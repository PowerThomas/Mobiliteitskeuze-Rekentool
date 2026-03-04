import { InputState } from './types';

export const defaultInputs: InputState = {
  general: {
    marginalTaxRate: 0.37,
    horizonMonths: 48
  },
  mobility: {
    mobilityBudgetAmount: 900,
    mobilityBudgetMode: 'bruto',
    taxFreeAllowanceEnabled: true,
    taxFreeAllowancePerKm: 0.23,
    reimbursableKmPerYear: 7000
  },
  energy: {
    totalKmPerYear: 25000,
    commuteKmPerYear: 12000,
    businessKmPerYear: 8000,
    kwhPer100Km: 17.5,
    homeChargingShare: 0.7,
    homeElectricityPricePerKwh: 0.31,
    publicElectricityPricePerKwh: 0.55
  },
  ere: {
    enabled: true,
    creditPerKwh: 0.08,
    eligibleShare: 0.9,
    monthlyFee: 5
  },
  lease: {
    listPrice: 42000,
    employeeContributionPerMonth: 125,
    additionalTaxRate: 0.17,
    additionalTaxCap: 30000,
    chargingCoveredByEmployer: true,
    alsoReceiveMobilityBudget: false
  },
  ownEv: {
    purchasePrice: 28000,
    downPayment: 5000,
    financingEnabled: true,
    apr: 0.06,
    financingMonths: 60,
    residualValueMode: 'percent',
    residualValuePercent: 0.45,
    residualValueAmount: 9000,
    insurancePerMonth: 85,
    mrbPerMonth: 25,
    maintenancePerMonth: 55,
    chargingStationCost: 1600,
    chargingStationDepreciationMonths: 60
  },
  privateLease: {
    monthlyLeaseCost: 620,
    includedKmPerYear: 15000,
    extraKmPrice: 0.1,
    includesInsurance: true,
    includesMrb: true,
    includesMaintenance: true
  }
};
