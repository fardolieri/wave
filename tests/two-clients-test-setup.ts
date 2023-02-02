import { BrowserContext, Page, test as base } from '@playwright/test';

export type TestOptions = {
  contextA: BrowserContext;
  contextB: BrowserContext;

  pageA: Page;
  pageB: Page;

  publicIdA: string;
  publicIdB: string;
};

export const test = base.extend<TestOptions>({
  page: async ({ page }, use) => {
    await initializeClient('userA', page);
    await use(page);
  },

  contextA: async ({ context }, use) => {
    await use(context);
  },

  contextB: async ({ browser }, use) => {
    const contextB = await browser.newContext();
    await use(contextB);
  },

  pageA: async ({ page }, use) => {
    await use(page);
  },

  pageB: async ({ contextB }, use) => {
    const page2 = await contextB.newPage();
    await initializeClient('userB', page2);
    await use(page2);
  },

  publicIdA: async ({ pageA }, use) => {
    const publicId = await pageA.evaluate(
      () => localStorage.getItem('publicKey') ?? '',
    );
    await use(publicId);
  },

  publicIdB: async ({ pageB }, use) => {
    const publicId = await pageB.evaluate(
      () => localStorage.getItem('publicKey') ?? '',
    );
    await use(publicId);
  },
});

async function initializeClient(username: string, page: Page): Promise<void> {
  await page.goto('');
  await page.getByText('Chose your Username').waitFor({ state: 'visible' });
  await page.getByLabel('Username').type(username);
  await page.locator('.jdent-icon:first-child').click();
}
