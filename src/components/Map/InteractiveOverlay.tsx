import { useAppStore } from '@/stores/appStore'
import { DraggableCountry, GhostCountry, PlacedCountry } from '@/components/CountryOverlay'

/**
 * Component that renders interactive country overlays:
 * - The currently dragged country (follows cursor, resizes in real-time)
 * - Ghost outlines at original positions
 * - Placed countries at their new positions
 */
export function InteractiveOverlay() {
  const selectedCountry = useAppStore((state) => state.selectedCountry)
  const dragState = useAppStore((state) => state.dragState)
  const placedCountries = useAppStore((state) => state.placedCountries)
  const removePlacedCountry = useAppStore((state) => state.removePlacedCountry)

  // Get the country being dragged
  const draggedCountry = selectedCountry

  // Calculate drag position (use centroid as initial position if not dragging)
  const dragPosition: [number, number] = dragState.currentPos ??
    (draggedCountry?.properties.centroid ?? [0, 0])

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

      {/* Currently dragged/selected country */}
      {draggedCountry && (
        <DraggableCountry
          country={draggedCountry}
          position={dragPosition}
          isDragging={dragState.isDragging}
        />
      )}
    </>
  )
}
