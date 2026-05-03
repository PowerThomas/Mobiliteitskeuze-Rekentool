/**
 * Playwright e2e tests for Mobiliteitskeuze Rekentool
 *
 * Expected values (default inputs) are derived from the same calculation logic
 * as src/lib/calculations.ts. See the breakdown comments below each test.
 *
 * Default inputs (src/lib/defaults.ts):
 *   marginalTaxRate=0.37, horizonMonths=48
 *   mobilityBudget=€900 bruto → net €567/m
 *   taxFreeKmCredit=7000km × €0.23 / 12 → €134.17/m
 *   energy: 25 000km, 17.5kWh/100km, 70% home (€0.31) / 30% public (€0.55) → €139.27/m
 *   ERE: 0.9 eligible × homeKwh × €0.08 − €5 fee → €13.38/m credit
 *
 * Scenario A: bijtelling=min(42000,30000)×0.18×0.37/12 + €125 → €291.50/m → €13.992 horizon
 * Scenario B: dep+fin+insurance+MRB+maintenance+energy+stationDep−ERE−budget−km → €381.88/m → €18.330 horizon
 * Scenario C: €620+extraKm(€83.33)+energy−ERE−budget−km → €128.06/m → €6.147 horizon  ← cheapest
 *
 * NOTE: Results are on wizard step 6 (last step). All result tests call goToStep(page, 6) first.
 */

import { expect, test, type Page } from '@playwright/test';

// Pin locale to 'nl' before every navigation so Dutch text is stable across all tests.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('locale', 'nl'));
});

/** Navigate forward by clicking "Volgende →" n times. */
async function goToStep(page: Page, n: number) {
  for (let i = 0; i < n; i++) {
    await page.getByRole('button', { name: 'Volgende →' }).click();
  }
}

test.describe('Page structure', () => {
  test('page title is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Mobiliteitskeuze Rekentool');
  });

  test('wizard starts at step 1 of 7', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Stap 1 van 7')).toBeVisible();
  });

  test('wizard advances to step 2 when clicking Volgende', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Volgende →' }).click();
    await expect(page.getByText('Stap 2 van 7')).toBeVisible();
  });
});

test.describe('Default scenario results', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await goToStep(page, 6);
  });

  test('scenario A shows correct net per month (bijtelling 18%)', async ({ page }) => {
    // min(42000,30000)*0.18*0.37/12 + 125 = 166.50 + 125 = 291.50 → € 292
    const card = page.locator('article').filter({ hasText: 'A · Zakelijke lease EV' });
    await expect(card.locator('p.text-xl')).toContainText('€ 292');
  });

  test('scenario A shows correct total over horizon', async ({ page }) => {
    // 291.50 × 48 = 13 992 → nl-NL: € 13.992
    const card = page.locator('article').filter({ hasText: 'A · Zakelijke lease EV' });
    await expect(card.locator('p.text-sm').first()).toContainText('€ 13.992');
  });

  test('scenario B shows correct net per month', async ({ page }) => {
    const card = page.locator('article').filter({ hasText: 'B · Mobiliteitsbudget + eigen EV' });
    await expect(card.locator('p.text-xl')).toContainText('€ 382');
  });

  test('scenario B shows correct total over horizon', async ({ page }) => {
    const card = page.locator('article').filter({ hasText: 'B · Mobiliteitsbudget + eigen EV' });
    await expect(card.locator('p.text-sm').first()).toContainText('€ 18.330');
  });

  test('scenario C shows correct net per month', async ({ page }) => {
    const card = page.locator('article').filter({ hasText: 'C · Mobiliteitsbudget + private lease EV' });
    await expect(card.locator('p.text-xl')).toContainText('€ 128');
  });

  test('scenario C shows correct total over horizon', async ({ page }) => {
    const card = page.locator('article').filter({ hasText: 'C · Mobiliteitsbudget + private lease EV' });
    await expect(card.locator('p.text-sm').first()).toContainText('€ 6.147');
  });

  test('scenario C is highlighted as cheapest', async ({ page }) => {
    const card = page.locator('article').filter({ hasText: 'C · Mobiliteitsbudget + private lease EV' });
    await expect(card).toHaveClass(/bg-emerald-100/);
    await expect(card.getByText('Meest voordelig')).toBeVisible();
  });

  test('scenarios A and B are not highlighted', async ({ page }) => {
    const cardA = page.locator('article').filter({ hasText: 'A · Zakelijke lease EV' });
    const cardB = page.locator('article').filter({ hasText: 'B · Mobiliteitsbudget + eigen EV' });
    await expect(cardA.getByText('Meest voordelig')).not.toBeVisible();
    await expect(cardB.getByText('Meest voordelig')).not.toBeVisible();
  });
});

test.describe('Breakdown lines (default inputs)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await goToStep(page, 6);
  });

  test('scenario A breakdown: bijtelling ≈ € 167', async ({ page }) => {
    // min(42000,30000)*0.18*0.37/12 = 5400*0.37/12 = €166.50 → € 167
    const section = page.locator('div').filter({ hasText: /Breakdown A · Zakelijke lease EV/ }).last();
    await expect(section.locator('li').filter({ hasText: 'Bijtelling: extra belasting' })).toContainText('€ 167');
  });

  test('scenario A breakdown: eigen bijdrage = € 125', async ({ page }) => {
    const section = page.locator('div').filter({ hasText: /Breakdown A · Zakelijke lease EV/ }).last();
    await expect(section.locator('li').filter({ hasText: 'Eigen bijdrage lease' })).toContainText('€ 125');
  });

  test('scenario A breakdown: laadkosten = € 0 (covered by employer)', async ({ page }) => {
    const section = page.locator('div').filter({ hasText: /Breakdown A · Zakelijke lease EV/ }).last();
    await expect(section.locator('li').filter({ hasText: 'Laadkosten (indien niet gedekt)' })).toContainText('€ 0');
  });

  test('scenario B breakdown: ERE-credit is shown as credit (green)', async ({ page }) => {
    // ereCredit = 255.21kWh × 0.9 × €0.08 − €5 = €13.38 credit → displayed negative
    const section = page.locator('div').filter({ hasText: /Breakdown B · Mobiliteitsbudget \+ eigen EV/ }).last();
    const ereRow = section.locator('li').filter({ hasText: 'ERE-credit' });
    await expect(ereRow.locator('span').last()).toHaveClass(/text-emerald-700/);
  });

  test('scenario C breakdown: meer-km kosten ≈ € 83', async ({ page }) => {
    // (25000-15000)*0.1/12 = 1000/12 = €83.33
    const section = page.locator('div').filter({ hasText: /Breakdown C · Mobiliteitsbudget \+ private lease EV/ }).last();
    await expect(section.locator('li').filter({ hasText: 'Meer-km kosten' })).toContainText('€ 83');
  });

  test('scenario C breakdown: private lease maandbedrag = € 620', async ({ page }) => {
    const section = page.locator('div').filter({ hasText: /Breakdown C · Mobiliteitsbudget \+ private lease EV/ }).last();
    await expect(section.locator('li').filter({ hasText: 'Private lease maandbedrag' })).toContainText('€ 620');
  });
});

test.describe('Input changes affect results', () => {
  const parse = (s: string | null) =>
    parseFloat((s ?? '').replace(/[^0-9,\-]/g, '').replace(',', '.'));

  test('enabling "toch mobiliteitsbudget" reduces scenario A cost', async ({ page }) => {
    await page.goto('/');
    // Enable advanced mode first (this field is hidden in simple mode)
    await page.getByRole('button', { name: 'Geavanceerd' }).click();
    // Step 3 = Scenario A inputs
    await goToStep(page, 3);
    await page.getByLabel('Toch mobiliteitsbudget ontvangen').check();
    // Steps 4, 5, 6 to reach results
    await goToStep(page, 3);

    const card = page.locator('article').filter({ hasText: 'A · Zakelijke lease EV' });
    const after = await card.locator('p.text-xl').textContent();
    // €292 − €567 (budget credit) → well below 0
    expect(parse(after)).toBeLessThan(292);
  });

  test('disabling "laadkosten door werkgever" increases scenario A cost', async ({ page }) => {
    await page.goto('/');
    await goToStep(page, 3);
    await page.getByLabel('Laadkosten door werkgever gedekt').uncheck();
    await goToStep(page, 3);

    const card = page.locator('article').filter({ hasText: 'A · Zakelijke lease EV' });
    const after = await card.locator('p.text-xl').textContent();
    // adds energy cost ≈ €139, so A goes from €292 to ≈€431
    expect(parse(after)).toBeGreaterThan(292);
  });

  test('disabling ERE increases scenario B and C costs', async ({ page }) => {
    await page.goto('/');
    // Step 2 = Rijden & laden (contains ERE toggle)
    await goToStep(page, 2);
    await page.getByLabel('ERE actief').uncheck();
    // Steps 3, 4, 5, 6 to reach results
    await goToStep(page, 4);

    const cardB = page.locator('article').filter({ hasText: 'B · Mobiliteitsbudget + eigen EV' });
    const cardC = page.locator('article').filter({ hasText: 'C · Mobiliteitsbudget + private lease EV' });
    const afterB = await cardB.locator('p.text-xl').textContent();
    const afterC = await cardC.locator('p.text-xl').textContent();
    // ERE credit was €13.38; removing it increases both costs
    expect(parse(afterB)).toBeGreaterThan(382);
    expect(parse(afterC)).toBeGreaterThan(128);
  });

  test('disabling ERE does NOT change scenario A cost', async ({ page }) => {
    await page.goto('/');
    await goToStep(page, 2);
    await page.getByLabel('ERE actief').uncheck();
    await goToStep(page, 4);

    const cardA = page.locator('article').filter({ hasText: 'A · Zakelijke lease EV' });
    await expect(cardA.locator('p.text-xl')).toContainText('€ 292');
  });

  test('reducing lease list price below cap reduces scenario A bijtelling', async ({ page }) => {
    await page.goto('/');
    await goToStep(page, 3);
    const input = page.getByLabel('Cataloguswaarde (incl. BTW)');
    await input.fill('20000');
    await input.blur();
    await goToStep(page, 3);

    const card = page.locator('article').filter({ hasText: 'A · Zakelijke lease EV' });
    const after = await card.locator('p.text-xl').textContent();
    // bijtelling: 20000*0.18*0.37/12 = €111 + €125 = €236 < €292
    expect(parse(after)).toBeLessThan(292);
  });
});

test.describe('CSV export', () => {
  test('clicking export triggers a CSV download', async ({ page }) => {
    await page.goto('/');
    await goToStep(page, 6);
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /exporteer csv/i }).click(),
    ]);
    expect(download.suggestedFilename()).toBe('mobiliteitsvergelijking.csv');
  });
});
