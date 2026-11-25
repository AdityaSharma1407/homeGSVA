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
  feetToMeters,
  KG_PER_LB,
  metersToFeet,
  type UnitSystem,
} from './units';

export type FenceRunType = 'straight' | 'closed';

export interface FenceInput {
  unitSystem: UnitSystem;
  runType: FenceRunType;
  totalRunLength: number; // ft (imperial) or m (metric)
  extraCornerPosts: number;
  gatesCount: number;
  gateWidth: number; // ft or m
  fenceHeight: number; // ft or m
  postSpacing: number; // ft or m
  railsPerSection: number;
  picketWidth: number; // in (imperial) or cm (metric)
  picketGap: number; // in (imperial) or cm (metric)
  picketWastePct: number; // default 5%
  // Post-hole footings
  postWidth: number; // in (imperial, 3.5) or cm (metric, 8.9)
  postThickness: number; // in (imperial, 3.5) or cm (metric, 8.9)
  holeDiameter: number; // in (imperial, 12) or cm (metric, 30)
  burialDepth: number; // in (imperial, >= 24) or cm (metric, >= 60)
  concreteWastePct: number; // default 10%
  bagWeightLb: 40 | 60 | 80;
  bagYieldFt3: number; // e.g., 0.60 for 80 lb
  pricePerPost: number;
  pricePerBag: number;
}

export interface FenceResult {
  netRunFt: number;
  netRunM: number;
  sections: number;
  posts: number;
  recommendedPostLengthFt: number;
  recommendedPostLengthM: number;
  rails: number;
  pickets: number;
  holeVolumePerPostFt3: number;
  netConcretePerPostFt3: number;
  totalConcreteFt3: number;
  totalConcreteCuM: number;
  concreteBags: number;
  concreteWeightLb: number;
  concreteWeightKg: number;
  estimatedMaterialCost: number;
  warnings: string[];
}

export function calculateFence(input: FenceInput): FenceResult {
  const isMetric = input.unitSystem === 'metric';
  const warnings: string[] = [];

  const toFt = (v: number) =>
    isMetric ? metersToFeet(clampNonNegative(v)) : clampNonNegative(v);
  const toIn = (v: number) =>
    isMetric ? cmToInches(clampNonNegative(v)) : clampNonNegative(v);

  const totalRunFt = toFt(input.totalRunLength);
  const gatesCount = clampNonNegative(Math.trunc(input.gatesCount));
  const gateWidthFt = toFt(input.gateWidth);
  const gatesTotalFt = gatesCount * gateWidthFt;

  if (gatesTotalFt > totalRunFt && totalRunFt > 0) {
    warnings.push(
      'Total gate width exceeds total fence run length; net fence run clamped to 0.'
    );
  }

  const netRunFt = Math.max(0, totalRunFt - gatesTotalFt);
  const postSpacingFt = clampRange(toFt(input.postSpacing), 1, 20, 8);
  const sections = safeCeil(safeDivide(netRunFt, postSpacingFt));

  const extraCornerPosts = clampNonNegative(Math.trunc(input.extraCornerPosts));
  const basePosts =
    sections === 0
      ? 0
      : input.runType === 'straight'
        ? sections + 1
        : sections;
  const posts = basePosts + extraCornerPosts;

  const fenceHeightFt = clampRange(toFt(input.fenceHeight), 1, 16, 6);
  const recommendedPostLengthFt = fenceHeightFt * 1.5;

  const railsPerSection = clampRange(Math.round(input.railsPerSection), 1, 6, 3);
  const rails = sections * railsPerSection;

  const picketWidthIn = Math.max(0.5, toIn(input.picketWidth));
  const picketGapIn = toIn(input.picketGap);
  const picketWastePct = clampRange(input.picketWastePct, 0, 30, 5);
  const picketPitchIn = picketWidthIn + picketGapIn;
  const basePickets = safeDivide(netRunFt * 12, picketPitchIn);
  const pickets = safeCeil(basePickets * (1 + picketWastePct / 100));

  // Post-hole footings
  const holeDiaIn = toIn(input.holeDiameter);
  const burialDepthIn = toIn(input.burialDepth);
  const postWIn = toIn(input.postWidth);
  const postTIn = toIn(input.postThickness);

  if (burialDepthIn > 0 && burialDepthIn < 24) {
    warnings.push(
      'Burial depth under 24 inches (60 cm) may heave in frost zones or lean under wind load.'
    );
  }

  const holeRadiusFt = holeDiaIn / 12 / 2;
  const burialDepthFt = burialDepthIn / 12;
  const holeVolumePerPostFt3 =
    Math.PI * holeRadiusFt * holeRadiusFt * burialDepthFt;
  const postBuriedFt3 = (postWIn / 12) * (postTIn / 12) * burialDepthFt;
  const netConcretePerPostFt3 = Math.max(0, holeVolumePerPostFt3 - postBuriedFt3);

  const concWastePct = clampRange(input.concreteWastePct, 0, 30, 10);
  const totalConcreteFt3 =
    netConcretePerPostFt3 * posts * (1 + concWastePct / 100);
  const bagYieldFt3 = clampRange(input.bagYieldFt3, 0.1, 2, 0.6);
  const concreteBags = safeCeil(safeDivide(totalConcreteFt3, bagYieldFt3));
  const concreteWeightLb = concreteBags * input.bagWeightLb;

  const estimatedMaterialCost =
    posts * clampNonNegative(input.pricePerPost) +
    concreteBags * clampNonNegative(input.pricePerBag);

  return {
    netRunFt: roundTo(netRunFt, 2),
    netRunM: roundTo(feetToMeters(netRunFt), 2),
    sections,
    posts,
    recommendedPostLengthFt: roundTo(recommendedPostLengthFt, 2),
    recommendedPostLengthM: roundTo(feetToMeters(recommendedPostLengthFt), 2),
    rails,
    pickets,
    holeVolumePerPostFt3: roundTo(holeVolumePerPostFt3, 4),
    netConcretePerPostFt3: roundTo(netConcretePerPostFt3, 4),
    totalConcreteFt3: roundTo(totalConcreteFt3, 2),
    totalConcreteCuM: roundTo(cuFeetToCuMeters(totalConcreteFt3), 3),
    concreteBags,
    concreteWeightLb: roundTo(concreteWeightLb, 1),
    concreteWeightKg: roundTo(concreteWeightLb * KG_PER_LB, 1),
    estimatedMaterialCost: roundTo(estimatedMaterialCost, 2),
    warnings,
  };
}
