import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '@/stores/appStore'

interface TutorialStep {
  title: string
  description: string
  icon: React.ReactNode
}

const STEPS: TutorialStep[] = [
  {
    title: 'Maps Lie About Size',
    description:
      'The Mercator projection stretches countries near the poles. Greenland looks as big as Africa, but Africa is actually 14x larger!',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" className="text-blue-300" />
        <ellipse cx="32" cy="32" rx="28" ry="14" stroke="currentColor" strokeWidth="2" className="text-blue-400" />
        <line x1="4" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="2" className="text-red-400" />
        <line x1="32" y1="4" x2="32" y2="60" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
        <rect x="22" y="8" width="20" height="12" fill="currentColor" className="text-green-500/50" rx="2" />
        <rect x="10" y="26" width="44" height="20" fill="currentColor" className="text-amber-500/50" rx="2" />
      </svg>
    ),
  },
  {
    title: 'Click to Pick Up',
    description:
      'Click on any country to select it. The country will highlight and lift off the map, ready to be moved.',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <path
          d="M32 48c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z"
          fill="currentColor"
          className="text-amber-100"
        />
        <path
          d="M32 44c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16z"
          stroke="currentColor"
          strokeWidth="2"
          className="text-amber-500"
        />
        <path
          d="M28 24l12 8-12 8V24z"
          fill="currentColor"
          className="text-amber-600"
        />
        <circle cx="50" cy="50" r="10" fill="currentColor" className="text-gray-200" />
        <path
          d="M46 46l4 4 8-8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-500"
        />
      </svg>
    ),
  },
  {
    title: 'Drag to the Equator',
    description:
      'Drag the selected country towards the equator (the red line). Watch it shrink to reveal its true relative size!',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="8" width="48" height="48" rx="4" fill="currentColor" className="text-blue-50" />
        <line x1="8" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="2" className="text-red-400" />
        <rect x="24" y="12" width="16" height="10" rx="2" fill="currentColor" className="text-green-400" />
        <path
          d="M32 26v12m0 0l-4-4m4 4l4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600"
        />
        <rect x="28" y="42" width="8" height="5" rx="1" fill="currentColor" className="text-green-600" />
      </svg>
    ),
  },
  {
    title: 'Try Greenland!',
    description:
      'Start by clicking Greenland (the big white island near the top). Drag it down to see how it compares to countries at the equator.',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" fill="currentColor" className="text-blue-100" />
        <path
          d="M28 10c-8 2-12 8-10 18s6 14 14 16 16-2 18-12-4-20-12-22-8 0-10 0z"
          fill="#e5e7eb"
          stroke="#9ca3af"
          strokeWidth="2"
        />
        <circle cx="32" cy="20" r="4" fill="currentColor" className="text-amber-400" />
        <text x="32" y="56" textAnchor="middle" className="text-[8px] font-bold fill-green-600">
          START HERE!
        </text>
      </svg>
    ),
  },
]

export function Tutorial() {
  const showTutorial = useAppStore((state) => state.ui.showTutorial)
  const setShowTutorial = useAppStore((state) => state.setShowTutorial)
  const [currentStep, setCurrentStep] = useState(0)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on escape key
  useEffect(() => {
    if (!showTutorial) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showTutorial])

  // Reset step when opening
  useEffect(() => {
    if (showTutorial) {
      setCurrentStep(0)
    }
  }, [showTutorial])

  if (!showTutorial) return null

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('mercator-tutorial-completed', 'true')
    }
    setShowTutorial(false)
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const step = STEPS[currentStep]
  const isLastStep = currentStep === STEPS.length - 1

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[3000]">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
      >
        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-4">
          {STEPS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-blue-500 w-6'
                  : index < currentStep
                    ? 'bg-blue-300'
                    : 'bg-gray-200'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-8 py-6 text-center">
          <div className="flex justify-center mb-4 text-blue-500">{step.icon}</div>
          <h2 id="tutorial-title" className="text-2xl font-bold text-gray-800 mb-3">
            {step.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">{step.description}</p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              Don't show again
            </label>
            <button
              onClick={handleClose}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Skip
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              {isLastStep ? "Let's Go!" : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
