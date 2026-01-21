import { useMemo } from 'react'
import type { Country } from '@/types'
import { formatArea, getDistortionAtLatitude, findSimilarSizedCountries } from '@/utils/projection'
import { useAppStore } from '@/stores/appStore'

interface InfoPanelProps {
  country: Country
  currentLatitude?: number
  isDragging?: boolean
}

export function InfoPanel({ country, currentLatitude, isDragging }: InfoPanelProps) {
  const countries = useAppStore((state) => state.countries)

  const originalLat = country.properties.centroid[1]
  const displayLat = currentLatitude ?? originalLat

  // Calculate distortion at both positions
  const originalDistortion = getDistortionAtLatitude(originalLat)
  const currentDistortion = getDistortionAtLatitude(displayLat)

  // Find similar-sized countries
  const similarCountries = useMemo(() => {
    return findSimilarSizedCountries(
      country.properties.area_km2,
      countries.filter((c) => c.id !== country.id),
      0.25
    ).slice(0, 3)
  }, [country, countries])

  // Calculate how size appears to change
  const sizeChangeText = useMemo(() => {
    if (Math.abs(currentDistortion - 1) < 0.1) {
      return 'Shown at true size'
    }
    if (currentDistortion > 1) {
      return `Appears ${currentDistortion.toFixed(1)}× larger than reality`
    }
    return `Appears ${(1 / currentDistortion).toFixed(1)}× smaller than reality`
  }, [currentDistortion])

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
      {/* Country header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{country.name}</h2>
          <p className="text-gray-500 text-sm">{country.properties.continent}</p>
        </div>
        {isDragging && (
          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
            Dragging
          </span>
        )}
      </div>

      {/* True area */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-blue-600 text-xs font-medium uppercase tracking-wide">True Area</p>
        <p className="text-2xl font-bold text-blue-900">
          {formatArea(country.properties.area_km2)}
        </p>
      </div>

      {/* Distortion info */}
      <div className="mt-3 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Original position</span>
          <span className="font-medium">
            {originalLat.toFixed(1)}° lat · {originalDistortion.toFixed(1)}× distortion
          </span>
        </div>

        {isDragging && currentLatitude !== undefined && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-amber-600 font-medium">Current position</span>
            <span className="font-medium text-amber-700">
              {displayLat.toFixed(1)}° lat · {currentDistortion.toFixed(1)}× distortion
            </span>
          </div>
        )}
      </div>

      {/* Size change indicator */}
      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <p className={`text-sm font-medium ${
          currentDistortion > 1.1 ? 'text-red-600' :
          currentDistortion < 0.9 ? 'text-green-600' :
          'text-gray-600'
        }`}>
          {sizeChangeText}
        </p>

        {/* Visual scale bar */}
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-150 ${
              currentDistortion > 1 ? 'bg-red-400' : 'bg-green-400'
            }`}
            style={{
              width: `${Math.min(100, (1 / Math.max(currentDistortion, 0.1)) * 100)}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>True size</span>
          <span>Displayed size</span>
        </div>
      </div>

      {/* Similar countries */}
      {similarCountries.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Similar-Sized Countries
          </p>
          <div className="flex flex-wrap gap-2">
            {similarCountries.map((similar) => (
              <span
                key={similar.id}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {similar.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Instruction */}
      {!isDragging && (
        <p className="mt-4 text-blue-600 text-sm text-center">
          Drag to equator to see true size
        </p>
      )}
    </div>
  )
}
