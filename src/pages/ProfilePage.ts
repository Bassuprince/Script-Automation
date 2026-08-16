import { Page, Locator, expect } from '@playwright/test';

/**
 * Profile screen, reached from DashboardPage.goToProfile(). Locators
 */
export class ProfilePage {
  readonly avatarInitials: Locator;
  readonly titleField: Locator;
  readonly nameField: Locator;
  readonly emailField: Locator;

  constructor(protected readonly page: Page) {
    this.avatarInitials = page.getByRole('main').getByText('BK');
    this.titleField = page.getByLabel('Title').first();
    this.nameField = page.getByLabel('Name');
    this.emailField = page.getByLabel('Email');
  }

  async expectLoaded() {
    await expect(this.avatarInitials).toBeVisible();
  }

  async expectAccountDetails(title: string, fullName: string, email: string): Promise<void> {
    await expect(this.titleField).toHaveValue(title);
    await expect(this.titleField).toBeDisabled();

    await expect(this.nameField).toHaveValue(fullName);
    await expect(this.nameField).toBeDisabled();

    await expect(this.emailField).toHaveValue(email);
    await expect(this.emailField).toBeDisabled();
  }
}
