import { useState, useEffect, useCallback } from 'react'
import { PRESETS, type Preset } from '@/data/presets'

interface PresetBannerProps {
  onSelectPreset: (preset: Preset) => void
  availableCountries: string[]
  disabled?: boolean
}

const ROTATION_INTERVAL_MS = 5000

export function PresetBanner({ onSelectPreset, availableCountries, disabled }: PresetBannerProps) {
  // Filter presets to only show those where at least one country is available
  const availablePresets = PRESETS.filter((preset) =>
    preset.countries.some((code) => availableCountries.includes(code))
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Rotate presets every 5 seconds (pause on hover)
  useEffect(() => {
    if (isHovered || availablePresets.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % availablePresets.length)
    }, ROTATION_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [isHovered, availablePresets.length])

  const currentPreset = availablePresets[currentIndex]

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? availablePresets.length - 1 : prev - 1
    )
  }, [availablePresets.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % availablePresets.length)
  }, [availablePresets.length])

  if (availablePresets.length === 0 || !currentPreset) {
    return null
  }

  return (
    <div
      className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Left: Label */}
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
          Try it
        </span>

        {/* Center: Current preset */}
        <button
          onClick={() => !disabled && onSelectPreset(currentPreset)}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center gap-3 px-4 py-1.5 rounded-lg transition-all ${
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-50 cursor-pointer'
          }`}
        >
          <span className="text-lg">{currentPreset.emoji}</span>
          <div className="text-left min-w-0">
            <p className={`text-sm font-medium truncate ${disabled ? 'text-gray-500' : 'text-gray-800'}`}>
              {currentPreset.name}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {currentPreset.description}
            </p>
          </div>
        </button>

        {/* Right: Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            aria-label="Previous comparison"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots indicator */}
          <div className="flex gap-1 px-1">
            {availablePresets.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to preset ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            aria-label="Next comparison"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
