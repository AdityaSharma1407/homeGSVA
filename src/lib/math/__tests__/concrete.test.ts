import { describe, expect, it } from 'vitest';
import { calculateConcrete, type ConcreteInput } from '../concrete';

const baseConcrete: ConcreteInput = {
  unitSystem: 'imperial',
  shape: 'slab',
  length: 10,
  width: 10,
  thickness: 4,
  columnDiameter: 12,
  columnHeight: 4,
  columnQuantity: 1,
  stepCount: 4,
  stepWidth: 4,
  treadDepth: 11,
  riserHeight: 7,
  platformDepth: 0,
  wastePct: 10,
  density: 150,
  bagYield40LbFt3: 0.3,
  bagYield60LbFt3: 0.45,
  bagYield80LbFt3: 0.6,
  bagYield20KgLiters: 9,
  bagYield25KgLiters: 10,
  pricePerBag80Lb: 6.5,
  pricePerCubicYard: 160,
};

describe('concrete calculator', () => {
  it('matches Section 4.2 slab benchmark', () => {
    const res = calculateConcrete(baseConcrete);
    expect(res.netCuFt).toBeCloseTo(33.3333, 4);
    expect(res.orderCuFt).toBeCloseTo(36.6667, 4);
    expect(res.orderCuYd).toBeCloseTo(1.358, 4);
    expect(res.weightLb).toBe(5500);
    expect(res.bags80Lb).toBe(62);
    expect(res.bags60Lb).toBe(82);
    expect(res.bags40Lb).toBe(123);
  });

  it('matches Section 4.2 column benchmark', () => {
    const res = calculateConcrete({
      ...baseConcrete,
      shape: 'column',
    });
    expect(res.netCuFt).toBeCloseTo(3.1416, 4);
    expect(res.orderCuFt).toBeCloseTo(3.4558, 4);
    expect(res.bags80Lb).toBe(6);
  });

  it('matches Section 4.2 steps benchmark', () => {
    const res = calculateConcrete({
      ...baseConcrete,
      shape: 'steps',
    });
    expect(res.netCuFt).toBeCloseTo(21.3889, 4);
    expect(res.orderCuFt).toBeCloseTo(23.5278, 4);
    expect(res.orderCuYd).toBeCloseTo(0.8714, 4);
  });

  it('handles metric mode and negative inputs safely', () => {
    const res = calculateConcrete({
      ...baseConcrete,
      unitSystem: 'metric',
      length: 3,
      width: 3,
      thickness: 10,
      density: 2400,
    });
    expect(res.netCuM).toBeCloseTo(0.9, 3);
    expect(res.orderCuM).toBeCloseTo(0.99, 3);
    expect(res.bags25Kg).toBe(99);

    const neg = calculateConcrete({
      ...baseConcrete,
      length: -10,
    });
    expect(neg.netCuFt).toBe(0);
    expect(neg.bags80Lb).toBe(0);
  });
});
