'use client';

import React, { useMemo, useState } from 'react';
import {
  calculateTile,
  TILE_PATTERN_WASTE,
  type TileAreaMode,
  type TileInput,
  type TilePattern,
} from '@/lib/math/tile';
import type { UnitSystem } from '@/lib/math/units';
import { setStoredUnitSystem } from '@/lib/storage/projectBag';
import { NumberField } from '../common/NumberField';
import { SvgSchematic } from '../common/SvgSchematic';
import { UnitToggle } from '../common/UnitToggle';
import { ZoneBagAdder } from '../common/ZoneBagAdder';

const DEFAULT_IMPERIAL: TileInput = {
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

const DEFAULT_METRIC: TileInput = {
  ...DEFAULT_IMPERIAL,
  unitSystem: 'metric',
  roomLength: 4,
  roomWidth: 3,
  directArea: 12,
  tileLength: 30,
  tileWidth: 60,
  groutGap: 3,
  tileThickness: 9.5,
};

export const TileCalculator: React.FC = () => {
  const [input, setInput] = useState<TileInput>(DEFAULT_IMPERIAL);
  const result = useMemo(() => calculateTile(input), [input]);
  const isMetric = input.unitSystem === 'metric';

  const handleUnitChange = (next: UnitSystem) => {
    setStoredUnitSystem(next);
    setInput(next === 'metric' ? DEFAULT_METRIC : DEFAULT_IMPERIAL);
  };

  const updateField = <K extends keyof TileInput>(
    key: K,
    value: TileInput[K]
  ) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const handlePatternChange = (pattern: TilePattern) => {
    setInput((prev) => ({
      ...prev,
      pattern,
      wastePct: TILE_PATTERN_WASTE[pattern],
    }));
  };

  const dimensionsSummary =
    input.areaMode === 'dimensions'
      ? `${input.roomLength} × ${input.roomWidth} ${isMetric ? 'm' : 'ft'} (${input.tileLength}×${input.tileWidth} ${isMetric ? 'cm' : 'in'} tile)`
      : `${input.directArea} ${isMetric ? 'm²' : 'sq ft'}`;

  const primaryLabel = `${result.boxes} boxes (${result.totalTiles} tiles)`;

  return (
    <div>
      <div className="calc-toolbar">
        <UnitToggle unitSystem={input.unitSystem} onChange={handleUnitChange} />
        <div className="preset-row">
          <button
            type="button"
            className="preset-chip"
            onClick={() =>
              setInput((prev) => ({
                ...prev,
                tileLength: isMetric ? 30 : 12,
                tileWidth: isMetric ? 60 : 24,
              }))
            }
          >
            12×24 Porcelain
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() =>
              setInput((prev) => ({
                ...prev,
                tileLength: isMetric ? 7.5 : 3,
                tileWidth: isMetric ? 15 : 6,
                pattern: 'running_bond',
                wastePct: 15,
              }))
            }
          >
            3×6 Subway (15%)
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() =>
              setInput(isMetric ? DEFAULT_METRIC : DEFAULT_IMPERIAL)
            }
          >
            Reset
          </button>
        </div>
      </div>

      <div className="calc-split">
        <div className="calc-inputs-col">
          <div className="calc-card">
            <h2 className="calc-card-title">1. Floor or Wall Area</h2>
            <div className="mode-tabs" role="group" aria-label="Area input mode">
              {(
                [
                  ['dimensions', 'Length × Width'],
                  ['area', 'Direct Area'],
                ] as [TileAreaMode, string][]
              ).map(([modeKey, label]) => (
                <button
                  key={modeKey}
                  type="button"
                  className="mode-tab"
                  aria-pressed={input.areaMode === modeKey}
                  onClick={() => updateField('areaMode', modeKey)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="field-grid">
              {input.areaMode === 'dimensions' ? (
                <>
                  <NumberField
                    id="tile-room-l"
                    label="Room Length"
                    value={input.roomLength}
                    onChange={(v) => updateField('roomLength', v)}
                    unit={isMetric ? 'm' : 'ft'}
                  />
                  <NumberField
                    id="tile-room-w"
                    label="Room Width"
                    value={input.roomWidth}
                    onChange={(v) => updateField('roomWidth', v)}
                    unit={isMetric ? 'm' : 'ft'}
                  />
                </>
              ) : (
                <NumberField
                  id="tile-direct-area"
                  label="Gross Area"
                  value={input.directArea}
                  onChange={(v) => updateField('directArea', v)}
                  unit={isMetric ? 'm²' : 'sq ft'}
                />
              )}
              <NumberField
                id="tile-deduct"
                label="Deductions (Tub / Island)"
                value={input.deductionsArea}
                onChange={(v) => updateField('deductionsArea', v)}
                unit={isMetric ? 'm²' : 'sq ft'}
              />
            </div>
          </div>

          <div className="calc-card">
            <h2 className="calc-card-title">2. Tile Size, Grout & Pattern</h2>
            <div className="field-grid">
              <NumberField
                id="tile-len"
                label="Tile Length"
                value={input.tileLength}
                onChange={(v) => updateField('tileLength', v)}
                unit={isMetric ? 'cm' : 'in'}
              />
              <NumberField
                id="tile-wid"
                label="Tile Width"
                value={input.tileWidth}
                onChange={(v) => updateField('tileWidth', v)}
                unit={isMetric ? 'cm' : 'in'}
              />
              <NumberField
                id="tile-grout"
                label="Grout Gap"
                value={input.groutGap}
                onChange={(v) => updateField('groutGap', v)}
                unit={isMetric ? 'mm' : 'in'}
                min={-1}
                hint={isMetric ? '3 mm ≈ 1/8 in' : '0.125 in = 1/8 in'}
              />
              <NumberField
                id="tile-thick"
                label="Tile Thickness"
                value={input.tileThickness}
                onChange={(v) => updateField('tileThickness', v)}
                unit={isMetric ? 'mm' : 'in'}
              />
              <div className="field">
                <label htmlFor="tile-pattern">Layout Pattern</label>
                <select
                  id="tile-pattern"
                  value={input.pattern}
                  onChange={(e) =>
                    handlePatternChange(e.target.value as TilePattern)
                  }
                >
                  <option value="straight">Straight Grid (10% waste)</option>
                  <option value="running_bond">
                    Running Bond / Offset (15% waste)
                  </option>
                  <option value="diagonal">
                    Diagonal / Herringbone (20% waste)
                  </option>
                </select>
              </div>
              <NumberField
                id="tile-waste"
                label="Waste Buffer"
                value={input.wastePct}
                onChange={(v) => updateField('wastePct', v)}
                unit="%"
              />
              <NumberField
                id="tile-per-box"
                label="Pieces per Box"
                value={input.piecesPerBox}
                onChange={(v) => updateField('piecesPerBox', v)}
                min={1}
                step={1}
              />
              <NumberField
                id="tile-price-box"
                label="Price per Box"
                value={input.pricePerBox}
                onChange={(v) => updateField('pricePerBox', v)}
                unit="$"
              />
            </div>
          </div>
        </div>

        <aside className="calc-receipt-col" id="receipt-summary">
          <div className="receipt-card">
            <div className="receipt-header">
              <h2>Live Tile Estimate</h2>
              <span className="mono-num" style={{ fontSize: '0.82rem' }}>
                +{input.wastePct}% waste
              </span>
            </div>

            <div className="receipt-primary">
              <div className="receipt-primary-label">Boxes & Tiles to Buy</div>
              <div className="receipt-primary-value">
                {result.boxes} boxes ({result.totalTiles} tiles)
              </div>
              <div className="receipt-primary-sub">
                Base before waste: {result.baseTiles} tiles · Net{' '}
                {isMetric
                  ? `${result.netAreaSqM} m²`
                  : `${result.netAreaSqFt} sq ft`}
              </div>
            </div>

            <ul className="receipt-rows">
              <li className="receipt-row">
                <span>Effective Tile Area (with grout)</span>
                <span className="receipt-row-val">
                  {result.effTileAreaSqIn.toFixed(2)} sq in
                </span>
              </li>
              <li className="receipt-row">
                <span>Estimated Grout Needed</span>
                <span className="receipt-row-val">
                  {isMetric ? `${result.groutKg} kg` : `${result.groutLb} lb`}
                </span>
              </li>
              {result.edgeCutAnalysis.canEvaluate && (
                <li className="receipt-row">
                  <span>Optimal Centering</span>
                  <span className="receipt-row-val">
                    Center on{' '}
                    {result.edgeCutAnalysis.recommendedCentering === 'tile'
                      ? 'Tile'
                      : 'Grout Joint'}
                  </span>
                </li>
              )}
              {result.estimatedCost > 0 && (
                <li className="receipt-row">
                  <span>Estimated Tile Cost</span>
                  <span className="receipt-row-val">
                    ${result.estimatedCost.toFixed(2)}
                  </span>
                </li>
              )}
            </ul>

            {(result.warnings.length > 0 ||
              result.edgeCutAnalysis.edgeCutWarning) && (
              <div className="receipt-warnings">
                {result.warnings.map((w, i) => (
                  <div key={i} className="receipt-warning">
                    {w}
                  </div>
                ))}
                {result.edgeCutAnalysis.edgeCutWarning && (
                  <div className="receipt-warning">
                    {result.edgeCutAnalysis.edgeCutWarning}
                  </div>
                )}
              </div>
            )}

            <ZoneBagAdder
              estimator="tile"
              defaultZoneName="Bathroom Floor"
              unitSystem={input.unitSystem}
              dimensionsSummary={dimensionsSummary}
              primaryQuantityLabel={primaryLabel}
              exactMetrics={{
                baseTilesWithWaste: result.baseTiles * (1 + input.wastePct / 100),
                piecesPerBox: input.piecesPerBox,
              }}
              estimatedCost={result.estimatedCost}
            />
          </div>

          <SvgSchematic
            kind="tile"
            roomLength={input.roomLength}
            roomWidth={input.roomWidth}
            tileL={input.tileLength}
            tileW={input.tileWidth}
            edgeCutText={
              result.edgeCutAnalysis.canEvaluate
                ? `Center on ${result.edgeCutAnalysis.recommendedCentering}`
                : `${result.totalTiles} tiles`
            }
          />
        </aside>
      </div>

      <a href="#receipt-summary" className="mobile-pill no-print">
        <span>Tile Estimate</span>
        <span className="mobile-pill-val">
          {result.boxes} boxes · {result.totalTiles} tiles
        </span>
      </a>
    </div>
  );
};
