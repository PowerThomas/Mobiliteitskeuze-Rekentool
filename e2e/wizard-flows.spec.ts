/**
 * Phase 9 — wizard flow tests
 *
 * Covers:
 * - Back/next navigation through all 7 steps
 * - Input persistence across step navigation
 * - Validation error display
 * - Locale persistence (EN) on reload
 * - Live-preview bar visibility (steps 1–5 only)
 */

import { expect, test, type Page } from '@playwright/test';

// Pin locale to 'nl' for all tests except the explicit locale tests at the bottom.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('locale', 'nl'));
});

async function goForward(page: Page, n = 1) {
  for (let i = 0; i < n; i++) {
    await page.getByRole('button', { name: 'Volgende →' }).click();
  }
}

async function goBack(page: Page, n = 1) {
  for (let i = 0; i < n; i++) {
    await page.getByRole('button', { name: '← Vorige' }).click();
  }
}

// ---------------------------------------------------------------------------
// Back/next navigation
// ---------------------------------------------------------------------------
test.describe('Wizard navigation', () => {
  test('back button is absent on step 1 (welcome)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: '← Vorige' })).not.toBeVisible();
  });

  test('next button is absent on the last step (results)', async ({ page }) => {
    await page.goto('/');
    await goForward(page, 6);
    await expect(page.getByText('Stap 7 van 7')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Volgende →' })).not.toBeVisible();
  });

  test('clicking back from step 3 returns to step 2', async ({ page }) => {
    await page.goto('/');
    await goForward(page, 2);
    await expect(page.getByText('Stap 3 van 7')).toBeVisible();
    await goBack(page);
    await expect(page.getByText('Stap 2 van 7')).toBeVisible();
  });

  test('full round-trip: steps 1→7→1 via back navigation', async ({ page }) => {
    await page.goto('/');
    await goForward(page, 6);
    await expect(page.getByText('Stap 7 van 7')).toBeVisible();
    await goBack(page, 6);
    await expect(page.getByText('Stap 1 van 7')).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Input persistence across step transitions
// ---------------------------------------------------------------------------
test.describe('Input persistence', () => {
  test('mobility budget entered in step 1 persists after going forward and back', async ({ page }) => {
    await page.goto('/');
    await goForward(page);
    // Step 1 = Persoonlijk & werkgever — change mobility budget from 900 to 750
    const budgetInput = page.getByLabel('Mobiliteitsbudget p/m');
    await budgetInput.fill('750');
    await budgetInput.blur();

    // Navigate to step 2 then back to step 1
    await goForward(page);
    await goBack(page);

    await expect(page.getByLabel('Mobiliteitsbudget p/m')).toHaveValue('750');
  });

  test('total km changed in step 2 persists after navigating forward and back', async ({ page }) => {
    await page.goto('/');
    await goForward(page, 2);
    // Step 2 = Rijden & laden
    const kmInput = page.getByLabel('Totaal km/jaar');
    await kmInput.fill('30000');
    await kmInput.blur();

    await goForward(page);
    await goBack(page);

    await expect(page.getByLabel('Totaal km/jaar')).toHaveValue('30000');
  });
});

// ---------------------------------------------------------------------------
// Validation errors
// ---------------------------------------------------------------------------
test.describe('Validation errors', () => {
  test('km error: commute + business > total shows error on total km field', async ({ page }) => {
    await page.goto('/');
    // Enable advanced mode so commute/business fields are visible
    await page.getByRole('button', { name: 'Geavanceerd' }).click();
    await goForward(page, 2); // step 2 = Rijden & laden

    // Default: commute=12000, business=8000, total=25000 (OK)
    // Set commute to 24000 → sum 32000 > 25000 → error
    const commuteInput = page.getByLabel('Woon-werk km/jaar');
    await commuteInput.fill('24000');
    await commuteInput.blur();

    await expect(page.getByText('Woon-werk + zakelijk km overschrijdt het totaal')).toBeVisible();
  });

  test('km error disappears when total km is increased above sum', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Geavanceerd' }).click();
    await goForward(page, 2);

    const commuteInput = page.getByLabel('Woon-werk km/jaar');
    await commuteInput.fill('24000');
    await commuteInput.blur();
    await expect(page.getByText('Woon-werk + zakelijk km overschrijdt het totaal')).toBeVisible();

    const totalInput = page.getByLabel('Totaal km/jaar');
    await totalInput.fill('40000');
    await totalInput.blur();
    await expect(page.getByText('Woon-werk + zakelijk km overschrijdt het totaal')).not.toBeVisible();
  });

  test('down payment error: down payment ≥ purchase price shows error', async ({ page }) => {
    await page.goto('/');
    await goForward(page, 4); // step 4 = Scenario B — eigen EV

    // Default purchasePrice = 28000. Set downPayment to 30000.
    const downInput = page.getByLabel('Aanbetaling (€)');
    await downInput.fill('30000');
    await downInput.blur();

    await expect(page.getByText('Mag niet groter zijn dan de aankoopprijs')).toBeVisible();
  });

  test('down payment error disappears when amount is corrected', async ({ page }) => {
    await page.goto('/');
    await goForward(page, 4);

    const downInput = page.getByLabel('Aanbetaling (€)');
    await downInput.fill('30000');
    await downInput.blur();
    await expect(page.getByText('Mag niet groter zijn dan de aankoopprijs')).toBeVisible();

    await downInput.fill('5000');
    await downInput.blur();
    await expect(page.getByText('Mag niet groter zijn dan de aankoopprijs')).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Live-preview bar visibility (Phase 8)
// ---------------------------------------------------------------------------
test.describe('Live preview bar', () => {
  test('preview bar is absent on welcome step (step 1)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Vooruitblik')).not.toBeVisible();
  });

  test('preview bar is visible on step 2 and shows all three scenario pills', async ({ page }) => {
    await page.goto('/');
    await goForward(page);
    await expect(page.getByText('Vooruitblik')).toBeVisible();
    // All three scenario keys visible as pill labels
    const bar = page.locator('div').filter({ hasText: 'Vooruitblik' }).last();
    await expect(bar.getByText('A', { exact: true }).first()).toBeVisible();
    await expect(bar.getByText('B', { exact: true }).first()).toBeVisible();
    await expect(bar.getByText('C', { exact: true }).first()).toBeVisible();
  });

  test('preview bar is visible on step 6 (last input step)', async ({ page }) => {
    await page.goto('/');
    await goForward(page, 5);
    await expect(page.getByText('Vooruitblik')).toBeVisible();
  });

  test('preview bar is absent on results step (step 7)', async ({ page }) => {
    await page.goto('/');
    await goForward(page, 6);
    await expect(page.getByText('Vooruitblik')).not.toBeVisible();
  });

  test('cheapest scenario pill is highlighted in the preview bar', async ({ page }) => {
    await page.goto('/');
    await goForward(page);
    // Scenario C is cheapest by default; its pill should have emerald classes
    const bar = page.locator('div').filter({ hasText: 'Vooruitblik' }).last();
    const cPill = bar.locator('div').filter({ hasText: /^C/ }).first();
    await expect(cPill).toHaveClass(/bg-emerald-100/);
  });
});

// Locale persistence tests are in locale.spec.ts (no nl-pin needed there).
