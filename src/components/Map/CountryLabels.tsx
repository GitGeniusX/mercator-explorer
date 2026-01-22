import { Marker } from 'react-leaflet'
import L from 'leaflet'
import { useAppStore } from '@/stores/appStore'

// Create a custom div icon for labels
function createLabelIcon(name: string): L.DivIcon {
  return L.divIcon({
    className: 'country-label',
    html: `<span class="text-[11px] font-medium text-gray-600 whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" style="transform: translate(-50%, -50%); display: inline-block;">${name}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

export function CountryLabels() {
  const showLabels = useAppStore((state) => state.ui.showLabels)
  const countries = useAppStore((state) => state.countries)

  if (!showLabels) return null

  // Only show labels for larger countries to avoid clutter
  const largeCountries = countries.filter(
    (c) => c.properties.area_km2 > 100_000
  )

  return (
    <>
      {largeCountries.map((country) => (
        <Marker
          key={`label-${country.id}`}
          position={[
            country.properties.centroid[1],
            country.properties.centroid[0],
          ]}
          icon={createLabelIcon(country.name)}
          interactive={false}
        />
      ))}
    </>
  )
}
