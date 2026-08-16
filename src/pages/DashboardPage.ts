import { Page, Locator, expect } from '@playwright/test';

/**
 * Authenticated patient landing screen, with locators confirmed against the
 */
export class DashboardPage {
  readonly patientRoleBadge: Locator;
  readonly tasksHeading: Locator;
  readonly userMenuToggle: Locator;
  readonly settingsNavLink: Locator;
  readonly profileMenuItem: Locator;
  readonly contactClinicNavLink: Locator;
  readonly getInTouchText: Locator;
  readonly clickHeading :Locator;

  // One-time "legal documents updated" modal shown on a fresh account's first login.
  readonly legalUpdateHeading: Locator;
  readonly legalUpdateSwitches: Locator;
  readonly legalUpdateContinueButton: Locator;

  constructor(protected readonly page: Page) {
    this.patientRoleBadge = page.getByText('PATIENT', { exact: true });
    this.clickHeading = page.getByRole('link', { name: 'Tasks' })
    this.tasksHeading = page.getByText(/Tasks \(\d+\)/);
    this.userMenuToggle = page.locator('[aria-haspopup="menu"]')
    this.settingsNavLink = page.getByRole('link', { name: 'Settings' });
    this.profileMenuItem = page.getByRole('menuitem', { name: 'Profile' });
    this.contactClinicNavLink = page.getByRole('link', { name: 'Contact Clinic' });
    this.getInTouchText = page.getByText('Get in touch');

    this.legalUpdateHeading = page.getByText("We've updated our legal");
    this.legalUpdateSwitches = page.locator('.mantine-Switch-track');
    this.legalUpdateContinueButton = page.getByRole('button', { name: 'Continue' });
  }

  async expectLoaded(){
    await expect(this.patientRoleBadge).toBeVisible();
    await this.clickHeading.click()
    await expect(this.tasksHeading).toBeVisible({ timeout: 60000 });
  }

  async goToSettings() {
    await this.settingsNavLink.click();
  }

  async goToContactClinic(){
    await this.contactClinicNavLink.click();
  }

  async goToProfile(){
    await this.userMenuToggle.click();
    await expect(this.profileMenuItem).toBeVisible();
    await this.profileMenuItem.click();
  }

  async acceptLegalDocumentsUpdate(){
    await expect(this.legalUpdateHeading).toBeVisible();
    await this.legalUpdateSwitches.first().check();
    await this.legalUpdateSwitches.nth(1).check();
    await this.legalUpdateContinueButton.click();
    await expect(this.legalUpdateContinueButton).toBeHidden();
  }
}
