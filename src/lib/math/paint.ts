import {
  clampNonNegative,
  clampRange,
  roundTo,
  safeCeil,
  safeDivide,
} from './rounding';
import {
  LITERS_PER_US_GALLON,
  metersToFeet,
  sqFeetToSqMeters,
  sqMetersToSqFeet,
  type UnitSystem,
} from './units';

export type PaintInputMode = 'room' | 'walls' | 'area';
export type SurfaceCondition = 'smooth' | 'textured_porous' | 'unpainted_raw';

export interface WallDimension {
  width: number;
  height: number;
}

export interface PaintInput {
  unitSystem: UnitSystem;
  mode: PaintInputMode;
  // Room dimensions (ft in imperial, m in metric)
  roomLength: number;
  roomWidth: number;
  wallHeight: number;
  // Custom walls list (ft in imperial, m in metric)
  walls: WallDimension[];
  // Direct area (sq ft in imperial, sq m in metric)
  directArea: number;
  // Optional additions
  includeCeiling: boolean;
  includeTrim: boolean;
  trimHeightInches: number; // in inches (imperial) or cm (metric)
  // Openings deduction
  doorsCount: number;
  doorAreaEach: number; // sq ft (imperial, default 21) or sq m (metric, default ~1.95)
  doorWidthEach: number; // ft (imperial, default 3) or m (metric, default ~0.914)
  windowsCount: number;
  windowAreaEach: number; // sq ft (imperial, default 15) or sq m (metric, default ~1.39)
  customOpeningsArea: number; // sq ft or sq m
  // Paint parameters
  coats: number; // 1 to 4
  surfaceCondition: SurfaceCondition;
  wastePct: number; // e.g., 5 for 5%
  coverageRate: number; // sq ft/gal (imperial, default 350) or sq m/L (metric, default 10)
  includePrimer: boolean;
  primerCoverageRate: number; // sq ft/gal (default 250) or sq m/L (default 7)
  // Optional costs
  pricePerGallon: number; // or per Liter/4L in metric
  pricePerQuart: number; // or per 1L tin in metric
}

export interface ContainerSplitImperial {
  wholeGallonsOnly: number;
  optimizedGallons: number;
  optimizedQuarts: number;
  summaryText: string;
}

export interface ContainerSplitMetric {
  tins10L: number;
  tins4L: number;
  tins1L: number;
  totalLitersBought: number;
  summaryText: string;
}

export interface PaintResult {
  grossWallAreaSqFt: number;
  openingsAreaSqFt: number;
  ceilingAreaSqFt: number;
  trimAreaSqFt: number;
  netPaintableAreaSqFt: number;
  effectiveAreaSqFt: number;
  surfaceMultiplier: number;
  // Imperial outputs
  gallonsExact: number;
  gallonsWhole: number;
  containerSplitImperial: ContainerSplitImperial;
  primerGallonsExact: number;
  primerGallonsWhole: number;
  // Metric outputs
  grossWallAreaSqM: number;
  openingsAreaSqM: number;
  netPaintableAreaSqM: number;
  effectiveAreaSqM: number;
  litersExact: number;
  litersWhole: number;
  containerSplitMetric: ContainerSplitMetric;
  primerLitersExact: number;
  primerLitersWhole: number;
  // Cost estimate
  estimatedPaintCost: number;
  warnings: string[];
}

export const SURFACE_MULTIPLIERS: Record<SurfaceCondition, number> = {
  smooth: 1.0,
  textured_porous: 1.15,
  unpainted_raw: 1.2,
};

export function calculateImperialContainerSplit(
  gallonsExact: number
): ContainerSplitImperial {
  const cleanExact = clampNonNegative(gallonsExact);
  if (cleanExact === 0) {
    return {
      wholeGallonsOnly: 0,
      optimizedGallons: 0,
      optimizedQuarts: 0,
      summaryText: '0 gallons',
    };
  }

  const wholeGallonsOnly = safeCeil(cleanExact);
  const baseGallons = Math.floor(cleanExact + 1e-9);
  const remainder = Math.max(0, cleanExact - baseGallons);

  if (remainder <= 1e-9) {
    return {
      wholeGallonsOnly,
      optimizedGallons: baseGallons,
      optimizedQuarts: 0,
      summaryText: `${baseGallons} × 1-gal can${baseGallons === 1 ? '' : 's'}`,
    };
  }

  if (remainder <= 0.5 + 1e-9) {
    const quarts = safeCeil(remainder * 4);
    const parts: string[] = [];
    if (baseGallons > 0) {
      parts.push(`${baseGallons} × 1-gal`);
    }
    if (quarts > 0) {
      parts.push(`${quarts} × 1-qt`);
    }
    return {
      wholeGallonsOnly,
      optimizedGallons: baseGallons,
      optimizedQuarts: quarts,
      summaryText: parts.join(' + '),
    };
  }

  // Remainder > 0.50 (especially >= 0.75 where 4 quarts cost more than 1 gallon,
  // or 3 quarts where 1 gallon is typically cheaper/simpler).
  const totalGallons = baseGallons + 1;
  return {
    wholeGallonsOnly,
    optimizedGallons: totalGallons,
    optimizedQuarts: 0,
    summaryText: `${totalGallons} × 1-gal can${totalGallons === 1 ? '' : 's'}`,
  };
}

export function calculateMetricContainerSplit(
  litersExact: number
): ContainerSplitMetric {
  const cleanExact = clampNonNegative(litersExact);
  const totalNeeded = safeCeil(cleanExact);
  if (totalNeeded === 0) {
    return {
      tins10L: 0,
      tins4L: 0,
      tins1L: 0,
      totalLitersBought: 0,
      summaryText: '0 L',
    };
  }

  let remaining = totalNeeded;
  const tins10L = Math.floor(remaining / 10);
  remaining -= tins10L * 10;

  let tins4L = Math.floor(remaining / 4);
  remaining -= tins4L * 4;

  let tins1L = remaining;
  // If remainder is 3L, a 4L tin is more economical than 3 × 1L tins
  if (tins1L === 3) {
    tins4L += 1;
    tins1L = 0;
  }

  const parts: string[] = [];
  if (tins10L > 0) parts.push(`${tins10L} × 10L`);
  if (tins4L > 0) parts.push(`${tins4L} × 4L`);
  if (tins1L > 0) parts.push(`${tins1L} × 1L`);

  return {
    tins10L,
    tins4L,
    tins1L,
    totalLitersBought: tins10L * 10 + tins4L * 4 + tins1L,
    summaryText: parts.join(' + '),
  };
}

export function calculatePaint(input: PaintInput): PaintResult {
  const isMetric = input.unitSystem === 'metric';
  const warnings: string[] = [];

  const toFt = (v: number) =>
    isMetric ? metersToFeet(clampNonNegative(v)) : clampNonNegative(v);
  const toSqFt = (v: number) =>
    isMetric ? sqMetersToSqFeet(clampNonNegative(v)) : clampNonNegative(v);

  let grossWallAreaSqFt = 0;
  let ceilingAreaSqFt = 0;
  let perimeterFt = 0;

  if (input.mode === 'room') {
    const L = toFt(input.roomLength);
    const W = toFt(input.roomWidth);
    const H = toFt(input.wallHeight);
    grossWallAreaSqFt = 2 * (L + W) * H;
    perimeterFt = 2 * (L + W);
    if (input.includeCeiling) {
      ceilingAreaSqFt = L * W;
    }
  } else if (input.mode === 'walls') {
    for (const wall of input.walls) {
      const wFt = toFt(wall.width);
      const hFt = toFt(wall.height);
      grossWallAreaSqFt += wFt * hFt;
      perimeterFt += wFt;
    }
    if (input.includeCeiling) {
      warnings.push(
        'Ceiling area cannot be inferred in individual-walls mode; add it as a wall or switch to Room mode.'
      );
    }
  } else {
    grossWallAreaSqFt = toSqFt(input.directArea);
    if (input.includeCeiling || input.includeTrim) {
      warnings.push(
        'Ceiling and trim additions require Room dimensions; switch to Room mode to include them automatically.'
      );
    }
  }

  const doorsCount = clampNonNegative(Math.trunc(input.doorsCount));
  const windowsCount = clampNonNegative(Math.trunc(input.windowsCount));
  const doorAreaEachSqFt = toSqFt(input.doorAreaEach);
  const windowAreaEachSqFt = toSqFt(input.windowAreaEach);
  const customOpeningsSqFt = toSqFt(input.customOpeningsArea);

  const openingsAreaSqFt =
    doorsCount * doorAreaEachSqFt +
    windowsCount * windowAreaEachSqFt +
    customOpeningsSqFt;

  if (openingsAreaSqFt > grossWallAreaSqFt && grossWallAreaSqFt > 0) {
    warnings.push(
      'Total door and window deductions exceed gross wall area; net wall area clamped to 0.'
    );
  }

  let trimAreaSqFt = 0;
  if (input.includeTrim && input.mode === 'room') {
    const doorWidthFt = toFt(input.doorWidthEach);
    const trimHeightFt = isMetric
      ? metersToFeet(clampNonNegative(input.trimHeightInches) / 100)
      : clampNonNegative(input.trimHeightInches) / 12;
    const netPerimeterFt = Math.max(0, perimeterFt - doorsCount * doorWidthFt);
    trimAreaSqFt = netPerimeterFt * trimHeightFt;
  }

  const netWallAreaSqFt = Math.max(0, grossWallAreaSqFt - openingsAreaSqFt);
  const netPaintableAreaSqFt = netWallAreaSqFt + ceilingAreaSqFt + trimAreaSqFt;

  const coats = clampRange(Math.round(input.coats), 1, 4, 2);
  const surfaceMultiplier = SURFACE_MULTIPLIERS[input.surfaceCondition] ?? 1.0;
  const wastePct = clampRange(input.wastePct, 0, 50, 5);

  const effectiveAreaSqFt =
    netPaintableAreaSqFt * coats * surfaceMultiplier * (1 + wastePct / 100);

  // Convert coverage rate to sq ft / US gallon
  const coverageSqFtPerGal = isMetric
    ? sqMetersToSqFeet(clampRange(input.coverageRate, 1, 50, 10)) *
      LITERS_PER_US_GALLON
    : clampRange(input.coverageRate, 50, 1000, 350);

  const gallonsExact = safeDivide(effectiveAreaSqFt, coverageSqFtPerGal);
  const gallonsWhole = safeCeil(gallonsExact);
  const containerSplitImperial = calculateImperialContainerSplit(gallonsExact);

  const effectiveAreaSqM = sqFeetToSqMeters(effectiveAreaSqFt);
  const metricCoverageSqMPerL = isMetric
    ? clampRange(input.coverageRate, 1, 50, 10)
    : sqFeetToSqMeters(coverageSqFtPerGal) / LITERS_PER_US_GALLON;
  const litersExact = safeDivide(effectiveAreaSqM, metricCoverageSqMPerL);
  const litersWhole = safeCeil(litersExact);
  const containerSplitMetric = calculateMetricContainerSplit(litersExact);

  // Primer calculation (1 coat over net paintable area + waste + surface condition)
  let primerGallonsExact = 0;
  let primerGallonsWhole = 0;
  let primerLitersExact = 0;
  let primerLitersWhole = 0;
  if (input.includePrimer) {
    const primerEffectiveSqFt =
      netPaintableAreaSqFt * surfaceMultiplier * (1 + wastePct / 100);
    const primerCovSqFtPerGal = isMetric
      ? sqMetersToSqFeet(clampRange(input.primerCoverageRate, 1, 50, 7)) *
        LITERS_PER_US_GALLON
      : clampRange(input.primerCoverageRate, 50, 1000, 250);
    primerGallonsExact = safeDivide(primerEffectiveSqFt, primerCovSqFtPerGal);
    primerGallonsWhole = safeCeil(primerGallonsExact);

    const primerCovSqMPerL = isMetric
      ? clampRange(input.primerCoverageRate, 1, 50, 7)
      : sqFeetToSqMeters(primerCovSqFtPerGal) / LITERS_PER_US_GALLON;
    primerLitersExact = safeDivide(
      sqFeetToSqMeters(primerEffectiveSqFt),
      primerCovSqMPerL
    );
    primerLitersWhole = safeCeil(primerLitersExact);
  }

  const pricePerGal = clampNonNegative(input.pricePerGallon);
  const pricePerQt = clampNonNegative(input.pricePerQuart);
  const estimatedPaintCost = isMetric
    ? roundTo(litersWhole * pricePerGal, 2)
    : roundTo(
        containerSplitImperial.optimizedGallons * pricePerGal +
          containerSplitImperial.optimizedQuarts * pricePerQt,
        2
      );

  return {
    grossWallAreaSqFt: roundTo(grossWallAreaSqFt, 2),
    openingsAreaSqFt: roundTo(openingsAreaSqFt, 2),
    ceilingAreaSqFt: roundTo(ceilingAreaSqFt, 2),
    trimAreaSqFt: roundTo(trimAreaSqFt, 2),
    netPaintableAreaSqFt: roundTo(netPaintableAreaSqFt, 2),
    effectiveAreaSqFt: roundTo(effectiveAreaSqFt, 2),
    surfaceMultiplier,
    gallonsExact: roundTo(gallonsExact, 4),
    gallonsWhole,
    containerSplitImperial,
    primerGallonsExact: roundTo(primerGallonsExact, 4),
    primerGallonsWhole,
    grossWallAreaSqM: roundTo(sqFeetToSqMeters(grossWallAreaSqFt), 2),
    openingsAreaSqM: roundTo(sqFeetToSqMeters(openingsAreaSqFt), 2),
    netPaintableAreaSqM: roundTo(sqFeetToSqMeters(netPaintableAreaSqFt), 2),
    effectiveAreaSqM: roundTo(effectiveAreaSqM, 2),
    litersExact: roundTo(litersExact, 2),
    litersWhole,
    containerSplitMetric,
    primerLitersExact: roundTo(primerLitersExact, 2),
    primerLitersWhole,
    estimatedPaintCost,
    warnings,
  };
}
