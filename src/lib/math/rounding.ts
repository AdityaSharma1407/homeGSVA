/**
 * IEEE-754 safe rounding and numeric sanitization helpers.
 * Pure TypeScript with zero DOM or framework dependencies.
 */

const EPSILON = 1e-9;

/**
 * Sanitizes an arbitrary numeric input so negative, NaN, or non-finite values
 * safely clamp to a non-negative finite number.
 */
export function clampNonNegative(value: number, fallback = 0): number {
  if (!Number.isFinite(value) || Number.isNaN(value)) {
    return fallback;
  }
  return Math.max(0, value);
}

/**
 * Clamps a numeric input within [min, max], returning `fallback` if non-finite.
 */
export function clampRange(
  value: number,
  min: number,
  max: number,
  fallback: number
): number {
  if (!Number.isFinite(value) || Number.isNaN(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, value));
}

/**
 * Performs a ceiling operation immune to IEEE-754 representation drift
 * (e.g., `55.00000000000001 / 0.5` -> `110`, not `111`).
 */
export function safeCeil(value: number): number {
  if (!Number.isFinite(value) || Number.isNaN(value) || value <= 0) {
    return 0;
  }
  return Math.ceil(value - EPSILON);
}

/**
 * Safely divides `numerator / denominator`, returning `0` if denominator is <= 0
 * or either input is non-finite.
 */
export function safeDivide(numerator: number, denominator: number): number {
  if (
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator) ||
    denominator <= 0
  ) {
    return 0;
  }
  return numerator / denominator;
}

/**
 * Rounds a finite number to a fixed number of decimal places without returning -0.
 */
export function roundTo(value: number, decimals = 2): number {
  if (!Number.isFinite(value) || Number.isNaN(value)) {
    return 0;
  }
  const factor = Math.pow(10, Math.max(0, Math.min(10, Math.trunc(decimals))));
  const rounded = Math.round((value + Number.EPSILON) * factor) / factor;
  return Object.is(rounded, -0) ? 0 : rounded;
}
