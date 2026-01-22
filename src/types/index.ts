import type { Geometry } from 'geojson'
import type { Preset } from '@/data/presets'

export interface Country {
  id: string
  name: string
  isoCode: string // ADM0_A3 code for preset matching
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

export interface AnimationState {
  isAnimating: boolean
  countryId: string | null
  startPos: [number, number] | null
  endPos: [number, number] | null
  progress: number // 0 to 1
}

export interface UIState {
  showLabels: boolean
  showLatitudeLines: boolean
  showHelpModal: boolean
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

  // Animation state (for preset demos)
  animationState: AnimationState

  // Active preset
  activePreset: Preset | null

  // UI state
  ui: UIState

  // Actions
  loadCountries: () => Promise<void>
  selectCountry: (id: string) => void
  selectCountryByCode: (isoCode: string) => Country | null
  clearSelection: () => void
  placeCountry: (countryId: string, position: [number, number]) => void
  removePlacedCountry: (index: number) => void
  undoLastPlaced: () => void
  startDrag: (countryId: string) => void
  updateDragPosition: (pos: [number, number]) => void
  endDrag: () => void
  reset: () => void
  // Preset/animation actions
  startAnimation: (countryId: string, endPos: [number, number]) => void
  updateAnimationProgress: (progress: number) => void
  endAnimation: () => void
  setActivePreset: (preset: Preset | null) => void
  // UI actions
  toggleLabels: () => void
  toggleLatitudeLines: () => void
  setShowHelpModal: (show: boolean) => void
}
