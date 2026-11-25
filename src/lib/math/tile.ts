import {
  clampNonNegative,
  clampRange,
  roundTo,
  safeCeil,
  safeDivide,
} from './rounding';
import {
  cmToInches,
  KG_PER_LB,
  LB_PER_KG,
  metersToFeet,
  mmToInches,
  sqFeetToSqMeters,
  sqMetersToSqFeet,
  type UnitSystem,
} from './units';

export type TileAreaMode = 'dimensions' | 'area';
export type TilePattern = 'straight' | 'running_bond' | 'diagonal';

export interface TileInput {
  unitSystem: UnitSystem;
  areaMode: TileAreaMode;
  roomLength: number; // ft (imperial) or m (metric)
  roomWidth: number; // ft (imperial) or m (metric)
  directArea: number; // sq ft or sq m
  deductionsArea: number; // sq ft or sq m
  tileLength: number; // in (imperial) or cm (metric)
  tileWidth: number; // in (imperial) or cm (metric)
  groutGap: number; // in (imperial, can be 0 or negative for overlap) or mm (metric)
  tileThickness: number; // in (imperial, default 0.375) or mm (metric, default 9.5)
  pattern: TilePattern;
  wastePct: number; // 0-40%
  piecesPerBox: number;
  pricePerBox: number;
  groutDensityKgPerL: number; // default 1.9 kg/L
}

export interface EdgeCutAnalysis {
  canEvaluate: boolean;
  centerOnJointEdgeIn: number;
  centerOnTileEdgeIn: number;
  recommendedCentering: 'joint' | 'tile';
  edgeCutWarning: string | null;
}

export interface TileResult {
  grossAreaSqFt: number;
  netAreaSqFt: number;
  netAreaSqM: number;
  effTileAreaSqIn: number;
  baseTiles: number;
  totalTiles: number;
  boxes: number;
  groutKg: number;
  groutLb: number;
  estimatedCost: number;
  edgeCutAnalysis: EdgeCutAnalysis;
  warnings: string[];
}

export const TILE_PATTERN_WASTE: Record<TilePattern, number> = {
  straight: 10,
  running_bond: 15,
  diagonal: 20,
};

function computeEdgeCut(roomSpanIn: number, tilePitchIn: number): number {
  if (roomSpanIn <= 0 || tilePitchIn <= 0) return 0;
  // Center on grout joint: half-span divided by tilePitch
  const halfSpan = roomSpanIn / 2;
  const rem = halfSpan % tilePitchIn;
  return rem < 1e-6 ? tilePitchIn : rem;
}

export function calculateTile(input: TileInput): TileResult {
  const isMetric = input.unitSystem === 'metric';
  const warnings: string[] = [];

  const toFt = (v: number) =>
    isMetric ? metersToFeet(clampNonNegative(v)) : clampNonNegative(v);
  const toSqFt = (v: number) =>
    isMetric ? sqMetersToSqFeet(clampNonNegative(v)) : clampNonNegative(v);

  let grossAreaSqFt = 0;
  let roomLenIn = 0;
  let roomWidIn = 0;

  if (input.areaMode === 'dimensions') {
    const lFt = toFt(input.roomLength);
    const wFt = toFt(input.roomWidth);
    roomLenIn = lFt * 12;
    roomWidIn = wFt * 12;
    grossAreaSqFt = lFt * wFt;
  } else {
    grossAreaSqFt = toSqFt(input.directArea);
  }

  const deductionsSqFt = toSqFt(input.deductionsArea);
  if (deductionsSqFt > grossAreaSqFt && grossAreaSqFt > 0) {
    warnings.push(
      'Deductions exceed gross room area; net tiled area clamped to 0.'
    );
  }

  const netAreaSqFt = Math.max(0, grossAreaSqFt - deductionsSqFt);
  const netAreaSqM = sqFeetToSqMeters(netAreaSqFt);
  const netAreaSqIn = netAreaSqFt * 144;

  const tileLIn = isMetric
    ? cmToInches(clampNonNegative(input.tileLength))
    : clampNonNegative(input.tileLength);
  const tileWIn = isMetric
    ? cmToInches(clampNonNegative(input.tileWidth))
    : clampNonNegative(input.tileWidth);

  const rawGapIn = isMetric
    ? mmToInches(Number.isFinite(input.groutGap) ? input.groutGap : 0)
    : Number.isFinite(input.groutGap)
      ? input.groutGap
      : 0;

  const effLIn = Math.max(0, tileLIn + rawGapIn);
  const effWIn = Math.max(0, tileWIn + rawGapIn);
  const effTileAreaSqIn = effLIn * effWIn;

  if (effTileAreaSqIn <= 0 && netAreaSqIn > 0) {
    warnings.push(
      'Effective tile size (tile dimension + grout gap) must be greater than zero.'
    );
  }

  const baseTiles = safeDivide(netAreaSqIn, effTileAreaSqIn);
  const wastePct = clampRange(input.wastePct, 0, 50, 10);
  const totalTiles = safeCeil(baseTiles * (1 + wastePct / 100));

  const piecesPerBox = clampRange(Math.trunc(input.piecesPerBox), 1, 500, 1);
  const boxes = safeCeil(safeDivide(totalTiles, piecesPerBox));

  // Grout estimator: jointWidth * tileThickness * (L + W) / (L * W) * area * density
  // Using mm for metric clarity then converting to kg
  const groutGapPosIn = Math.max(0, rawGapIn);
  const thicknessIn = isMetric
    ? mmToInches(clampNonNegative(input.tileThickness))
    : clampNonNegative(input.tileThickness);

  let groutKg = 0;
  if (tileLIn > 0 && tileWIn > 0 && groutGapPosIn > 0 && thicknessIn > 0) {
    const gapMm = groutGapPosIn * 25.4;
    const thickMm = thicknessIn * 25.4;
    const lMm = tileLIn * 25.4;
    const wMm = tileWIn * 25.4;
    const density = clampRange(input.groutDensityKgPerL, 0.5, 4, 1.9);
    // Formula yields kg/m² when dimensions are in mm and density is kg/L (= g/cm³)
    const kgPerSqM = ((lMm + wMm) / (lMm * wMm)) * gapMm * thickMm * density;
    groutKg = kgPerSqM * netAreaSqM * (1 + wastePct / 100);
  }
  const groutLb = groutKg * LB_PER_KG;

  // Centered layout edge-cut checker (for dimensions mode)
  let edgeCutAnalysis: EdgeCutAnalysis = {
    canEvaluate: false,
    centerOnJointEdgeIn: 0,
    centerOnTileEdgeIn: 0,
    recommendedCentering: 'joint',
    edgeCutWarning: null,
  };

  if (input.areaMode === 'dimensions' && roomLenIn > 0 && effLIn > 0) {
    const jointEdge = computeEdgeCut(roomLenIn, effLIn);
    const tileEdge = computeEdgeCut(roomLenIn + effLIn, effLIn);
    const recommendedCentering = tileEdge >= jointEdge ? 'tile' : 'joint';
    const bestEdge = Math.max(jointEdge, tileEdge);
    let edgeCutWarning: string | null = null;
    if (bestEdge < tileLIn * 0.5) {
      edgeCutWarning = `Even with optimal centering, perimeter cuts along the length are ${roundTo(bestEdge, 2)} in (under half a tile). Consider shifting the starting line or choosing a different tile size.`;
    }
    edgeCutAnalysis = {
      canEvaluate: true,
      centerOnJointEdgeIn: roundTo(jointEdge, 2),
      centerOnTileEdgeIn: roundTo(tileEdge, 2),
      recommendedCentering,
      edgeCutWarning,
    };
  }

  return {
    grossAreaSqFt: roundTo(grossAreaSqFt, 2),
    netAreaSqFt: roundTo(netAreaSqFt, 2),
    netAreaSqM: roundTo(netAreaSqM, 2),
    effTileAreaSqIn: roundTo(effTileAreaSqIn, 4),
    baseTiles: roundTo(baseTiles, 2),
    totalTiles,
    boxes,
    groutKg: roundTo(groutKg, 2),
    groutLb: roundTo(groutLb, 2),
    estimatedCost: roundTo(boxes * clampNonNegative(input.pricePerBox), 2),
    edgeCutAnalysis,
    warnings,
  };
}
