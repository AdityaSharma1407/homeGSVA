'use client';

import React, { useMemo, useState } from 'react';
import {
  calculatePaint,
  type PaintInput,
  type PaintInputMode,
  type SurfaceCondition,
} from '@/lib/math/paint';
import { type UnitSystem } from '@/lib/math/units';
import { setStoredUnitSystem } from '@/lib/storage/projectBag';
import { NumberField } from '../common/NumberField';
import { SvgSchematic } from '../common/SvgSchematic';
import { UnitToggle } from '../common/UnitToggle';
import { ZoneBagAdder } from '../common/ZoneBagAdder';

const DEFAULT_IMPERIAL: PaintInput = {
  unitSystem: 'imperial',
  mode: 'room',
  roomLength: 12,
  roomWidth: 10,
  wallHeight: 8,
  walls: [
    { width: 12, height: 8 },
    { width: 10, height: 8 },
  ],
  directArea: 300,
  includeCeiling: false,
  includeTrim: false,
  trimHeightInches: 4,
  doorsCount: 1,
  doorAreaEach: 21,
  doorWidthEach: 3,
  windowsCount: 2,
  windowAreaEach: 15,
  customOpeningsArea: 0,
  coats: 2,
  surfaceCondition: 'smooth',
  wastePct: 5,
  coverageRate: 350,
  includePrimer: false,
  primerCoverageRate: 250,
  pricePerGallon: 42,
  pricePerQuart: 22,
};

const DEFAULT_METRIC: PaintInput = {
  ...DEFAULT_IMPERIAL,
  unitSystem: 'metric',
  roomLength: 4,
  roomWidth: 3.5,
  wallHeight: 2.5,
  walls: [
    { width: 4, height: 2.5 },
    { width: 3.5, height: 2.5 },
  ],
  directArea: 30,
  trimHeightInches: 10,
  doorAreaEach: 1.95,
  doorWidthEach: 0.9,
  windowAreaEach: 1.4,
  coverageRate: 10,
  primerCoverageRate: 7,
};

export const PaintCalculator: React.FC = () => {
  const [input, setInput] = useState<PaintInput>(DEFAULT_IMPERIAL);

  const result = useMemo(() => calculatePaint(input), [input]);
  const isMetric = input.unitSystem === 'metric';
  const lenUnit = isMetric ? 'm' : 'ft';
  const areaUnit = isMetric ? 'm²' : 'sq ft';

  const handleUnitChange = (next: UnitSystem) => {
    setStoredUnitSystem(next);
    setInput(next === 'metric' ? DEFAULT_METRIC : DEFAULT_IMPERIAL);
  };

  const handleReset = () => {
    setInput(isMetric ? DEFAULT_METRIC : DEFAULT_IMPERIAL);
  };

  const updateField = <K extends keyof PaintInput>(
    key: K,
    value: PaintInput[K]
  ) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const primaryLabel = isMetric
    ? `${result.containerSplitMetric.summaryText} (${result.litersExact} L exact)`
    : `${result.containerSplitImperial.summaryText} (${result.gallonsWhole} gal whole)`;

  const dimensionsSummary =
    input.mode === 'room'
      ? `${input.roomLength} × ${input.roomWidth} × ${input.wallHeight} ${lenUnit}`
      : input.mode === 'walls'
        ? `${input.walls.length} custom walls`
        : `${input.directArea} ${areaUnit}`;

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
                roomLength: 12,
                roomWidth: 10,
                wallHeight: 8,
                doorsCount: 1,
                windowsCount: 2,
              })
            }
          >
            12×10 Bedroom
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() =>
              setInput({
                ...DEFAULT_IMPERIAL,
                roomLength: 20,
                roomWidth: 14,
                wallHeight: 9,
                doorsCount: 2,
                windowsCount: 3,
                includeCeiling: true,
              })
            }
          >
            20×14 Living + Ceiling
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={handleReset}
          >
            Reset Defaults
          </button>
        </div>
      </div>

      <div className="calc-split">
        <div className="calc-inputs-col">
          <div className="calc-card">
            <h2 className="calc-card-title">1. Room & Wall Dimensions</h2>
            <div className="mode-tabs" role="group" aria-label="Input mode">
              {(
                [
                  ['room', 'Room (L × W × H)'],
                  ['walls', 'Individual Walls'],
                  ['area', 'Direct Area'],
                ] as [PaintInputMode, string][]
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

            {input.mode === 'room' && (
              <div className="field-grid">
                <NumberField
                  id="paint-length"
                  label="Room Length"
                  value={input.roomLength}
                  onChange={(v) => updateField('roomLength', v)}
                  unit={lenUnit}
                />
                <NumberField
                  id="paint-width"
                  label="Room Width"
                  value={input.roomWidth}
                  onChange={(v) => updateField('roomWidth', v)}
                  unit={lenUnit}
                />
                <NumberField
                  id="paint-height"
                  label="Wall Height"
                  value={input.wallHeight}
                  onChange={(v) => updateField('wallHeight', v)}
                  unit={lenUnit}
                />
              </div>
            )}

            {input.mode === 'walls' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {input.walls.map((w, idx) => (
                  <div key={idx} className="field-grid">
                    <NumberField
                      id={`wall-w-${idx}`}
                      label={`Wall ${idx + 1} Width`}
                      value={w.width}
                      onChange={(val) => {
                        const next = [...input.walls];
                        next[idx] = { ...w, width: val };
                        updateField('walls', next);
                      }}
                      unit={lenUnit}
                    />
                    <NumberField
                      id={`wall-h-${idx}`}
                      label={`Wall ${idx + 1} Height`}
                      value={w.height}
                      onChange={(val) => {
                        const next = [...input.walls];
                        next[idx] = { ...w, height: val };
                        updateField('walls', next);
                      }}
                      unit={lenUnit}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      updateField('walls', [
                        ...input.walls,
                        { width: isMetric ? 3 : 10, height: isMetric ? 2.5 : 8 },
                      ])
                    }
                  >
                    + Add Wall
                  </button>
                  {input.walls.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        updateField('walls', input.walls.slice(0, -1))
                      }
                    >
                      Remove Last
                    </button>
                  )}
                </div>
              </div>
            )}

            {input.mode === 'area' && (
              <NumberField
                id="paint-direct-area"
                label="Total Wall Area"
                value={input.directArea}
                onChange={(v) => updateField('directArea', v)}
                unit={areaUnit}
              />
            )}

            {input.mode === 'room' && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginTop: '1rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={input.includeCeiling}
                    onChange={(e) =>
                      updateField('includeCeiling', e.target.checked)
                    }
                  />
                  Include Ceiling ({isMetric ? 'L × W m²' : 'L × W sq ft'})
                </label>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={input.includeTrim}
                    onChange={(e) =>
                      updateField('includeTrim', e.target.checked)
                    }
                  />
                  Include Baseboard Trim
                </label>
                {input.includeTrim && (
                  <div style={{ maxWidth: '170px' }}>
                    <NumberField
                      id="paint-trim-h"
                      label="Trim Height"
                      value={input.trimHeightInches}
                      onChange={(v) => updateField('trimHeightInches', v)}
                      unit={isMetric ? 'cm' : 'in'}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="calc-card">
            <h2 className="calc-card-title">2. Doors & Windows Deduction</h2>
            <div className="field-grid">
              <NumberField
                id="paint-doors"
                label="Doors"
                value={input.doorsCount}
                onChange={(v) => updateField('doorsCount', v)}
                step={1}
              />
              <NumberField
                id="paint-door-area"
                label="Area per Door"
                value={input.doorAreaEach}
                onChange={(v) => updateField('doorAreaEach', v)}
                unit={areaUnit}
              />
              <NumberField
                id="paint-windows"
                label="Windows"
                value={input.windowsCount}
                onChange={(v) => updateField('windowsCount', v)}
                step={1}
              />
              <NumberField
                id="paint-window-area"
                label="Area per Window"
                value={input.windowAreaEach}
                onChange={(v) => updateField('windowAreaEach', v)}
                unit={areaUnit}
              />
              <NumberField
                id="paint-custom-openings"
                label="Custom Openings"
                value={input.customOpeningsArea}
                onChange={(v) => updateField('customOpeningsArea', v)}
                unit={areaUnit}
              />
            </div>
          </div>

          <div className="calc-card">
            <h2 className="calc-card-title">3. Coats, Surface & Pricing</h2>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="paint-coats">Number of Coats</label>
                <select
                  id="paint-coats"
                  value={input.coats}
                  onChange={(e) => updateField('coats', Number(e.target.value))}
                >
                  <option value={1}>1 Coat (Touch-up / Same Color)</option>
                  <option value={2}>2 Coats (Standard Repaint)</option>
                  <option value={3}>3 Coats (Dark-to-Light)</option>
                  <option value={4}>4 Coats (Heavy Coverage)</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="paint-surface">Surface Texture</label>
                <select
                  id="paint-surface"
                  value={input.surfaceCondition}
                  onChange={(e) =>
                    updateField(
                      'surfaceCondition',
                      e.target.value as SurfaceCondition
                    )
                  }
                >
                  <option value="smooth">Smooth Drywall (1.00×)</option>
                  <option value="textured_porous">
                    Textured / Porous (1.15×)
                  </option>
                  <option value="unpainted_raw">
                    Unpainted / Raw Plaster (1.20×)
                  </option>
                </select>
              </div>
              <NumberField
                id="paint-coverage"
                label="Coverage Rate"
                value={input.coverageRate}
                onChange={(v) => updateField('coverageRate', v)}
                unit={isMetric ? 'm²/L' : 'sq ft/gal'}
              />
              <NumberField
                id="paint-waste"
                label="Waste Buffer"
                value={input.wastePct}
                onChange={(v) => updateField('wastePct', v)}
                unit="%"
              />
              <NumberField
                id="paint-price-gal"
                label={isMetric ? 'Price per Liter' : 'Price per Gallon'}
                value={input.pricePerGallon}
                onChange={(v) => updateField('pricePerGallon', v)}
                unit="$"
              />
              {!isMetric && (
                <NumberField
                  id="paint-price-qt"
                  label="Price per Quart"
                  value={input.pricePerQuart}
                  onChange={(v) => updateField('pricePerQuart', v)}
                  unit="$"
                />
              )}
            </div>

            <div style={{ marginTop: '0.9rem' }}>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={input.includePrimer}
                  onChange={(e) =>
                    updateField('includePrimer', e.target.checked)
                  }
                />
                Add 1 Coat of Primer ({isMetric ? '7 m²/L' : '250 sq ft/gal'})
              </label>
            </div>
          </div>
        </div>

        <aside className="calc-receipt-col" id="receipt-summary">
          <div className="receipt-card">
            <div className="receipt-header">
              <h2>Live Paint Estimate</h2>
              <span className="mono-num" style={{ fontSize: '0.82rem' }}>
                {input.coats} coat{input.coats > 1 ? 's' : ''}
              </span>
            </div>

            <div className="receipt-primary">
              <div className="receipt-primary-label">Recommended Purchase</div>
              <div className="receipt-primary-value">
                {isMetric
                  ? result.containerSplitMetric.summaryText
                  : result.containerSplitImperial.summaryText}
              </div>
              <div className="receipt-primary-sub">
                {isMetric
                  ? `${result.litersExact} L exact (${result.litersWhole} L rounded up)`
                  : `${result.gallonsExact.toFixed(4)} gal exact · ${result.gallonsWhole} × 1-gal whole`}
              </div>
            </div>

            <ul className="receipt-rows">
              <li className="receipt-row">
                <span>Gross Wall Area</span>
                <span className="receipt-row-val">
                  {isMetric
                    ? `${result.grossWallAreaSqM} m²`
                    : `${result.grossWallAreaSqFt} sq ft`}
                </span>
              </li>
              <li className="receipt-row">
                <span>Openings Deducted</span>
                <span className="receipt-row-val">
                  −
                  {isMetric
                    ? `${result.openingsAreaSqM} m²`
                    : `${result.openingsAreaSqFt} sq ft`}
                </span>
              </li>
              <li className="receipt-row">
                <span>Net Paintable Area</span>
                <span className="receipt-row-val">
                  {isMetric
                    ? `${result.netPaintableAreaSqM} m²`
                    : `${result.netPaintableAreaSqFt} sq ft`}
                </span>
              </li>
              <li className="receipt-row">
                <span>Effective Coverage Area</span>
                <span className="receipt-row-val">
                  {isMetric
                    ? `${result.effectiveAreaSqM} m²`
                    : `${result.effectiveAreaSqFt.toFixed(2)} sq ft`}
                </span>
              </li>
              {input.includePrimer && (
                <li className="receipt-row">
                  <span>Primer Needed (1 coat)</span>
                  <span className="receipt-row-val">
                    {isMetric
                      ? `${result.primerLitersWhole} L`
                      : `${result.primerGallonsWhole} gal`}
                  </span>
                </li>
              )}
              {result.estimatedPaintCost > 0 && (
                <li className="receipt-row">
                  <span>Estimated Paint Cost</span>
                  <span className="receipt-row-val">
                    ${result.estimatedPaintCost.toFixed(2)}
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
              estimator="paint"
              defaultZoneName="Living Room"
              unitSystem={input.unitSystem}
              dimensionsSummary={dimensionsSummary}
              primaryQuantityLabel={primaryLabel}
              exactMetrics={{
                gallonsExact: result.gallonsExact,
                litersExact: result.litersExact,
              }}
              estimatedCost={result.estimatedPaintCost}
            />
          </div>

          <SvgSchematic
            kind="paint"
            length={input.roomLength}
            width={input.roomWidth}
            height={input.wallHeight}
            doors={input.doorsCount}
            windows={input.windowsCount}
            unitLabel={lenUnit}
          />
        </aside>
      </div>

      <a href="#receipt-summary" className="mobile-pill no-print">
        <span>Paint Estimate</span>
        <span className="mobile-pill-val">
          {isMetric
            ? result.containerSplitMetric.summaryText
            : result.containerSplitImperial.summaryText}
        </span>
      </a>
    </div>
  );
};
