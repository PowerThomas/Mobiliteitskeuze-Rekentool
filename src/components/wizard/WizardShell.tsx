'use client';

import React from 'react';
import { useLocale } from '@/lib/i18n/context';

export interface WizardStepMeta {
  title: string;
  navLabel?: string;
  subtitle?: string;
}

interface WizardShellProps {
  steps: WizardStepMeta[];
  activeStep: number;
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (step: number) => void;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

export function WizardShell({ steps, activeStep, onNext, onPrev, onGoTo, headerActions, children }: WizardShellProps) {
  const { t } = useLocale();
  const isFirst = activeStep === 0;
  const isLast = activeStep === steps.length - 1;

  return (
    <div className="flex flex-col gap-6">
      {/* Clickable step indicators */}
      <nav aria-label="Wizard stappen" className="flex items-start">
        {steps.map((s, idx) => {
          const done = idx < activeStep;
          const active = idx === activeStep;
          return (
            <React.Fragment key={idx}>
              <button
                type="button"
                onClick={() => onGoTo(idx)}
                aria-current={active ? 'step' : undefined}
                title={s.title}
                className={`group flex flex-col items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-sm ${
                  active ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors ${
                  active
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : done
                    ? 'border-blue-600 bg-blue-600 text-white group-hover:bg-blue-700 group-hover:border-blue-700'
                    : 'border-slate-300 bg-white text-slate-400 group-hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500'
                }`}>
                  {done ? (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className={`w-14 truncate text-center text-[0.6rem] leading-tight transition-colors ${
                  active ? 'font-semibold text-blue-600 dark:text-blue-400' :
                  done ? 'text-slate-500 dark:text-slate-400' :
                  'text-slate-400 dark:text-slate-500'
                }`}>
                  {s.navLabel ?? s.title}
                </span>
              </button>
              {idx < steps.length - 1 && (
                <div className={`mt-3.5 h-0.5 flex-1 shrink transition-colors ${idx < activeStep ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Step header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{steps[activeStep].title}</h2>
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
