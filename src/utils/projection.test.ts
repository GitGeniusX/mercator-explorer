import { describe, it, expect } from 'vitest'
import { getMercatorScale, calculateSizeAdjustment, getAreaComparison } from './projection'

describe('getMercatorScale', () => {
  it('returns 1 at the equator', () => {
    expect(getMercatorScale(0)).toBeCloseTo(1, 5)
  })

  it('returns ~1.414 at 45 degrees', () => {
    expect(getMercatorScale(45)).toBeCloseTo(1.414, 2)
  })

  it('returns 2 at 60 degrees', () => {
    expect(getMercatorScale(60)).toBeCloseTo(2, 2)
  })

  it('handles negative latitudes (southern hemisphere)', () => {
    expect(getMercatorScale(-45)).toBeCloseTo(getMercatorScale(45), 5)
  })

  it('clamps extreme latitudes to avoid infinity', () => {
    const result = getMercatorScale(90)
    expect(result).toBeLessThan(100)
    expect(result).toBeGreaterThan(0)
  })
})

describe('calculateSizeAdjustment', () => {
  it('returns 1 when latitudes are the same', () => {
    expect(calculateSizeAdjustment(45, 45)).toBeCloseTo(1, 5)
  })

  it('returns < 1 when moving toward equator', () => {
    const result = calculateSizeAdjustment(60, 0)
    expect(result).toBeLessThan(1)
  })

  it('returns > 1 when moving away from equator', () => {
    const result = calculateSizeAdjustment(0, 60)
    expect(result).toBeGreaterThan(1)
  })
})

describe('getAreaComparison', () => {
  it('reports larger when scale > 1.1', () => {
    const result = getAreaComparison(1000000, 2)
    expect(result).toContain('larger')
  })

  it('reports approximately true size when scale near 1', () => {
    const result = getAreaComparison(1000000, 1)
    expect(result).toContain('true size')
  })
})
