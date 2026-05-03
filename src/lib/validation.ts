import { InputState } from './types';

export type ValidationErrors = Record<string, string>;

export function getValidationErrors(inputs: InputState): ValidationErrors {
  const errors: ValidationErrors = {};

  // km coherence: woon-werk + zakelijk must not exceed total
  if (inputs.energy.commuteKmPerYear + inputs.energy.businessKmPerYear > inputs.energy.totalKmPerYear) {
    errors['energy.totalKmPerYear'] = 'err_km_exceeds_total';
  }

  // Down payment must be strictly less than purchase price
  if (inputs.ownEv.downPayment > 0 && inputs.ownEv.downPayment >= inputs.ownEv.purchasePrice) {
    errors['ownEv.downPayment'] = 'err_downpayment_exceeds_price';
  }

  // Residual value must be less than purchase price
  if (inputs.ownEv.residualValueMode === 'percent' && inputs.ownEv.residualValuePercent >= 1) {
    errors['ownEv.residualValuePercent'] = 'err_residual_100pct';
  }
  if (
    inputs.ownEv.residualValueMode === 'amount' &&
    inputs.ownEv.residualValueAmount >= inputs.ownEv.purchasePrice
  ) {
    errors['ownEv.residualValueAmount'] = 'err_residual_exceeds_price';
  }

  // Financing duration should not exceed comparison horizon
  if (inputs.ownEv.financingEnabled && inputs.ownEv.financingMonths > inputs.general.horizonMonths) {
    errors['ownEv.financingMonths'] = 'err_financing_exceeds_horizon';
  }

  return errors;
}
