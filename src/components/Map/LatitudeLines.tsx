import { Polyline, Tooltip } from 'react-leaflet'
import { useAppStore } from '@/stores/appStore'

// Key latitudes to display
const LATITUDES = [
  { lat: 66.5, label: 'Arctic Circle' },
  { lat: 60, label: '60°N' },
  { lat: 45, label: '45°N' },
  { lat: 30, label: '30°N' },
  { lat: 0, label: 'Equator' },
  { lat: -30, label: '30°S' },
  { lat: -45, label: '45°S' },
  { lat: -60, label: '60°S' },
  { lat: -66.5, label: 'Antarctic Circle' },
]

export function LatitudeLines() {
  const showLatitudeLines = useAppStore((state) => state.ui.showLatitudeLines)

  if (!showLatitudeLines) return null

  return (
    <>
      {LATITUDES.map(({ lat, label }) => {
        const isEquator = lat === 0
        const isCircle = Math.abs(lat) === 66.5
        return (
          <Polyline
            key={lat}
            positions={[
              [lat, -180],
              [lat, 180],
            ]}
            pathOptions={{
              color: isEquator ? '#dc2626' : isCircle ? '#3b82f6' : '#6b7280',
              weight: isEquator ? 2 : 1,
              opacity: isEquator ? 0.7 : 0.5,
              dashArray: isEquator ? undefined : '5, 5',
            }}
          >
            <Tooltip
              permanent
              direction="left"
              offset={[-5, 0]}
              className="latitude-tooltip-subtle"
            >
              <span className="text-[10px] text-gray-600">{label}</span>
            </Tooltip>
          </Polyline>
        )
      })}
    </>
  )
}
