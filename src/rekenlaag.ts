export function calculateBijtellingCap(annualBijtelling: number, fiscalCapPerYear: number): number {
  return Math.min(annualBijtelling, fiscalCapPerYear);
}

export function pmt(rate: number, numberOfPeriods: number, presentValue: number): number {
  if (numberOfPeriods <= 0) {
    throw new Error('numberOfPeriods moet groter zijn dan 0');
  }

  if (rate === 0) {
    return -(presentValue / numberOfPeriods);
  }

  const factor = (1 + rate) ** numberOfPeriods;
  return -((rate * presentValue * factor) / (factor - 1));
}

export function calculateChargingCost(
  totalKwh: number,
  homeShare: number,
  homePricePerKwh: number,
  publicPricePerKwh: number
): number {
  if (homeShare < 0 || homeShare > 1) {
    throw new Error('homeShare moet tussen 0 en 1 liggen');
  }

  const publicShare = 1 - homeShare;
  return totalKwh * homeShare * homePricePerKwh + totalKwh * publicShare * publicPricePerKwh;
}

export function calculateEreNetMonthly(totalMonthlyBenefit: number, eligibleShare: number): number {
  if (eligibleShare < 0 || eligibleShare > 1) {
    throw new Error('eligibleShare moet tussen 0 en 1 liggen');
  }

  return totalMonthlyBenefit * eligibleShare;
}

export function calculateScenarioTotal(monthlyNet: number, horizonMonths: number): number {
  return monthlyNet * horizonMonths;
}
