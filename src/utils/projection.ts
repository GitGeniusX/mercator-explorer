/**
 * Mercator projection utilities
 *
 * These functions handle the mathematical calculations for
 * Mercator projection distortion.
 */

/**
 * Calculate Mercator scale factor at a given latitude.
 *
 * Scale = 1/cos(φ) where φ is latitude in radians
 * - At equator (0°): scale = 1
 * - At 60°: scale = 2
 * - At 80°: scale ≈ 5.76
 *
 * @param latitudeDegrees - Latitude in degrees (-90 to 90)
 * @returns Scale factor (1 at equator, increases toward poles)
 */
export function getMercatorScale(latitudeDegrees: number): number {
  // TODO(phase-2): Implement actual calculation
  // Clamp latitude to avoid infinity at poles
  const maxLat = 85
  const clampedLat = Math.max(-maxLat, Math.min(maxLat, latitudeDegrees))
  const latRad = (clampedLat * Math.PI) / 180
  return 1 / Math.cos(latRad)
}

/**
 * Calculate how a country's apparent size changes when moved
 * from one latitude to another.
 *
 * @param fromLatitude - Original latitude in degrees
 * @param toLatitude - New latitude in degrees
 * @returns Multiplier for visual scaling (< 1 means appears smaller)
 */
export function calculateSizeAdjustment(
  fromLatitude: number,
  toLatitude: number
): number {
  // TODO(phase-2): Implement actual calculation
  const fromScale = getMercatorScale(fromLatitude)
  const toScale = getMercatorScale(toLatitude)
  return toScale / fromScale
}

/**
 * Get human-readable area comparison string.
 *
 * @param trueAreaKm2 - True area in square kilometers
 * @param apparentScale - Current apparent scale factor
 * @returns Human-readable comparison string
 */
export function getAreaComparison(
  trueAreaKm2: number,
  apparentScale: number
): string {
  // TODO(phase-4): Implement comparison text generation
  const apparentArea = trueAreaKm2 * apparentScale * apparentScale
  const ratio = apparentArea / trueAreaKm2

  if (ratio > 1.1) {
    return `appears ${ratio.toFixed(1)}x larger than its true size`
  } else if (ratio < 0.9) {
    return `appears ${(1 / ratio).toFixed(1)}x smaller than its true size`
  }
  return 'shown at approximately true size'
}
