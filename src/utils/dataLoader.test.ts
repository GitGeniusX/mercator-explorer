import { describe, it, expect } from 'vitest'
import { loadCountries, findSimilarSizedCountries, getCountryById, getCountriesByArea } from './dataLoader'

describe('dataLoader', () => {
  describe('loadCountries', () => {
    it('should load all countries from GeoJSON', async () => {
      const countries = await loadCountries()

      // Should have loaded countries (Natural Earth has 177)
      expect(countries.length).toBeGreaterThan(150)
    })

    it('should have required properties for each country', async () => {
      const countries = await loadCountries()

      for (const country of countries) {
        expect(country.id).toBeTruthy()
        expect(country.name).toBeTruthy()
        expect(country.geometry).toBeDefined()
        expect(country.properties.area_km2).toBeGreaterThan(0)
        expect(country.properties.centroid).toHaveLength(2)
        expect(country.properties.continent).toBeTruthy()
      }
    })

    it('should calculate reasonable centroids', async () => {
      const countries = await loadCountries()

      for (const country of countries) {
        const [lng, lat] = country.properties.centroid
        // Longitude: -180 to 180, Latitude: -90 to 90
        expect(lng).toBeGreaterThanOrEqual(-180)
        expect(lng).toBeLessThanOrEqual(180)
        expect(lat).toBeGreaterThanOrEqual(-90)
        expect(lat).toBeLessThanOrEqual(90)
      }
    })

    it('should calculate areas within reasonable ranges', async () => {
      const countries = await loadCountries()

      // Find Russia (should be largest)
      const russia = countries.find((c) => c.id === 'RUS')
      expect(russia).toBeDefined()
      // Russia is ~17.1 million km², allow some tolerance for calculation differences
      expect(russia!.properties.area_km2).toBeGreaterThan(15_000_000)
      expect(russia!.properties.area_km2).toBeLessThan(20_000_000)

      // Find small countries (Natural Earth 110m has Luxembourg as smallest at ~2400 km²)
      const smallCountries = countries.filter((c) => c.properties.area_km2 < 5000)
      expect(smallCountries.length).toBeGreaterThan(0)
    })

    it('should include known countries with correct data', async () => {
      const countries = await loadCountries()

      // Check USA
      const usa = countries.find((c) => c.id === 'USA')
      expect(usa).toBeDefined()
      expect(usa!.name).toContain('United States')

      // Check Brazil
      const brazil = countries.find((c) => c.id === 'BRA')
      expect(brazil).toBeDefined()
      expect(brazil!.name).toBe('Brazil')
      expect(brazil!.properties.continent).toBe('South America')

      // Check Greenland
      const greenland = countries.find((c) => c.id === 'GRL')
      expect(greenland).toBeDefined()
      expect(greenland!.name).toBe('Greenland')
      // Greenland is ~2.166 million km²
      expect(greenland!.properties.area_km2).toBeGreaterThan(2_000_000)
    })
  })

  describe('findSimilarSizedCountries', () => {
    it('should find countries within tolerance range', async () => {
      const countries = await loadCountries()

      // Brazil is about 8.5 million km²
      const brazil = countries.find((c) => c.id === 'BRA')!
      const similar = findSimilarSizedCountries(brazil.properties.area_km2, countries, 0.2)

      // Should find Brazil itself
      expect(similar).toContain(brazil)
      // Should find some similar countries (USA, Canada, China, etc.)
      expect(similar.length).toBeGreaterThan(1)
    })

    it('should return empty array for extreme values', async () => {
      const countries = await loadCountries()

      // Very small area that no country has
      const similar = findSimilarSizedCountries(0.001, countries, 0.1)
      expect(similar).toHaveLength(0)
    })

    it('should respect tolerance parameter', async () => {
      const countries = await loadCountries()
      const areaKm2 = 1_000_000

      const narrow = findSimilarSizedCountries(areaKm2, countries, 0.05)
      const wide = findSimilarSizedCountries(areaKm2, countries, 0.5)

      // Wider tolerance should include more countries
      expect(wide.length).toBeGreaterThanOrEqual(narrow.length)
    })
  })

  describe('getCountryById', () => {
    it('should find country by ID', async () => {
      const countries = await loadCountries()

      const france = getCountryById('FRA', countries)
      expect(france).toBeDefined()
      expect(france!.name).toBe('France')
    })

    it('should return undefined for unknown ID', async () => {
      const countries = await loadCountries()

      const unknown = getCountryById('XXX', countries)
      expect(unknown).toBeUndefined()
    })
  })

  describe('getCountriesByArea', () => {
    it('should sort countries by area descending', async () => {
      const countries = await loadCountries()

      const sorted = getCountriesByArea(countries)

      // Verify sorted (largest first)
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].properties.area_km2).toBeGreaterThanOrEqual(sorted[i + 1].properties.area_km2)
      }

      // Russia should be first
      expect(sorted[0].id).toBe('RUS')
    })

    it('should not mutate original array', async () => {
      const countries = await loadCountries()
      const originalOrder = countries.map((c) => c.id)

      getCountriesByArea(countries)

      const afterOrder = countries.map((c) => c.id)
      expect(afterOrder).toEqual(originalOrder)
    })
  })
})
