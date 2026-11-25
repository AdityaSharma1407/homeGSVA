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
  LB_PER_KG,
  metersToFeet,
  type UnitSystem,
} from './units';

export type ConcreteShape = 'slab' | 'footing' | 'column' | 'steps';

export interface ConcreteInput {
  unitSystem: UnitSystem;
  shape: ConcreteShape;
  // Slab / Footing: length & width in ft (imperial) or m (metric); thickness in in (imperial) or cm (metric)
  length: number;
  width: number;
  thickness: number;
  // Column: diameter in in (imperial) or cm (metric); height in ft (imperial) or m (metric)
  columnDiameter: number;
  columnHeight: number;
  columnQuantity: number;
  // Steps: stepCount, width (ft/m), treadDepth (in/cm), riserHeight (in/cm), platformDepth (ft/m)
  stepCount: number;
  stepWidth: number;
  treadDepth: number;
  riserHeight: number;
  platformDepth: number;
  // Waste & density
  wastePct: number; // default 10% (0-25%)
  density: number; // lb/cu ft (150) or kg/cu m (2400)
  // Bag yields (in cu ft for imperial, liters for metric)
  bagYield40LbFt3: number;
  bagYield60LbFt3: number;
  bagYield80LbFt3: number;
  bagYield20KgLiters: number;
  bagYield25KgLiters: number;
  // Optional pricing
  pricePerBag80Lb: number;
  pricePerCubicYard: number;
}

export interface ConcreteResult {
  netCuFt: number;
  orderCuFt: number;
  netCuYd: number;
  orderCuYd: number;
  netCuM: number;
  orderCuM: number;
  orderLiters: number;
  weightLb: number;
  weightKg: number;
  bags40Lb: number;
  bags60Lb: number;
  bags80Lb: number;
  bags20Kg: number;
  bags25Kg: number;
  estimatedBagCost80Lb: number;
  estimatedBulkCost: number;
  warnings: string[];
}

export function calculateConcrete(input: ConcreteInput): ConcreteResult {
  const isMetric = input.unitSystem === 'metric';
  const warnings: string[] = [];

  const toFt = (v: number) =>
    isMetric ? metersToFeet(clampNonNegative(v)) : clampNonNegative(v);
  const toIn = (v: number) =>
    isMetric ? cmToInches(clampNonNegative(v)) : clampNonNegative(v);

  let netCuFt = 0;

  if (input.shape === 'slab' || input.shape === 'footing') {
    const lengthFt = toFt(input.length);
    const widthFt = toFt(input.width);
    const thicknessIn = toIn(input.thickness);
    netCuFt = lengthFt * widthFt * (thicknessIn / 12);
    if (thicknessIn > 0 && thicknessIn < 3.5 && input.shape === 'slab') {
      warnings.push(
        'Slabs thinner than 3.5–4 inches may crack under foot or vehicle loads.'
      );
    }
  } else if (input.shape === 'column') {
    const diaIn = toIn(input.columnDiameter);
    const heightFt = toFt(input.columnHeight);
    const qty = clampNonNegative(Math.trunc(input.columnQuantity));
    const radiusFt = diaIn / 12 / 2;
    netCuFt = Math.PI * radiusFt * radiusFt * heightFt * qty;
  } else if (input.shape === 'steps') {
    const n = clampNonNegative(Math.trunc(input.stepCount));
    const stepWFt = toFt(input.stepWidth);
    const treadFt = toIn(input.treadDepth) / 12;
    const riserFt = toIn(input.riserHeight) / 12;
    const platformFt = toFt(input.platformDepth);

    const stepsBodyFt3 = stepWFt * treadFt * riserFt * ((n * (n + 1)) / 2);
    const platformFt3 = platformFt * stepWFt * n * riserFt;
    netCuFt = stepsBodyFt3 + platformFt3;
  }

  const wastePct = clampRange(input.wastePct, 0, 25, 10);
  const orderCuFt = netCuFt * (1 + wastePct / 100);
  const netCuYd = cuFeetToCuYards(netCuFt);
  const orderCuYd = cuFeetToCuYards(orderCuFt);
  const netCuM = cuFeetToCuMeters(netCuFt);
  const orderCuM = cuFeetToCuMeters(orderCuFt);
  const orderLiters = orderCuM * 1000;

  // Density normalization: lb/cu ft
  const densityLbPerFt3 = isMetric
    ? clampRange(input.density, 500, 4000, 2400) * LB_PER_KG * 0.028316846592
    : clampRange(input.density, 50, 250, 150);

  const weightLb = orderCuFt * densityLbPerFt3;
  const weightKg = weightLb * KG_PER_LB;

  const y40 = clampRange(input.bagYield40LbFt3, 0.1, 2, 0.3);
  const y60 = clampRange(input.bagYield60LbFt3, 0.1, 2, 0.45);
  const y80 = clampRange(input.bagYield80LbFt3, 0.1, 2, 0.6);
  const y20kg = clampRange(input.bagYield20KgLiters, 1, 50, 9);
  const y25kg = clampRange(input.bagYield25KgLiters, 1, 50, 10);

  const bags40Lb = safeCeil(safeDivide(orderCuFt, y40));
  const bags60Lb = safeCeil(safeDivide(orderCuFt, y60));
  const bags80Lb = safeCeil(safeDivide(orderCuFt, y80));
  const bags20Kg = safeCeil(safeDivide(orderLiters, y20kg));
  const bags25Kg = safeCeil(safeDivide(orderLiters, y25kg));

  if (orderCuYd >= 1.5) {
    warnings.push(
      'Volume exceeds 1.5 cubic yards — ready-mix truck delivery may be faster and more economical than hand-mixing bags.'
    );
  }

  return {
    netCuFt: roundTo(netCuFt, 4),
    orderCuFt: roundTo(orderCuFt, 4),
    netCuYd: roundTo(netCuYd, 4),
    orderCuYd: roundTo(orderCuYd, 4),
    netCuM: roundTo(netCuM, 4),
    orderCuM: roundTo(orderCuM, 4),
    orderLiters: roundTo(orderLiters, 2),
    weightLb: roundTo(weightLb, 1),
    weightKg: roundTo(weightKg, 1),
    bags40Lb,
    bags60Lb,
    bags80Lb,
    bags20Kg,
    bags25Kg,
    estimatedBagCost80Lb: roundTo(
      bags80Lb * clampNonNegative(input.pricePerBag80Lb),
      2
    ),
    estimatedBulkCost: roundTo(
      orderCuYd * clampNonNegative(input.pricePerCubicYard),
      2
    ),
    warnings,
  };
}
