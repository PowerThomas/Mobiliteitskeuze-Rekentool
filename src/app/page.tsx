'use client';

import { useMemo, useState } from 'react';
import { CheckboxInput } from '@/components/CheckboxInput';
import { NumberInput } from '@/components/NumberInput';
import { SelectInput } from '@/components/SelectInput';
import { calculateComparison } from '@/lib/calculations';
import { defaultInputs } from '@/lib/defaults';
import { euro } from '@/lib/format';
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

export default function Home() {
  const [inputs, setInputs] = useState<InputState>(defaultInputs);

  const result = useMemo(() => calculateComparison(inputs), [inputs]);

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

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
      <h1 className="mb-2 text-2xl font-bold">Mobiliteitskeuze Rekentool (MVP)</h1>
      <p className="mb-4 text-sm text-slate-600">Alle fiscale en rekenparameters zijn configureerbaar. Bedragen zijn netto maandimpact (negatief = credit).</p>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <section className="space-y-3 rounded-xl bg-white p-4 shadow">
          <details open>
            <summary className="cursor-pointer font-semibold">Algemeen & mobiliteit</summary>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <NumberInput label="Marginaal belastingtarief (0-1)" value={inputs.general.marginalTaxRate} onChange={(v) => update('general', { marginalTaxRate: v })} step={0.01} min={0} max={1} />
              <NumberInput label="Horizon (maanden)" value={inputs.general.horizonMonths} onChange={(v) => update('general', { horizonMonths: v })} min={1} />
              <NumberInput label="Mobiliteitsbudget p/m" value={inputs.mobility.mobilityBudgetAmount} onChange={(v) => update('mobility', { mobilityBudgetAmount: v })} />
              <SelectInput label="Budgetmodus" value={inputs.mobility.mobilityBudgetMode} options={[{ value: 'bruto', label: 'Bruto' }, { value: 'netto', label: 'Netto' }]} onChange={(v) => update('mobility', { mobilityBudgetMode: v as 'bruto' | 'netto' })} />
              <CheckboxInput label="Onbelaste km-vergoeding actief" checked={inputs.mobility.taxFreeAllowanceEnabled} onChange={(v) => update('mobility', { taxFreeAllowanceEnabled: v })} />
              <NumberInput label="Onbelaste km-vergoeding €/km" value={inputs.mobility.taxFreeAllowancePerKm} onChange={(v) => update('mobility', { taxFreeAllowancePerKm: v })} step={0.01} />
              <NumberInput label="Reimbursable km/jaar" value={inputs.mobility.reimbursableKmPerYear} onChange={(v) => update('mobility', { reimbursableKmPerYear: v })} />
            </div>
          </details>

          <details>
            <summary className="cursor-pointer font-semibold">Energie + ERE</summary>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <NumberInput label="Totaal km/jaar" value={inputs.energy.totalKmPerYear} onChange={(v) => update('energy', { totalKmPerYear: v })} />
              <NumberInput label="Woon-werk km/jaar" value={inputs.energy.commuteKmPerYear} onChange={(v) => update('energy', { commuteKmPerYear: v })} />
              <NumberInput label="Zakelijk km/jaar" value={inputs.energy.businessKmPerYear} onChange={(v) => update('energy', { businessKmPerYear: v })} />
              <NumberInput label="Verbruik kWh/100km" value={inputs.energy.kwhPer100Km} onChange={(v) => update('energy', { kwhPer100Km: v })} step={0.1} />
              <NumberInput label="Stroomprijs thuis €/kWh" value={inputs.energy.homeElectricityPricePerKwh} onChange={(v) => update('energy', { homeElectricityPricePerKwh: v })} step={0.01} />
              <NumberInput label="Publieke laadprijs €/kWh" value={inputs.energy.publicElectricityPricePerKwh} onChange={(v) => update('energy', { publicElectricityPricePerKwh: v })} step={0.01} />
              <label className="text-sm md:col-span-2">
                <span className="font-medium text-slate-700">Thuislaadaandeel: {(inputs.energy.homeChargingShare * 100).toFixed(0)}%</span>
                <input type="range" min={0} max={1} step={0.01} value={inputs.energy.homeChargingShare} onChange={(e) => update('energy', { homeChargingShare: Number(e.target.value) })} className="w-full" />
              </label>
              <CheckboxInput label="ERE actief" checked={inputs.ere.enabled} onChange={(v) => update('ere', { enabled: v })} />
              <NumberInput label="ERE credit €/kWh" value={inputs.ere.creditPerKwh} onChange={(v) => update('ere', { creditPerKwh: v })} step={0.01} />
              <NumberInput label="ERE eligible share (0-1)" value={inputs.ere.eligibleShare} onChange={(v) => update('ere', { eligibleShare: v })} step={0.01} min={0} max={1} />
              <NumberInput label="ERE vaste fee p/m" value={inputs.ere.monthlyFee} onChange={(v) => update('ere', { monthlyFee: v })} step={0.5} />
            </div>
          </details>

          <details>
            <summary className="cursor-pointer font-semibold">Scenario-parameters (A/B/C)</summary>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <NumberInput label="A: Cataloguswaarde" value={inputs.lease.listPrice} onChange={(v) => update('lease', { listPrice: v })} />
              <NumberInput label="A: Eigen bijdrage p/m" value={inputs.lease.employeeContributionPerMonth} onChange={(v) => update('lease', { employeeContributionPerMonth: v })} />
              <NumberInput label="A: Bijtellingstarief (0-1)" value={inputs.lease.additionalTaxRate} onChange={(v) => update('lease', { additionalTaxRate: v })} step={0.01} />
              <NumberInput label="A: Bijtelling cap" value={inputs.lease.additionalTaxCap} onChange={(v) => update('lease', { additionalTaxCap: v })} />
              <CheckboxInput label="A: Laadkosten door werkgever gedekt" checked={inputs.lease.chargingCoveredByEmployer} onChange={(v) => update('lease', { chargingCoveredByEmployer: v })} />
              <CheckboxInput label="A: Toch mobiliteitsbudget ontvangen" checked={inputs.lease.alsoReceiveMobilityBudget} onChange={(v) => update('lease', { alsoReceiveMobilityBudget: v })} />

              <NumberInput label="B: Aankoopprijs EV" value={inputs.ownEv.purchasePrice} onChange={(v) => update('ownEv', { purchasePrice: v })} />
              <NumberInput label="B: Aanbetaling" value={inputs.ownEv.downPayment} onChange={(v) => update('ownEv', { downPayment: v })} />
              <CheckboxInput label="B: Financiering actief" checked={inputs.ownEv.financingEnabled} onChange={(v) => update('ownEv', { financingEnabled: v })} />
              <NumberInput label="B: APR (0-1)" value={inputs.ownEv.apr} onChange={(v) => update('ownEv', { apr: v })} step={0.01} />
              <NumberInput label="B: Financieringsduur (mnd)" value={inputs.ownEv.financingMonths} onChange={(v) => update('ownEv', { financingMonths: v })} />
              <SelectInput label="B: Restwaarde modus" value={inputs.ownEv.residualValueMode} options={[{ value: 'percent', label: 'Percentage' }, { value: 'amount', label: 'Bedrag' }]} onChange={(v) => update('ownEv', { residualValueMode: v as 'percent' | 'amount' })} />
              <NumberInput label="B: Restwaarde % (0-1)" value={inputs.ownEv.residualValuePercent} onChange={(v) => update('ownEv', { residualValuePercent: v })} step={0.01} />
              <NumberInput label="B: Restwaarde bedrag" value={inputs.ownEv.residualValueAmount} onChange={(v) => update('ownEv', { residualValueAmount: v })} />
              <NumberInput label="B: Verzekering p/m" value={inputs.ownEv.insurancePerMonth} onChange={(v) => update('ownEv', { insurancePerMonth: v })} />
              <NumberInput label="B: MRB p/m" value={inputs.ownEv.mrbPerMonth} onChange={(v) => update('ownEv', { mrbPerMonth: v })} />
              <NumberInput label="B: Onderhoud p/m" value={inputs.ownEv.maintenancePerMonth} onChange={(v) => update('ownEv', { maintenancePerMonth: v })} />
              <NumberInput label="B: Thuislaadpaal 1x" value={inputs.ownEv.chargingStationCost} onChange={(v) => update('ownEv', { chargingStationCost: v })} />
              <NumberInput label="B: Laadpaal afschrijving (mnd)" value={inputs.ownEv.chargingStationDepreciationMonths} onChange={(v) => update('ownEv', { chargingStationDepreciationMonths: v })} />

              <NumberInput label="C: Private lease p/m" value={inputs.privateLease.monthlyLeaseCost} onChange={(v) => update('privateLease', { monthlyLeaseCost: v })} />
              <NumberInput label="C: Inbegrepen km/jaar" value={inputs.privateLease.includedKmPerYear} onChange={(v) => update('privateLease', { includedKmPerYear: v })} />
              <NumberInput label="C: Extra km-prijs" value={inputs.privateLease.extraKmPrice} onChange={(v) => update('privateLease', { extraKmPrice: v })} step={0.01} />
              <CheckboxInput label="C: Verzekering inbegrepen" checked={inputs.privateLease.includesInsurance} onChange={(v) => update('privateLease', { includesInsurance: v })} />
              <CheckboxInput label="C: MRB inbegrepen" checked={inputs.privateLease.includesMrb} onChange={(v) => update('privateLease', { includesMrb: v })} />
              <CheckboxInput label="C: Onderhoud inbegrepen" checked={inputs.privateLease.includesMaintenance} onChange={(v) => update('privateLease', { includesMaintenance: v })} />
            </div>
          </details>
        </section>

        <section className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {result.scenarios.map((scenario) => (
              <article key={scenario.key} className={`rounded-xl p-3 shadow ${result.cheapestScenarioKey === scenario.key ? 'bg-emerald-100 ring-2 ring-emerald-400' : 'bg-white'}`}>
                <h2 className="text-sm font-semibold">{scenario.title}</h2>
                <p className="text-xl font-bold">{euro(scenario.netPerMonth)} / maand</p>
                <p className="text-sm text-slate-600">{euro(scenario.totalHorizon)} over horizon</p>
                {result.cheapestScenarioKey === scenario.key && <p className="mt-1 text-xs font-semibold text-emerald-700">Meest voordelig</p>}
              </article>
            ))}
          </div>

          <div className="rounded-xl bg-white p-4 shadow">
            <h3 className="mb-2 font-semibold">Sensitivity sliders</h3>
            <div className="grid gap-3">
              <label className="text-sm">
                <span>Stroomprijs thuis €/kWh: {inputs.energy.homeElectricityPricePerKwh.toFixed(2)}</span>
                <input type="range" min={0.15} max={0.8} step={0.01} value={inputs.energy.homeElectricityPricePerKwh} onChange={(e) => update('energy', { homeElectricityPricePerKwh: Number(e.target.value) })} className="w-full" />
              </label>
              <label className="text-sm">
                <span>Restwaarde (%): {(inputs.ownEv.residualValuePercent * 100).toFixed(0)}%</span>
                <input type="range" min={0.1} max={0.8} step={0.01} value={inputs.ownEv.residualValuePercent} onChange={(e) => update('ownEv', { residualValuePercent: Number(e.target.value), residualValueMode: 'percent' })} className="w-full" />
              </label>
              <label className="text-sm">
                <span>Km/jaar totaal: {inputs.energy.totalKmPerYear}</span>
                <input type="range" min={5000} max={60000} step={500} value={inputs.energy.totalKmPerYear} onChange={(e) => update('energy', { totalKmPerYear: Number(e.target.value) })} className="w-full" />
              </label>
              <label className="text-sm">
                <span>ERE €/kWh: {inputs.ere.creditPerKwh.toFixed(2)}</span>
                <input type="range" min={0} max={0.3} step={0.01} value={inputs.ere.creditPerKwh} onChange={(e) => update('ere', { creditPerKwh: Number(e.target.value) })} className="w-full" />
              </label>
            </div>
          </div>

          <button onClick={exportCsv} className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Exporteer CSV (inputs + resultaten)</button>

          <div className="space-y-3">
            {result.scenarios.map((scenario) => (
              <div key={`${scenario.key}-breakdown`} className="rounded-xl bg-white p-4 shadow">
                <h3 className="mb-2 font-semibold">Breakdown {scenario.title}</h3>
                <ul className="space-y-1 text-sm">
                  {scenario.breakdown.map((item) => (
                    <li key={item.label} className="flex justify-between border-b border-slate-100 py-1">
                      <span>{item.label}</span>
                      <span className={item.amountPerMonth < 0 ? 'text-emerald-700' : ''}>{euro(item.amountPerMonth)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
