'use client';

import { useLocale } from '@/lib/i18n/context';
import { euro } from '@/lib/format';
import { ScenarioResult } from '@/lib/types';

interface Props {
  scenario: ScenarioResult;
}

export function BreakdownList({ scenario }: Props) {
  const { t } = useLocale();
  const scenarioTitle = t.scenarios[scenario.key as 'A' | 'B' | 'C'];
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 p-4 shadow">
      <h3 className="mb-2 font-semibold">{t.ui.breakdownTitle} {scenarioTitle}</h3>
      <ul className="space-y-1 text-sm">
        {scenario.breakdown.map((item) => (
          <li key={item.label} className="flex justify-between border-b border-slate-100 dark:border-slate-700 py-1">
            <span>{t.breakdown[item.label] ?? item.label}</span>
            <span className={item.amountPerMonth < 0 ? 'text-emerald-700 dark:text-emerald-400' : ''}>
              {euro(item.amountPerMonth)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
