import { test as setup } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';

export const STORAGE_STATE_PATH = path.resolve(__dirname, '../../playwright/.auth/patient.json');

/**
 * Runs once per test run (before the ui-chromium project, via `dependencies`
 * in playwright.config.ts) and persists an authenticated session to disk.
 * Every ui-chromium test then starts already signed in via `storageState`,
 * instead of repeating the login flow in each spec/beforeEach.
 */
setup('authenticate as seeded patient', async ({browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage();
 
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.goto();
  await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
  await loginPage.navigateToTasks()
 // await page.getByRole('link', { name: 'Tasks' }).click();
 // await page.getByLabel('Please add your address. To do. Due No due date.').waitFor({ state: 'visible' })
  await dashboardPage.expectLoaded();

  await page.context().storageState({ path: STORAGE_STATE_PATH });
});
