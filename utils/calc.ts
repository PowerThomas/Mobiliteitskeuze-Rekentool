import { MobilityInput, MobilityResult } from '@/types';

export const defaultInput: MobilityInput = {
  workDaysPerMonth: 20,
  commuteKmPerDay: 30,
  fuelPricePerLiter: 2.1,
  consumptionKmPerLiter: 15,
  publicTransportCostPerDay: 9.5,
  bikeMaintenancePerMonth: 25
};

const round = (value: number): number => Math.round(value * 100) / 100;

export function calculateMobilityCosts(input: MobilityInput): MobilityResult {
  const fuelLitersPerMonth = (input.workDaysPerMonth * input.commuteKmPerDay) / input.consumptionKmPerLiter;
  const carMonthlyCost = round(fuelLitersPerMonth * input.fuelPricePerLiter);
  const publicTransportMonthlyCost = round(input.workDaysPerMonth * input.publicTransportCostPerDay);
  const bikeMonthlyCost = round(input.bikeMaintenancePerMonth);

  const options: Array<{ name: MobilityResult['bestOption']; cost: number }> = [
    { name: 'Auto', cost: carMonthlyCost },
    { name: 'OV', cost: publicTransportMonthlyCost },
    { name: 'Fiets', cost: bikeMonthlyCost }
  ];

  const bestOption = options.reduce((lowest, current) =>
    current.cost < lowest.cost ? current : lowest
  ).name;

  return {
    carMonthlyCost,
    publicTransportMonthlyCost,
    bikeMonthlyCost,
    bestOption
  };
}
