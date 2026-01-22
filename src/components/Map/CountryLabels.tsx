import { Marker } from 'react-leaflet'
import L from 'leaflet'
import { useAppStore } from '@/stores/appStore'

// Create a custom div icon for labels
function createLabelIcon(name: string): L.DivIcon {
  return L.divIcon({
    className: 'country-label',
    html: `<span class="px-1.5 py-0.5 text-xs font-medium text-gray-700 bg-white/80 rounded shadow-sm whitespace-nowrap">${name}</span>`,
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
