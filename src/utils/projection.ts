/**
 * Mercator projection utilities
 *
 * These functions handle the mathematical calculations for
 * Mercator projection distortion.
 */

import type { Geometry, Position, Polygon, MultiPolygon, Feature } from 'geojson'
import * as turf from '@turf/turf'
import type { Country } from '../types'

/** Maximum latitude to avoid infinity at poles */
const MAX_LATITUDE = 85

/**
 * Calculate Mercator scale factor at a given latitude.
 *
 * Scale = 1/cos(φ) where φ is latitude in radians
 * - At equator (0°): scale = 1
 * - At 45°: scale ≈ 1.414
 * - At 60°: scale = 2
 * - At 80°: scale ≈ 5.76
 *
 * @param latitudeDegrees - Latitude in degrees (-90 to 90)
 * @returns Scale factor (1 at equator, increases toward poles)
 */
export function getMercatorScale(latitudeDegrees: number): number {
  // Clamp latitude to avoid infinity at poles
  const clampedLat = Math.max(-MAX_LATITUDE, Math.min(MAX_LATITUDE, latitudeDegrees))
  const latRad = (clampedLat * Math.PI) / 180
  return 1 / Math.cos(latRad)
}

/**
 * Calculate how a country's apparent size changes when moved
 * from one latitude to another.
 *
 * Moving from 70° to 0° returns ~0.34 (appears 66% smaller)
 * Moving from 0° to 70° returns ~2.92 (appears 192% larger)
 *
 * @param fromLatitude - Original latitude in degrees
 * @param toLatitude - New latitude in degrees
 * @returns Multiplier for visual scaling (< 1 means appears smaller)
 */
export function calculateSizeAdjustment(
  fromLatitude: number,
  toLatitude: number
): number {
  const fromScale = getMercatorScale(fromLatitude)
  const toScale = getMercatorScale(toLatitude)
  return toScale / fromScale
}

/**
 * Get human-readable area comparison string.
 *
 * @param trueAreaKm2 - True area in square kilometers
 * @param apparentScale - Current apparent scale factor (linear, not area)
 * @returns Human-readable comparison string
 */
export function getAreaComparison(
  _trueAreaKm2: number,
  apparentScale: number
): string {
  // Area scales with square of linear scale
  const areaRatio = apparentScale * apparentScale

  if (areaRatio > 1.1) {
    return `appears ${areaRatio.toFixed(1)}x larger than its true size`
  } else if (areaRatio < 0.9) {
    return `appears ${(1 / areaRatio).toFixed(1)}x smaller than its true size`
  }
  return 'shown at approximately true size'
}

/**
 * Transform a GeoJSON geometry to appear at a new location.
 *
 * IMPORTANT: We only TRANSLATE the geometry, we do NOT scale it.
 * The Mercator projection naturally handles the size change:
 * - At high latitudes, Mercator stretches countries (making them appear larger)
 * - At the equator, there's no distortion
 * - By moving a country without scaling, Mercator shows its "true" relative size
 *
 * @param geometry - Original GeoJSON geometry (Polygon or MultiPolygon)
 * @param originalCentroid - Original centroid [lng, lat]
 * @param newPosition - Target position [lng, lat]
 * @returns Transformed GeoJSON geometry
 */
export function transformCountryToPosition(
  geometry: Geometry,
  originalCentroid: [number, number],
  newPosition: [number, number]
): Geometry {
  // Only handle Polygon and MultiPolygon
  if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') {
    return geometry
  }

  const [origLng, origLat] = originalCentroid
  const [newLng, newLat] = newPosition

  // Calculate translation offset (NO scaling - let Mercator handle size)
  const deltaLng = newLng - origLng
  const deltaLat = newLat - origLat

  // Transform coordinates - translate only
  const transformCoord = (coord: Position): Position => {
    const [lng, lat] = coord
    return [lng + deltaLng, lat + deltaLat]
  }

  const transformRing = (ring: Position[]): Position[] => {
    return ring.map(transformCoord)
  }

  if (geometry.type === 'Polygon') {
    return {
      type: 'Polygon',
      coordinates: geometry.coordinates.map(transformRing),
    } as Polygon
  } else {
    // MultiPolygon
    return {
      type: 'MultiPolygon',
      coordinates: geometry.coordinates.map((polygon) =>
        polygon.map(transformRing)
      ),
    } as MultiPolygon
  }
}

/**
 * Find countries of similar actual size.
 *
 * For Greenland (2.166M km²): returns countries like Saudi Arabia, Mexico
 *
 * @param areaKm2 - Target area in square kilometers
 * @param allCountries - Array of all countries to search
 * @param tolerance - Percentage tolerance (0.2 = ±20%)
 * @returns Array of countries within tolerance of target area
 */
export function findSimilarSizedCountries(
  areaKm2: number,
  allCountries: Country[],
  tolerance: number = 0.2
): Country[] {
  const minArea = areaKm2 * (1 - tolerance)
  const maxArea = areaKm2 * (1 + tolerance)

  return allCountries
    .filter((country) => {
      const area = country.properties.area_km2
      return area >= minArea && area <= maxArea
    })
    .sort((a, b) => {
      // Sort by how close they are to target area
      const diffA = Math.abs(a.properties.area_km2 - areaKm2)
      const diffB = Math.abs(b.properties.area_km2 - areaKm2)
      return diffA - diffB
    })
}

/**
 * Calculate the distortion factor for a country at its native latitude.
 * This shows how much larger it appears on a Mercator map compared to reality.
 *
 * @param centroidLatitude - The country's centroid latitude
 * @returns Area distortion factor (e.g., 14 means appears 14x larger)
 */
export function getDistortionAtLatitude(centroidLatitude: number): number {
  const scale = getMercatorScale(centroidLatitude)
  // Area distortion is square of linear scale
  return scale * scale
}

/**
 * Format area in human-readable format.
 *
 * @param areaKm2 - Area in square kilometers
 * @returns Formatted string like "2.17M km²" or "156,000 km²"
 */
export function formatArea(areaKm2: number): string {
  if (areaKm2 >= 1_000_000) {
    return `${(areaKm2 / 1_000_000).toFixed(2)}M km²`
  } else if (areaKm2 >= 1000) {
    return `${Math.round(areaKm2).toLocaleString()} km²`
  }
  return `${areaKm2.toFixed(0)} km²`
}

/**
 * Simplify a geometry using Douglas-Peucker algorithm.
 * Useful for performance optimization during drag operations.
 *
 * @param geometry - GeoJSON geometry to simplify
 * @param tolerance - Simplification tolerance (higher = more simplified)
 * @returns Simplified geometry
 */
export function simplifyGeometry(
  geometry: Geometry,
  tolerance: number = 0.1
): Geometry {
  if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') {
    return geometry
  }

  const feature: Feature = {
    type: 'Feature',
    properties: {},
    geometry,
  }

  const simplified = turf.simplify(feature, {
    tolerance,
    highQuality: false, // Faster, less accurate during drag
  })

  return simplified.geometry
}
