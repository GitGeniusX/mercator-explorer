import { GeoJSON } from 'react-leaflet'
import type { PathOptions } from 'leaflet'
import { useMemo } from 'react'
import type { Country } from '@/types'

export interface GhostCountryProps {
  country: Country
}

// Ghost style - translucent with dashed border
const ghostStyle: PathOptions = {
  fillColor: '#9ca3af', // gray-400
  fillOpacity: 0.25,
  color: '#6b7280', // gray-500
  weight: 1,
  dashArray: '5, 5',
  className: 'country-ghost',
}

export function GhostCountry({ country }: GhostCountryProps) {
  // Create GeoJSON feature at original position
  const geojsonData: GeoJSON.FeatureCollection = useMemo(() => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature' as const,
        id: `ghost-${country.id}`,
        properties: {
          id: country.id,
          name: country.name,
          isGhost: true,
        },
        geometry: country.geometry,
      },
    ],
  }), [country.id, country.name, country.geometry])

  return (
    <GeoJSON
      key={`ghost-${country.id}`}
      data={geojsonData}
      style={() => ghostStyle}
      interactive={false}
    />
  )
}
