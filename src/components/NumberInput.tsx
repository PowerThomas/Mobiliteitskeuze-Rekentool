'use client';

import { Hint } from '@/components/Hint';

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  error?: string;
  hint?: string;
};

export function NumberInput({ label, value, onChange, step = 1, min, max, error, hint }: Props) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex items-center gap-1">
        <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
        {hint && <Hint text={hint} />}
      </span>
      <input
        type="number"
        className={`rounded border px-2 py-1 bg-white dark:bg-slate-700 dark:text-slate-100 ${error ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'}`}
        value={Number.isFinite(value) ? value : 0}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
