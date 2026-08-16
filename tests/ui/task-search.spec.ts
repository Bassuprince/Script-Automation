import { test,expect } from '@playwright/test';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { TaskSearchPage } from '../../src/pages/TaskSearchPage';

test.describe('Search bar Test cases', () => {
  test.describe.configure({ mode: 'parallel' })
  // Signed in via the stored `storageState` (see auth.setup.ts) instead of logging in per test.
  test.beforeEach(async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await page.goto('/dashboard');
   // await expect(page.getByText('PATIENT', { exact: true })).toBeVisible({ timeout: 6000 })
    await dashboardPage.goToProfile();
    await dashboardPage.expectLoaded();
  });

  test('searching tasks with a non-matching term shows the no-tasks-found message', async ({ page }) => {
    const taskSearchPage = new TaskSearchPage(page);
    await taskSearchPage.searchTasks('abcd');
    await taskSearchPage.expectNoTasksFound();
  });

  test('searching tasks with a matching term returns the task and opens the address reminder', async ({ page }) => {
    const taskSearchPage = new TaskSearchPage(page);

    await taskSearchPage.searchTasks('Please add your address');
    await taskSearchPage.expectAddressReminderTaskVisible();

    await taskSearchPage.openAddressReminderTask();
    await taskSearchPage.expectNoAddressFound();

    await taskSearchPage.openAddressEditor();
  });
});
