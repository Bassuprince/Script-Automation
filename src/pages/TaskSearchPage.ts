import { Page, Locator, expect } from '@playwright/test';

/**
 * Task search bar on the patient dashboard. Locators were confirmed against
 */
export class TaskSearchPage {
  readonly searchInput: Locator;
  readonly noTasksFoundMessage: Locator;
  readonly addressReminderTaskResult: Locator;
  readonly noAddressFoundMessage: Locator;
  readonly addressEditButton: Locator;

  constructor(protected readonly page: Page) {
    this.searchInput = page.getByRole('textbox', { name: 'Search tasks...' });
    this.noTasksFoundMessage = page.getByText('tasks.noTasks');
    this.addressReminderTaskResult = page.getByRole('button', { name: 'Please add your address. To' });
    this.noAddressFoundMessage = page.getByText('No address found.');
    this.addressEditButton = page.getByLabel('Address', { exact: true }).getByRole('button').filter({ hasText: /^$/ });
  }

  async searchTasks(query: string){
    await this.searchInput.fill(query);
  }

  async expectNoTasksFound() {
    await expect(this.noTasksFoundMessage).toBeVisible();
  }

  async expectAddressReminderTaskVisible(){
    await expect(this.addressReminderTaskResult).toBeVisible({timeout:6000});
  }

  async openAddressReminderTask() {
    await this.addressReminderTaskResult.click();
  }

  async expectNoAddressFound() {
    await expect(this.noAddressFoundMessage).toBeVisible();
  }

  async openAddressEditor(){
    await this.addressEditButton.click();
  }
}
