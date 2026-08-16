import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../src/pages/DashboardPage';

test.describe('Dashboard Test cases', () => {
  test.describe.configure({ mode: 'parallel' })
  test.setTimeout(40000)
  // Signed in via the stored `storageState` (see auth.setup.ts) instead of logging in per test.
  test('@sanity dashboard shows the correct heading, and patientRoleBadge after login', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await page.goto('/dashboard');

    // Verify important heading
    await expect(dashboardPage.tasksHeading).toBeVisible();

    // Verify key dashboard component
    await expect(dashboardPage.patientRoleBadge).toBeVisible();
  });
});