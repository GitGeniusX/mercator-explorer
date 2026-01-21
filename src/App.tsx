import { useEffect } from 'react'
import { Map } from '@/components/Map'
import { useAppStore } from '@/stores/appStore'

function App() {
  const loadCountries = useAppStore((state) => state.loadCountries)
  const isLoading = useAppStore((state) => state.isLoading)
  const error = useAppStore((state) => state.error)
  const countriesCount = useAppStore((state) => state.countries.length)
  const selectedCountry = useAppStore((state) => state.selectedCountry)

  useEffect(() => {
    loadCountries()
  }, [loadCountries])

  if (error) {
    return (
      <div className="min-h-screen bg-map-water flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen relative">
      {isLoading && (
        <div className="absolute inset-0 bg-map-water flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading countries...</p>
          </div>
        </div>
      )}

      <Map className="h-full w-full" />

      {/* Info overlay showing selected country */}
      {selectedCountry && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-sm">
          <h2 className="text-xl font-bold text-gray-800">{selectedCountry.name}</h2>
          <p className="text-gray-600 text-sm mt-1">
            Area: {Math.round(selectedCountry.properties.area_km2).toLocaleString()} km²
          </p>
          <p className="text-gray-500 text-sm">
            Continent: {selectedCountry.properties.continent}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Centroid: {selectedCountry.properties.centroid[1].toFixed(2)}°, {selectedCountry.properties.centroid[0].toFixed(2)}°
          </p>
        </div>
      )}

      {/* Status bar */}
      <div className="absolute bottom-4 left-4 bg-white/80 rounded px-3 py-1 text-sm text-gray-600 z-[1000]">
        {countriesCount} countries loaded
      </div>
    </div>
  )
}

export default App
