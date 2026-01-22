import { useEffect, useRef } from 'react'
import { useAppStore } from '@/stores/appStore'

const SHORTCUTS = [
  { key: 'Esc', description: 'Cancel selection or drag' },
  { key: 'R', description: 'Reset all placed countries' },
  { key: 'Z', description: 'Undo last placement' },
  { key: 'L', description: 'Toggle country labels' },
  { key: 'G', description: 'Toggle latitude grid lines' },
  { key: '?', description: 'Show this help' },
]

export function HelpModal() {
  const showHelpModal = useAppStore((state) => state.ui.showHelpModal)
  const setShowHelpModal = useAppStore((state) => state.setShowHelpModal)
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on escape key
  useEffect(() => {
    if (!showHelpModal) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowHelpModal(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showHelpModal, setShowHelpModal])

  // Close on click outside
  useEffect(() => {
    if (!showHelpModal) return

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowHelpModal(false)
      }
    }

    // Delay to prevent immediate close from the button click
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showHelpModal, setShowHelpModal])

  if (!showHelpModal) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 id="help-modal-title" className="text-lg font-semibold text-gray-800">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setShowHelpModal(false)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          <ul className="space-y-3">
            {SHORTCUTS.map(({ key, description }) => (
              <li key={key} className="flex items-center justify-between">
                <span className="text-gray-600">{description}</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-sm font-mono text-gray-700">
                  {key}
                </kbd>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-500 text-center">
            Click any country to pick it up, then drag to see its true size
          </p>
        </div>
      </div>
    </div>
  )
}
