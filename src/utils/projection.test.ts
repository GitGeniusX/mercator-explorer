import { describe, it, expect } from 'vitest'
import {
  getMercatorScale,
  calculateSizeAdjustment,
  getAreaComparison,
  transformCountryToPosition,
  findSimilarSizedCountries,
  getDistortionAtLatitude,
  formatArea,
} from './projection'
import type { Country } from '../types'
import type { Polygon, MultiPolygon } from 'geojson'

describe('getMercatorScale', () => {
  it('returns 1 at the equator (0°)', () => {
    expect(getMercatorScale(0)).toBeCloseTo(1, 5)
  })

  it('returns ~1.414 at 45 degrees', () => {
    // 1/cos(45°) = 1/0.707... ≈ 1.414
    expect(getMercatorScale(45)).toBeCloseTo(1.41421, 4)
  })

  it('returns 2 at 60 degrees', () => {
    // 1/cos(60°) = 1/0.5 = 2
    expect(getMercatorScale(60)).toBeCloseTo(2, 5)
  })

  it('returns ~5.76 at 80 degrees', () => {
    // 1/cos(80°) ≈ 5.759
    expect(getMercatorScale(80)).toBeCloseTo(5.759, 2)
  })

  it('handles negative latitudes (southern hemisphere) symmetrically', () => {
    expect(getMercatorScale(-45)).toBeCloseTo(getMercatorScale(45), 5)
    expect(getMercatorScale(-60)).toBeCloseTo(getMercatorScale(60), 5)
    expect(getMercatorScale(-80)).toBeCloseTo(getMercatorScale(80), 5)
  })

  it('clamps extreme latitudes to avoid infinity', () => {
    const at85 = getMercatorScale(85)
    const at90 = getMercatorScale(90)
    const atNeg90 = getMercatorScale(-90)

    // Should be clamped to 85°
    expect(at90).toBeCloseTo(at85, 5)
    expect(atNeg90).toBeCloseTo(at85, 5)
    expect(at90).toBeLessThan(100)
    expect(at90).toBeGreaterThan(0)
  })

  it('returns values with < 0.01% error for known values', () => {
    // cos(30°) = √3/2, so scale = 2/√3 ≈ 1.1547
    const expected30 = 2 / Math.sqrt(3)
    expect(getMercatorScale(30)).toBeCloseTo(expected30, 4)
  })
})

describe('calculateSizeAdjustment', () => {
  it('returns 1 when latitudes are the same', () => {
    expect(calculateSizeAdjustment(0, 0)).toBeCloseTo(1, 5)
    expect(calculateSizeAdjustment(45, 45)).toBeCloseTo(1, 5)
    expect(calculateSizeAdjustment(70, 70)).toBeCloseTo(1, 5)
  })

  it('returns ~0.34 when moving from 70° to 0° (equator)', () => {
    // scale(70°)/scale(0°) = cos(0°)/cos(70°) = 1/cos(70°) ≈ 2.924
    // Adjustment from 70° to 0° = scale(0°)/scale(70°) = cos(70°)/1 ≈ 0.342
    const result = calculateSizeAdjustment(70, 0)
    expect(result).toBeCloseTo(0.342, 2)
  })

  it('returns ~2.92 when moving from 0° to 70°', () => {
    // Inverse of above
    const result = calculateSizeAdjustment(0, 70)
    expect(result).toBeCloseTo(2.924, 2)
  })

  it('returns < 1 when moving toward equator from high latitude', () => {
    expect(calculateSizeAdjustment(60, 30)).toBeLessThan(1)
    expect(calculateSizeAdjustment(80, 0)).toBeLessThan(1)
  })

  it('returns > 1 when moving away from equator', () => {
    expect(calculateSizeAdjustment(30, 60)).toBeGreaterThan(1)
    expect(calculateSizeAdjustment(0, 80)).toBeGreaterThan(1)
  })

  it('is symmetric for equal latitude changes in opposite directions', () => {
    const towardEquator = calculateSizeAdjustment(60, 30)
    const awayFromEquator = calculateSizeAdjustment(30, 60)
    expect(towardEquator * awayFromEquator).toBeCloseTo(1, 5)
  })

  it('works correctly for southern hemisphere', () => {
    const northResult = calculateSizeAdjustment(70, 0)
    const southResult = calculateSizeAdjustment(-70, 0)
    expect(northResult).toBeCloseTo(southResult, 5)
  })
})

describe('getAreaComparison', () => {
  it('reports larger when scale > 1.05 (area ratio > 1.1)', () => {
    // scale of 2 means area ratio of 4
    const result = getAreaComparison(1000000, 2)
    expect(result).toContain('larger')
    expect(result).toContain('4.0x')
  })

  it('reports smaller when scale < 0.95 (area ratio < 0.9)', () => {
    // scale of 0.5 means area ratio of 0.25, so appears 4x smaller
    const result = getAreaComparison(1000000, 0.5)
    expect(result).toContain('smaller')
  })

  it('reports approximately true size when scale near 1', () => {
    const result = getAreaComparison(1000000, 1)
    expect(result).toContain('true size')
  })

  it('handles edge cases around the threshold', () => {
    // scale of 1.05 gives area ratio of 1.1025 (just over threshold)
    const justOver = getAreaComparison(1000000, 1.05)
    expect(justOver).toContain('larger')

    // scale of 1.04 gives area ratio of 1.0816 (under threshold)
    const justUnder = getAreaComparison(1000000, 1.04)
    expect(justUnder).toContain('true size')
  })
})

describe('transformCountryToPosition', () => {
  const simplePolygon: Polygon = {
    type: 'Polygon',
    coordinates: [
      [
        [0, 10],
        [2, 10],
        [2, 12],
        [0, 12],
        [0, 10], // closed ring
      ],
    ],
  }

  it('returns original geometry for non-polygon types', () => {
    const point = { type: 'Point' as const, coordinates: [0, 0] }
    const result = transformCountryToPosition(point, [0, 0], [10, 10])
    expect(result).toEqual(point)
  })

  it('moves centroid to new position', () => {
    // Original centroid at [1, 11]
    const result = transformCountryToPosition(
      simplePolygon,
      [1, 11],
      [10, 0] // Move to equator at lng 10
    )

    expect(result.type).toBe('Polygon')
    const coords = (result as Polygon).coordinates[0]

    // Calculate new centroid (average of corners)
    const lngs = coords.slice(0, -1).map(c => c[0])
    const lats = coords.slice(0, -1).map(c => c[1])
    const newCentroidLng = lngs.reduce((a, b) => a + b) / lngs.length
    const newCentroidLat = lats.reduce((a, b) => a + b) / lats.length

    expect(newCentroidLng).toBeCloseTo(10, 1)
    expect(newCentroidLat).toBeCloseTo(0, 1)
  })

  it('scales polygon smaller when moving toward equator', () => {
    // Moving from lat 60 to equator should shrink by factor of 0.5
    const highLatPolygon: Polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [0, 59],
          [4, 59],
          [4, 61],
          [0, 61],
          [0, 59],
        ],
      ],
    }

    const result = transformCountryToPosition(
      highLatPolygon,
      [2, 60],
      [2, 0]
    )

    const coords = (result as Polygon).coordinates[0]
    // Original width was 4 degrees, should be ~2 degrees at equator
    const width = Math.abs(coords[1][0] - coords[0][0])
    expect(width).toBeCloseTo(2, 0) // scale factor ~0.5
  })

  it('handles MultiPolygon geometries', () => {
    const multiPolygon: MultiPolygon = {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [0, 10],
            [1, 10],
            [1, 11],
            [0, 11],
            [0, 10],
          ],
        ],
        [
          [
            [2, 10],
            [3, 10],
            [3, 11],
            [2, 11],
            [2, 10],
          ],
        ],
      ],
    }

    const result = transformCountryToPosition(
      multiPolygon,
      [1.5, 10.5],
      [10, 0]
    )

    expect(result.type).toBe('MultiPolygon')
    expect((result as MultiPolygon).coordinates).toHaveLength(2)
  })

  it('preserves polygon ring closure', () => {
    const result = transformCountryToPosition(
      simplePolygon,
      [1, 11],
      [10, 0]
    )

    const coords = (result as Polygon).coordinates[0]
    const first = coords[0]
    const last = coords[coords.length - 1]

    expect(first[0]).toBeCloseTo(last[0], 5)
    expect(first[1]).toBeCloseTo(last[1], 5)
  })
})

describe('findSimilarSizedCountries', () => {
  const mockCountries: Country[] = [
    {
      id: 'A',
      name: 'Country A',
      geometry: { type: 'Point', coordinates: [0, 0] },
      properties: { area_km2: 1000000, centroid: [0, 0], continent: 'Test' },
    },
    {
      id: 'B',
      name: 'Country B',
      geometry: { type: 'Point', coordinates: [0, 0] },
      properties: { area_km2: 1100000, centroid: [0, 0], continent: 'Test' },
    },
    {
      id: 'C',
      name: 'Country C',
      geometry: { type: 'Point', coordinates: [0, 0] },
      properties: { area_km2: 2000000, centroid: [0, 0], continent: 'Test' },
    },
    {
      id: 'D',
      name: 'Country D',
      geometry: { type: 'Point', coordinates: [0, 0] },
      properties: { area_km2: 1050000, centroid: [0, 0], continent: 'Test' },
    },
  ]

  it('finds countries within default tolerance (20%)', () => {
    const result = findSimilarSizedCountries(1000000, mockCountries)
    expect(result.map(c => c.id)).toContain('A')
    expect(result.map(c => c.id)).toContain('B')
    expect(result.map(c => c.id)).toContain('D')
    expect(result.map(c => c.id)).not.toContain('C')
  })

  it('respects custom tolerance', () => {
    const result = findSimilarSizedCountries(1000000, mockCountries, 0.05)
    expect(result.map(c => c.id)).toContain('A')
    expect(result.map(c => c.id)).toContain('D')
    expect(result.map(c => c.id)).not.toContain('B') // 10% larger, outside 5%
  })

  it('sorts by closeness to target area', () => {
    const result = findSimilarSizedCountries(1000000, mockCountries)
    expect(result[0].id).toBe('A') // exact match
    expect(result[1].id).toBe('D') // 5% larger
    expect(result[2].id).toBe('B') // 10% larger
  })

  it('returns empty array when no matches', () => {
    const result = findSimilarSizedCountries(5000000, mockCountries, 0.1)
    expect(result).toHaveLength(0)
  })
})

describe('getDistortionAtLatitude', () => {
  it('returns 1 at equator', () => {
    expect(getDistortionAtLatitude(0)).toBeCloseTo(1, 5)
  })

  it('returns 4 at 60° (scale² = 2² = 4)', () => {
    expect(getDistortionAtLatitude(60)).toBeCloseTo(4, 3)
  })

  it('returns ~33 at 80° (scale² ≈ 5.76² ≈ 33)', () => {
    expect(getDistortionAtLatitude(80)).toBeCloseTo(33.17, 1)
  })

  it('is symmetric for north and south', () => {
    expect(getDistortionAtLatitude(-60)).toBeCloseTo(getDistortionAtLatitude(60), 5)
  })
})

describe('formatArea', () => {
  it('formats millions with M suffix', () => {
    expect(formatArea(2166086)).toBe('2.17M km²')
    expect(formatArea(17098242)).toBe('17.10M km²')
  })

  it('formats thousands with comma separator', () => {
    const result = formatArea(156000)
    expect(result).toContain('156')
    expect(result).toContain('km²')
  })

  it('formats small areas without decimals', () => {
    expect(formatArea(500)).toBe('500 km²')
  })

  it('handles edge cases', () => {
    expect(formatArea(1000000)).toBe('1.00M km²')
    expect(formatArea(999999)).toContain('999')
  })
})
