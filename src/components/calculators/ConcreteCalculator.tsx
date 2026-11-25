'use client';

import React, { useMemo, useState } from 'react';
import {
  calculateConcrete,
  type ConcreteInput,
  type ConcreteShape,
} from '@/lib/math/concrete';
import type { UnitSystem } from '@/lib/math/units';
import { setStoredUnitSystem } from '@/lib/storage/projectBag';
import { NumberField } from '../common/NumberField';
import { SvgSchematic } from '../common/SvgSchematic';
import { UnitToggle } from '../common/UnitToggle';
import { ZoneBagAdder } from '../common/ZoneBagAdder';

const DEFAULT_IMPERIAL: ConcreteInput = {
  unitSystem: 'imperial',
  shape: 'slab',
  length: 10,
  width: 10,
  thickness: 4,
  columnDiameter: 12,
  columnHeight: 4,
  columnQuantity: 1,
  stepCount: 4,
  stepWidth: 4,
  treadDepth: 11,
  riserHeight: 7,
  platformDepth: 0,
  wastePct: 10,
  density: 150,
  bagYield40LbFt3: 0.3,
  bagYield60LbFt3: 0.45,
  bagYield80LbFt3: 0.6,
  bagYield20KgLiters: 9,
  bagYield25KgLiters: 10,
  pricePerBag80Lb: 6.5,
  pricePerCubicYard: 160,
};

const DEFAULT_METRIC: ConcreteInput = {
  ...DEFAULT_IMPERIAL,
  unitSystem: 'metric',
  length: 3,
  width: 3,
  thickness: 10,
  columnDiameter: 30,
  columnHeight: 1.2,
  stepWidth: 1.2,
  treadDepth: 28,
  riserHeight: 18,
  density: 2400,
};

export const ConcreteCalculator: React.FC = () => {
  const [input, setInput] = useState<ConcreteInput>(DEFAULT_IMPERIAL);
  const result = useMemo(() => calculateConcrete(input), [input]);
  const isMetric = input.unitSystem === 'metric';
  const lenUnit = isMetric ? 'm' : 'ft';
  const thickUnit = isMetric ? 'cm' : 'in';

  const handleUnitChange = (next: UnitSystem) => {
    setStoredUnitSystem(next);
    setInput(next === 'metric' ? DEFAULT_METRIC : DEFAULT_IMPERIAL);
  };

  const updateField = <K extends keyof ConcreteInput>(
    key: K,
    value: ConcreteInput[K]
  ) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const dimensionsSummary =
    input.shape === 'column'
      ? `${input.columnQuantity}× Ø${input.columnDiameter}${thickUnit} × ${input.columnHeight}${lenUnit}`
      : input.shape === 'steps'
        ? `${input.stepCount} steps (${input.stepWidth}${lenUnit} W)`
        : `${input.length} × ${input.width} ${lenUnit} × ${input.thickness} ${thickUnit}`;

  const primaryLabel = isMetric
    ? `${result.bags25Kg} × 25 kg bags (${result.orderCuM} m³)`
    : `${result.bags80Lb} × 80 lb bags (${result.orderCuYd.toFixed(2)} cu yd)`;

  return (
    <div>
      <div className="calc-toolbar">
        <UnitToggle unitSystem={input.unitSystem} onChange={handleUnitChange} />
        <div className="preset-row">
          <button
            type="button"
            className="preset-chip"
            onClick={() =>
              setInput({
                ...DEFAULT_IMPERIAL,
                shape: 'slab',
                length: 10,
                width: 10,
                thickness: 4,
              })
            }
          >
            10×10 Patio (4 in)
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() =>
              setInput({
                ...DEFAULT_IMPERIAL,
                shape: 'column',
                columnDiameter: 12,
                columnHeight: 4,
                columnQuantity: 6,
              })
            }
          >
            6× Deck Piers
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() =>
              setInput(isMetric ? DEFAULT_METRIC : DEFAULT_IMPERIAL)
            }
          >
            Reset Defaults
          </button>
        </div>
      </div>

      <div className="calc-split">
        <div className="calc-inputs-col">
          <div className="calc-card">
            <h2 className="calc-card-title">1. Structure Shape & Dimensions</h2>
            <div className="mode-tabs" role="group" aria-label="Concrete shape">
              {(
                [
                  ['slab', 'Slab / Patio'],
                  ['footing', 'Footing / Trench'],
                  ['column', 'Column / Post Hole'],
                  ['steps', 'Stairs / Steps'],
                ] as [ConcreteShape, string][]
              ).map(([shapeKey, label]) => (
                <button
                  key={shapeKey}
                  type="button"
                  className="mode-tab"
                  aria-pressed={input.shape === shapeKey}
                  onClick={() => updateField('shape', shapeKey)}
                >
                  {label}
                </button>
              ))}
            </div>

            {(input.shape === 'slab' || input.shape === 'footing') && (
              <div className="field-grid">
                <NumberField
                  id="conc-len"
                  label="Length"
                  value={input.length}
                  onChange={(v) => updateField('length', v)}
                  unit={lenUnit}
                />
                <NumberField
                  id="conc-wid"
                  label="Width"
                  value={input.width}
                  onChange={(v) => updateField('width', v)}
                  unit={lenUnit}
                />
                <NumberField
                  id="conc-thick"
                  label={input.shape === 'slab' ? 'Thickness' : 'Depth'}
                  value={input.thickness}
                  onChange={(v) => updateField('thickness', v)}
                  unit={thickUnit}
                />
              </div>
            )}

            {input.shape === 'column' && (
              <div className="field-grid">
                <NumberField
                  id="conc-col-dia"
                  label="Diameter"
                  value={input.columnDiameter}
                  onChange={(v) => updateField('columnDiameter', v)}
                  unit={thickUnit}
                />
                <NumberField
                  id="conc-col-h"
                  label="Height / Depth"
                  value={input.columnHeight}
                  onChange={(v) => updateField('columnHeight', v)}
                  unit={lenUnit}
                />
                <NumberField
                  id="conc-col-qty"
                  label="Quantity"
                  value={input.columnQuantity}
                  onChange={(v) => updateField('columnQuantity', v)}
                  step={1}
                />
              </div>
            )}

            {input.shape === 'steps' && (
              <div className="field-grid">
                <NumberField
                  id="conc-step-n"
                  label="Number of Steps"
                  value={input.stepCount}
                  onChange={(v) => updateField('stepCount', v)}
                  step={1}
                />
                <NumberField
                  id="conc-step-w"
                  label="Step Width"
                  value={input.stepWidth}
                  onChange={(v) => updateField('stepWidth', v)}
                  unit={lenUnit}
                />
                <NumberField
                  id="conc-tread"
                  label="Tread Depth"
                  value={input.treadDepth}
                  onChange={(v) => updateField('treadDepth', v)}
                  unit={thickUnit}
                />
                <NumberField
                  id="conc-riser"
                  label="Riser Height"
                  value={input.riserHeight}
                  onChange={(v) => updateField('riserHeight', v)}
                  unit={thickUnit}
                />
                <NumberField
                  id="conc-platform"
                  label="Top Platform Depth"
                  value={input.platformDepth}
                  onChange={(v) => updateField('platformDepth', v)}
                  unit={lenUnit}
                />
              </div>
            )}
          </div>

          <div className="calc-card">
            <h2 className="calc-card-title">2. Waste, Bag Yields & Pricing</h2>
            <div className="field-grid">
              <NumberField
                id="conc-waste"
                label="Waste / Spillage"
                value={input.wastePct}
                onChange={(v) => updateField('wastePct', v)}
                unit="%"
                max={25}
              />
              <NumberField
                id="conc-density"
                label="Concrete Density"
                value={input.density}
                onChange={(v) => updateField('density', v)}
                unit={isMetric ? 'kg/m³' : 'lb/cu ft'}
              />
              <NumberField
                id="conc-price-bag"
                label={isMetric ? 'Price per 25 kg Bag' : 'Price per 80 lb Bag'}
                value={input.pricePerBag80Lb}
                onChange={(v) => updateField('pricePerBag80Lb', v)}
                unit="$"
              />
              <NumberField
                id="conc-price-yd"
                label="Ready-Mix Price"
                value={input.pricePerCubicYard}
                onChange={(v) => updateField('pricePerCubicYard', v)}
                unit={isMetric ? '$/m³' : '$/yd³'}
              />
            </div>
          </div>
        </div>

        <aside className="calc-receipt-col" id="receipt-summary">
          <div className="receipt-card">
            <div className="receipt-header">
              <h2>Live Concrete Estimate</h2>
              <span className="mono-num" style={{ fontSize: '0.82rem' }}>
                +{input.wastePct}% waste
              </span>
            </div>

            <div className="receipt-primary">
              <div className="receipt-primary-label">Order Volume & Bags</div>
              <div className="receipt-primary-value">
                {isMetric
                  ? `${result.orderCuM.toFixed(3)} m³ (${result.bags25Kg} × 25 kg)`
                  : `${result.orderCuYd.toFixed(4)} yd³ (${result.bags80Lb} × 80 lb)`}
              </div>
              <div className="receipt-primary-sub">
                {isMetric
                  ? `${result.orderLiters} L · ${result.weightKg.toLocaleString()} kg`
                  : `${result.orderCuFt.toFixed(2)} cu ft · ${result.weightLb.toLocaleString()} lb`}
              </div>
            </div>

            <ul className="receipt-rows">
              <li className="receipt-row">
                <span>Net Volume (before waste)</span>
                <span className="receipt-row-val">
                  {isMetric
                    ? `${result.netCuM.toFixed(3)} m³`
                    : `${result.netCuFt.toFixed(4)} cu ft`}
                </span>
              </li>
              {!isMetric ? (
                <>
                  <li className="receipt-row">
                    <span>80 lb Bags (0.60 cu ft)</span>
                    <span className="receipt-row-val">{result.bags80Lb} bags</span>
                  </li>
                  <li className="receipt-row">
                    <span>60 lb Bags (0.45 cu ft)</span>
                    <span className="receipt-row-val">{result.bags60Lb} bags</span>
                  </li>
                  <li className="receipt-row">
                    <span>40 lb Bags (0.30 cu ft)</span>
                    <span className="receipt-row-val">{result.bags40Lb} bags</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="receipt-row">
                    <span>25 kg Bags (10 L)</span>
                    <span className="receipt-row-val">{result.bags25Kg} bags</span>
                  </li>
                  <li className="receipt-row">
                    <span>20 kg Bags (9 L)</span>
                    <span className="receipt-row-val">{result.bags20Kg} bags</span>
                  </li>
                </>
              )}
              {result.estimatedBagCost80Lb > 0 && (
                <li className="receipt-row">
                  <span>Est. Bagged Cost</span>
                  <span className="receipt-row-val">
                    ${result.estimatedBagCost80Lb.toFixed(2)}
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
              estimator="concrete"
              defaultZoneName="Patio Slab"
              unitSystem={input.unitSystem}
              dimensionsSummary={dimensionsSummary}
              primaryQuantityLabel={primaryLabel}
              exactMetrics={{
                orderCuFt: result.orderCuFt,
                bagYieldFt3: input.bagYield80LbFt3,
              }}
              estimatedCost={result.estimatedBagCost80Lb}
            />
          </div>

          <SvgSchematic
            kind="concrete"
            shape={input.shape}
            dimA={input.length}
            dimB={input.shape === 'column' ? input.columnHeight : input.width}
            depthLabel={
              input.shape === 'column'
                ? `${input.columnDiameter} ${thickUnit}`
                : input.shape === 'steps'
                  ? `${input.stepCount} steps`
                  : `${input.thickness} ${thickUnit}`
            }
            unitLabel={lenUnit}
          />
        </aside>
      </div>

      <a href="#receipt-summary" className="mobile-pill no-print">
        <span>Concrete Estimate</span>
        <span className="mobile-pill-val">
          {isMetric
            ? `${result.bags25Kg} bags · ${result.orderCuM.toFixed(2)} m³`
            : `${result.bags80Lb} bags (80 lb) · ${result.orderCuYd.toFixed(2)} yd³`}
        </span>
      </a>
    </div>
  );
};
