'use client';

type Props = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export function CheckboxInput({ label, checked, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
