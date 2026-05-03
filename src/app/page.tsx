'use client';

import { useMemo, useState } from 'react';
import { LocaleProvider, useLocale } from '@/lib/i18n/context';
import { ThemeProvider, useTheme, type Theme } from '@/lib/theme/context';
import { WizardShell } from '@/components/wizard/WizardShell';
import { BreakdownList } from '@/components/BreakdownList';
import { Hint } from '@/components/Hint';
import { PercentInput } from '@/components/PercentInput';
import { ScenarioCard } from '@/components/ScenarioCard';
import { SensitivitySliders } from '@/components/SensitivitySliders';
import { CheckboxInput } from '@/components/CheckboxInput';
import { NumberInput } from '@/components/NumberInput';
import { SelectInput } from '@/components/SelectInput';
import { calculateComparison } from '@/lib/calculations';
import { defaultInputs } from '@/lib/defaults';
import { euro } from '@/lib/format';
import { getValidationErrors } from '@/lib/validation';
import { InputState } from '@/lib/types';

function flattenInputs(inputs: InputState): Record<string, string | number | boolean> {
  return {
    marginalTaxRate: inputs.general.marginalTaxRate,
    horizonMonths: inputs.general.horizonMonths,
    mobilityBudgetAmount: inputs.mobility.mobilityBudgetAmount,
    mobilityBudgetMode: inputs.mobility.mobilityBudgetMode,
    taxFreeAllowanceEnabled: inputs.mobility.taxFreeAllowanceEnabled,
    taxFreeAllowancePerKm: inputs.mobility.taxFreeAllowancePerKm,
    reimbursableKmPerYear: inputs.mobility.reimbursableKmPerYear,
    totalKmPerYear: inputs.energy.totalKmPerYear,
    commuteKmPerYear: inputs.energy.commuteKmPerYear,
    businessKmPerYear: inputs.energy.businessKmPerYear,
    kwhPer100Km: inputs.energy.kwhPer100Km,
    homeChargingShare: inputs.energy.homeChargingShare,
    homeElectricityPricePerKwh: inputs.energy.homeElectricityPricePerKwh,
    publicElectricityPricePerKwh: inputs.energy.publicElectricityPricePerKwh,
    ereEnabled: inputs.ere.enabled,
    ereCreditPerKwh: inputs.ere.creditPerKwh,
    ereEligibleShare: inputs.ere.eligibleShare,
    ereMonthlyFee: inputs.ere.monthlyFee,
    leaseListPrice: inputs.lease.listPrice,
    leaseEmployeeContributionPerMonth: inputs.lease.employeeContributionPerMonth,
    leaseAdditionalTaxRate: inputs.lease.additionalTaxRate,
    leaseAdditionalTaxRateAboveCap: inputs.lease.additionalTaxRateAboveCap,
    leaseAdditionalTaxCap: inputs.lease.additionalTaxCap,
    leaseChargingCovered: inputs.lease.chargingCoveredByEmployer,
    leaseAlsoMobilityBudget: inputs.lease.alsoReceiveMobilityBudget,
    ownEvPurchasePrice: inputs.ownEv.purchasePrice,
    ownEvDownPayment: inputs.ownEv.downPayment,
    ownEvFinancingEnabled: inputs.ownEv.financingEnabled,
    ownEvApr: inputs.ownEv.apr,
    ownEvFinancingMonths: inputs.ownEv.financingMonths,
    ownEvResidualMode: inputs.ownEv.residualValueMode,
    ownEvResidualPercent: inputs.ownEv.residualValuePercent,
    ownEvResidualAmount: inputs.ownEv.residualValueAmount,
    ownEvInsurancePerMonth: inputs.ownEv.insurancePerMonth,
    ownEvMrbPerMonth: inputs.ownEv.mrbPerMonth,
    ownEvMaintenancePerMonth: inputs.ownEv.maintenancePerMonth,
    ownEvChargingStationCost: inputs.ownEv.chargingStationCost,
    ownEvChargingStationDepMonths: inputs.ownEv.chargingStationDepreciationMonths,
    privateLeaseMonthlyCost: inputs.privateLease.monthlyLeaseCost,
    privateLeaseIncludedKmPerYear: inputs.privateLease.includedKmPerYear,
    privateLeaseExtraKmPrice: inputs.privateLease.extraKmPrice,
    privateLeaseIncludesInsurance: inputs.privateLease.includesInsurance,
    privateLeaseIncludesMrb: inputs.privateLease.includesMrb,
    privateLeaseIncludesMaintenance: inputs.privateLease.includesMaintenance
  };
}

function HomeContent() {
  const [step, setStep] = useState(0);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [inputs, setInputs] = useState<InputState>(defaultInputs);

  const { theme, setTheme } = useTheme();
  const { t, locale, setLocale } = useLocale();
  const result = useMemo(() => calculateComparison(inputs), [inputs]);
  const errors = useMemo(() => getValidationErrors(inputs), [inputs]);
  const e = (key: string | undefined) => key ? (t.errors[key] ?? key) : undefined;

  const update = <K extends keyof InputState>(section: K, patch: Partial<InputState[K]>) => {
    setInputs((prev) => ({ ...prev, [section]: { ...prev[section], ...patch } }));
  };

  const exportCsv = () => {
    const flat = flattenInputs(inputs);
    const rows: string[][] = [['type', 'key', 'value']];
    Object.entries(flat).forEach(([key, value]) => rows.push(['input', key, String(value)]));
    result.scenarios.forEach((scenario) => {
      rows.push(['result', `${scenario.key}.netPerMonth`, scenario.netPerMonth.toFixed(2)]);
      rows.push(['result', `${scenario.key}.totalHorizon`, scenario.totalHorizon.toFixed(2)]);
      scenario.breakdown.forEach((item, idx) => {
        rows.push(['breakdown', `${scenario.key}.${idx}.${item.label}`, item.amountPerMonth.toFixed(2)]);
      });
    });
    rows.push(['result', 'cheapestScenarioKey', result.cheapestScenarioKey]);

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mobiliteitsvergelijking.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <p className="text-slate-700 dark:text-slate-200">{t.welcome.intro}</p>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              {t.welcome.scenarios.map((s, i) => {
                const colors = [
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
                ] as const;
                return (
                  <li key={s.badge} className="flex items-start gap-2">
                    <span className={`mt-0.5 rounded px-1.5 py-0.5 text-xs font-bold ${colors[i]}`}>{s.badge}</span>
                    <span><strong>{s.title}</strong> &mdash; {s.desc}</span>
                  </li>
                );
              })}
            </ul>
            <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-700/50 dark:text-slate-300">
              <p className="font-semibold text-slate-800 dark:text-slate-100">{t.welcome.checklistTitle}</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {t.welcome.checklistItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t.welcome.defaultsNote}</p>
          </div>
        );

      case 1:
        return (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1.5 text-sm">
              <span className="flex items-center gap-1">
                <span className="font-medium text-slate-700 dark:text-slate-200">{t.fields.marginalTaxRate}</span>
                <Hint text={t.hints.marginalTaxRate} />
              </span>
              <div className="flex flex-wrap gap-1.5">
                {t.fields.taxBrackets.map((bracket) => (
                  <button
                    key={bracket.value}
                    type="button"
                    onClick={() => update('general', { marginalTaxRate: bracket.value })}
                    className={`flex flex-col items-start rounded border px-3 py-1.5 text-sm transition-colors ${
                      inputs.general.marginalTaxRate === bracket.value
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{bracket.label}</span>
                    <span className="text-xs opacity-70">{bracket.sublabel}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-200">{t.fields.horizonMonths}</span>
              <div className="flex flex-wrap gap-1.5">
                {[12, 24, 36, 48, 60].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => update('general', { horizonMonths: m })}
                    className={`rounded border px-3 py-1.5 text-sm transition-colors ${
                      inputs.general.horizonMonths === m
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {m} {t.ui.monthsAbbr}
                  </button>
                ))}
              </div>
            </div>
            <NumberInput
              label={t.fields.mobilityBudgetAmount}
              value={inputs.mobility.mobilityBudgetAmount}
              onChange={(v) => update('mobility', { mobilityBudgetAmount: v })}
              min={0}
              hint={t.hints.mobilityBudgetAmount}
            />
            <SelectInput
              label={t.fields.mobilityBudgetMode}
              value={inputs.mobility.mobilityBudgetMode}
              options={[{ value: 'bruto', label: t.fields.budgetModeGross }, { value: 'netto', label: t.fields.budgetModeNet }]}
              onChange={(v) => update('mobility', { mobilityBudgetMode: v as 'bruto' | 'netto' })}
              hint={t.hints.mobilityBudgetMode}
            />
            {inputs.mobility.mobilityBudgetMode === 'bruto' && (
              <p className="text-xs text-slate-500 dark:text-slate-400 md:col-span-2">
                {t.ui.netLabel}: {euro(inputs.mobility.mobilityBudgetAmount * (1 - inputs.general.marginalTaxRate))} {t.ui.perMonth}
              </p>
            )}
            <CheckboxInput
              label={t.fields.taxFreeAllowanceEnabled}
              checked={inputs.mobility.taxFreeAllowanceEnabled}
              onChange={(v) => update('mobility', { taxFreeAllowanceEnabled: v })}
              hint={t.hints.taxFreeAllowanceEnabled}
            />
            {advancedMode && (
              <NumberInput
                label={t.fields.taxFreeAllowancePerKm}
                value={inputs.mobility.taxFreeAllowancePerKm}
                onChange={(v) => update('mobility', { taxFreeAllowancePerKm: v })}
                step={0.01}
                min={0}
                hint={t.hints.taxFreeAllowancePerKm}
              />
            )}
            {advancedMode && (
              <NumberInput
                label={t.fields.reimbursableKmPerYear}
                value={inputs.mobility.reimbursableKmPerYear}
                onChange={(v) => update('mobility', { reimbursableKmPerYear: v })}
                min={0}
                hint={t.hints.reimbursableKmPerYear}
              />
            )}
          </div>
        );

      case 2:
        return (
          <div className="grid gap-3 md:grid-cols-2">
            <NumberInput
              label={t.fields.totalKmPerYear}
              value={inputs.energy.totalKmPerYear}
              onChange={(v) => update('energy', { totalKmPerYear: v })}
              min={0}
              error={e(errors['energy.totalKmPerYear'])}
              hint={t.hints.totalKmPerYear}
            />
            {advancedMode && (
              <NumberInput
                label={t.fields.commuteKmPerYear}
                value={inputs.energy.commuteKmPerYear}
                onChange={(v) => update('energy', { commuteKmPerYear: v })}
                min={0}
                hint={t.hints.commuteKmPerYear}
              />
            )}
            {advancedMode && (
              <NumberInput
                label={t.fields.businessKmPerYear}
                value={inputs.energy.businessKmPerYear}
                onChange={(v) => update('energy', { businessKmPerYear: v })}
                min={0}
                hint={t.hints.businessKmPerYear}
              />
            )}
            <div className="md:col-span-2">
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">{t.fields.consumptionClassLabel}</span>
              <div className="flex flex-wrap gap-1.5">
                {t.fields.consumptionPresets.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => update('energy', { kwhPer100Km: p.value })}
                    className={`rounded border px-3 py-1 text-xs transition-colors ${
                      inputs.energy.kwhPer100Km === p.value
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            {advancedMode && (
              <NumberInput
                label={t.fields.kwhPer100Km}
                value={inputs.energy.kwhPer100Km}
                onChange={(v) => update('energy', { kwhPer100Km: v })}
                step={0.1}
                min={0}
                hint={t.hints.kwhPer100Km}
              />
            )}
            <NumberInput
              label={t.fields.homeElectricityPrice}
              value={inputs.energy.homeElectricityPricePerKwh}
              onChange={(v) => update('energy', { homeElectricityPricePerKwh: v })}
              step={0.01}
              min={0}
              hint={t.hints.homeElectricityPrice}
            />
            {advancedMode && (
              <NumberInput
                label={t.fields.publicElectricityPrice}
                value={inputs.energy.publicElectricityPricePerKwh}
                onChange={(v) => update('energy', { publicElectricityPricePerKwh: v })}
                step={0.01}
                min={0}
                hint={t.hints.publicElectricityPrice}
              />
            )}
            <label className="text-sm md:col-span-2">
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {t.fields.homeChargingShare}: {(inputs.energy.homeChargingShare * 100).toFixed(0)}%
              </span>
              <input
                type="range" min={0} max={1} step={0.01}
                value={inputs.energy.homeChargingShare}
                onChange={(e) => update('energy', { homeChargingShare: Number(e.target.value) })}
                className="mt-1 w-full"
              />
            </label>
            <div className="md:col-span-2 border-t border-slate-100 dark:border-slate-700 pt-3">
              <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{t.fields.ereTitle}</p>
            </div>
            <CheckboxInput
              label={t.fields.ereEnabled}
              checked={inputs.ere.enabled}
              onChange={(v) => update('ere', { enabled: v })}
              hint={t.hints.ereEnabled}
            />
            {advancedMode && inputs.ere.enabled && (
              <NumberInput
                label={t.fields.ereCreditPerKwh}
                value={inputs.ere.creditPerKwh}
                onChange={(v) => update('ere', { creditPerKwh: v })}
                step={0.01}
                min={0}
                hint={t.hints.ereCreditPerKwh}
              />
            )}
            {advancedMode && inputs.ere.enabled && (
              <PercentInput
                label={t.fields.ereEligibleShare}
                value={inputs.ere.eligibleShare}
                onChange={(v) => update('ere', { eligibleShare: v })}
                min={0} max={100}
                hint={t.hints.ereEligibleShare}
              />
            )}
            {advancedMode && inputs.ere.enabled && (
              <NumberInput
                label={t.fields.ereMonthlyFee}
                value={inputs.ere.monthlyFee}
                onChange={(v) => update('ere', { monthlyFee: v })}
                step={0.5}
                min={0}
                hint={t.hints.ereMonthlyFee}
              />
            )}
          </div>
        );

      case 3:
        return (
          <div className="grid gap-3 md:grid-cols-2">
            <NumberInput
              label={t.fields.listPrice}
              value={inputs.lease.listPrice}
              onChange={(v) => update('lease', { listPrice: v })}
              hint={t.hints.listPrice}
            />
            <NumberInput
              label={t.fields.employeeContribution}
              value={inputs.lease.employeeContributionPerMonth}
              onChange={(v) => update('lease', { employeeContributionPerMonth: v })}
              hint={t.hints.employeeContribution}
            />
            <PercentInput
              label={t.fields.additionalTaxRate}
              value={inputs.lease.additionalTaxRate}
              onChange={(v) => update('lease', { additionalTaxRate: v })}
              min={0} max={100}
              hint={t.hints.additionalTaxRate}
            />
            <PercentInput
              label={t.fields.additionalTaxRateAboveCap}
              value={inputs.lease.additionalTaxRateAboveCap}
              onChange={(v) => update('lease', { additionalTaxRateAboveCap: v })}
              min={0} max={100}
              hint={t.hints.additionalTaxRateAboveCap}
            />
            {advancedMode && (
              <NumberInput
                label={t.fields.additionalTaxCap}
                value={inputs.lease.additionalTaxCap}
                onChange={(v) => update('lease', { additionalTaxCap: v })}
                hint={t.hints.additionalTaxCap}
              />
            )}
            <CheckboxInput
              label={t.fields.chargingCoveredByEmployer}
              checked={inputs.lease.chargingCoveredByEmployer}
              onChange={(v) => update('lease', { chargingCoveredByEmployer: v })}
              hint={t.hints.chargingCoveredByEmployer}
            />
            {advancedMode && (
              <CheckboxInput
                label={t.fields.alsoReceiveMobilityBudget}
                checked={inputs.lease.alsoReceiveMobilityBudget}
                onChange={(v) => update('lease', { alsoReceiveMobilityBudget: v })}
                hint={t.hints.alsoReceiveMobilityBudget}
              />
            )}
          </div>
        );

      case 4:
        return (
          <div className="grid gap-3 md:grid-cols-2">
            <NumberInput
              label={t.fields.purchasePrice}
              value={inputs.ownEv.purchasePrice}
              onChange={(v) => update('ownEv', { purchasePrice: v })}
              min={0}
              hint={t.hints.purchasePrice}
            />
            <NumberInput
              label={t.fields.downPayment}
              value={inputs.ownEv.downPayment}
              onChange={(v) => update('ownEv', { downPayment: v })}
              min={0}
              error={e(errors['ownEv.downPayment'])}
              hint={t.hints.downPayment}
            />
            <CheckboxInput
              label={t.fields.financingEnabled}
              checked={inputs.ownEv.financingEnabled}
              onChange={(v) => update('ownEv', { financingEnabled: v })}
              hint={t.hints.financingEnabled}
            />
            {advancedMode && (
              <PercentInput
                label={t.fields.apr}
                value={inputs.ownEv.apr}
                onChange={(v) => update('ownEv', { apr: v })}
                min={0} max={100}
                hint={t.hints.apr}
              />
            )}
            {advancedMode && (
              <NumberInput
                label={t.fields.financingMonths}
                value={inputs.ownEv.financingMonths}
                onChange={(v) => update('ownEv', { financingMonths: v })}
                min={1}
                error={e(errors['ownEv.financingMonths'])}
                hint={t.hints.financingMonths}
              />
            )}
            {advancedMode && (
              <SelectInput
                label={t.fields.residualValueMode}
                value={inputs.ownEv.residualValueMode}
                options={[{ value: 'percent', label: t.fields.residualValueModePercent }, { value: 'amount', label: t.fields.residualValueModeAmount }]}
                onChange={(v) => update('ownEv', { residualValueMode: v as 'percent' | 'amount' })}
              />
            )}
            {advancedMode && inputs.ownEv.residualValueMode === 'percent' && (
              <PercentInput
                label={t.fields.residualValuePercent}
                value={inputs.ownEv.residualValuePercent}
                onChange={(v) => update('ownEv', { residualValuePercent: v })}
                min={0} max={100}
                error={e(errors['ownEv.residualValuePercent'])}
                hint={t.hints.residualValuePercent}
              />
            )}
            {advancedMode && inputs.ownEv.residualValueMode === 'amount' && (
              <NumberInput
                label={t.fields.residualValueAmount}
                value={inputs.ownEv.residualValueAmount}
                onChange={(v) => update('ownEv', { residualValueAmount: v })}
                min={0}
                error={e(errors['ownEv.residualValueAmount'])}
                hint={t.hints.residualValueAmount}
              />
            )}
            <NumberInput
              label={t.fields.insurancePerMonth}
              value={inputs.ownEv.insurancePerMonth}
              onChange={(v) => update('ownEv', { insurancePerMonth: v })}
              hint={t.hints.insurancePerMonth}
            />
            <NumberInput
              label={t.fields.mrbPerMonth}
              value={inputs.ownEv.mrbPerMonth}
              onChange={(v) => update('ownEv', { mrbPerMonth: v })}
              hint={t.hints.mrbPerMonth}
            />
            <NumberInput
              label={t.fields.maintenancePerMonth}
              value={inputs.ownEv.maintenancePerMonth}
              onChange={(v) => update('ownEv', { maintenancePerMonth: v })}
              hint={t.hints.maintenancePerMonth}
            />
            {advancedMode && (
              <NumberInput
                label={t.fields.chargingStationCost}
                value={inputs.ownEv.chargingStationCost}
                onChange={(v) => update('ownEv', { chargingStationCost: v })}
                hint={t.hints.chargingStationCost}
              />
            )}
            {advancedMode && (
              <NumberInput
                label={t.fields.chargingStationDepMonths}
                value={inputs.ownEv.chargingStationDepreciationMonths}
                onChange={(v) => update('ownEv', { chargingStationDepreciationMonths: v })}
                hint={t.hints.chargingStationDepMonths}
              />
            )}
          </div>
        );

      case 5:
        return (
          <div className="grid gap-3 md:grid-cols-2">
            <NumberInput
              label={t.fields.privateLeaseCost}
              value={inputs.privateLease.monthlyLeaseCost}
              onChange={(v) => update('privateLease', { monthlyLeaseCost: v })}
              hint={t.hints.privateLeaseCost}
            />
            <NumberInput
              label={t.fields.includedKmPerYear}
              value={inputs.privateLease.includedKmPerYear}
              onChange={(v) => update('privateLease', { includedKmPerYear: v })}
              hint={t.hints.includedKmPerYear}
            />
            <NumberInput
              label={t.fields.extraKmPrice}
              value={inputs.privateLease.extraKmPrice}
              onChange={(v) => update('privateLease', { extraKmPrice: v })}
              step={0.01}
              hint={t.hints.extraKmPrice}
            />
            <CheckboxInput
              label={t.fields.includesInsurance}
              checked={inputs.privateLease.includesInsurance}
              onChange={(v) => update('privateLease', { includesInsurance: v })}
              hint={t.hints.includesInsurance}
            />
            <CheckboxInput
              label={t.fields.includesMrb}
              checked={inputs.privateLease.includesMrb}
              onChange={(v) => update('privateLease', { includesMrb: v })}
              hint={t.hints.includesMrb}
            />
            <CheckboxInput
              label={t.fields.includesMaintenance}
              checked={inputs.privateLease.includesMaintenance}
              onChange={(v) => update('privateLease', { includesMaintenance: v })}
              hint={t.hints.includesMaintenance}
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-5">
            <div className="grid gap-3 md:grid-cols-3">
              {result.scenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.key}
                  scenario={scenario}
                  isCheapest={result.cheapestScenarioKey === scenario.key}
                />
              ))}
            </div>
            <div className="space-y-3">
              {result.scenarios.map((scenario) => (
                <BreakdownList key={scenario.key} scenario={scenario} />
              ))}
            </div>
            <SensitivitySliders
              homeElectricityPricePerKwh={inputs.energy.homeElectricityPricePerKwh}
              onHomeElectricityPriceChange={(v) => update('energy', { homeElectricityPricePerKwh: v })}
              residualValuePercent={inputs.ownEv.residualValuePercent}
              onResidualValuePercentChange={(v) => update('ownEv', { residualValuePercent: v, residualValueMode: 'percent' })}
              totalKmPerYear={inputs.energy.totalKmPerYear}
              onTotalKmChange={(v) => update('energy', { totalKmPerYear: v })}
              creditPerKwh={inputs.ere.creditPerKwh}
              onCreditPerKwhChange={(v) => update('ere', { creditPerKwh: v })}
            />
            <button
              type="button"
              onClick={exportCsv}
              className="rounded bg-slate-900 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-white"
            >
              {t.ui.exportCsv}
            </button>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <div className="mb-6 space-y-3">
        <div className="flex justify-end">
          <div className="flex flex-wrap gap-2">
            <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 text-sm">
              <button
                type="button"
                onClick={() => setLocale('nl')}
                className={`px-3 py-1.5 transition-colors ${locale === 'nl' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'}`}
              >
                NL
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`px-3 py-1.5 transition-colors ${locale === 'en' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'}`}
              >
                EN
              </button>
            </div>
            <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 text-sm">
              {(['light', 'dark', 'system'] as Theme[]).map((th) => (
                <button
                  key={th}
                  type="button"
                  onClick={() => setTheme(th)}
                  className={`px-3 py-1.5 transition-colors ${theme === th ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                >
                  {th === 'light' ? t.ui.themeLight : th === 'dark' ? t.ui.themeDark : t.ui.themeSystem}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{t.ui.appTitle}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.ui.appSubtitle}</p>
        </div>
        </div>
      </div>
      <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
        <WizardShell
          steps={t.steps}
          activeStep={step}
          onNext={() => setStep((s) => Math.min(s + 1, t.steps.length - 1))}
          onPrev={() => setStep((s) => Math.max(s - 1, 0))}
          headerActions={(
            <div className="flex overflow-hidden rounded-lg border border-slate-200 text-sm dark:border-slate-700">
              <button
                type="button"
                onClick={() => setAdvancedMode(false)}
                className={`px-3 py-1.5 transition-colors ${!advancedMode ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'}`}
              >
                {t.ui.simpleMode}
              </button>
              <button
                type="button"
                onClick={() => setAdvancedMode(true)}
                className={`px-3 py-1.5 transition-colors ${advancedMode ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'}`}
              >
                {t.ui.advancedMode}
              </button>
            </div>
          )}
        >
          {renderStep()}
        </WizardShell>
      </div>

      {/* Compact live preview — only shown during input steps 1–5, not on welcome (0) or results (6) */}
      {step > 0 && step < 6 && (
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-white dark:bg-slate-800 px-4 py-2.5 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
          <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {t.ui.livePreview}
          </span>
          <div className="flex flex-wrap gap-2">
            {result.scenarios.map((s) => {
              const cheapest = s.key === result.cheapestScenarioKey;
              return (
                <div
                  key={s.key}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                    cheapest
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="font-bold">{s.key}</span>
                  <span>{euro(s.netPerMonth)}<span className="text-xs opacity-70">/m</span></span>
                  {cheapest && <span className="text-xs">✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <HomeContent />
      </LocaleProvider>
    </ThemeProvider>
  );
}

