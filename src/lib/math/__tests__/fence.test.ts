import { describe, expect, it } from 'vitest';
import { calculateFence, type FenceInput } from '../fence';

const baseFence: FenceInput = {
  unitSystem: 'imperial',
  runType: 'straight',
  totalRunLength: 100,
  extraCornerPosts: 0,
  gatesCount: 0,
  gateWidth: 4,
  fenceHeight: 6,
  postSpacing: 8,
  railsPerSection: 3,
  picketWidth: 5.5,
  picketGap: 0,
  picketWastePct: 5,
  postWidth: 3.5,
  postThickness: 3.5,
  holeDiameter: 12,
  burialDepth: 24,
  concreteWastePct: 10,
  bagWeightLb: 80,
  bagYieldFt3: 0.6,
  pricePerPost: 18,
  pricePerBag: 6.5,
};

describe('fencing calculator', () => {
  it('matches Section 4.5 benchmark case', () => {
    const res = calculateFence(baseFence);
    expect(res.sections).toBe(13);
    expect(res.posts).toBe(14);
    expect(res.recommendedPostLengthFt).toBe(9);
    expect(res.rails).toBe(39);
    expect(res.pickets).toBe(230);
    expect(res.netConcretePerPostFt3).toBeCloseTo(1.4007, 4);
    expect(res.totalConcreteFt3).toBeCloseTo(21.57, 2);
    expect(res.concreteBags).toBe(36);
  });

  it('handles closed perimeter and gate deductions', () => {
    const closed = calculateFence({
      ...baseFence,
      runType: 'closed',
      totalRunLength: 104,
      gatesCount: 1,
      gateWidth: 4,
    });
    expect(closed.netRunFt).toBe(100);
    expect(closed.sections).toBe(13);
    expect(closed.posts).toBe(13);
  });
});
