'use client';

import { Hint } from '@/components/Hint';

type Props = {
  label: string;
  value: number; // stored as fraction 0–1
  onChange: (value: number) => void;
  step?: number; // in percentage points, default 1
  min?: number; // in percentage points, default 0
  max?: number; // in percentage points, default 100
  error?: string;
  hint?: string;
};

export function PercentInput({ label, value, onChange, step = 1, min = 0, max = 100, error, hint }: Props) {
  // Round to avoid floating-point display artefacts (e.g. 0.37 * 100 = 37.000…3)
  const displayValue = Math.round(value * 10000) / 100;
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex items-center gap-1">
        <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
        {hint && <Hint text={hint} />}
      </span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          className={`w-full rounded border px-2 py-1 bg-white dark:bg-slate-700 dark:text-slate-100 ${error ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'}`}
          value={displayValue}
          step={step}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value) / 100)}
        />
        <span className="shrink-0 text-slate-500 dark:text-slate-400">%</span>
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
