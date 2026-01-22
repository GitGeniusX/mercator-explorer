import { getDistortionAtLatitude } from '@/utils/projection'

interface LatitudeIndicatorProps {
  latitude: number
  originalLatitude: number
}

export function LatitudeIndicator({ latitude, originalLatitude }: LatitudeIndicatorProps) {
  const distortion = getDistortionAtLatitude(latitude)
  const originalDistortion = getDistortionAtLatitude(originalLatitude)

  // Calculate direction to true size
  const distanceToEquator = Math.abs(latitude)
  const isNearTrueSize = distortion < 1.1
  const isMovingCorrectWay = Math.abs(latitude) < Math.abs(originalLatitude)

  // Get hemisphere indicator
  const hemisphere = latitude >= 0 ? 'N' : 'S'

  return (
    <div className="bg-black/80 backdrop-blur-sm text-white rounded-lg px-4 py-3 shadow-xl animate-slide-in-up">
      {/* Current latitude display */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tabular-nums">
          {Math.abs(latitude).toFixed(1)}°
        </span>
        <span className="text-lg text-gray-300">{hemisphere}</span>
      </div>

      {/* Distortion indicator */}
      <div className="mt-2 flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isNearTrueSize ? 'bg-green-400' :
            distortion < 2 ? 'bg-yellow-400' :
            distortion < 5 ? 'bg-orange-400' :
            'bg-red-400'
          }`}
        />
        <span className="text-sm">
          {isNearTrueSize ? (
            <span className="text-green-400 font-medium">True size zone</span>
          ) : (
            <span>
              <span className="text-gray-300">Distortion: </span>
              <span className="font-medium">{distortion.toFixed(1)}×</span>
            </span>
          )}
        </span>
      </div>

      {/* Change from original */}
      {Math.abs(distortion - originalDistortion) > 0.1 && (
        <div className="mt-2 pt-2 border-t border-white/20 text-xs text-gray-400">
          {isMovingCorrectWay ? (
            <span className="text-green-400">
              ↓ {((1 - distortion / originalDistortion) * 100).toFixed(0)}% closer to true size
            </span>
          ) : (
            <span className="text-red-400">
              ↑ {((distortion / originalDistortion - 1) * 100).toFixed(0)}% more distorted
            </span>
          )}
        </div>
      )}

      {/* Direction hint */}
      {!isNearTrueSize && (
        <div className="mt-2 text-xs text-blue-300">
          {distanceToEquator > 0 ? (
            latitude > 0 ? '↓ Move south toward equator' : '↑ Move north toward equator'
          ) : (
            'At equator - true size!'
          )}
        </div>
      )}
    </div>
  )
}
