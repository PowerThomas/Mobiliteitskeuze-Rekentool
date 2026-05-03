'use client';

import { Hint } from '@/components/Hint';

type Props = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  hint?: string;
};

export function CheckboxInput({ label, checked, onChange, hint }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
      {hint && <Hint text={hint} />}
    </label>
  );
}
