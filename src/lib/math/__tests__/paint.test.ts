import { describe, expect, it } from 'vitest';
import {
  calculateImperialContainerSplit,
  calculatePaint,
  type PaintInput,
} from '../paint';

const baseImperialInput: PaintInput = {
  unitSystem: 'imperial',
  mode: 'room',
  roomLength: 12,
  roomWidth: 10,
  wallHeight: 8,
  walls: [],
  directArea: 0,
  includeCeiling: false,
  includeTrim: false,
  trimHeightInches: 4,
  doorsCount: 1,
  doorAreaEach: 21,
  doorWidthEach: 3,
  windowsCount: 2,
  windowAreaEach: 15,
  customOpeningsArea: 0,
  coats: 2,
  surfaceCondition: 'smooth',
  wastePct: 5,
  coverageRate: 350,
  includePrimer: false,
  primerCoverageRate: 250,
  pricePerGallon: 42,
  pricePerQuart: 22,
};

describe('paint calculator', () => {
  it('matches Section 4.1 benchmark case', () => {
    const res = calculatePaint(baseImperialInput);
    expect(res.grossWallAreaSqFt).toBe(352);
    expect(res.openingsAreaSqFt).toBe(51);
    expect(res.netPaintableAreaSqFt).toBe(301);
    expect(res.effectiveAreaSqFt).toBe(632.1);
    expect(res.gallonsExact).toBe(1.806);
    expect(res.gallonsWhole).toBe(2);
    expect(res.containerSplitImperial.optimizedGallons).toBe(2);
    expect(res.containerSplitImperial.optimizedQuarts).toBe(0);
  });

  it('optimizes container split for <= 0.50 gal vs >= 0.75 gal', () => {
    const splitLow = calculateImperialContainerSplit(1.35);
    expect(splitLow.optimizedGallons).toBe(1);
    expect(splitLow.optimizedQuarts).toBe(2);

    const splitHigh = calculateImperialContainerSplit(1.806);
    expect(splitHigh.optimizedGallons).toBe(2);
    expect(splitHigh.optimizedQuarts).toBe(0);
  });

  it('handles zero openings, ceiling, trim, and primer', () => {
    const res = calculatePaint({
      ...baseImperialInput,
      doorsCount: 0,
      windowsCount: 0,
      includeCeiling: true,
      includeTrim: true,
      includePrimer: true,
    });
    expect(res.openingsAreaSqFt).toBe(0);
    expect(res.ceilingAreaSqFt).toBe(120);
    // perimeter = 44 ft, trim height = 4 in (1/3 ft) -> 14.67 sq ft
    expect(res.trimAreaSqFt).toBeCloseTo(14.67, 2);
    expect(res.primerGallonsWhole).toBe(3);
  });

  it('clamps net area to 0 when openings exceed wall area', () => {
    const res = calculatePaint({
      ...baseImperialInput,
      doorsCount: 25,
    });
    expect(res.netPaintableAreaSqFt).toBe(0);
    expect(res.gallonsWhole).toBe(0);
    expect(res.warnings.length).toBeGreaterThan(0);
  });

  it('supports metric round-trip', () => {
    const res = calculatePaint({
      ...baseImperialInput,
      unitSystem: 'metric',
      roomLength: 4,
      roomWidth: 3,
      wallHeight: 2.5,
      doorsCount: 1,
      doorAreaEach: 1.95,
      doorWidthEach: 0.9,
      windowsCount: 1,
      windowAreaEach: 1.4,
      coverageRate: 10,
      primerCoverageRate: 7,
    });
    expect(res.grossWallAreaSqM).toBe(35);
    expect(res.litersWhole).toBe(7);
  });
});
