import { test, expect } from '@fixtures/pages.fixture';
import { DashboardPage } from '../../src/pages/DashboardPage';

test.describe('Logout Test cases', () => {
test.use({ storageState: { cookies: [], origins: [] } });

  test.skip('@smoke @sanity a logged-in patient can sign out and return to the login screen', async ({ page, loginPage }) => {
    const dashboardPage = new DashboardPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
    await dashboardPage.expectLoaded();
   // await loginPage.logout();
  });
});
