import { describe, expect, it } from 'vitest';
import { calculateComparison } from '@/lib/calculations';
import { defaultInputs } from '@/lib/defaults';

describe('calculateComparison', () => {
  it('returns 3 scenarios and a cheapest key', () => {
    const result = calculateComparison(defaultInputs);
    expect(result.scenarios).toHaveLength(3);
    expect(['A', 'B', 'C']).toContain(result.cheapestScenarioKey);
  });

  it('increases cost when energy price rises sharply', () => {
    const low = calculateComparison(defaultInputs);
    const high = calculateComparison({
      ...defaultInputs,
      energy: { ...defaultInputs.energy, homeElectricityPricePerKwh: 0.8, publicElectricityPricePerKwh: 1 }
    });

    const bLow = low.scenarios.find((s) => s.key === 'B')!;
    const bHigh = high.scenarios.find((s) => s.key === 'B')!;
    expect(bHigh.netPerMonth).toBeGreaterThan(bLow.netPerMonth);
  });

  it('applies ERE as credit when enabled', () => {
    const withoutEre = calculateComparison({ ...defaultInputs, ere: { ...defaultInputs.ere, enabled: false } });
    const withEre = calculateComparison(defaultInputs);

    const cWithout = withoutEre.scenarios.find((s) => s.key === 'C')!;
    const cWith = withEre.scenarios.find((s) => s.key === 'C')!;
    expect(cWith.netPerMonth).toBeLessThan(cWithout.netPerMonth);
  });

  it('bijtelling uses two-tier rate when list price exceeds cap', () => {
    // €42.000 auto, cap €30.000 bij 16%, boven cap 22%, marginaal tarief 37,56%
    // grondslag = (30.000 * 0.16) + (12.000 * 0.22) = 4.800 + 2.640 = 7.440/jaar
    // netto bijtelling = 7.440 * 0.3756 / 12 ≈ 232.95/mnd
    const inputs = {
      ...defaultInputs,
      general: { ...defaultInputs.general, marginalTaxRate: 0.3756 },
      lease: {
        ...defaultInputs.lease,
        listPrice: 42000,
        additionalTaxRate: 0.16,
        additionalTaxRateAboveCap: 0.22,
        additionalTaxCap: 30000,
        employeeContributionPerMonth: 0,
        chargingCoveredByEmployer: true,
        alsoReceiveMobilityBudget: false,
      },
    };
    const result = calculateComparison(inputs);
    const a = result.scenarios.find((s) => s.key === 'A')!;
    expect(a.netPerMonth).toBeCloseTo((7440 * 0.3756) / 12, 1);
  });

  it('bijtelling applies only lower rate when list price is at or below cap', () => {
    // €25.000 auto, onder cap van €30.000 → alleen 16% tarief
    // grondslag = 25.000 * 0.16 = 4.000/jaar
    // netto bijtelling = 4.000 * 0.3756 / 12 ≈ 125.20/mnd
    const inputs = {
      ...defaultInputs,
      general: { ...defaultInputs.general, marginalTaxRate: 0.3756 },
      lease: {
        ...defaultInputs.lease,
        listPrice: 25000,
        additionalTaxRate: 0.16,
        additionalTaxRateAboveCap: 0.22,
        additionalTaxCap: 30000,
        employeeContributionPerMonth: 0,
        chargingCoveredByEmployer: true,
        alsoReceiveMobilityBudget: false,
      },
    };
    const result = calculateComparison(inputs);
    const a = result.scenarios.find((s) => s.key === 'A')!;
    expect(a.netPerMonth).toBeCloseTo((4000 * 0.3756) / 12, 1);
  });
});
