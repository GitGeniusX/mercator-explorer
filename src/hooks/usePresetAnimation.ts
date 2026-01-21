import { useCallback, useRef } from 'react'
import { useAppStore } from '@/stores/appStore'
import type { Preset } from '@/data/presets'

const ANIMATION_DURATION_MS = 1500

/**
 * Easing function for smooth animation
 * Uses ease-out-cubic for a natural deceleration
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Hook for handling preset animation
 */
export function usePresetAnimation() {
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)

  const startAnimation = useAppStore((state) => state.startAnimation)
  const updateAnimationProgress = useAppStore((state) => state.updateAnimationProgress)
  const endAnimation = useAppStore((state) => state.endAnimation)
  const selectCountryByCode = useAppStore((state) => state.selectCountryByCode)
  const setActivePreset = useAppStore((state) => state.setActivePreset)
  const countries = useAppStore((state) => state.countries)

  const cancelAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  const runAnimation = useCallback((
    countryId: string,
    startLng: number,
    _startLat: number,
    targetLat: number
  ) => {
    cancelAnimation()
    startTimeRef.current = performance.now()

    // Start the animation in the store
    startAnimation(countryId, [startLng, targetLat])

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current
      const rawProgress = Math.min(elapsed / ANIMATION_DURATION_MS, 1)
      const easedProgress = easeOutCubic(rawProgress)

      updateAnimationProgress(easedProgress)

      if (rawProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        // Animation complete
        endAnimation()
        animationFrameRef.current = null
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [cancelAnimation, startAnimation, updateAnimationProgress, endAnimation])

  const loadPreset = useCallback((preset: Preset) => {
    cancelAnimation()
    setActivePreset(preset)

    // Find the first available country from the preset
    const countryCode = preset.countries.find((code) =>
      countries.some((c) => c.isoCode === code)
    )

    if (!countryCode) {
      console.warn(`No countries found for preset: ${preset.id}`)
      return
    }

    // Get the country
    const country = selectCountryByCode(countryCode)
    if (!country) {
      console.warn(`Country not found: ${countryCode}`)
      return
    }

    // Start animation from country's centroid to target latitude
    const [lng, lat] = country.properties.centroid
    runAnimation(country.id, lng, lat, preset.targetLatitude)
  }, [cancelAnimation, setActivePreset, countries, selectCountryByCode, runAnimation])

  return {
    loadPreset,
    cancelAnimation,
  }
}

/**
 * Calculate interpolated position during animation
 */
export function getAnimatedPosition(
  startPos: [number, number],
  endPos: [number, number],
  progress: number
): [number, number] {
  const easedProgress = easeOutCubic(progress)
  return [
    startPos[0] + (endPos[0] - startPos[0]) * easedProgress,
    startPos[1] + (endPos[1] - startPos[1]) * easedProgress,
  ]
}
