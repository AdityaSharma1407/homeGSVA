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
  KG_PER_LB,
  LB_PER_CU_YD_TO_KG_PER_CU_M,
  LB_PER_US_TON,
  metersToFeet,
  sqFeetToSqMeters,
  sqMetersToSqFeet,
  type UnitSystem,
} from './units';

export type GravelAreaMode = 'rectangle' | 'circle' | 'area';
export type GravelMaterialId =
  | 'crushed_57'
  | 'all_purpose'
  | 'pea_gravel'
  | 'crusher_run'
  | 'river_rock'
  | 'custom';

export const GRAVEL_DENSITIES_LB_PER_YD3: Record<
  Exclude<GravelMaterialId, 'custom'>,
  number
> = {
  crushed_57: 2700,
  all_purpose: 2835,
  pea_gravel: 2592,
  crusher_run: 2970,
  river_rock: 2403,
};

export interface GravelInput {
  unitSystem: UnitSystem;
  mode: GravelAreaMode;
  length: number; // ft or m
  width: number; // ft or m
  diameter: number; // ft or m
  directArea: number; // sq ft or sq m
  depth: number; // in (imperial) or cm (metric)
  material: GravelMaterialId;
  customDensity: number; // lb/cu yd (imperial) or kg/cu m (metric)
  bufferPct: number; // 0, 5, 10, 15, 20
  pricePerTon: number;
  pricePerCubicYard: number;
}

export interface GravelResult {
  areaSqFt: number;
  areaSqM: number;
  netCuFt: number;
  orderCuFt: number;
  netCuYd: number;
  orderCuYd: number;
  orderCuM: number;
  densityLbPerYd3: number;
  densityKgPerCuM: number;
  weightLb: number;
  usTons: number;
  netUsTons: number;
  metricTonnes: number;
  retailBags05Ft3: number;
  estimatedTonCost: number;
  estimatedYardCost: number;
  warnings: string[];
}

export function calculateGravel(input: GravelInput): GravelResult {
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

  if (depthIn > 0 && depthIn < 2) {
    warnings.push(
      'Gravel thinner than 2 inches may expose underlying soil or fabric under foot traffic.'
    );
  }

  const bufferPct = clampRange(input.bufferPct, 0, 30, 10);
  const netCuFt = areaSqFt * (depthIn / 12);
  const orderCuFt = netCuFt * (1 + bufferPct / 100);
  const netCuYd = cuFeetToCuYards(netCuFt);
  const orderCuYd = cuFeetToCuYards(orderCuFt);
  const orderCuM = cuFeetToCuMeters(orderCuFt);

  const densityLbPerYd3 =
    input.material === 'custom'
      ? isMetric
        ? clampRange(input.customDensity, 500, 4000, 1600) /
          LB_PER_CU_YD_TO_KG_PER_CU_M
        : clampRange(input.customDensity, 1000, 4500, 2700)
      : GRAVEL_DENSITIES_LB_PER_YD3[input.material];

  const densityKgPerCuM = densityLbPerYd3 * LB_PER_CU_YD_TO_KG_PER_CU_M;
  const weightLb = orderCuYd * densityLbPerYd3;
  const netWeightLb = netCuYd * densityLbPerYd3;
  const usTons = weightLb / LB_PER_US_TON;
  const netUsTons = netWeightLb / LB_PER_US_TON;
  const metricTonnes = (weightLb * KG_PER_LB) / 1000;
  const retailBags05Ft3 = safeCeil(safeDivide(orderCuFt, 0.5));

  return {
    areaSqFt: roundTo(areaSqFt, 2),
    areaSqM: roundTo(sqFeetToSqMeters(areaSqFt), 2),
    netCuFt: roundTo(netCuFt, 2),
    orderCuFt: roundTo(orderCuFt, 2),
    netCuYd: roundTo(netCuYd, 4),
    orderCuYd: roundTo(orderCuYd, 4),
    orderCuM: roundTo(orderCuM, 3),
    densityLbPerYd3: roundTo(densityLbPerYd3, 0),
    densityKgPerCuM: roundTo(densityKgPerCuM, 0),
    weightLb: roundTo(weightLb, 1),
    usTons: roundTo(usTons, 2),
    netUsTons: roundTo(netUsTons, 2),
    metricTonnes: roundTo(metricTonnes, 2),
    retailBags05Ft3,
    estimatedTonCost: roundTo(
      usTons * clampNonNegative(input.pricePerTon),
      2
    ),
    estimatedYardCost: roundTo(
      orderCuYd * clampNonNegative(input.pricePerCubicYard),
      2
    ),
    warnings,
  };
}
