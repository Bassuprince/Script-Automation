import { test, expect } from '@fixtures/pages.fixture';
import { DashboardPage } from '../../src/pages/DashboardPage';

test.describe('Logout Test cases', () => {
  // Signed in via the stored `storageState` (see auth.setup.ts) instead of logging in per test.
  test('@smoke @sanity a logged-in patient can sign out and return to the login screen', async ({ page, loginPage }) => {
    const dashboardPage = new DashboardPage(page);
    await page.goto('/dashboard');
    await expect(page.getByText('PATIENT', { exact: true })).toBeVisible({ timeout: 6000 });
    await dashboardPage.expectLoaded();

    await loginPage.logout();
  });
});
