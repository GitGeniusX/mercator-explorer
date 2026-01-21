import { GeoJSON } from 'react-leaflet'
import type { PathOptions } from 'leaflet'
import { useMemo } from 'react'
import type { Country } from '@/types'
import { transformCountryToPosition, calculateSizeAdjustment, simplifyGeometry } from '@/utils/projection'

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

  // Transform geometry to current position
  const transformedGeometry = useMemo(() => {
    return transformCountryToPosition(
      workingGeometry,
      country.properties.centroid,
      position
    )
  }, [workingGeometry, country.properties.centroid, position])

  // Calculate current scale factor for info display
  const scaleFactor = useMemo(() => {
    const originalLat = country.properties.centroid[1]
    const currentLat = position[1]
    return calculateSizeAdjustment(originalLat, currentLat)
  }, [country.properties.centroid, position])

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
          scaleFactor,
          ...country.properties,
        },
        geometry: transformedGeometry,
      },
    ],
  }), [country.id, country.name, country.properties, transformedGeometry, scaleFactor])

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
