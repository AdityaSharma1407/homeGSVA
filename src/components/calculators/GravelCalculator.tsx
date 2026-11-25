'use client';

import React, { useMemo, useState } from 'react';
import {
  calculateGravel,
  type GravelAreaMode,
  type GravelInput,
  type GravelMaterialId,
} from '@/lib/math/gravel';
import type { UnitSystem } from '@/lib/math/units';
import { setStoredUnitSystem } from '@/lib/storage/projectBag';
import { NumberField } from '../common/NumberField';
import { SvgSchematic } from '../common/SvgSchematic';
import { UnitToggle } from '../common/UnitToggle';
import { ZoneBagAdder } from '../common/ZoneBagAdder';

const DEFAULT_IMPERIAL: GravelInput = {
  unitSystem: 'imperial',
  mode: 'rectangle',
  length: 20,
  width: 10,
  diameter: 12,
  directArea: 200,
  depth: 3,
  material: 'crushed_57',
  customDensity: 2700,
  bufferPct: 10,
  pricePerTon: 48,
  pricePerCubicYard: 62,
};

const DEFAULT_METRIC: GravelInput = {
  ...DEFAULT_IMPERIAL,
  unitSystem: 'metric',
  length: 6,
  width: 3,
  diameter: 4,
  directArea: 18,
  depth: 7.5,
  customDensity: 1600,
};

export const GravelCalculator: React.FC = () => {
  const [input, setInput] = useState<GravelInput>(DEFAULT_IMPERIAL);
  const result = useMemo(() => calculateGravel(input), [input]);
  const isMetric = input.unitSystem === 'metric';
  const lenUnit = isMetric ? 'm' : 'ft';
  const depthUnit = isMetric ? 'cm' : 'in';

  const handleUnitChange = (next: UnitSystem) => {
    setStoredUnitSystem(next);
    setInput(next === 'metric' ? DEFAULT_METRIC : DEFAULT_IMPERIAL);
  };

  const updateField = <K extends keyof GravelInput>(
    key: K,
    value: GravelInput[K]
  ) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const dimensionsSummary =
    input.mode === 'rectangle'
      ? `${input.length} × ${input.width} ${lenUnit} @ ${input.depth} ${depthUnit}`
      : input.mode === 'circle'
        ? `Ø${input.diameter} ${lenUnit} @ ${input.depth} ${depthUnit}`
        : `${input.directArea} ${isMetric ? 'm²' : 'sq ft'} @ ${input.depth} ${depthUnit}`;

  const primaryLabel = isMetric
    ? `${result.metricTonnes} t (${result.orderCuM} m³)`
    : `${result.usTons} US tons (${result.orderCuYd.toFixed(2)} cu yd)`;

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
                length: isMetric ? 6 : 20,
                width: isMetric ? 3 : 10,
                depth: isMetric ? 7.5 : 3,
                material: 'crushed_57',
              }))
            }
          >
            20×10 Driveway (3 in)
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() =>
              setInput((prev) => ({
                ...prev,
                material: 'pea_gravel',
                depth: isMetric ? 5 : 2,
              }))
            }
          >
            Pea Gravel Path (2 in)
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
            <h2 className="calc-card-title">1. Area & Depth</h2>
            <div className="mode-tabs" role="group" aria-label="Area shape">
              {(
                [
                  ['rectangle', 'Rectangular Area'],
                  ['circle', 'Circular Area'],
                  ['area', 'Direct Area'],
                ] as [GravelAreaMode, string][]
              ).map(([modeKey, label]) => (
                <button
                  key={modeKey}
                  type="button"
                  className="mode-tab"
                  aria-pressed={input.mode === modeKey}
                  onClick={() => updateField('mode', modeKey)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="field-grid">
              {input.mode === 'rectangle' && (
                <>
                  <NumberField
                    id="gravel-len"
                    label="Length"
                    value={input.length}
                    onChange={(v) => updateField('length', v)}
                    unit={lenUnit}
                  />
                  <NumberField
                    id="gravel-wid"
                    label="Width"
                    value={input.width}
                    onChange={(v) => updateField('width', v)}
                    unit={lenUnit}
                  />
                </>
              )}
              {input.mode === 'circle' && (
                <NumberField
                  id="gravel-dia"
                  label="Diameter"
                  value={input.diameter}
                  onChange={(v) => updateField('diameter', v)}
                  unit={lenUnit}
                />
              )}
              {input.mode === 'area' && (
                <NumberField
                  id="gravel-area"
                  label="Area"
                  value={input.directArea}
                  onChange={(v) => updateField('directArea', v)}
                  unit={isMetric ? 'm²' : 'sq ft'}
                />
              )}
              <NumberField
                id="gravel-depth"
                label="Depth"
                value={input.depth}
                onChange={(v) => updateField('depth', v)}
                unit={depthUnit}
              />
            </div>
          </div>

          <div className="calc-card">
            <h2 className="calc-card-title">2. Aggregate Type, Compaction & Price</h2>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="gravel-material">Stone / Gravel Type</label>
                <select
                  id="gravel-material"
                  value={input.material}
                  onChange={(e) =>
                    updateField('material', e.target.value as GravelMaterialId)
                  }
                >
                  <option value="crushed_57">
                    #57 Crushed Stone (2,700 lb/yd³)
                  </option>
                  <option value="all_purpose">
                    All-Purpose Gravel (2,835 lb/yd³)
                  </option>
                  <option value="pea_gravel">
                    Pea Gravel 3/8 in (2,592 lb/yd³)
                  </option>
                  <option value="crusher_run">
                    Crusher Run / Road Base (2,970 lb/yd³)
                  </option>
                  <option value="river_rock">
                    River Rock (2,403 lb/yd³)
                  </option>
                  <option value="custom">Custom Density</option>
                </select>
              </div>
              {input.material === 'custom' && (
                <NumberField
                  id="gravel-custom-density"
                  label="Custom Density"
                  value={input.customDensity}
                  onChange={(v) => updateField('customDensity', v)}
                  unit={isMetric ? 'kg/m³' : 'lb/yd³'}
                />
              )}
              <div className="field">
                <label htmlFor="gravel-buffer">Compaction & Waste Buffer</label>
                <select
                  id="gravel-buffer"
                  value={input.bufferPct}
                  onChange={(e) =>
                    updateField('bufferPct', Number(e.target.value))
                  }
                >
                  <option value={0}>0% (Exact Volume)</option>
                  <option value={5}>5% (Light Settling)</option>
                  <option value={10}>10% (Standard Compaction)</option>
                  <option value={15}>15% (Heavy Base / Uneven Grade)</option>
                  <option value={20}>20% (Maximum Buffer)</option>
                </select>
              </div>
              <NumberField
                id="gravel-price-ton"
                label="Price per Ton"
                value={input.pricePerTon}
                onChange={(v) => updateField('pricePerTon', v)}
                unit="$"
              />
              <NumberField
                id="gravel-price-yd"
                label={isMetric ? 'Price per m³' : 'Price per cu yd'}
                value={input.pricePerCubicYard}
                onChange={(v) => updateField('pricePerCubicYard', v)}
                unit="$"
              />
            </div>
          </div>
        </div>

        <aside className="calc-receipt-col" id="receipt-summary">
          <div className="receipt-card">
            <div className="receipt-header">
              <h2>Live Gravel Estimate</h2>
              <span className="mono-num" style={{ fontSize: '0.82rem' }}>
                +{input.bufferPct}% buffer
              </span>
            </div>

            <div className="receipt-primary">
              <div className="receipt-primary-label">Weight & Bulk Volume</div>
              <div className="receipt-primary-value">
                {isMetric
                  ? `${result.metricTonnes} tonnes (${result.orderCuM} m³)`
                  : `${result.usTons} US tons (${result.orderCuYd.toFixed(4)} yd³)`}
              </div>
              <div className="receipt-primary-sub">
                {isMetric
                  ? `${result.weightLb.toLocaleString()} lb · Density ${result.densityKgPerCuM} kg/m³`
                  : `${result.orderCuFt} cu ft · Net ${result.netUsTons} tons · ${result.retailBags05Ft3} × 0.5 cu ft bags`}
              </div>
            </div>

            <ul className="receipt-rows">
              <li className="receipt-row">
                <span>Coverage Area</span>
                <span className="receipt-row-val">
                  {isMetric
                    ? `${result.areaSqM} m²`
                    : `${result.areaSqFt} sq ft`}
                </span>
              </li>
              <li className="receipt-row">
                <span>Net Volume (before buffer)</span>
                <span className="receipt-row-val">
                  {result.netCuFt} cu ft ({result.netCuYd.toFixed(4)} yd³)
                </span>
              </li>
              <li className="receipt-row">
                <span>Retail 0.5 cu ft Bags</span>
                <span className="receipt-row-val">
                  {result.retailBags05Ft3} bags
                </span>
              </li>
              {result.estimatedTonCost > 0 && (
                <li className="receipt-row">
                  <span>Est. Cost (by Ton)</span>
                  <span className="receipt-row-val">
                    ${result.estimatedTonCost.toFixed(2)}
                  </span>
                </li>
              )}
            </ul>

            {result.warnings.length > 0 && (
              <div className="receipt-warnings">
                {result.warnings.map((w, i) => (
                  <div key={i} className="receipt-warning">
                    {w}
                  </div>
                ))}
              </div>
            )}

            <ZoneBagAdder
              estimator="gravel"
              defaultZoneName="Driveway Extension"
              unitSystem={input.unitSystem}
              dimensionsSummary={dimensionsSummary}
              primaryQuantityLabel={primaryLabel}
              exactMetrics={{
                gravelOrderCuYd: result.orderCuYd,
                gravelUsTons: result.usTons,
              }}
              estimatedCost={result.estimatedTonCost}
            />
          </div>

          <SvgSchematic
            kind="gravel"
            mode={input.mode}
            length={input.mode === 'circle' ? input.diameter : input.length}
            width={input.width}
            depthLabel={`${input.depth} ${depthUnit}`}
            unitLabel={lenUnit}
            fillTone="#DFDCD4"
          />
        </aside>
      </div>

      <a href="#receipt-summary" className="mobile-pill no-print">
        <span>Gravel Estimate</span>
        <span className="mobile-pill-val">
          {isMetric
            ? `${result.metricTonnes} t · ${result.orderCuM} m³`
            : `${result.usTons} tons · ${result.orderCuYd.toFixed(2)} yd³`}
        </span>
      </a>
    </div>
  );
};
