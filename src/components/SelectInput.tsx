'use client';

import { Hint } from '@/components/Hint';

type Option = { value: string; label: string };

type Props = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  hint?: string;
};

export function SelectInput({ label, value, options, onChange, hint }: Props) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex items-center gap-1">
        <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
        {hint && <Hint text={hint} />}
      </span>
      <select className="rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-100 px-2 py-1" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
