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
});
