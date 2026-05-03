'use client';

import { useLocale } from '@/lib/i18n/context';

interface Props {
  homeElectricityPricePerKwh: number;
  onHomeElectricityPriceChange: (v: number) => void;
  residualValuePercent: number;
  onResidualValuePercentChange: (v: number) => void;
  totalKmPerYear: number;
  onTotalKmChange: (v: number) => void;
  creditPerKwh: number;
  onCreditPerKwhChange: (v: number) => void;
}

export function SensitivitySliders({
  homeElectricityPricePerKwh,
  onHomeElectricityPriceChange,
  residualValuePercent,
  onResidualValuePercentChange,
  totalKmPerYear,
  onTotalKmChange,
  creditPerKwh,
  onCreditPerKwhChange,
}: Props) {
  const { t } = useLocale();
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 p-4 shadow">
      <h3 className="mb-3 font-semibold">{t.ui.sensitivityTitle}</h3>
      <div className="grid gap-3">
        <label className="text-sm">
          <span>{t.fields.homeElectricityPrice}: {homeElectricityPricePerKwh.toFixed(2)}</span>
          <input
            type="range" min={0.15} max={0.8} step={0.01}
            value={homeElectricityPricePerKwh}
            onChange={(e) => onHomeElectricityPriceChange(Number(e.target.value))}
            className="mt-1 w-full"
          />
        </label>
        <label className="text-sm">
          <span>{t.fields.residualValuePercent} (%): {(residualValuePercent * 100).toFixed(0)}%</span>
          <input
            type="range" min={0.1} max={0.8} step={0.01}
            value={residualValuePercent}
            onChange={(e) => onResidualValuePercentChange(Number(e.target.value))}
            className="mt-1 w-full"
          />
        </label>
        <label className="text-sm">
          <span>{t.fields.totalKmPerYear}: {totalKmPerYear}</span>
          <input
            type="range" min={5000} max={60000} step={500}
            value={totalKmPerYear}
            onChange={(e) => onTotalKmChange(Number(e.target.value))}
            className="mt-1 w-full"
          />
        </label>
        <label className="text-sm">
          <span>{t.fields.ereCreditPerKwh}: {creditPerKwh.toFixed(2)}</span>
          <input
            type="range" min={0} max={0.3} step={0.01}
            value={creditPerKwh}
            onChange={(e) => onCreditPerKwhChange(Number(e.target.value))}
            className="mt-1 w-full"
          />
        </label>
      </div>
    </div>
  );
}
