import { useEffect, useCallback, useRef } from 'react'
import { useMap, useMapEvents } from 'react-leaflet'
import type { LeafletMouseEvent } from 'leaflet'
import { useAppStore } from '@/stores/appStore'

/**
 * Hook to handle drag interaction on the map.
 * Supports both mouse and touch events.
 * Must be used within a MapContainer component.
 */
export function useDragInteraction() {
  const map = useMap()
  const isDraggingRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)
  const touchIdRef = useRef<number | null>(null)

  const selectedCountry = useAppStore((state) => state.selectedCountry)
  const dragState = useAppStore((state) => state.dragState)
  const startDrag = useAppStore((state) => state.startDrag)
  const updateDragPosition = useAppStore((state) => state.updateDragPosition)
  const endDrag = useAppStore((state) => state.endDrag)
  const placeCountry = useAppStore((state) => state.placeCountry)
  const clearSelection = useAppStore((state) => state.clearSelection)

  // Common function to start drag
  const beginDrag = useCallback((latlng: { lat: number; lng: number }) => {
    if (!selectedCountry) return

    isDraggingRef.current = true
    startDrag(selectedCountry.id)
    updateDragPosition([latlng.lng, latlng.lat])

    // Disable map dragging while we're dragging a country
    map.dragging.disable()
    map.getContainer().style.cursor = 'grabbing'
  }, [selectedCountry, startDrag, updateDragPosition, map])

  // Common function to update drag position
  const moveDrag = useCallback((latlng: { lat: number; lng: number }) => {
    if (!isDraggingRef.current || !dragState.isDragging) return

    // Cancel any pending RAF
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
    }

    // Throttle updates using requestAnimationFrame
    rafIdRef.current = requestAnimationFrame(() => {
      // Clamp latitude to reasonable bounds (-85 to 85)
      const clampedLat = Math.max(-85, Math.min(85, latlng.lat))
      updateDragPosition([latlng.lng, clampedLat])
    })
  }, [dragState.isDragging, updateDragPosition])

  // Common function to end drag
  const finishDrag = useCallback(() => {
    if (!isDraggingRef.current) return

    isDraggingRef.current = false
    touchIdRef.current = null

    // Cancel any pending RAF
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }

    // Re-enable map dragging
    map.dragging.enable()
    map.getContainer().style.cursor = ''

    // If we have a valid drag position, place the country
    if (dragState.countryId && dragState.currentPos) {
      placeCountry(dragState.countryId, dragState.currentPos)
    }

    // End drag state
    endDrag()
    clearSelection()
  }, [map, dragState.countryId, dragState.currentPos, placeCountry, endDrag, clearSelection])

  // Cancel drag without placing
  const cancelDrag = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false
      touchIdRef.current = null
      map.dragging.enable()
      map.getContainer().style.cursor = ''
      endDrag()
    }
    clearSelection()
  }, [map, endDrag, clearSelection])

  // Mouse event handlers
  const handleMouseDown = useCallback((e: LeafletMouseEvent) => {
    beginDrag(e.latlng)
  }, [beginDrag])

  const handleMouseMove = useCallback((e: LeafletMouseEvent) => {
    moveDrag(e.latlng)
  }, [moveDrag])

  const handleMouseUp = useCallback(() => {
    finishDrag()
  }, [finishDrag])

  // Touch event handlers
  useEffect(() => {
    const container = map.getContainer()

    const handleTouchStart = (e: TouchEvent) => {
      if (!selectedCountry || e.touches.length !== 1) return

      const touch = e.touches[0]
      touchIdRef.current = touch.identifier

      // Convert touch position to latlng
      const containerPoint = map.mouseEventToContainerPoint({
        clientX: touch.clientX,
        clientY: touch.clientY,
      } as MouseEvent)
      const latlng = map.containerPointToLatLng(containerPoint)

      beginDrag(latlng)

      // Prevent default to stop scrolling
      e.preventDefault()
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || touchIdRef.current === null) return

      // Find our touch
      const touch = Array.from(e.touches).find(
        (t) => t.identifier === touchIdRef.current
      )
      if (!touch) return

      // Convert touch position to latlng
      const containerPoint = map.mouseEventToContainerPoint({
        clientX: touch.clientX,
        clientY: touch.clientY,
      } as MouseEvent)
      const latlng = map.containerPointToLatLng(containerPoint)

      moveDrag(latlng)

      // Prevent default to stop scrolling
      e.preventDefault()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDraggingRef.current || touchIdRef.current === null) return

      // Check if our touch ended
      const touchEnded = !Array.from(e.touches).some(
        (t) => t.identifier === touchIdRef.current
      )
      if (touchEnded) {
        finishDrag()
      }
    }

    const handleTouchCancel = () => {
      cancelDrag()
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)
    container.addEventListener('touchcancel', handleTouchCancel)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('touchcancel', handleTouchCancel)
    }
  }, [map, selectedCountry, beginDrag, moveDrag, finishDrag, cancelDrag])

  // Cancel drag on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelDrag()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cancelDrag])

  // Listen to map events (mouse only - touch handled separately)
  useMapEvents({
    mousedown: handleMouseDown,
    mousemove: handleMouseMove,
    mouseup: handleMouseUp,
    mouseout: (e) => {
      // Only end drag if we're actually leaving the map
      const relatedTarget = (e.originalEvent as MouseEvent).relatedTarget
      if (relatedTarget && !map.getContainer().contains(relatedTarget as Node)) {
        handleMouseUp()
      }
    },
  })

  // Update cursor when country is selected (before dragging starts)
  useEffect(() => {
    if (selectedCountry && !dragState.isDragging) {
      map.getContainer().style.cursor = 'grab'
    } else if (!dragState.isDragging) {
      map.getContainer().style.cursor = ''
    }
  }, [selectedCountry, dragState.isDragging, map])

  return null
}
