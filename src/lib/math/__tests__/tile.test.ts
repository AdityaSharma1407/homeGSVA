import { describe, expect, it } from 'vitest';
import { calculateTile, type TileInput } from '../tile';

const baseTile: TileInput = {
  unitSystem: 'imperial',
  areaMode: 'dimensions',
  roomLength: 12,
  roomWidth: 10,
  directArea: 120,
  deductionsArea: 0,
  tileLength: 12,
  tileWidth: 24,
  groutGap: 0.125,
  tileThickness: 0.375,
  pattern: 'straight',
  wastePct: 10,
  piecesPerBox: 8,
  pricePerBox: 48,
  groutDensityKgPerL: 1.9,
};

describe('tile wastage calculator', () => {
  it('matches Section 4.4 benchmark case', () => {
    const res = calculateTile(baseTile);
    expect(res.netAreaSqFt).toBe(120);
    expect(res.effTileAreaSqIn).toBeCloseTo(292.5156, 4);
    expect(res.baseTiles).toBeCloseTo(59.07, 2);
    expect(res.totalTiles).toBe(65);
    expect(res.boxes).toBe(9);
  });

  it('supports zero grout gap, grout estimator, and edge-cut analysis', () => {
    const buttJoint = calculateTile({
      ...baseTile,
      groutGap: 0,
    });
    expect(buttJoint.effTileAreaSqIn).toBe(288);
    expect(buttJoint.groutKg).toBe(0);
    expect(buttJoint.edgeCutAnalysis.canEvaluate).toBe(true);

    const withGrout = calculateTile(baseTile);
    expect(withGrout.groutKg).toBeGreaterThan(0);
  });

  it('clamps deductions exceeding room area', () => {
    const res = calculateTile({
      ...baseTile,
      deductionsArea: 200,
    });
    expect(res.netAreaSqFt).toBe(0);
    expect(res.totalTiles).toBe(0);
    expect(res.boxes).toBe(0);
    expect(res.warnings.length).toBeGreaterThan(0);
  });
});
