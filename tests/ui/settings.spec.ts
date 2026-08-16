import { test,expect} from '@playwright/test';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { SettingsPage } from '../../src/pages/SettingsPage';

test.describe('Settings Navigation Test cases', () => {
  test.describe.configure({ mode: 'parallel' })
  // Signed in via the stored `storageState` (see auth.setup.ts) instead of logging in per test.
  test('@sanity a patient can navigate from the dashboard to the settings screen off Appointments mobile', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const settingsPage = new SettingsPage(page);

   // await page.goto('/dashboard');
   await page.goto('/dashboard');
    await dashboardPage.expectLoaded();
    await dashboardPage.goToSettings();

    await settingsPage.expectLoaded();
    await settingsPage.openNotificationSettings();
    await settingsPage.toggleSmsNotification();
    await settingsPage.closeNotificationDialog();
  });
});

