/**
 * GeoJSON data loading utilities
 */

import * as turf from '@turf/turf'
import type { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon } from 'geojson'
import type { Country } from '@/types'
import countriesData from '@/data/countries.json'

/**
 * Properties from Natural Earth GeoJSON
 */
interface NaturalEarthProperties {
  NAME: string
  ADMIN: string
  ADM0_A3: string
  CONTINENT: string
  [key: string]: unknown
}

/**
 * Load and process country GeoJSON data.
 *
 * @returns Promise resolving to array of processed Country objects
 */
export async function loadCountries(): Promise<Country[]> {
  const geojson = countriesData as unknown as FeatureCollection<Polygon | MultiPolygon, NaturalEarthProperties>

  const countries: Country[] = geojson.features
    .map((feature) => processFeature(feature))
    .filter((country): country is Country => country !== null)

  return countries
}

/**
 * Process a single GeoJSON feature into a Country object.
 */
function processFeature(
  feature: Feature<Polygon | MultiPolygon, NaturalEarthProperties>
): Country | null {
  const { properties, geometry } = feature

  if (!properties || !geometry) {
    return null
  }

  // Calculate centroid using Turf.js
  const centroidPoint = turf.centroid(feature)
  const centroid: [number, number] = centroidPoint.geometry.coordinates as [number, number]

  // Calculate area using Turf.js (returns square meters, convert to km²)
  const areaM2 = turf.area(feature)
  const areaKm2 = areaM2 / 1_000_000

  return {
    id: properties.ADM0_A3,
    name: properties.NAME || properties.ADMIN,
    isoCode: properties.ADM0_A3,
    geometry: geometry as Geometry,
    properties: {
      area_km2: areaKm2,
      centroid,
      continent: properties.CONTINENT || 'Unknown',
    },
  }
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

/**
 * Get a country by its ID (ISO A3 code).
 */
export function getCountryById(id: string, countries: Country[]): Country | undefined {
  return countries.find((c) => c.id === id)
}

/**
 * Get countries sorted by area (largest first).
 */
export function getCountriesByArea(countries: Country[]): Country[] {
  return [...countries].sort((a, b) => b.properties.area_km2 - a.properties.area_km2)
}
