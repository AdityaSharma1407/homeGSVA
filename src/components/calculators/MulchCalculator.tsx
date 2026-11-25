'use client';

import React, { useMemo, useState } from 'react';
import {
  calculateMulch,
  type MulchAreaMode,
  type MulchInput,
} from '@/lib/math/mulch';
import type { UnitSystem } from '@/lib/math/units';
import { setStoredUnitSystem } from '@/lib/storage/projectBag';
import { NumberField } from '../common/NumberField';
import { SvgSchematic } from '../common/SvgSchematic';
import { UnitToggle } from '../common/UnitToggle';
import { ZoneBagAdder } from '../common/ZoneBagAdder';

const DEFAULT_IMPERIAL: MulchInput = {
  unitSystem: 'imperial',
  mode: 'rectangle',
  length: 18,
  width: 9,
  diameter: 10,
  directArea: 162,
  depth: 2,
  wastePct: 0,
  pricePerBag2CuFt: 4.5,
  pricePerCubicYard: 45,
};

const DEFAULT_METRIC: MulchInput = {
  ...DEFAULT_IMPERIAL,
  unitSystem: 'metric',
  length: 6,
  width: 3,
  diameter: 3,
  directArea: 18,
  depth: 5,
};

export const MulchCalculator: React.FC = () => {
  const [input, setInput] = useState<MulchInput>(DEFAULT_IMPERIAL);
  const result = useMemo(() => calculateMulch(input), [input]);
  const isMetric = input.unitSystem === 'metric';
  const lenUnit = isMetric ? 'm' : 'ft';
  const depthUnit = isMetric ? 'cm' : 'in';

  const handleUnitChange = (next: UnitSystem) => {
    setStoredUnitSystem(next);
    setInput(next === 'metric' ? DEFAULT_METRIC : DEFAULT_IMPERIAL);
  };

  const updateField = <K extends keyof MulchInput>(
    key: K,
    value: MulchInput[K]
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
    ? `${result.orderCuM.toFixed(2)} m³ (${result.bags50L} × 50 L bags)`
    : `${result.orderCuYd.toFixed(2)} cu yd (${result.bags2CuFt} × 2 cu ft bags)`;

  return (
    <div>
      <div className="calc-toolbar">
        <UnitToggle unitSystem={input.unitSystem} onChange={handleUnitChange} />
        <div className="preset-row">
          <button
            type="button"
            className="preset-chip"
            onClick={() => updateField('depth', isMetric ? 5 : 2)}
          >
            {isMetric ? '5 cm Fine Mulch' : '2 in Fine Mulch'}
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() => updateField('depth', isMetric ? 7.5 : 3)}
          >
            {isMetric ? '7.5 cm Coarse Bark' : '3 in Coarse Bark'}
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() => updateField('depth', isMetric ? 10 : 4)}
          >
            {isMetric ? '10 cm Weed Barrier' : '4 in Weed Barrier'}
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
            <h2 className="calc-card-title">1. Bed Shape & Coverage Area</h2>
            <div className="mode-tabs" role="group" aria-label="Bed shape">
              {(
                [
                  ['rectangle', 'Rectangular Bed'],
                  ['circle', 'Tree Ring / Circle'],
                  ['area', 'Direct Area'],
                ] as [MulchAreaMode, string][]
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
                    id="mulch-len"
                    label="Bed Length"
                    value={input.length}
                    onChange={(v) => updateField('length', v)}
                    unit={lenUnit}
                  />
                  <NumberField
                    id="mulch-wid"
                    label="Bed Width"
                    value={input.width}
                    onChange={(v) => updateField('width', v)}
                    unit={lenUnit}
                  />
                </>
              )}
              {input.mode === 'circle' && (
                <NumberField
                  id="mulch-dia"
                  label="Circle Diameter"
                  value={input.diameter}
                  onChange={(v) => updateField('diameter', v)}
                  unit={lenUnit}
                />
              )}
              {input.mode === 'area' && (
                <NumberField
                  id="mulch-area"
                  label="Total Bed Area"
                  value={input.directArea}
                  onChange={(v) => updateField('directArea', v)}
                  unit={isMetric ? 'm²' : 'sq ft'}
                />
              )}
              <NumberField
                id="mulch-depth"
                label="Mulch Depth"
                value={input.depth}
                onChange={(v) => updateField('depth', v)}
                unit={depthUnit}
              />
            </div>
          </div>

          <div className="calc-card">
            <h2 className="calc-card-title">2. Settling Buffer & Pricing</h2>
            <div className="field-grid">
              <NumberField
                id="mulch-waste"
                label="Settling / Waste Buffer"
                value={input.wastePct}
                onChange={(v) => updateField('wastePct', v)}
                unit="%"
              />
              <NumberField
                id="mulch-price-bag"
                label={isMetric ? 'Price per 50 L Bag' : 'Price per 2 cu ft Bag'}
                value={input.pricePerBag2CuFt}
                onChange={(v) => updateField('pricePerBag2CuFt', v)}
                unit="$"
              />
              <NumberField
                id="mulch-price-yd"
                label={isMetric ? 'Bulk Price per m³' : 'Bulk Price per cu yd'}
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
              <h2>Live Mulch Estimate</h2>
              <span className="mono-num" style={{ fontSize: '0.82rem' }}>
                {isMetric ? `${result.areaSqM} m²` : `${result.areaSqFt} sq ft`}
              </span>
            </div>

            <div className="receipt-primary">
              <div className="receipt-primary-label">Bulk & Bagged Quantity</div>
              <div className="receipt-primary-value">
                {isMetric
                  ? `${result.orderCuM.toFixed(2)} m³`
                  : `${result.orderCuYd.toFixed(2)} cu yd`}
              </div>
              <div className="receipt-primary-sub">
                {isMetric
                  ? `${result.bags50L} × 50 L bags · ${result.bags75L} × 75 L bags`
                  : `${result.orderCuFt.toFixed(2)} cu ft · ${result.bags2CuFt} × 2 cu ft bags`}
              </div>
            </div>

            <ul className="receipt-rows">
              <li className="receipt-row">
                <span>Bed Area</span>
                <span className="receipt-row-val">
                  {isMetric
                    ? `${result.areaSqM} m²`
                    : `${result.areaSqFt} sq ft`}
                </span>
              </li>
              {!isMetric ? (
                <>
                  <li className="receipt-row">
                    <span>2 cu ft Bags</span>
                    <span className="receipt-row-val">
                      {result.bags2CuFt} bags
                    </span>
                  </li>
                  <li className="receipt-row">
                    <span>3 cu ft Bags</span>
                    <span className="receipt-row-val">
                      {result.bags3CuFt} bags
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li className="receipt-row">
                    <span>50 L Bags</span>
                    <span className="receipt-row-val">
                      {result.bags50L} bags
                    </span>
                  </li>
                  <li className="receipt-row">
                    <span>75 L Bags</span>
                    <span className="receipt-row-val">
                      {result.bags75L} bags
                    </span>
                  </li>
                </>
              )}
              {result.estimatedBagCost > 0 && (
                <li className="receipt-row">
                  <span>Est. Bagged Cost</span>
                  <span className="receipt-row-val">
                    ${result.estimatedBagCost.toFixed(2)}
                  </span>
                </li>
              )}
              {result.estimatedBulkCost > 0 && (
                <li className="receipt-row">
                  <span>Est. Bulk Cost</span>
                  <span className="receipt-row-val">
                    ${result.estimatedBulkCost.toFixed(2)}
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
              estimator="mulch"
              defaultZoneName="Front Garden Bed"
              unitSystem={input.unitSystem}
              dimensionsSummary={dimensionsSummary}
              primaryQuantityLabel={primaryLabel}
              exactMetrics={{ mulchOrderCuFt: result.orderCuFt }}
              estimatedCost={result.estimatedBagCost}
            />
          </div>

          <SvgSchematic
            kind="mulch"
            mode={input.mode}
            length={input.mode === 'circle' ? input.diameter : input.length}
            width={input.width}
            depthLabel={`${input.depth} ${depthUnit}`}
            unitLabel={lenUnit}
            fillTone="#E7DFD3"
          />
        </aside>
      </div>

      <a href="#receipt-summary" className="mobile-pill no-print">
        <span>Mulch Estimate</span>
        <span className="mobile-pill-val">
          {isMetric
            ? `${result.bags50L} bags · ${result.orderCuM.toFixed(2)} m³`
            : `${result.bags2CuFt} bags · ${result.orderCuYd.toFixed(2)} yd³`}
        </span>
      </a>
    </div>
  );
};
