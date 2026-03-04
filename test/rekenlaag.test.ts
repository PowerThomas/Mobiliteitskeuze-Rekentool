import {
  calculateBijtellingCap,
  calculateChargingCost,
  calculateEreNetMonthly,
  calculateScenarioTotal,
  pmt
} from '../src/rekenlaag';

describe('calculateBijtellingCap', () => {
  it('past een cap toe als de bijtelling hoger is dan de fiscale grens', () => {
    expect(calculateBijtellingCap(4200, 3500)).toBe(3500);
  });

  it('laat de waarde gelijk als de bijtelling onder de cap zit', () => {
    expect(calculateBijtellingCap(2800, 3500)).toBe(2800);
  });
});

describe('pmt', () => {
  it('berekent de lineaire aflossing als rate == 0', () => {
    expect(pmt(0, 12, 12000)).toBe(-1000);
  });

  it('berekent annuiteit als rate > 0', () => {
    const payment = pmt(0.01, 12, 10000);
    expect(payment).toBeCloseTo(-888.4878867834, 6);
  });
});

describe('calculateChargingCost', () => {
  it('berekent charging cost met split tussen thuis en publiek laden', () => {
    const total = calculateChargingCost(300, 0.6, 0.3, 0.7);
    expect(total).toBeCloseTo(138, 6);
  });
});

describe('calculateEreNetMonthly', () => {
  it('past eligible share toe op maandelijkse tegemoetkoming', () => {
    expect(calculateEreNetMonthly(250, 0.8)).toBeCloseTo(200, 6);
  });
});

describe('calculateScenarioTotal', () => {
  it('berekent scenario-totaal als monthlyNet * horizonMonths', () => {
    expect(calculateScenarioTotal(175, 36)).toBe(6300);
  });
});
