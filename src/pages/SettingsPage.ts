import { Page, Locator, expect } from '@playwright/test';

/**
 * Settings screen, reached from DashboardPage.goToSettings(). Locators
 */
export class SettingsPage {
  readonly accountsHeading: Locator;
  readonly notificationSettingsLink: Locator;
  readonly notificationDialog: Locator;
  readonly notificationDialogBanner: Locator;
  readonly smsNotificationToggle: Locator;
  readonly closeNotificationDialogButton: Locator;

  constructor(protected readonly page: Page) {
    this.accountsHeading = page.getByText('Accounts');
    this.notificationSettingsLink = page.getByText('Notification Settings');

    this.notificationDialog = page.getByRole('dialog', { name: 'Notification Settings' });
    this.notificationDialogBanner = this.notificationDialog.getByRole('banner');
    // Each notification row renders an email switch then an SMS switch; nth(1)
    // picks the first row's SMS toggle.
    this.smsNotificationToggle = this.notificationDialog.locator('label span[data-label-position="right"]').nth(1);
    this.closeNotificationDialogButton = page.getByRole('button', { name: 'Close' });
  }

  async expectLoaded() {
  }

  async openNotificationSettings() {
    await this.notificationSettingsLink.click();
    await expect(this.notificationDialogBanner).toBeVisible();
  }

  async toggleSmsNotification(){
    await this.smsNotificationToggle.check();
    await expect(this.smsNotificationToggle.locator('xpath=ancestor::label//input')).toBeChecked();
  }

  async closeNotificationDialog(): Promise<void> {
    await this.closeNotificationDialogButton.click();
    await expect(this.notificationDialog).toBeHidden();
  }
}
