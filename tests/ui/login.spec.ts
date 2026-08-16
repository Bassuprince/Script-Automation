import { test, expect } from '@fixtures/pages.fixture';
import { DashboardPage } from '../../src/pages/DashboardPage';

test.describe('Login Test cases', () => {
  // These tests exercise the login flow itself, so they must start logged out
  // even though the ui-chromium project defaults to an authenticated storageState.
  test.use({ storageState: { cookies: [], origins: [] } });

  test('@smoke @sanity a registered patient can sign in, land on the patient dashboard, and sign out', async ({page, loginPage}) => {
    const dashboardPage = new DashboardPage(page);
    await loginPage.goto();
    await expect(page).toHaveURL(process.env.BASE_URL!);
    await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
    await dashboardPage.expectLoaded();

    await loginPage.logout();
  });
  test('@smoke a user with invalid credentials sees an error and stays logged out', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.invalidlogin(process.env.USER_EMAIL!, 'ABC');

    await loginPage.expectInvalidCredentialsError();

  });
});
