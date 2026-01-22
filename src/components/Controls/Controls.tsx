import { useAppStore } from '@/stores/appStore'

interface ControlsProps {
  onShare?: () => void
}

export function Controls({ onShare }: ControlsProps) {
  const reset = useAppStore((state) => state.reset)
  const undoLastPlaced = useAppStore((state) => state.undoLastPlaced)
  const toggleLabels = useAppStore((state) => state.toggleLabels)
  const toggleLatitudeLines = useAppStore((state) => state.toggleLatitudeLines)
  const setShowHelpModal = useAppStore((state) => state.setShowHelpModal)
  const showLabels = useAppStore((state) => state.ui.showLabels)
  const showLatitudeLines = useAppStore((state) => state.ui.showLatitudeLines)
  const placedCount = useAppStore((state) => state.placedCountries.length)

  return (
    <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-1.5">
      {/* Undo */}
      <button
        onClick={undoLastPlaced}
        disabled={placedCount === 0}
        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Undo last (Z)"
        aria-label="Undo last placement"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </button>

      {/* Reset */}
      <button
        onClick={reset}
        disabled={placedCount === 0}
        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Reset all (R)"
        aria-label="Reset all placements"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Toggle Labels */}
      <button
        onClick={toggleLabels}
        className={`p-2 rounded-md transition-colors ${
          showLabels ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Toggle country labels"
        aria-label="Toggle country labels"
        aria-pressed={showLabels}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </button>

      {/* Toggle Latitude Lines */}
      <button
        onClick={toggleLatitudeLines}
        className={`p-2 rounded-md transition-colors ${
          showLatitudeLines ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Toggle latitude lines"
        aria-label="Toggle latitude lines"
        aria-pressed={showLatitudeLines}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Share */}
      <button
        onClick={onShare}
        disabled={placedCount === 0}
        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Share"
        aria-label="Share current view"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {/* Help */}
      <button
        onClick={() => setShowHelpModal(true)}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        title="Keyboard shortcuts (?)"
        aria-label="Show keyboard shortcuts"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  )
}
