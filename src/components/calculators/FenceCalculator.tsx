'use client';

import React, { useMemo, useState } from 'react';
import {
  calculateFence,
  type FenceInput,
  type FenceRunType,
} from '@/lib/math/fence';
import type { UnitSystem } from '@/lib/math/units';
import { setStoredUnitSystem } from '@/lib/storage/projectBag';
import { NumberField } from '../common/NumberField';
import { SvgSchematic } from '../common/SvgSchematic';
import { UnitToggle } from '../common/UnitToggle';
import { ZoneBagAdder } from '../common/ZoneBagAdder';

const DEFAULT_IMPERIAL: FenceInput = {
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

const DEFAULT_METRIC: FenceInput = {
  ...DEFAULT_IMPERIAL,
  unitSystem: 'metric',
  totalRunLength: 30,
  gateWidth: 1.2,
  fenceHeight: 1.8,
  postSpacing: 2.4,
  picketWidth: 14,
  picketGap: 0,
  postWidth: 8.9,
  postThickness: 8.9,
  holeDiameter: 30,
  burialDepth: 60,
};

export const FenceCalculator: React.FC = () => {
  const [input, setInput] = useState<FenceInput>(DEFAULT_IMPERIAL);
  const result = useMemo(() => calculateFence(input), [input]);
  const isMetric = input.unitSystem === 'metric';
  const lenUnit = isMetric ? 'm' : 'ft';
  const smallUnit = isMetric ? 'cm' : 'in';

  const handleUnitChange = (next: UnitSystem) => {
    setStoredUnitSystem(next);
    setInput(next === 'metric' ? DEFAULT_METRIC : DEFAULT_IMPERIAL);
  };

  const updateField = <K extends keyof FenceInput>(
    key: K,
    value: FenceInput[K]
  ) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const dimensionsSummary = `${input.totalRunLength} ${lenUnit} (${input.runType}), ${input.fenceHeight} ${lenUnit} H`;
  const primaryLabel = `${result.posts} posts · ${result.rails} rails · ${result.pickets} pickets · ${result.concreteBags} bags`;

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
                fenceHeight: isMetric ? 1.8 : 6,
                railsPerSection: 3,
                burialDepth: isMetric ? 60 : 24,
              }))
            }
          >
            6 ft Privacy Fence
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() =>
              setInput((prev) => ({
                ...prev,
                fenceHeight: isMetric ? 1.2 : 4,
                railsPerSection: 2,
                burialDepth: isMetric ? 60 : 24,
              }))
            }
          >
            4 ft Picket Fence
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
            <h2 className="calc-card-title">1. Fence Run & Gates</h2>
            <div className="mode-tabs" role="group" aria-label="Fence run type">
              {(
                [
                  ['straight', 'Straight / Open Run (Sections + 1 posts)'],
                  ['closed', 'Closed Perimeter (Sections = posts)'],
                ] as [FenceRunType, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className="mode-tab"
                  aria-pressed={input.runType === key}
                  onClick={() => updateField('runType', key)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="field-grid">
              <NumberField
                id="fence-run"
                label="Total Run Length"
                value={input.totalRunLength}
                onChange={(v) => updateField('totalRunLength', v)}
                unit={lenUnit}
              />
              <NumberField
                id="fence-height"
                label="Fence Height"
                value={input.fenceHeight}
                onChange={(v) => updateField('fenceHeight', v)}
                unit={lenUnit}
              />
              <NumberField
                id="fence-spacing"
                label="Post Spacing"
                value={input.postSpacing}
                onChange={(v) => updateField('postSpacing', v)}
                unit={lenUnit}
              />
              <NumberField
                id="fence-extra-posts"
                label="Extra Corner/End Posts"
                value={input.extraCornerPosts}
                onChange={(v) => updateField('extraCornerPosts', v)}
                step={1}
              />
              <NumberField
                id="fence-gates"
                label="Number of Gates"
                value={input.gatesCount}
                onChange={(v) => updateField('gatesCount', v)}
                step={1}
              />
              <NumberField
                id="fence-gate-w"
                label="Gate Width"
                value={input.gateWidth}
                onChange={(v) => updateField('gateWidth', v)}
                unit={lenUnit}
              />
            </div>
          </div>

          <div className="calc-card">
            <h2 className="calc-card-title">2. Rails, Pickets & Post Footings</h2>
            <div className="field-grid">
              <NumberField
                id="fence-rails"
                label="Rails per Section"
                value={input.railsPerSection}
                onChange={(v) => updateField('railsPerSection', v)}
                step={1}
              />
              <NumberField
                id="fence-picket-w"
                label="Picket Width"
                value={input.picketWidth}
                onChange={(v) => updateField('picketWidth', v)}
                unit={smallUnit}
                hint={isMetric ? '14 cm = 1×6 actual' : '5.5 in = 1×6 actual'}
              />
              <NumberField
                id="fence-picket-gap"
                label="Picket Gap"
                value={input.picketGap}
                onChange={(v) => updateField('picketGap', v)}
                unit={smallUnit}
              />
              <NumberField
                id="fence-picket-waste"
                label="Picket Waste"
                value={input.picketWastePct}
                onChange={(v) => updateField('picketWastePct', v)}
                unit="%"
              />
              <NumberField
                id="fence-hole-dia"
                label="Post Hole Diameter"
                value={input.holeDiameter}
                onChange={(v) => updateField('holeDiameter', v)}
                unit={smallUnit}
              />
              <NumberField
                id="fence-burial"
                label="Burial Depth"
                value={input.burialDepth}
                onChange={(v) => updateField('burialDepth', v)}
                unit={smallUnit}
              />
              <div className="field">
                <label htmlFor="fence-bag-weight">Concrete Bag Size</label>
                <select
                  id="fence-bag-weight"
                  value={input.bagWeightLb}
                  onChange={(e) => {
                    const wt = Number(e.target.value) as 40 | 60 | 80;
                    const yld = wt === 40 ? 0.3 : wt === 60 ? 0.45 : 0.6;
                    setInput((prev) => ({
                      ...prev,
                      bagWeightLb: wt,
                      bagYieldFt3: yld,
                    }));
                  }}
                >
                  <option value={80}>80 lb (0.60 cu ft)</option>
                  <option value={60}>60 lb (0.45 cu ft)</option>
                  <option value={40}>40 lb (0.30 cu ft)</option>
                </select>
              </div>
              <NumberField
                id="fence-conc-waste"
                label="Concrete Waste"
                value={input.concreteWastePct}
                onChange={(v) => updateField('concreteWastePct', v)}
                unit="%"
              />
            </div>
          </div>
        </div>

        <aside className="calc-receipt-col" id="receipt-summary">
          <div className="receipt-card">
            <div className="receipt-header">
              <h2>Live Fencing Estimate</h2>
              <span className="mono-num" style={{ fontSize: '0.82rem' }}>
                {result.sections} sections
              </span>
            </div>

            <div className="receipt-primary">
              <div className="receipt-primary-label">Lumber & Footing Concrete</div>
              <div className="receipt-primary-value">
                {result.posts} posts · {result.concreteBags} bags
              </div>
              <div className="receipt-primary-sub">
                {result.rails} rails · {result.pickets} pickets ·{' '}
                {input.bagWeightLb} lb concrete bags
              </div>
            </div>

            <ul className="receipt-rows">
              <li className="receipt-row">
                <span>Net Fence Run (excl. gates)</span>
                <span className="receipt-row-val">
                  {isMetric ? `${result.netRunM} m` : `${result.netRunFt} ft`}
                </span>
              </li>
              <li className="receipt-row">
                <span>Recommended Post Length</span>
                <span className="receipt-row-val">
                  {isMetric
                    ? `${result.recommendedPostLengthM} m`
                    : `${result.recommendedPostLengthFt} ft`}
                </span>
              </li>
              <li className="receipt-row">
                <span>Net Concrete per Post</span>
                <span className="receipt-row-val">
                  {result.netConcretePerPostFt3.toFixed(4)} cu ft
                </span>
              </li>
              <li className="receipt-row">
                <span>Total Concrete Volume</span>
                <span className="receipt-row-val">
                  {isMetric
                    ? `${result.totalConcreteCuM} m³`
                    : `${result.totalConcreteFt3} cu ft`}
                </span>
              </li>
              {result.estimatedMaterialCost > 0 && (
                <li className="receipt-row">
                  <span>Est. Posts + Concrete Cost</span>
                  <span className="receipt-row-val">
                    ${result.estimatedMaterialCost.toFixed(2)}
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
              estimator="fence"
              defaultZoneName="Backyard Fence"
              unitSystem={input.unitSystem}
              dimensionsSummary={dimensionsSummary}
              primaryQuantityLabel={primaryLabel}
              exactMetrics={{
                posts: result.posts,
                rails: result.rails,
                pickets: result.pickets,
                fenceConcreteBags: result.concreteBags,
              }}
              estimatedCost={result.estimatedMaterialCost}
            />
          </div>

          <SvgSchematic
            kind="fence"
            sections={result.sections}
            railsPerSection={input.railsPerSection}
            heightLabel={`${input.fenceHeight} ${lenUnit}`}
            burialLabel={`${input.burialDepth} ${smallUnit}`}
          />
        </aside>
      </div>

      <a href="#receipt-summary" className="mobile-pill no-print">
        <span>Fence Estimate</span>
        <span className="mobile-pill-val">
          {result.posts} posts · {result.pickets} pickets · {result.concreteBags} bags
        </span>
      </a>
    </div>
  );
};
