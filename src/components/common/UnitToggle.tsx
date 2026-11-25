'use client';

import React from 'react';
import type { UnitSystem } from '@/lib/math/units';

interface UnitToggleProps {
  unitSystem: UnitSystem;
  onChange: (next: UnitSystem) => void;
}

export const UnitToggle: React.FC<UnitToggleProps> = ({
  unitSystem,
  onChange,
}) => {
  return (
    <div className="unit-toggle" role="group" aria-label="Measurement units">
      <button
        type="button"
        aria-pressed={unitSystem === 'imperial'}
        onClick={() => onChange('imperial')}
      >
        US Imperial (ft / in)
      </button>
      <button
        type="button"
        aria-pressed={unitSystem === 'metric'}
        onClick={() => onChange('metric')}
      >
        Metric (m / cm)
      </button>
    </div>
  );
};
