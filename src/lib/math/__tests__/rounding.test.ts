import { describe, expect, it } from 'vitest';
import {
  clampNonNegative,
  clampRange,
  roundTo,
  safeCeil,
  safeDivide,
} from '../rounding';

describe('rounding & sanitization helpers', () => {
  it('prevents IEEE-754 drift in safeCeil', () => {
    expect(safeCeil(55.00000000000001 / 0.5)).toBe(110);
    expect(safeCeil(110.00000000000001)).toBe(110);
    expect(safeCeil(110.0001)).toBe(111);
    expect(safeCeil(0)).toBe(0);
    expect(safeCeil(-5)).toBe(0);
    expect(safeCeil(Number.NaN)).toBe(0);
  });

  it('clamps negative and non-finite inputs', () => {
    expect(clampNonNegative(-10)).toBe(0);
    expect(clampNonNegative(Number.NaN, 5)).toBe(5);
    expect(clampNonNegative(Number.POSITIVE_INFINITY, 2)).toBe(2);
    expect(clampRange(50, 0, 25, 10)).toBe(25);
    expect(clampRange(-5, 0, 25, 10)).toBe(0);
  });

  it('handles safeDivide and roundTo cleanly', () => {
    expect(safeDivide(100, 0)).toBe(0);
    expect(safeDivide(100, -2)).toBe(0);
    expect(safeDivide(100, 4)).toBe(25);
    expect(roundTo(-0, 2)).toBe(0);
    expect(Object.is(roundTo(-0, 2), -0)).toBe(false);
  });
});
