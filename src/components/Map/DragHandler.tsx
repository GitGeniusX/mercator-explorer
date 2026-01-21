import { useDragInteraction } from '@/hooks/useDragInteraction'

/**
 * Component that handles drag interactions on the map.
 * Must be placed inside MapContainer.
 * Renders nothing, just attaches event handlers.
 */
export function DragHandler() {
  useDragInteraction()
  return null
}
