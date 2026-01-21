import { create } from 'zustand'
import type { AppState } from '@/types'
import { loadCountries as loadCountriesData } from '@/utils/dataLoader'
import { calculateSizeAdjustment } from '@/utils/projection'

const initialDragState = {
  isDragging: false,
  countryId: null,
  currentPos: null,
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  countries: [],
  isLoading: false,
  error: null,
  selectedCountry: null,
  placedCountries: [],
  dragState: initialDragState,

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

  clearSelection: () => {
    set({ selectedCountry: null })
  },

  placeCountry: (countryId: string, position: [number, number]) => {
    const { countries, placedCountries } = get()
    const country = countries.find((c) => c.id === countryId)
    if (!country) return

    // Calculate scale factor based on latitude change
    const originalLat = country.properties.centroid[1]
    const newLat = position[1]
    const scaleFactor = calculateSizeAdjustment(originalLat, newLat)

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
    })
  },
}))
