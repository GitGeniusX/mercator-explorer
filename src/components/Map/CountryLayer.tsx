import { GeoJSON } from 'react-leaflet'
import type { PathOptions, Layer, LeafletMouseEvent } from 'leaflet'
import type { Feature, Geometry } from 'geojson'
import { useCallback, useState } from 'react'
import { useAppStore } from '@/stores/appStore'
import type { Country } from '@/types'

// Default style for countries
const defaultStyle: PathOptions = {
  fillColor: '#f5f5f0', // map-land color
  fillOpacity: 0.8,
  color: '#888',
  weight: 1,
}

// Hover style
const hoverStyle: PathOptions = {
  fillColor: '#e6d690', // map-highlight color
  fillOpacity: 0.9,
  color: '#666',
  weight: 2,
}

// Selected style
const selectedStyle: PathOptions = {
  fillColor: '#d4c070',
  fillOpacity: 1,
  color: '#444',
  weight: 2,
}

export function CountryLayer() {
  const countries = useAppStore((state) => state.countries)
  const selectedCountry = useAppStore((state) => state.selectedCountry)
  const selectCountry = useAppStore((state) => state.selectCountry)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const getStyle = useCallback(
    (feature: Feature<Geometry, Country['properties'] & { id: string }> | undefined): PathOptions => {
      if (!feature?.properties) return defaultStyle
      const id = feature.properties.id

      if (selectedCountry?.id === id) {
        return selectedStyle
      }
      if (hoveredId === id) {
        return hoverStyle
      }
      return defaultStyle
    },
    [hoveredId, selectedCountry?.id]
  )

  const onEachFeature = useCallback(
    (feature: Feature<Geometry>, layer: Layer) => {
      const id = (feature.properties as { id: string })?.id
      const name = (feature.properties as { name: string })?.name

      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          setHoveredId(id)
          e.target.bringToFront()
        },
        mouseout: () => {
          setHoveredId(null)
        },
        click: () => {
          selectCountry(id)
          console.log('Selected country:', name, `(${id})`)
        },
      })
    },
    [selectCountry]
  )

  if (countries.length === 0) {
    return null
  }

  // Convert countries to GeoJSON FeatureCollection
  const geojsonData: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: countries.map((country) => ({
      type: 'Feature' as const,
      id: country.id,
      properties: {
        id: country.id,
        name: country.name,
        ...country.properties,
      },
      geometry: country.geometry,
    })),
  }

  return (
    <GeoJSON
      key={`countries-${hoveredId}-${selectedCountry?.id}`}
      data={geojsonData}
      style={getStyle}
      onEachFeature={onEachFeature}
    />
  )
}
