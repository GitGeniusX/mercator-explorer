import { Polyline, Tooltip } from 'react-leaflet'
import { useAppStore } from '@/stores/appStore'

// Key latitudes to display
const LATITUDES = [
  { lat: 66.5, label: 'Arctic Circle', color: '#6bb3d9' },
  { lat: 60, label: '60°N', color: '#9ca3af' },
  { lat: 45, label: '45°N', color: '#9ca3af' },
  { lat: 30, label: '30°N (Tropics)', color: '#d97706' },
  { lat: 0, label: 'Equator', color: '#dc2626' },
  { lat: -30, label: '30°S (Tropics)', color: '#d97706' },
  { lat: -45, label: '45°S', color: '#9ca3af' },
  { lat: -60, label: '60°S', color: '#9ca3af' },
  { lat: -66.5, label: 'Antarctic Circle', color: '#6bb3d9' },
]

export function LatitudeLines() {
  const showLatitudeLines = useAppStore((state) => state.ui.showLatitudeLines)

  if (!showLatitudeLines) return null

  return (
    <>
      {LATITUDES.map(({ lat, label, color }) => (
        <Polyline
          key={lat}
          positions={[
            [lat, -180],
            [lat, 180],
          ]}
          pathOptions={{
            color,
            weight: lat === 0 ? 2 : 1,
            opacity: 0.6,
            dashArray: lat === 0 ? undefined : '5, 5',
          }}
        >
          <Tooltip permanent direction="right" offset={[10, 0]} className="latitude-tooltip">
            <span className="text-xs font-medium">{label}</span>
          </Tooltip>
        </Polyline>
      ))}
    </>
  )
}
