/**
 * GeoJSON data loading utilities
 */

import type { Country } from '@/types'

/**
 * Load and process country GeoJSON data.
 *
 * @returns Promise resolving to array of processed Country objects
 */
export async function loadCountries(): Promise<Country[]> {
  // TODO(phase-1): Implement actual data loading
  // - Fetch GeoJSON from src/data/countries.json
  // - Extract country properties
  // - Calculate centroids using Turf.js
  // - Calculate areas using Turf.js
  return []
}

/**
 * Find countries with similar area (within tolerance).
 *
 * @param areaKm2 - Target area in square kilometers
 * @param countries - Array of countries to search
 * @param tolerance - Percentage tolerance (0.2 = 20%)
 * @returns Array of countries within the size range
 */
export function findSimilarSizedCountries(
  areaKm2: number,
  countries: Country[],
  tolerance: number = 0.2
): Country[] {
  const minArea = areaKm2 * (1 - tolerance)
  const maxArea = areaKm2 * (1 + tolerance)

  return countries.filter(
    (c) => c.properties.area_km2 >= minArea && c.properties.area_km2 <= maxArea
  )
}
