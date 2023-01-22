import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('');
});

test('title is WΛVE', async ({ page }) => {
  await expect(page).toHaveTitle('WΛVE');
});
