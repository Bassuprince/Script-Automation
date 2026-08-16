import { Page, Locator, expect } from '@playwright/test';

/**
 * Sign-in screen, with locators confirmed against the real staging DOM
 */
export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly signUpButton: Locator;
  readonly invalidCredentialsError: Locator;
  readonly selectask: Locator;
  readonly openmenu: Locator;
  readonly logoutButton: Locator;
  readonly addAddressTask: Locator;
  readonly signOutMenuItem: Locator;
  readonly signOutConfirmHeading: Locator;
  readonly signOutConfirmButton: Locator;
  readonly loggedOutMessage: Locator;
  readonly loginSubmitButton: Locator;


  constructor(protected readonly page: Page) {
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.signUpButton = page.getByTestId('patient-sign-up-button');
    this.invalidCredentialsError = page.getByText('Password is required');
    this.selectask = page.getByRole('link', { name: 'Tasks' });


    this.openmenu = page.locator('[aria-haspopup="menu"]')
    this.logoutButton = page.locator('#logout')
    this.addAddressTask = page.getByLabel('Please add your address. To do. Due No due date.');
    this.signOutMenuItem = page.getByRole('menuitem', { name: 'Sign Out' });
    this.signOutConfirmHeading = page.getByText('Are you sure you want to sign');
    this.signOutConfirmButton = page.getByRole('button', { name: 'Sign Out' });
    this.loggedOutMessage = page.getByText('Logged out successfully');
    this.loginSubmitButton = page.getByTestId('login-submit-button');


  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click()
    await expect(this.page.getByText('PATIENT', { exact: true })).toBeVisible({ timeout: 6000 })

  }
  async dashbordselectask() {
    await this.selectask.click()
  }

  async navigateToTasks() {
    await this.selectask.click();
    await this.addAddressTask.waitFor({ state: 'visible' });
  }

  async logout() {
    await this.openmenu.click();
    await expect(this.signOutMenuItem).toBeVisible();
    await this.signOutMenuItem.click();
    await expect(this.signOutConfirmHeading).toBeVisible();
    await this.signOutConfirmButton.click();
    await expect(this.loggedOutMessage).toBeVisible();
    await expect(this.loginSubmitButton).toBeVisible();
  }

  async goToSignUp(): Promise<void> {
    await this.signUpButton.click();
  };

  async expectInvalidCredentialsError() {
    await expect(this.invalidCredentialsError).toBeVisible();
  }
  async invalidlogin(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click()
  }

}
