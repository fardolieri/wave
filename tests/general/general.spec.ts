import { expect, test } from '@playwright/test';

test('title is WΛVE', async ({ page }) => {
  await page.goto('');
  await expect(page).toHaveTitle('WΛVE');
});
