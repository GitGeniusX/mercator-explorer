import type { Geometry } from 'geojson'

export interface Country {
  id: string
  name: string
  geometry: Geometry
  properties: {
    area_km2: number
    centroid: [number, number] // [lng, lat]
    continent: string
  }
}

export interface PlacedCountry {
  original: Country
  currentPosition: [number, number] // [lng, lat]
  scaleFactor: number
}

export interface DragState {
  isDragging: boolean
  countryId: string | null
  currentPos: [number, number] | null
}

export interface AppState {
  // Data
  countries: Country[]
  isLoading: boolean
  error: string | null

  // Selection
  selectedCountry: Country | null

  // Placed countries
  placedCountries: PlacedCountry[]

  // Drag state
  dragState: DragState

  // Actions
  loadCountries: () => Promise<void>
  selectCountry: (id: string) => void
  clearSelection: () => void
  placeCountry: (countryId: string, position: [number, number]) => void
  removePlacedCountry: (index: number) => void
  startDrag: (countryId: string) => void
  updateDragPosition: (pos: [number, number]) => void
  endDrag: () => void
  reset: () => void
}
