'use client';

import React from 'react';

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (next: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number | 'any';
  hint?: string;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  id,
  label,
  value,
  onChange,
  unit,
  min = 0,
  max,
  step = 'any',
  hint,
}) => {
  const isInvalid = !Number.isFinite(value) || value < min;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : ''}
          aria-invalid={isInvalid}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === '') {
              onChange(0);
              return;
            }
            const parsed = Number(raw);
            onChange(Number.isFinite(parsed) ? Math.max(min, parsed) : 0);
          }}
        />
        {unit && <span className="input-unit">{unit}</span>}
      </div>
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
};
