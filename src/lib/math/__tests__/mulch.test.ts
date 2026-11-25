import { describe, expect, it } from 'vitest';
import { calculateMulch, type MulchInput } from '../mulch';

const baseMulch: MulchInput = {
  unitSystem: 'imperial',
  mode: 'rectangle',
  length: 18,
  width: 9,
  diameter: 10,
  directArea: 162,
  depth: 2,
  wastePct: 0,
  pricePerBag2CuFt: 4.5,
  pricePerCubicYard: 45,
};

describe('mulch calculator', () => {
  it('matches Section 4.3 benchmark case', () => {
    const res = calculateMulch(baseMulch);
    expect(res.areaSqFt).toBe(162);
    expect(res.netCuFt).toBe(27);
    expect(res.orderCuFt).toBe(27);
    expect(res.orderCuYd).toBe(1);
    expect(res.bags2CuFt).toBe(14);
    expect(res.bags3CuFt).toBe(9);
  });

  it('supports circle mode and metric mode', () => {
    const circleRes = calculateMulch({
      ...baseMulch,
      mode: 'circle',
      diameter: 10,
      depth: 3,
    });
    expect(circleRes.areaSqFt).toBeCloseTo(78.54, 2);

    const metricRes = calculateMulch({
      ...baseMulch,
      unitSystem: 'metric',
      length: 5,
      width: 4,
      depth: 5, // 5 cm
    });
    expect(metricRes.areaSqM).toBe(20);
    expect(metricRes.orderCuM).toBeCloseTo(1, 3);
    expect(metricRes.bags50L).toBe(20);
  });
});
