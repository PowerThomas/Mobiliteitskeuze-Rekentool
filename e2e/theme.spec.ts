import { expect, test, type Page } from '@playwright/test';

async function allButtonLabels(page: Page) {
  return page.$$eval('button', (btns) =>
    btns.map((b) => ({ text: b.textContent?.trim(), visible: !!(b.offsetParent) }))
  );
}

// Pin locale to 'nl' before every navigation so Dutch button labels are stable.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('locale', 'nl'));
});

test.describe('Theme switcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('html element has no dark class on initial load (system/light default)', async ({ page }) => {
    // System default — in headless Chromium prefers-color-scheme is light,
    // so the dark class should be absent.
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(hasDark).toBe(false);
  });

  test('clicking Donker adds dark class to <html>', async ({ page }) => {
    await page.getByRole('button', { name: 'Donker' }).click();
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(hasDark).toBe(true);
  });

  test('clicking Licht removes dark class from <html>', async ({ page }) => {
    // First go dark, then back to light
    await page.getByRole('button', { name: 'Donker' }).click();
    await page.getByRole('button', { name: 'Licht' }).click();
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(hasDark).toBe(false);
  });

  test('clicking Systeem removes dark class (headless = light system)', async ({ page }) => {
    await page.getByRole('button', { name: 'Donker' }).click();
    await page.getByRole('button', { name: 'Systeem' }).click();
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(hasDark).toBe(false);
  });

  test('preference is persisted in localStorage', async ({ page }) => {
    await page.getByRole('button', { name: 'Donker' }).click();
    const stored = await page.evaluate(() => localStorage.getItem('mkr-theme'));
    expect(stored).toBe('dark');
  });

  test('dark class persists after page reload when dark was chosen', async ({ page }) => {
    await page.getByRole('button', { name: 'Donker' }).click();
    await page.reload();
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(hasDark).toBe(true);
  });
});
