'use client';

import React, { useState } from 'react';
import { addZoneToBag, type EstimatorType } from '@/lib/storage/projectBag';
import type { UnitSystem } from '@/lib/math/units';

interface ZoneBagAdderProps {
  estimator: EstimatorType;
  defaultZoneName: string;
  unitSystem: UnitSystem;
  dimensionsSummary: string;
  primaryQuantityLabel: string;
  exactMetrics: Record<string, number | undefined>;
  estimatedCost: number;
}

export const ZoneBagAdder: React.FC<ZoneBagAdderProps> = ({
  estimator,
  defaultZoneName,
  unitSystem,
  dimensionsSummary,
  primaryQuantityLabel,
  exactMetrics,
  estimatedCost,
}) => {
  const [zoneName, setZoneName] = useState(defaultZoneName);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleAdd = () => {
    const label = zoneName.trim() || defaultZoneName;
    addZoneToBag({
      estimator,
      zoneName: label,
      unitSystem,
      dimensionsSummary,
      primaryQuantityLabel,
      exactMetrics,
      estimatedCost,
    });
    setSavedMsg(`Added "${label}" to Project Bag`);
    window.setTimeout(() => setSavedMsg(null), 2600);
  };

  return (
    <div className="zone-add-box">
      <label
        htmlFor={`zone-label-${estimator}`}
        style={{ fontSize: '0.82rem', fontWeight: 600 }}
      >
        Save Zone to Project Bag
      </label>
      <div className="zone-input-row">
        <input
          id={`zone-label-${estimator}`}
          type="text"
          value={zoneName}
          onChange={(e) => setZoneName(e.target.value)}
          placeholder={defaultZoneName}
          aria-label="Zone name"
        />
        <button type="button" className="btn btn-primary" onClick={handleAdd}>
          Add Zone to Project Bag
        </button>
      </div>
      {savedMsg && (
        <span
          role="status"
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--color-success)',
          }}
        >
          ✓ {savedMsg}
        </span>
      )}
    </div>
  );
};
