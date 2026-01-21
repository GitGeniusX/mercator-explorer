import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import type { Map as LeafletMap } from 'leaflet'
import { useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import { CountryLayer } from './CountryLayer'
import { DragHandler } from './DragHandler'
import { InteractiveOverlay } from './InteractiveOverlay'

// World bounds for initial view
const WORLD_CENTER: [number, number] = [20, 0] // Slightly north for better view
const INITIAL_ZOOM = 2
const MIN_ZOOM = 1
const MAX_ZOOM = 8

export interface MapProps {
  className?: string
}

export function Map({ className }: MapProps) {
  const mapRef = useRef<LeafletMap>(null)

  return (
    <MapContainer
      ref={mapRef}
      center={WORLD_CENTER}
      zoom={INITIAL_ZOOM}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      scrollWheelZoom={true}
      zoomControl={false}
      className={className}
      style={{ height: '100%', width: '100%' }}
      worldCopyJump={true}
    >
      {/* Use a light-colored tile layer or no tiles for cleaner look */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
      />
      <ZoomControl position="bottomright" />
      <CountryLayer />
      <InteractiveOverlay />
      <DragHandler />
    </MapContainer>
  )
}
