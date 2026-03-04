export type BudgetMode = 'netto' | 'bruto';

export interface InputState {
  general: {
    marginalTaxRate: number;
    horizonMonths: number;
  };
  mobility: {
    mobilityBudgetAmount: number;
    mobilityBudgetMode: BudgetMode;
    taxFreeAllowanceEnabled: boolean;
    taxFreeAllowancePerKm: number;
    reimbursableKmPerYear: number;
  };
  energy: {
    totalKmPerYear: number;
    commuteKmPerYear: number;
    businessKmPerYear: number;
    kwhPer100Km: number;
    homeChargingShare: number;
    homeElectricityPricePerKwh: number;
    publicElectricityPricePerKwh: number;
  };
  ere: {
    enabled: boolean;
    creditPerKwh: number;
    eligibleShare: number;
    monthlyFee: number;
  };
  lease: {
    listPrice: number;
    employeeContributionPerMonth: number;
    additionalTaxRate: number;
    additionalTaxCap: number;
    chargingCoveredByEmployer: boolean;
    alsoReceiveMobilityBudget: boolean;
  };
  ownEv: {
    purchasePrice: number;
    downPayment: number;
    financingEnabled: boolean;
    apr: number;
    financingMonths: number;
    residualValueMode: 'percent' | 'amount';
    residualValuePercent: number;
    residualValueAmount: number;
    insurancePerMonth: number;
    mrbPerMonth: number;
    maintenancePerMonth: number;
    chargingStationCost: number;
    chargingStationDepreciationMonths: number;
  };
  privateLease: {
    monthlyLeaseCost: number;
    includedKmPerYear: number;
    extraKmPrice: number;
    includesInsurance: boolean;
    includesMrb: boolean;
    includesMaintenance: boolean;
  };
}

export interface ScenarioResult {
  key: 'A' | 'B' | 'C';
  title: string;
  netPerMonth: number;
  totalHorizon: number;
  breakdown: Array<{ label: string; amountPerMonth: number }>;
}

export interface ComparisonResult {
  scenarios: ScenarioResult[];
  cheapestScenarioKey: 'A' | 'B' | 'C';
}
