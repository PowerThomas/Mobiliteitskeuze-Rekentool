import { ComparisonResult, InputState, ScenarioResult } from './types';

const monthly = (yearly: number) => yearly / 12;
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function financePayment(principal: number, apr: number, months: number): number {
  if (months <= 0 || principal <= 0) return 0;
  const monthlyRate = apr / 12;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

function mobilityBudgetNetPerMonth(inputs: InputState): number {
  const gross = inputs.mobility.mobilityBudgetAmount;
  return inputs.mobility.mobilityBudgetMode === 'netto' ? gross : gross * (1 - inputs.general.marginalTaxRate);
}

function taxFreeKmCreditPerMonth(inputs: InputState): number {
  if (!inputs.mobility.taxFreeAllowanceEnabled) return 0;
  return monthly(inputs.mobility.reimbursableKmPerYear * inputs.mobility.taxFreeAllowancePerKm);
}

function energyCostPerMonth(inputs: InputState): { homeCost: number; publicCost: number; total: number; homeKwh: number } {
  const totalKwh = (inputs.energy.totalKmPerYear / 100) * inputs.energy.kwhPer100Km;
  const homeShare = clamp(inputs.energy.homeChargingShare);
  const homeKwh = monthly(totalKwh * homeShare);
  const publicKwh = monthly(totalKwh * (1 - homeShare));
  const homeCost = homeKwh * inputs.energy.homeElectricityPricePerKwh;
  const publicCost = publicKwh * inputs.energy.publicElectricityPricePerKwh;
  return { homeCost, publicCost, total: homeCost + publicCost, homeKwh };
}

function ereCreditPerMonth(inputs: InputState, homeKwhPerMonth: number): number {
  if (!inputs.ere.enabled) return 0;
  const eligibleShare = clamp(inputs.ere.eligibleShare);
  return homeKwhPerMonth * eligibleShare * inputs.ere.creditPerKwh - inputs.ere.monthlyFee;
}

function scenarioA(inputs: InputState): ScenarioResult {
  const cappedBase = Math.min(inputs.lease.listPrice, inputs.lease.additionalTaxCap) * inputs.lease.additionalTaxRate;
  const aboveCapBase = Math.max(inputs.lease.listPrice - inputs.lease.additionalTaxCap, 0) * inputs.lease.additionalTaxRateAboveCap;
  const taxableBaseYear = cappedBase + aboveCapBase;
  const bijtellingTaxPerMonth = monthly(taxableBaseYear * inputs.general.marginalTaxRate);

  const energy = energyCostPerMonth(inputs);
  const chargingCost = inputs.lease.chargingCoveredByEmployer ? 0 : energy.total;
  const mobilityBudgetCredit = inputs.lease.alsoReceiveMobilityBudget ? mobilityBudgetNetPerMonth(inputs) : 0;

  const breakdown = [
    { label: 'bijtelling_tax', amountPerMonth: bijtellingTaxPerMonth },
    { label: 'employee_contribution', amountPerMonth: inputs.lease.employeeContributionPerMonth },
    { label: 'charging_cost_lease', amountPerMonth: chargingCost },
    { label: 'mobility_budget_optional', amountPerMonth: -mobilityBudgetCredit }
  ];

  const netPerMonth = breakdown.reduce((sum, x) => sum + x.amountPerMonth, 0);
  return { key: 'A', title: 'A', netPerMonth, totalHorizon: netPerMonth * inputs.general.horizonMonths, breakdown };
}

function scenarioB(inputs: InputState): ScenarioResult {
  const energy = energyCostPerMonth(inputs);
  const ereCredit = ereCreditPerMonth(inputs, energy.homeKwh);

  const principal = Math.max(inputs.ownEv.purchasePrice - inputs.ownEv.downPayment, 0);
  const financeMonthly = inputs.ownEv.financingEnabled
    ? financePayment(principal, inputs.ownEv.apr, inputs.ownEv.financingMonths)
    : principal / Math.max(inputs.general.horizonMonths, 1);

  const residual =
    inputs.ownEv.residualValueMode === 'percent'
      ? inputs.ownEv.purchasePrice * clamp(inputs.ownEv.residualValuePercent)
      : inputs.ownEv.residualValueAmount;

  const depreciationPerMonth = (inputs.ownEv.purchasePrice - residual) / Math.max(inputs.general.horizonMonths, 1);
  const stationDepPerMonth = inputs.ownEv.chargingStationCost / Math.max(inputs.ownEv.chargingStationDepreciationMonths, 1);

  const breakdown = [
    { label: 'depreciation', amountPerMonth: depreciationPerMonth },
    { label: 'financing', amountPerMonth: financeMonthly },
    { label: 'insurance', amountPerMonth: inputs.ownEv.insurancePerMonth },
    { label: 'mrb', amountPerMonth: inputs.ownEv.mrbPerMonth },
    { label: 'maintenance', amountPerMonth: inputs.ownEv.maintenancePerMonth },
    { label: 'charging_cost', amountPerMonth: energy.total },
    { label: 'station_depreciation', amountPerMonth: stationDepPerMonth },
    { label: 'ere_credit', amountPerMonth: -ereCredit },
    { label: 'mobility_budget_net', amountPerMonth: -mobilityBudgetNetPerMonth(inputs) },
    { label: 'km_allowance', amountPerMonth: -taxFreeKmCreditPerMonth(inputs) }
  ];

  const netPerMonth = breakdown.reduce((sum, x) => sum + x.amountPerMonth, 0);
  return { key: 'B', title: 'B', netPerMonth, totalHorizon: netPerMonth * inputs.general.horizonMonths, breakdown };
}

function scenarioC(inputs: InputState): ScenarioResult {
  const energy = energyCostPerMonth(inputs);
  const ereCredit = ereCreditPerMonth(inputs, energy.homeKwh);
  const annualExtraKm = Math.max(inputs.energy.totalKmPerYear - inputs.privateLease.includedKmPerYear, 0);
  const extraKmCostPerMonth = monthly(annualExtraKm * inputs.privateLease.extraKmPrice);

  const fallbackInsurance = inputs.privateLease.includesInsurance ? 0 : inputs.ownEv.insurancePerMonth;
  const fallbackMrb = inputs.privateLease.includesMrb ? 0 : inputs.ownEv.mrbPerMonth;
  const fallbackMaintenance = inputs.privateLease.includesMaintenance ? 0 : inputs.ownEv.maintenancePerMonth;

  const breakdown = [
    { label: 'lease_monthly', amountPerMonth: inputs.privateLease.monthlyLeaseCost },
    { label: 'extra_km_cost', amountPerMonth: extraKmCostPerMonth },
    { label: 'insurance_not_included', amountPerMonth: fallbackInsurance },
    { label: 'mrb_not_included', amountPerMonth: fallbackMrb },
    { label: 'maintenance_not_included', amountPerMonth: fallbackMaintenance },
    { label: 'charging_cost', amountPerMonth: energy.total },
    { label: 'ere_credit', amountPerMonth: -ereCredit },
    { label: 'mobility_budget_net', amountPerMonth: -mobilityBudgetNetPerMonth(inputs) },
    { label: 'km_allowance', amountPerMonth: -taxFreeKmCreditPerMonth(inputs) }
  ];

  const netPerMonth = breakdown.reduce((sum, x) => sum + x.amountPerMonth, 0);
  return { key: 'C', title: 'C', netPerMonth, totalHorizon: netPerMonth * inputs.general.horizonMonths, breakdown };
}

export function calculateComparison(inputs: InputState): ComparisonResult {
  const scenarios = [scenarioA(inputs), scenarioB(inputs), scenarioC(inputs)];
  const cheapest = [...scenarios].sort((a, b) => a.totalHorizon - b.totalHorizon)[0].key;
  return { scenarios, cheapestScenarioKey: cheapest };
}
