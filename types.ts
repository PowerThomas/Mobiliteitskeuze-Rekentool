export type MobilityInput = {
  workDaysPerMonth: number;
  commuteKmPerDay: number;
  fuelPricePerLiter: number;
  consumptionKmPerLiter: number;
  publicTransportCostPerDay: number;
  bikeMaintenancePerMonth: number;
};

export type MobilityResult = {
  carMonthlyCost: number;
  publicTransportMonthlyCost: number;
  bikeMonthlyCost: number;
  bestOption: 'Auto' | 'OV' | 'Fiets';
};
