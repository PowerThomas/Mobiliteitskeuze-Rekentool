/**
 * Locale persistence tests.
 * These tests must NOT pin locale in localStorage before navigation,
 * because they verify that the locale stored by the user actually persists
 * across page reloads.
 */

import { expect, test } from '@playwright/test';

test.describe('Locale persistence', () => {
  test('switching to EN and reloading shows English step title', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await page.reload();
    await expect(page.getByText('Welcome')).toBeVisible();
  });

  test('switching back to NL after EN stores NL preference', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await page.getByRole('button', { name: 'NL', exact: true }).click();
    await page.reload();
    await expect(page.getByText('Welkom')).toBeVisible();
  });

  test('EN locale shows English next button label', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Next →', exact: true })).toBeVisible();
  });
});
