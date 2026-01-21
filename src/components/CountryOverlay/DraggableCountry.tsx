import { GeoJSON } from 'react-leaflet'
import type { PathOptions } from 'leaflet'
import { useMemo } from 'react'
import type { Country } from '@/types'
import { transformCountryToPosition, simplifyGeometry } from '@/utils/projection'

export interface DraggableCountryProps {
  country: Country
  position: [number, number] // [lng, lat]
  isDragging: boolean
}

// Style for the dragged country (lifted appearance)
const draggedStyle: PathOptions = {
  fillColor: '#f59e0b', // amber-500 for visibility
  fillOpacity: 0.85,
  color: '#d97706', // amber-600 border
  weight: 3,
  className: 'country-dragged',
}

// Style for the lifted (selected but not yet dragging) country
const liftedStyle: PathOptions = {
  fillColor: '#fbbf24', // amber-400
  fillOpacity: 0.9,
  color: '#f59e0b', // amber-500 border
  weight: 2,
  className: 'country-lifted',
}

export function DraggableCountry({ country, position, isDragging }: DraggableCountryProps) {
  // Simplify geometry during drag for better performance
  const workingGeometry = useMemo(() => {
    if (isDragging) {
      // Use simplified geometry during drag (tolerance = 0.1 degrees)
      return simplifyGeometry(country.geometry, 0.1)
    }
    return country.geometry
  }, [country.geometry, isDragging])

  // Transform geometry to current position (translate only, no scaling)
  // Mercator projection naturally handles the visual size change
  const transformedGeometry = useMemo(() => {
    return transformCountryToPosition(
      workingGeometry,
      country.properties.centroid,
      position
    )
  }, [workingGeometry, country.properties.centroid, position])

  // Create GeoJSON feature
  const geojsonData: GeoJSON.FeatureCollection = useMemo(() => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature' as const,
        id: `dragged-${country.id}`,
        properties: {
          id: country.id,
          name: country.name,
          ...country.properties,
        },
        geometry: transformedGeometry,
      },
    ],
  }), [country.id, country.name, country.properties, transformedGeometry])

  const style = isDragging ? draggedStyle : liftedStyle

  return (
    <GeoJSON
      key={`dragged-${country.id}-${position[0].toFixed(4)}-${position[1].toFixed(4)}`}
      data={geojsonData}
      style={() => style}
      interactive={false} // Prevent interfering with drag events
    />
  )
}
