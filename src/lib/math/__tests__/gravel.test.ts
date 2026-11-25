import { describe, expect, it } from 'vitest';
import { calculateGravel, type GravelInput } from '../gravel';

const baseGravel: GravelInput = {
  unitSystem: 'imperial',
  mode: 'rectangle',
  length: 20,
  width: 10,
  diameter: 12,
  directArea: 200,
  depth: 3,
  material: 'crushed_57',
  customDensity: 2700,
  bufferPct: 10,
  pricePerTon: 48,
  pricePerCubicYard: 62,
};

describe('gravel calculator', () => {
  it('matches Section 4.6 benchmark case', () => {
    const res = calculateGravel(baseGravel);
    expect(res.areaSqFt).toBe(200);
    expect(res.netCuFt).toBe(50);
    expect(res.orderCuFt).toBe(55);
    expect(res.orderCuYd).toBeCloseTo(2.037, 4);
    expect(res.netUsTons).toBe(2.5);
    expect(res.usTons).toBe(2.75);
    expect(res.retailBags05Ft3).toBe(110);
  });

  it('supports custom density and metric mode', () => {
    const res = calculateGravel({
      ...baseGravel,
      unitSystem: 'metric',
      length: 6,
      width: 3,
      depth: 10,
      bufferPct: 0,
    });
    expect(res.areaSqM).toBe(18);
    expect(res.orderCuM).toBeCloseTo(1.8, 3);
    expect(res.metricTonnes).toBeGreaterThan(2.5);
  });
});
