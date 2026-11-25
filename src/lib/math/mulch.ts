import {
  clampNonNegative,
  clampRange,
  roundTo,
  safeCeil,
  safeDivide,
} from './rounding';
import {
  cmToInches,
  cuFeetToCuMeters,
  cuFeetToCuYards,
  metersToFeet,
  sqFeetToSqMeters,
  sqMetersToSqFeet,
  type UnitSystem,
} from './units';

export type MulchAreaMode = 'rectangle' | 'circle' | 'area';

export interface MulchInput {
  unitSystem: UnitSystem;
  mode: MulchAreaMode;
  length: number; // ft or m
  width: number; // ft or m
  diameter: number; // ft or m
  directArea: number; // sq ft or sq m
  depth: number; // inches (imperial) or cm (metric)
  wastePct: number; // 0-25%
  pricePerBag2CuFt: number;
  pricePerCubicYard: number;
}

export interface MulchResult {
  areaSqFt: number;
  areaSqM: number;
  netCuFt: number;
  orderCuFt: number;
  orderCuYd: number;
  orderCuM: number;
  orderLiters: number;
  bags2CuFt: number;
  bags3CuFt: number;
  bags50L: number;
  bags75L: number;
  estimatedBagCost: number;
  estimatedBulkCost: number;
  warnings: string[];
}

export function calculateMulch(input: MulchInput): MulchResult {
  const isMetric = input.unitSystem === 'metric';
  const warnings: string[] = [];

  const toFt = (v: number) =>
    isMetric ? metersToFeet(clampNonNegative(v)) : clampNonNegative(v);

  let areaSqFt = 0;
  if (input.mode === 'rectangle') {
    areaSqFt = toFt(input.length) * toFt(input.width);
  } else if (input.mode === 'circle') {
    const rFt = toFt(input.diameter) / 2;
    areaSqFt = Math.PI * rFt * rFt;
  } else {
    areaSqFt = isMetric
      ? sqMetersToSqFeet(clampNonNegative(input.directArea))
      : clampNonNegative(input.directArea);
  }

  const depthIn = isMetric
    ? cmToInches(clampNonNegative(input.depth))
    : clampNonNegative(input.depth);

  if (depthIn > 4) {
    warnings.push(
      'Mulch deeper than 4 inches can suffocate tree roots and retain excess moisture against trunks.'
    );
  }

  const wastePct = clampRange(input.wastePct, 0, 25, 0);
  const netCuFt = areaSqFt * (depthIn / 12);
  const orderCuFt = netCuFt * (1 + wastePct / 100);
  const orderCuYd = cuFeetToCuYards(orderCuFt);
  const orderCuM = cuFeetToCuMeters(orderCuFt);
  const orderLiters = orderCuM * 1000;

  const bags2CuFt = safeCeil(safeDivide(orderCuFt, 2.0));
  const bags3CuFt = safeCeil(safeDivide(orderCuFt, 3.0));
  const bags50L = safeCeil(safeDivide(orderLiters, 50));
  const bags75L = safeCeil(safeDivide(orderLiters, 75));

  return {
    areaSqFt: roundTo(areaSqFt, 2),
    areaSqM: roundTo(sqFeetToSqMeters(areaSqFt), 2),
    netCuFt: roundTo(netCuFt, 2),
    orderCuFt: roundTo(orderCuFt, 2),
    orderCuYd: roundTo(orderCuYd, 4),
    orderCuM: roundTo(orderCuM, 4),
    orderLiters: roundTo(orderLiters, 1),
    bags2CuFt,
    bags3CuFt,
    bags50L,
    bags75L,
    estimatedBagCost: roundTo(
      bags2CuFt * clampNonNegative(input.pricePerBag2CuFt),
      2
    ),
    estimatedBulkCost: roundTo(
      orderCuYd * clampNonNegative(input.pricePerCubicYard),
      2
    ),
    warnings,
  };
}
