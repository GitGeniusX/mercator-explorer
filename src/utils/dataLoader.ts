/**
 * GeoJSON data loading utilities
 */

import * as turf from '@turf/turf'
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import type { Country } from '@/types'
import countriesData from '@/data/countries.json'

/**
 * Minimum area (km²) for a polygon part to be split into its own country.
 * Parts smaller than this remain combined with the main landmass.
 */
const SPLIT_AREA_THRESHOLD_KM2 = 500_000

/**
 * Known names for significant disconnected regions.
 * Key format: "ISO_CODE:approx_longitude:approx_latitude" (rounded to nearest 10°)
 */
const KNOWN_REGION_NAMES: Record<string, string> = {
  // USA
  'USA:-150:60': 'Alaska',
  'USA:-160:20': 'Hawaii',
  // Canada
  'CAN:-70:70': 'Baffin Island',
  'CAN:-110:70': 'Victoria Island',
  'CAN:-80:80': 'Ellesmere Island',
  // Russia
  'RUS:20:55': 'Kaliningrad',
  // Indonesia
  'IDN:115:-2': 'Borneo (Kalimantan)',
  'IDN:120:-5': 'Sulawesi',
  'IDN:140:-5': 'Papua',
}

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
 * MultiPolygon countries with parts > SPLIT_AREA_THRESHOLD_KM2 are split
 * into separate draggable entities.
 *
 * @returns Promise resolving to array of processed Country objects
 */
export async function loadCountries(): Promise<Country[]> {
  const geojson = countriesData as unknown as FeatureCollection<Polygon | MultiPolygon, NaturalEarthProperties>

  const countries: Country[] = geojson.features
    .flatMap((feature) => processFeature(feature))
    .filter((country): country is Country => country !== null)

  return countries
}

/**
 * Process a single GeoJSON feature into Country object(s).
 * MultiPolygon features may be split into multiple countries if parts exceed threshold.
 */
function processFeature(
  feature: Feature<Polygon | MultiPolygon, NaturalEarthProperties>
): (Country | null)[] {
  const { properties, geometry } = feature

  if (!properties || !geometry) {
    return [null]
  }

  // For simple Polygons, return single country
  if (geometry.type === 'Polygon') {
    return [createCountryFromPolygon(geometry, properties)]
  }

  // For MultiPolygons, check if we need to split
  if (geometry.type === 'MultiPolygon') {
    return processMultiPolygon(geometry, properties)
  }

  return [null]
}

/**
 * Create a Country object from a Polygon geometry.
 */
function createCountryFromPolygon(
  geometry: Polygon,
  properties: NaturalEarthProperties,
  idSuffix?: string,
  nameSuffix?: string
): Country {
  const feature = turf.polygon(geometry.coordinates)
  const centroidPoint = turf.centroid(feature)
  const centroid: [number, number] = centroidPoint.geometry.coordinates as [number, number]
  const areaKm2 = turf.area(feature) / 1_000_000

  const id = idSuffix ? `${properties.ADM0_A3}_${idSuffix}` : properties.ADM0_A3
  const name = nameSuffix
    ? `${properties.NAME || properties.ADMIN} (${nameSuffix})`
    : properties.NAME || properties.ADMIN

  return {
    id,
    name,
    isoCode: properties.ADM0_A3,
    geometry,
    properties: {
      area_km2: areaKm2,
      centroid,
      continent: properties.CONTINENT || 'Unknown',
    },
  }
}

/**
 * Process a MultiPolygon, potentially splitting into multiple countries.
 */
function processMultiPolygon(
  geometry: MultiPolygon,
  properties: NaturalEarthProperties
): (Country | null)[] {
  const isoCode = properties.ADM0_A3
  const parts: Array<{ polygon: Polygon; areaKm2: number; centroid: [number, number] }> = []

  // Analyze each polygon part
  for (const coords of geometry.coordinates) {
    const polygon: Polygon = { type: 'Polygon', coordinates: coords }
    const feature = turf.polygon(coords)
    const areaKm2 = turf.area(feature) / 1_000_000
    const centroid = turf.centroid(feature).geometry.coordinates as [number, number]
    parts.push({ polygon, areaKm2, centroid })
  }

  // Sort by area (largest first)
  parts.sort((a, b) => b.areaKm2 - a.areaKm2)

  // Find parts that exceed the threshold
  const significantParts = parts.filter((p) => p.areaKm2 >= SPLIT_AREA_THRESHOLD_KM2)

  // If 0 or 1 significant parts, return as single combined country
  if (significantParts.length <= 1) {
    const combinedFeature = turf.multiPolygon(geometry.coordinates)
    const centroid = turf.centroid(combinedFeature).geometry.coordinates as [number, number]
    const areaKm2 = turf.area(combinedFeature) / 1_000_000

    return [{
      id: isoCode,
      name: properties.NAME || properties.ADMIN,
      isoCode,
      geometry,
      properties: {
        area_km2: areaKm2,
        centroid,
        continent: properties.CONTINENT || 'Unknown',
      },
    }]
  }

  // Multiple significant parts - split them
  const countries: Country[] = []

  for (let i = 0; i < significantParts.length; i++) {
    const part = significantParts[i]
    const isMainLandmass = i === 0

    if (isMainLandmass) {
      // Largest part gets "Continental" or "Mainland" suffix
      const suffix = getMainlandSuffix(isoCode)
      countries.push(
        createCountryFromPolygon(part.polygon, properties, suffix.id, suffix.name)
      )
    } else {
      // Other significant parts get named based on location
      const regionName = getRegionName(isoCode, part.centroid)
      const idSuffix = regionName.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8)
      countries.push(
        createCountryFromPolygon(part.polygon, properties, idSuffix, regionName)
      )
    }
  }

  return countries
}

/**
 * Get the suffix for the main landmass of a country.
 */
function getMainlandSuffix(isoCode: string): { id: string; name: string } {
  const suffixes: Record<string, { id: string; name: string }> = {
    USA: { id: 'CONT', name: 'Continental' },
    CAN: { id: 'MAIN', name: 'Mainland' },
    RUS: { id: 'MAIN', name: 'Mainland' },
    IDN: { id: 'MAIN', name: 'Main Islands' },
  }
  return suffixes[isoCode] || { id: 'MAIN', name: 'Mainland' }
}

/**
 * Get a human-readable name for a region based on its location.
 */
function getRegionName(isoCode: string, centroid: [number, number]): string {
  const [lng, lat] = centroid
  const roundedLng = Math.round(lng / 10) * 10
  const roundedLat = Math.round(lat / 10) * 10
  const key = `${isoCode}:${roundedLng}:${roundedLat}`

  if (KNOWN_REGION_NAMES[key]) {
    return KNOWN_REGION_NAMES[key]
  }

  // Fallback: describe by cardinal direction
  const latDir = lat > 45 ? 'Northern' : lat < -45 ? 'Southern' : ''
  const lngDir = lng > 90 || lng < -90 ? 'Far ' : ''
  const ewDir = lng > 0 ? 'Eastern' : 'Western'

  return `${lngDir}${latDir} ${ewDir} Region`.trim().replace(/\s+/g, ' ')
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
