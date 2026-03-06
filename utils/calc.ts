import type {
  BreakdownItem,
  CalcBaseInput,
  ChargingCostResult,
  EreNetResult,
  ScenarioInput,
  ScenarioKind,
  ScenarioResult,
} from '../types';

const MONTHS = 12;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function annualToMonthly(amountAnnual: number): number {
  return amountAnnual / MONTHS;
}

function pushCost(items: BreakdownItem[], key: string, label: string, monthlyAmount: number, note?: string): void {
  const amount = Math.max(0, monthlyAmount);
  items.push({
    key,
    label,
    monthlyAmount: round2(amount),
    annualAmount: round2(amount * MONTHS),
    type: 'cost',
    note,
  });
}

function pushCredit(
  items: BreakdownItem[],
  key: string,
  label: string,
  monthlyCredit: number,
  type: 'credit' | 'reimbursement' = 'credit',
  note?: string,
): void {
  const amount = Math.max(0, monthlyCredit);
  items.push({
    key,
    label,
    monthlyAmount: round2(-amount),
    annualAmount: round2(-amount * MONTHS),
    type,
    note,
  });
}

/**
 * Excel-compatible PMT implementation.
 * Returns a positive monthly payment amount for a positive pv.
 */
export function pmt(rate: number, nper: number, pv: number): number {
  if (nper <= 0) {
    throw new Error('nper must be greater than 0');
  }

  if (rate === 0) {
    return pv / nper;
  }

  const factor = (1 + rate) ** nper;
  return (pv * rate * factor) / (factor - 1);
}

export function calcChargingCosts(input: CalcBaseInput): ChargingCostResult {
  const annualKmTotal = input.annualKmBusiness + input.annualKmPrivate;
  const annualKwhTotal = (annualKmTotal * input.kWhPer100km) / 100;

  const homeShare = Math.min(1, Math.max(0, input.homeChargingShare));
  const publicShare = 1 - homeShare;

  const homeAnnual = annualKwhTotal * homeShare * input.homePricePerKwh;
  const publicAnnual = annualKwhTotal * publicShare * input.publicPricePerKwh;
  const totalAnnual = homeAnnual + publicAnnual;

  return {
    totalMonthly: round2(annualToMonthly(totalAnnual)),
    totalAnnual: round2(totalAnnual),
    homeMonthly: round2(annualToMonthly(homeAnnual)),
    publicMonthly: round2(annualToMonthly(publicAnnual)),
    homeAnnual: round2(homeAnnual),
    publicAnnual: round2(publicAnnual),
    annualKwhTotal: round2(annualKwhTotal),
  };
}

export function calcEreNetMonthly(input: ScenarioInput): EreNetResult {
  const businessKwhAnnual = (input.annualKmBusiness * input.kWhPer100km) / 100;
  const homeBusinessKwhAnnual = businessKwhAnnual * Math.min(1, Math.max(0, input.homeChargingShare));

  const reimbursementAnnual = homeBusinessKwhAnnual * input.ereRatePerKwh;
  const businessHomeChargeCostAnnual = homeBusinessKwhAnnual * input.homePricePerKwh;
  const annualNet = reimbursementAnnual - businessHomeChargeCostAnnual;

  const notes: string[] = [];
  if (input.homeChargingShare < 0.2) {
    notes.push('Lage thuislaadshare: ERE-effect is beperkt bij weinig thuisladen.');
  }
  if (annualNet < 0) {
    notes.push('ERE-netto is negatief: vergoeding dekt thuislaadkosten voor zakelijke kilometers niet volledig.');
  }

  return {
    monthlyNet: round2(annualToMonthly(annualNet)),
    annualNet: round2(annualNet),
    reimbursementMonthly: round2(annualToMonthly(reimbursementAnnual)),
    reimbursementAnnual: round2(reimbursementAnnual),
    businessHomeChargeCostMonthly: round2(annualToMonthly(businessHomeChargeCostAnnual)),
    businessHomeChargeCostAnnual: round2(businessHomeChargeCostAnnual),
    notes,
  };
}

function commonSignals(input: ScenarioInput, monthlyNet: number): { notes: string[]; warnings: string[]; annualKmTotal: number } {
  const annualKmTotal = input.annualKmBusiness + input.annualKmPrivate;
  const notes: string[] = [];
  const warnings: string[] = [];

  if (annualKmTotal > 80000) {
    warnings.push('Jaarlijkse kilometers zijn hoger dan 80.000; controleer aannames en slijtage-effecten.');
  }

  if (input.kWhPer100km < 10 || input.kWhPer100km > 30) {
    warnings.push('kWh/100km ligt buiten de verwachte bandbreedte (10-30); controleer efficiëntie-invoer.');
  }

  if (monthlyNet < 0) {
    notes.push('Maandelijks nettoresultaat is negatief (voordeel / teruggaaf).');
    warnings.push('monthlyNet < 0: dit scenario levert netto een maandelijkse credit op.');
  }

  return { notes, warnings, annualKmTotal };
}

function finalizeScenario(
  scenario: ScenarioKind,
  input: ScenarioInput,
  breakdown: BreakdownItem[],
  extraNotes: string[] = [],
  extraWarnings: string[] = [],
): ScenarioResult {
  const monthlyNet = round2(breakdown.reduce((sum, item) => sum + item.monthlyAmount, 0));
  const annualNet = round2(monthlyNet * MONTHS);

  const common = commonSignals(input, monthlyNet);

  return {
    scenario,
    monthlyNet,
    annualNet,
    annualKmTotal: common.annualKmTotal,
    breakdown,
    notes: [...extraNotes, ...common.notes],
    warnings: [...extraWarnings, ...common.warnings],
  };
}

/**
 * Scenario A
 * Netto = energiekosten (+ optionele vaste kosten) - vergoedingen/credits.
 */
export function calcScenarioA(input: ScenarioInput): ScenarioResult {
  const breakdown: BreakdownItem[] = [];
  const charging = calcChargingCosts(input);

  if (input.toggles.includeEnergyCosts) {
    pushCost(breakdown, 'charging_home', 'Laadkosten thuis', charging.homeMonthly);
    pushCost(breakdown, 'charging_public', 'Laadkosten publiek', charging.publicMonthly);
  }

  if (input.toggles.includePublicPass) {
    pushCost(breakdown, 'public_pass', 'Publieke laadpas', input.publicPassMonthly);
  }

  if (input.toggles.includeEreCompensation) {
    const ere = calcEreNetMonthly(input);
    pushCredit(
      breakdown,
      'ere_reimbursement',
      'ERE-vergoeding thuisladen zakelijk',
      ere.reimbursementMonthly,
      'reimbursement',
    );

    return finalizeScenario('A', input, breakdown, ere.notes);
  }

  return finalizeScenario('A', input, breakdown);
}

/**
 * Scenario B
 * Netto = lease + gebruikskosten - werkgeverbijdragen - vergoedingen.
 */
export function calcScenarioB(input: ScenarioInput): ScenarioResult {
  const breakdown: BreakdownItem[] = [];
  const charging = calcChargingCosts(input);
  const ere = calcEreNetMonthly(input);

  if (input.toggles.includeLeaseCost) {
    pushCost(breakdown, 'lease', 'Leasekosten', input.leaseCostMonthly);
  }

  if (input.toggles.includeEnergyCosts) {
    pushCost(breakdown, 'charging_home', 'Laadkosten thuis', charging.homeMonthly);
    pushCost(breakdown, 'charging_public', 'Laadkosten publiek', charging.publicMonthly);
  }

  if (input.toggles.includePublicPass) {
    pushCost(breakdown, 'public_pass', 'Publieke laadpas', input.publicPassMonthly);
  }

  if (input.toggles.includeEmployerContribution) {
    pushCredit(breakdown, 'employer_contribution', 'Werkgeversbijdrage', input.employerContributionMonthly);
  }

  if (input.toggles.includeMobilityBudget) {
    pushCredit(breakdown, 'mobility_budget', 'Mobiliteitsbudget', input.mobilityBudgetMonthly);
  }

  if (input.toggles.includeEreCompensation) {
    pushCredit(
      breakdown,
      'ere_reimbursement',
      'ERE-vergoeding thuisladen zakelijk',
      ere.reimbursementMonthly,
      'reimbursement',
    );
  }

  return finalizeScenario('B', input, breakdown, ere.notes);
}

/**
 * Scenario C
 * Netto = financiering + eigendomskosten + energie - declaraties/credits.
 */
export function calcScenarioC(input: ScenarioInput): ScenarioResult {
  const breakdown: BreakdownItem[] = [];
  const charging = calcChargingCosts(input);
  const ere = calcEreNetMonthly(input);

  if (input.toggles.includeFinancing) {
    const financedPrincipal = Math.max(0, input.purchasePrice - input.downPayment);
    const monthlyRate = input.annualInterestRate / 12;
    const financingMonthly = pmt(monthlyRate, input.financeMonths, financedPrincipal);
    pushCost(breakdown, 'financing', 'Financiering (PMT)', financingMonthly);
  }

  if (input.toggles.includeInsurance) {
    pushCost(breakdown, 'insurance', 'Verzekering', input.insuranceMonthly);
  }

  if (input.toggles.includeRoadTax) {
    pushCost(breakdown, 'road_tax', 'Motorrijtuigenbelasting', input.roadTaxMonthly);
  }

  if (input.toggles.includeMaintenance) {
    pushCost(breakdown, 'maintenance', 'Onderhoud', input.maintenanceMonthly);
  }

  if (input.toggles.includeEnergyCosts) {
    pushCost(breakdown, 'charging_home', 'Laadkosten thuis', charging.homeMonthly);
    pushCost(breakdown, 'charging_public', 'Laadkosten publiek', charging.publicMonthly);
  }

  if (input.toggles.includeMileageAllowance) {
    const monthlyAllowance = annualToMonthly(input.annualKmBusiness * input.mileageAllowancePerKm);
    pushCredit(breakdown, 'mileage_allowance', 'Kilometervergoeding zakelijk', monthlyAllowance, 'reimbursement');
  }

  if (input.toggles.includeEmployerContribution) {
    pushCredit(breakdown, 'employer_contribution', 'Werkgeversbijdrage', input.employerContributionMonthly);
  }

  if (input.toggles.includeMobilityBudget) {
    pushCredit(breakdown, 'mobility_budget', 'Mobiliteitsbudget', input.mobilityBudgetMonthly);
  }

  if (input.toggles.includeEreCompensation) {
    pushCredit(
      breakdown,
      'ere_reimbursement',
      'ERE-vergoeding thuisladen zakelijk',
      ere.reimbursementMonthly,
      'reimbursement',
    );
  }

  return finalizeScenario('C', input, breakdown, ere.notes);
}
