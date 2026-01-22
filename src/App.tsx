import { useEffect, useMemo, useCallback } from 'react'
import { Map } from '@/components/Map'
import {
  InfoPanel,
  ComparisonCard,
  LatitudeIndicator,
  StatsOverlay,
  PresetBanner,
} from '@/components/InfoPanel'
import { Controls, HelpModal } from '@/components/Controls'
import { Tutorial } from '@/components/Onboarding'
import { useAppStore } from '@/stores/appStore'
import { usePresetAnimation, getAnimatedPosition } from '@/hooks/usePresetAnimation'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

function App() {
  const loadCountries = useAppStore((state) => state.loadCountries)
  const isLoading = useAppStore((state) => state.isLoading)
  const error = useAppStore((state) => state.error)
  const countriesCount = useAppStore((state) => state.countries.length)
  const countries = useAppStore((state) => state.countries)
  const selectedCountry = useAppStore((state) => state.selectedCountry)
  const dragState = useAppStore((state) => state.dragState)
  const animationState = useAppStore((state) => state.animationState)
  const placedCountries = useAppStore((state) => state.placedCountries)
  const activePreset = useAppStore((state) => state.activePreset)
  const reset = useAppStore((state) => state.reset)
  const removePlacedCountry = useAppStore((state) => state.removePlacedCountry)
  const placeCountry = useAppStore((state) => state.placeCountry)
  const setShowTutorial = useAppStore((state) => state.setShowTutorial)

  const { loadPreset } = usePresetAnimation()

  // Initialize keyboard shortcuts
  useKeyboardShortcuts()

  useEffect(() => {
    loadCountries()
  }, [loadCountries])

  // Parse URL parameters and place countries from shared link
  useEffect(() => {
    if (countries.length === 0) return

    const url = new URL(window.location.href)
    const placedParam = url.searchParams.get('placed')
    if (!placedParam) return

    // Parse format: ID:lat:lng,ID:lat:lng,...
    const placements = placedParam.split(',')
    let placedAny = false

    for (const placement of placements) {
      const [id, latStr, lngStr] = placement.split(':')
      const lat = parseFloat(latStr)
      const lng = parseFloat(lngStr)

      if (id && !isNaN(lat) && !isNaN(lng)) {
        const country = countries.find((c) => c.id === id)
        if (country) {
          placeCountry(id, [lng, lat])
          placedAny = true
        }
      }
    }

    // Skip tutorial if loading shared state
    if (placedAny) {
      setShowTutorial(false)
    }

    // Clear URL params after loading
    url.searchParams.delete('placed')
    window.history.replaceState({}, '', url.pathname)
  }, [countries, placeCountry, setShowTutorial])

  // Share handler - generates URL with placed countries
  const handleShare = useCallback(() => {
    const url = new URL(window.location.href)
    const placedData = placedCountries
      .map((p) => `${p.original.id}:${p.currentPosition[1].toFixed(1)}:${p.currentPosition[0].toFixed(1)}`)
      .join(',')
    if (placedData) {
      url.searchParams.set('placed', placedData)
    }
    navigator.clipboard.writeText(url.toString())
    alert('Link copied to clipboard!')
  }, [placedCountries])

  // Get available country codes for preset filtering
  const availableCountryCodes = useMemo(() =>
    countries.map((c) => c.isoCode),
    [countries]
  )

  // Calculate current latitude for display
  const currentLatitude = useMemo(() => {
    if (animationState.isAnimating && animationState.startPos && animationState.endPos) {
      const pos = getAnimatedPosition(
        animationState.startPos,
        animationState.endPos,
        animationState.progress
      )
      return pos[1]
    }
    if (dragState.isDragging && dragState.currentPos) {
      return dragState.currentPos[1]
    }
    return selectedCountry?.properties.centroid[1] ?? null
  }, [animationState, dragState, selectedCountry])

  // Determine if actively dragging or animating
  const isActive = dragState.isDragging || animationState.isAnimating

  if (error) {
    return (
      <div className="min-h-screen bg-map-water flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Header - Preset Banner */}
      <div className="relative z-[1001] flex-shrink-0">
        <PresetBanner
          onSelectPreset={loadPreset}
          availableCountries={availableCountryCodes}
          disabled={isActive}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-map-water flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading countries...</p>
            </div>
          </div>
        )}

        <Map className="h-full w-full" />

        {/* Left panel - Info when country selected */}
        {selectedCountry && (
          <div className="absolute top-4 left-4 z-[1000] space-y-4">
            <InfoPanel
              country={selectedCountry}
              currentLatitude={currentLatitude ?? undefined}
              isDragging={isActive}
            />

            {/* Active preset info */}
            {activePreset && (
              <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span>{activePreset.emoji}</span>
                  <span>{activePreset.name}</span>
                </h4>
                <ul className="mt-2 space-y-1">
                  {activePreset.facts.map((fact, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Right panel - Session stats and placed countries */}
        <div className="absolute top-4 right-4 z-[1000] space-y-4">
          <StatsOverlay
            placedCountries={placedCountries}
            onReset={reset}
          />

          {/* Placed countries list */}
          {placedCountries.length > 0 && (
            <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
              {placedCountries.map((placed, index) => (
                <ComparisonCard
                  key={`${placed.original.id}-${index}`}
                  placed={placed}
                  onRemove={() => removePlacedCountry(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Latitude indicator during drag/animation */}
        {isActive && selectedCountry && currentLatitude !== null && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000]">
            <LatitudeIndicator
              latitude={currentLatitude}
              originalLatitude={selectedCountry.properties.centroid[1]}
            />
          </div>
        )}

        {/* Controls - bottom center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
          <Controls onShare={handleShare} />
        </div>

        {/* Status bar - bottom left */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow z-[1000]">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{countriesCount}</span> countries
            {placedCountries.length > 0 && (
              <span className="text-gray-400"> • {placedCountries.length} placed</span>
            )}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Press <kbd className="px-1 bg-gray-100 rounded text-xs">?</kbd> for shortcuts
          </p>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal />

      {/* Tutorial Overlay */}
      <Tutorial />
    </div>
  )
}

export default App
