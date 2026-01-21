import { useAppStore } from '@/stores/appStore'
import { DraggableCountry, GhostCountry, PlacedCountry } from '@/components/CountryOverlay'
import { getAnimatedPosition } from '@/hooks/usePresetAnimation'

/**
 * Component that renders interactive country overlays:
 * - The currently dragged country (follows cursor, resizes in real-time)
 * - Ghost outlines at original positions
 * - Placed countries at their new positions
 * - Animated country (during preset demos)
 */
export function InteractiveOverlay() {
  const selectedCountry = useAppStore((state) => state.selectedCountry)
  const dragState = useAppStore((state) => state.dragState)
  const animationState = useAppStore((state) => state.animationState)
  const placedCountries = useAppStore((state) => state.placedCountries)
  const removePlacedCountry = useAppStore((state) => state.removePlacedCountry)

  // Get the country being dragged or animated
  const activeCountry = selectedCountry

  // Calculate position based on drag or animation state
  let activePosition: [number, number]
  let isActive = false

  if (animationState.isAnimating && animationState.startPos && animationState.endPos) {
    // Animation in progress - calculate interpolated position
    activePosition = getAnimatedPosition(
      animationState.startPos,
      animationState.endPos,
      animationState.progress
    )
    isActive = true
  } else if (dragState.isDragging && dragState.currentPos) {
    // Dragging in progress
    activePosition = dragState.currentPos
    isActive = true
  } else {
    // Not active - use centroid as initial position
    activePosition = activeCountry?.properties.centroid ?? [0, 0]
  }

  return (
    <>
      {/* Ghost outlines for placed countries */}
      {placedCountries.map((placed) => (
        <GhostCountry
          key={`ghost-${placed.original.id}`}
          country={placed.original}
        />
      ))}

      {/* Placed countries at new positions */}
      {placedCountries.map((placed, index) => (
        <PlacedCountry
          key={`placed-${placed.original.id}-${index}`}
          placedCountry={placed}
          index={index}
          onRemove={removePlacedCountry}
        />
      ))}

      {/* Currently dragged/selected/animated country */}
      {activeCountry && (
        <DraggableCountry
          country={activeCountry}
          position={activePosition}
          isDragging={isActive}
        />
      )}
    </>
  )
}
