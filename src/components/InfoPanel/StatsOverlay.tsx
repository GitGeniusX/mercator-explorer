import type { PlacedCountry } from '@/types'
import { formatArea, getDistortionAtLatitude } from '@/utils/projection'

interface StatsOverlayProps {
  placedCountries: PlacedCountry[]
  onReset?: () => void
}

// Fun facts about Mercator distortion
const FACTS = [
  'Africa is 14× larger than Greenland, but they look similar on Mercator maps.',
  'Brazil is larger than all of Europe combined (excluding Russia).',
  'Alaska appears as large as Brazil on Mercator, but is actually 5× smaller.',
  'Antarctica appears massive on Mercator but is only 1.5× the size of USA.',
  'India fits inside Africa more than 10 times.',
]

export function StatsOverlay({ placedCountries, onReset }: StatsOverlayProps) {
  // Calculate total "revealed" area
  const totalRevealedArea = placedCountries.reduce((sum, placed) => {
    const originalLat = placed.original.properties.centroid[1]
    const newLat = placed.currentPosition[1]
    const originalDistortion = getDistortionAtLatitude(originalLat)
    const newDistortion = getDistortionAtLatitude(newLat)

    // Area "saved" by revealing true size
    if (newDistortion < originalDistortion) {
      const apparentArea = placed.original.properties.area_km2 * originalDistortion
      const newApparentArea = placed.original.properties.area_km2 * newDistortion
      return sum + (apparentArea - newApparentArea)
    }
    return sum
  }, 0)

  // Count countries moved to true size zone
  const truesSizeCount = placedCountries.filter(
    (p) => getDistortionAtLatitude(p.currentPosition[1]) < 1.2
  ).length

  // Pick a random fact based on session
  const factIndex = placedCountries.length % FACTS.length

  if (placedCountries.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs animate-slide-in-right">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Session Stats</h3>
        {onReset && (
          <button
            onClick={onReset}
            className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
          >
            Reset All
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Countries placed */}
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-3xl font-bold text-blue-600">{placedCountries.length}</p>
          <p className="text-xs text-blue-500 font-medium">Countries Placed</p>
        </div>

        {/* True size reveals */}
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-3xl font-bold text-green-600">{truesSizeCount}</p>
          <p className="text-xs text-green-500 font-medium">At True Size</p>
        </div>
      </div>

      {/* Area revealed */}
      {totalRevealedArea > 0 && (
        <div className="mt-3 p-3 bg-purple-50 rounded-lg text-center">
          <p className="text-purple-600 text-sm font-medium">
            Distortion Removed
          </p>
          <p className="text-xl font-bold text-purple-700">
            {formatArea(totalRevealedArea)}
          </p>
          <p className="text-purple-500 text-xs">
            (apparent area "saved")
          </p>
        </div>
      )}

      {/* Fun fact */}
      <div className="mt-3 p-3 bg-amber-50 rounded-lg">
        <p className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-1">
          Did You Know?
        </p>
        <p className="text-amber-800 text-sm">{FACTS[factIndex]}</p>
      </div>
    </div>
  )
}
