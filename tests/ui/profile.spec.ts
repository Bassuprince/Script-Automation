import { test, expect} from '@playwright/test';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { ProfilePage } from '../../src/pages/ProfilePage';
import data from '../../TestData/registration.json';

test.describe('Profile Test cases', () => {
  test.setTimeout(40000)
  test.describe.configure({ mode: 'parallel' })
  // Signed in via the stored `storageState` (see auth.setup.ts) instead of logging in per test.
  test.beforeEach(async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await page.goto('/dashboard');
    await dashboardPage.goToProfile();
  });

  test('@sanity profile verify the account details', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.expectAccountDetails(data.title,`${data.firstName} ${data.lastName}`,process.env.USER_EMAIL!);
  });
});
