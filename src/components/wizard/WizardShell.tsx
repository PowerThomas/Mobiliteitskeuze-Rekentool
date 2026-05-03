'use client';

import React from 'react';
import { useLocale } from '@/lib/i18n/context';

export interface WizardStepMeta {
  title: string;
  subtitle?: string;
}

interface WizardShellProps {
  steps: WizardStepMeta[];
  activeStep: number;
  onNext: () => void;
  onPrev: () => void;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

export function WizardShell({ steps, activeStep, onNext, onPrev, headerActions, children }: WizardShellProps) {
  const { t } = useLocale();
  const isFirst = activeStep === 0;
  const isLast = activeStep === steps.length - 1;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div className="flex items-center gap-1" role="progressbar" aria-valuenow={activeStep + 1} aria-valuemin={1} aria-valuemax={steps.length}>
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${idx <= activeStep ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
          />
        ))}
      </div>

      {/* Step header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {t.ui.stepOf(activeStep + 1, steps.length)}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">{steps[activeStep].title}</h2>
          {steps[activeStep].subtitle && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{steps[activeStep].subtitle}</p>
          )}
        </div>
        {headerActions && <div className="shrink-0">{headerActions}</div>}
      </div>

      {/* Step content */}
      <div className="min-h-[24rem]">{children}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4">
        {!isFirst ? (
          <button
            type="button"
            onClick={onPrev}
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            {t.ui.prev}
          </button>
        ) : (
          <div />
        )}
        {!isLast && (
          <button
            type="button"
            onClick={onNext}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {t.ui.next}
          </button>
        )}
      </div>
    </div>
  );
}
