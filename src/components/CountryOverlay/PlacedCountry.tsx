import { GeoJSON } from 'react-leaflet'
import type { PathOptions } from 'leaflet'
import { useMemo } from 'react'
import type { PlacedCountry as PlacedCountryType } from '@/types'
import { transformCountryToPosition } from '@/utils/projection'

export interface PlacedCountryProps {
  placedCountry: PlacedCountryType
  index: number
  onRemove: (index: number) => void
}

// Style for placed countries
const placedStyle: PathOptions = {
  fillColor: '#22c55e', // green-500
  fillOpacity: 0.75,
  color: '#16a34a', // green-600 border
  weight: 2,
  className: 'country-placed',
}

export function PlacedCountry({ placedCountry, index, onRemove }: PlacedCountryProps) {
  const { original, currentPosition } = placedCountry

  // Transform geometry to placed position
  const transformedGeometry = useMemo(() => {
    return transformCountryToPosition(
      original.geometry,
      original.properties.centroid,
      currentPosition
    )
  }, [original.geometry, original.properties.centroid, currentPosition])

  // Create GeoJSON feature
  const geojsonData: GeoJSON.FeatureCollection = useMemo(() => ({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature' as const,
        id: `placed-${original.id}-${index}`,
        properties: {
          id: original.id,
          name: original.name,
          index,
          scaleFactor: placedCountry.scaleFactor,
          ...original.properties,
        },
        geometry: transformedGeometry,
      },
    ],
  }), [original.id, original.name, original.properties, transformedGeometry, index, placedCountry.scaleFactor])

  return (
    <GeoJSON
      key={`placed-${original.id}-${index}`}
      data={geojsonData}
      style={() => placedStyle}
      onEachFeature={(_feature, layer) => {
        layer.on({
          click: () => {
            onRemove(index)
          },
        })
        layer.bindTooltip(`${original.name} (click to remove)`, {
          permanent: false,
          direction: 'top',
        })
      }}
    />
  )
}
