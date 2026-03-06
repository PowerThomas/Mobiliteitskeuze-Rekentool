export type ScenarioKind = 'A' | 'B' | 'C';

export type BreakdownType = 'cost' | 'credit' | 'reimbursement';

export interface BreakdownItem {
  key: string;
  label: string;
  /**
   * Positive for costs, negative for credits/reimbursements.
   */
  monthlyAmount: number;
  annualAmount: number;
  type: BreakdownType;
  note?: string;
}

export interface ChargingCostResult {
  totalMonthly: number;
  totalAnnual: number;
  homeMonthly: number;
  publicMonthly: number;
  homeAnnual: number;
  publicAnnual: number;
  annualKwhTotal: number;
}

export interface EreNetResult {
  monthlyNet: number;
  annualNet: number;
  reimbursementMonthly: number;
  reimbursementAnnual: number;
  businessHomeChargeCostMonthly: number;
  businessHomeChargeCostAnnual: number;
  notes: string[];
}

export interface CalcBaseInput {
  annualKmBusiness: number;
  annualKmPrivate: number;
  kWhPer100km: number;
  homeChargingShare: number;
  homePricePerKwh: number;
  publicPricePerKwh: number;
}

export interface CompensationInput {
  ereRatePerKwh: number;
  mileageAllowancePerKm: number;
  employerContributionMonthly: number;
  mobilityBudgetMonthly: number;
}

export interface FixedCostInput {
  leaseCostMonthly: number;
  insuranceMonthly: number;
  roadTaxMonthly: number;
  maintenanceMonthly: number;
  publicPassMonthly: number;
}

export interface FinanceInput {
  purchasePrice: number;
  downPayment: number;
  annualInterestRate: number;
  financeMonths: number;
}

export interface ScenarioToggles {
  includeEnergyCosts: boolean;
  includeEreCompensation: boolean;
  includeMileageAllowance: boolean;
  includeEmployerContribution: boolean;
  includeMobilityBudget: boolean;
  includeLeaseCost: boolean;
  includeInsurance: boolean;
  includeRoadTax: boolean;
  includeMaintenance: boolean;
  includePublicPass: boolean;
  includeFinancing: boolean;
}

export interface ScenarioInput
  extends CalcBaseInput,
    CompensationInput,
    FixedCostInput,
    FinanceInput {
  toggles: ScenarioToggles;
}

export interface ScenarioResult {
  scenario: ScenarioKind;
  monthlyNet: number;
  annualNet: number;
  annualKmTotal: number;
  breakdown: BreakdownItem[];
  notes: string[];
  warnings: string[];
}
