import { useEffect, useMemo } from 'react'
import { Map } from '@/components/Map'
import { useAppStore } from '@/stores/appStore'
import { getDistortionAtLatitude, formatArea } from '@/utils/projection'

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

  // Calculate drag info - show distortion at current latitude
  const dragInfo = useMemo(() => {
    if (!selectedCountry || !dragState.currentPos) return null

    const originalLat = selectedCountry.properties.centroid[1]
    const currentLat = dragState.currentPos[1]

    // Distortion at original and current positions
    const originalDistortion = getDistortionAtLatitude(originalLat)
    const currentDistortion = getDistortionAtLatitude(currentLat)

    // How the country appears relative to true size at current position
    let comparison: string
    if (currentDistortion > 1.1) {
      comparison = `appears ${currentDistortion.toFixed(1)}x larger than true size`
    } else if (currentDistortion < 0.9) {
      comparison = `appears ${(1 / currentDistortion).toFixed(1)}x smaller than true size`
    } else {
      comparison = 'shown at approximately true size'
    }

    return {
      originalDistortion,
      currentDistortion,
      comparison,
      currentLat,
      originalLat,
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
                Original: {dragInfo.originalDistortion.toFixed(1)}x distortion at {dragInfo.originalLat.toFixed(0)}°
              </p>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-gray-500 text-xs">
                At {selectedCountry.properties.centroid[1].toFixed(0)}° lat: {getDistortionAtLatitude(selectedCountry.properties.centroid[1]).toFixed(1)}x distortion
              </p>
              <p className="text-blue-600 text-sm mt-1">
                Drag to equator to see true size
              </p>
            </div>
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
            {placedCountries.map((placed, i) => {
              const distortion = getDistortionAtLatitude(placed.currentPosition[1])
              return (
                <div key={i} className="text-sm border-b border-gray-100 pb-2 last:border-0">
                  <p className="font-medium text-green-700">{placed.original.name}</p>
                  <p className="text-gray-500 text-xs">
                    At {placed.currentPosition[1].toFixed(1)}° lat
                    {distortion < 1.1 ? ' (true size)' : ` (${distortion.toFixed(1)}x distortion)`}
                  </p>
                </div>
              )
            })}
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
