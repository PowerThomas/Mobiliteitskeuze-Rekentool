import { calculateMobilityCosts, defaultInput } from '@/utils/calc';

describe('calculateMobilityCosts', () => {
  it('calculates monthly costs from input', () => {
    const result = calculateMobilityCosts(defaultInput);

    expect(result).toEqual({
      carMonthlyCost: 84,
      publicTransportMonthlyCost: 190,
      bikeMonthlyCost: 25,
      bestOption: 'Fiets'
    });
  });

  it('marks OV as best option when OV is cheapest', () => {
    const result = calculateMobilityCosts({
      ...defaultInput,
      publicTransportCostPerDay: 1,
      bikeMaintenancePerMonth: 60
    });

    expect(result.bestOption).toBe('OV');
  });
});
