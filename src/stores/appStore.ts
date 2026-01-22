import { create } from 'zustand'
import type { AppState, AnimationState, UIState } from '@/types'
import type { Preset } from '@/data/presets'
import { loadCountries as loadCountriesData } from '@/utils/dataLoader'
import { getDistortionAtLatitude } from '@/utils/projection'

const initialDragState = {
  isDragging: false,
  countryId: null,
  currentPos: null,
}

const initialAnimationState: AnimationState = {
  isAnimating: false,
  countryId: null,
  startPos: null,
  endPos: null,
  progress: 0,
}

const initialUIState: UIState = {
  showLabels: false,
  showLatitudeLines: false,
  showHelpModal: false,
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  countries: [],
  isLoading: false,
  error: null,
  selectedCountry: null,
  placedCountries: [],
  dragState: initialDragState,
  animationState: initialAnimationState,
  activePreset: null,
  ui: initialUIState,

  // Actions
  loadCountries: async () => {
    set({ isLoading: true, error: null })
    try {
      const countries = await loadCountriesData()
      set({ countries, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load countries',
        isLoading: false
      })
    }
  },

  selectCountry: (id: string) => {
    const { countries } = get()
    const country = countries.find((c) => c.id === id) ?? null
    set({ selectedCountry: country })
  },

  selectCountryByCode: (isoCode: string) => {
    const { countries } = get()
    const country = countries.find((c) => c.isoCode === isoCode) ?? null
    if (country) {
      set({ selectedCountry: country })
    }
    return country
  },

  clearSelection: () => {
    set({ selectedCountry: null })
  },

  placeCountry: (countryId: string, position: [number, number]) => {
    const { countries, placedCountries } = get()
    const country = countries.find((c) => c.id === countryId)
    if (!country) return

    // Store the distortion at the new position (for display purposes)
    const newLat = position[1]
    const scaleFactor = getDistortionAtLatitude(newLat)

    set({
      placedCountries: [
        ...placedCountries,
        { original: country, currentPosition: position, scaleFactor },
      ],
      selectedCountry: null,
    })
  },

  removePlacedCountry: (index: number) => {
    const { placedCountries } = get()
    set({
      placedCountries: placedCountries.filter((_, i) => i !== index),
    })
  },

  undoLastPlaced: () => {
    const { placedCountries } = get()
    if (placedCountries.length === 0) return
    set({
      placedCountries: placedCountries.slice(0, -1),
    })
  },

  startDrag: (countryId: string) => {
    set({
      dragState: { isDragging: true, countryId, currentPos: null },
    })
  },

  updateDragPosition: (pos: [number, number]) => {
    set((state) => ({
      dragState: { ...state.dragState, currentPos: pos },
    }))
  },

  endDrag: () => {
    set({ dragState: initialDragState })
  },

  reset: () => {
    set({
      selectedCountry: null,
      placedCountries: [],
      dragState: initialDragState,
      animationState: initialAnimationState,
      activePreset: null,
    })
  },

  // Animation actions for preset demos
  startAnimation: (countryId: string, endPos: [number, number]) => {
    const { countries } = get()
    const country = countries.find((c) => c.id === countryId)
    if (!country) return

    const startPos = country.properties.centroid
    set({
      selectedCountry: country,
      animationState: {
        isAnimating: true,
        countryId,
        startPos,
        endPos,
        progress: 0,
      },
    })
  },

  updateAnimationProgress: (progress: number) => {
    set((state) => ({
      animationState: { ...state.animationState, progress: Math.min(1, progress) },
    }))
  },

  endAnimation: () => {
    const { animationState, selectedCountry } = get()
    if (selectedCountry && animationState.endPos) {
      // Place the country at the final position
      get().placeCountry(selectedCountry.id, animationState.endPos)
    }
    set({ animationState: initialAnimationState })
  },

  setActivePreset: (preset: Preset | null) => {
    set({ activePreset: preset })
  },

  // UI actions
  toggleLabels: () => {
    set((state) => ({
      ui: { ...state.ui, showLabels: !state.ui.showLabels },
    }))
  },

  toggleLatitudeLines: () => {
    set((state) => ({
      ui: { ...state.ui, showLatitudeLines: !state.ui.showLatitudeLines },
    }))
  },

  setShowHelpModal: (show: boolean) => {
    set((state) => ({
      ui: { ...state.ui, showHelpModal: show },
    }))
  },
}))
