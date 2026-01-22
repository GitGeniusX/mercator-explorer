import { useEffect } from 'react'
import { useAppStore } from '@/stores/appStore'

/**
 * Hook that sets up global keyboard shortcuts for the app.
 *
 * Shortcuts:
 * - Escape: Cancel selection or drag
 * - R: Reset all placed countries
 * - Z: Undo last placement
 * - L: Toggle country labels
 * - G: Toggle latitude grid lines
 * - ?: Show help modal
 */
export function useKeyboardShortcuts() {
  const clearSelection = useAppStore((state) => state.clearSelection)
  const endDrag = useAppStore((state) => state.endDrag)
  const reset = useAppStore((state) => state.reset)
  const undoLastPlaced = useAppStore((state) => state.undoLastPlaced)
  const toggleLabels = useAppStore((state) => state.toggleLabels)
  const toggleLatitudeLines = useAppStore((state) => state.toggleLatitudeLines)
  const setShowHelpModal = useAppStore((state) => state.setShowHelpModal)
  const isDragging = useAppStore((state) => state.dragState.isDragging)
  const selectedCountry = useAppStore((state) => state.selectedCountry)
  const showHelpModal = useAppStore((state) => state.ui.showHelpModal)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // If help modal is open, only allow Escape to close it
      if (showHelpModal) {
        if (e.key === 'Escape') {
          setShowHelpModal(false)
        }
        return
      }

      switch (e.key) {
        case 'Escape':
          if (isDragging) {
            endDrag()
          } else if (selectedCountry) {
            clearSelection()
          }
          break

        case 'r':
        case 'R':
          // Don't trigger if modifier keys are pressed (e.g., Cmd+R for refresh)
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault()
            reset()
          }
          break

        case 'z':
        case 'Z':
          // Don't trigger if modifier keys are pressed (e.g., Cmd+Z for browser undo)
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault()
            undoLastPlaced()
          }
          break

        case 'l':
        case 'L':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault()
            toggleLabels()
          }
          break

        case 'g':
        case 'G':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault()
            toggleLatitudeLines()
          }
          break

        case '?':
          e.preventDefault()
          setShowHelpModal(true)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [
    clearSelection,
    endDrag,
    reset,
    undoLastPlaced,
    toggleLabels,
    toggleLatitudeLines,
    setShowHelpModal,
    isDragging,
    selectedCountry,
    showHelpModal,
  ])
}
