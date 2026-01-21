import { useEffect, useMemo } from 'react'
import { Map } from '@/components/Map'
import { useAppStore } from '@/stores/appStore'
import { calculateSizeAdjustment, getAreaComparison, formatArea } from '@/utils/projection'

function App() {
  const loadCountries = useAppStore((state) => state.loadCountries)
  const isLoading = useAppStore((state) => state.isLoading)
  const error = useAppStore((state) => state.error)
  const countriesCount = useAppStore((state) => state.countries.length)
  const selectedCountry = useAppStore((state) => state.selectedCountry)
  const dragState = useAppStore((state) => state.dragState)
  const placedCountries = useAppStore((state) => state.placedCountries)
  const reset = useAppStore((state) => state.reset)

  useEffect(() => {
    loadCountries()
  }, [loadCountries])

  // Calculate drag info
  const dragInfo = useMemo(() => {
    if (!selectedCountry || !dragState.currentPos) return null

    const originalLat = selectedCountry.properties.centroid[1]
    const currentLat = dragState.currentPos[1]
    const scaleFactor = calculateSizeAdjustment(originalLat, currentLat)
    const comparison = getAreaComparison(selectedCountry.properties.area_km2, scaleFactor)

    return {
      scaleFactor,
      comparison,
      currentLat,
    }
  }, [selectedCountry, dragState.currentPos])

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

      {/* Info overlay showing selected country and drag info */}
      {selectedCountry && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-sm">
          <h2 className="text-xl font-bold text-gray-800">{selectedCountry.name}</h2>
          <p className="text-gray-600 text-sm mt-1">
            True area: {formatArea(selectedCountry.properties.area_km2)}
          </p>

          {dragInfo && dragState.isDragging ? (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-amber-600 font-medium text-sm">
                At latitude {dragInfo.currentLat.toFixed(1)}°
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {dragInfo.comparison}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Scale: {dragInfo.scaleFactor.toFixed(2)}x
              </p>
            </div>
          ) : (
            <p className="text-blue-600 text-sm mt-2">
              Click and drag to move to a new latitude
            </p>
          )}
        </div>
      )}

      {/* Placed countries info */}
      {placedCountries.length > 0 && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-700">Placed Countries</h3>
            <button
              onClick={reset}
              className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
            >
              Reset
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {placedCountries.map((placed, i) => (
              <div key={i} className="text-sm border-b border-gray-100 pb-2 last:border-0">
                <p className="font-medium text-green-700">{placed.original.name}</p>
                <p className="text-gray-500 text-xs">
                  At {placed.currentPosition[1].toFixed(1)}° lat • Scale: {placed.scaleFactor.toFixed(2)}x
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="absolute bottom-4 left-4 bg-white/80 rounded px-3 py-1 text-sm text-gray-600 z-[1000]">
        {countriesCount} countries • Click a country to select
      </div>
    </div>
  )
}

export default App
