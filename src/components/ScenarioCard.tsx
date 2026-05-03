'use client';

import { useLocale } from '@/lib/i18n/context';
import { euro } from '@/lib/format';
import { ScenarioResult } from '@/lib/types';

interface Props {
  scenario: ScenarioResult;
  isCheapest: boolean;
}

export function ScenarioCard({ scenario, isCheapest }: Props) {
  const { t } = useLocale();
  return (
    <article
      className={`rounded-xl p-4 shadow ${isCheapest ? 'bg-emerald-100 ring-2 ring-emerald-400 dark:bg-emerald-900/20 dark:ring-emerald-500' : 'bg-white dark:bg-slate-700'}`}
    >
      <h3 className="text-sm font-semibold">{t.scenarios[scenario.key as 'A' | 'B' | 'C']}</h3>
      <p className="mt-1 text-xl font-bold">{euro(scenario.netPerMonth)} {t.ui.perMonth}</p>
      <p className="text-sm text-slate-600 dark:text-slate-300">{euro(scenario.totalHorizon)} {t.ui.overHorizon}</p>
      {isCheapest && (
        <p className="mt-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">{t.ui.mostAffordable}</p>
      )}
    </article>
  );
}
