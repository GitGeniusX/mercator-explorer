import type { PlacedCountry } from '@/types'
import { formatArea, getDistortionAtLatitude } from '@/utils/projection'

interface ComparisonCardProps {
  placed: PlacedCountry
  onRemove?: () => void
}

export function ComparisonCard({ placed, onRemove }: ComparisonCardProps) {
  const { original, currentPosition } = placed

  const originalLat = original.properties.centroid[1]
  const newLat = currentPosition[1]

  const originalDistortion = getDistortionAtLatitude(originalLat)
  const newDistortion = getDistortionAtLatitude(newLat)

  // Calculate the size reduction
  const sizeRatio = newDistortion / originalDistortion
  const reductionPercent = ((1 - sizeRatio) * 100).toFixed(0)

  const isAtTrueSize = newDistortion < 1.1

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 p-3">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-gray-800">{original.name}</h4>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1 -mt-1"
            aria-label={`Remove ${original.name}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        {/* Original position */}
        <div className="bg-gray-50 rounded p-2">
          <p className="text-gray-500 font-medium">Original</p>
          <p className="text-gray-700">{originalLat.toFixed(0)}° lat</p>
          <p className="text-red-600 font-medium">{originalDistortion.toFixed(1)}× enlarged</p>
        </div>

        {/* New position */}
        <div className={`rounded p-2 ${isAtTrueSize ? 'bg-green-50' : 'bg-amber-50'}`}>
          <p className={`font-medium ${isAtTrueSize ? 'text-green-600' : 'text-amber-600'}`}>
            Now at
          </p>
          <p className="text-gray-700">{newLat.toFixed(0)}° lat</p>
          <p className={`font-medium ${isAtTrueSize ? 'text-green-600' : 'text-amber-600'}`}>
            {isAtTrueSize ? 'True size' : `${newDistortion.toFixed(1)}× enlarged`}
          </p>
        </div>
      </div>

      {/* Reveal stat */}
      {sizeRatio < 0.9 && (
        <div className="mt-2 text-center p-2 bg-blue-50 rounded">
          <p className="text-blue-700 text-sm font-medium">
            Actually {reductionPercent}% smaller!
          </p>
          <p className="text-blue-600 text-xs">
            True area: {formatArea(original.properties.area_km2)}
          </p>
        </div>
      )}
    </div>
  )
}
