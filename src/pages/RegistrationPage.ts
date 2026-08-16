import { Page, Locator, expect } from '@playwright/test';

export interface PersonalDetails {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface DateOfBirth {
  day: string;
  month: string;
  year: string;
}

/**
 * Multi-step patient sign-up wizard ("Your details" -> "Set your password"),
 * reached from LoginPage.goToSignUp(). Locators were confirmed against
 * the real staging DOM via Playwright codegen.
 */
export class RegistrationPage {
  // Step 1: "Your details"
  readonly titleDropdown: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly nextButton: Locator;

  // Step 2: "Set your password"
  readonly sexAtBirthDropdown: Locator;
  readonly dayDropdown: Locator;
  readonly monthDropdown: Locator;
  readonly yearDropdown: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly createAccountButton: Locator;

  readonly detailsStepHeading: Locator;
  readonly passwordStepHeading: Locator;
  readonly accountCreatedMessage: Locator;
  readonly invalidPhoneError: Locator;

  constructor(protected readonly page: Page) {
    this.titleDropdown = page.getByRole('textbox', { name: 'Select a title' });
    this.firstNameInput = page.getByRole('textbox', { name: 'Legal First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Legal Last Name' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone Number' });
    this.nextButton = page.getByRole('button', { name: 'Next' });

    this.sexAtBirthDropdown = page.getByRole('textbox', { name: 'Sex at Birth' });
    this.dayDropdown = page.getByRole('textbox', { name: 'Day' });
    this.monthDropdown = page.getByRole('textbox', { name: 'Month' });
    this.yearDropdown = page.getByRole('textbox', { name: 'Year' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
    this.termsCheckbox = page.getByRole('checkbox');
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });

    this.detailsStepHeading = page.getByText('Your details');
    this.passwordStepHeading = page.getByText('Set your password');
    this.accountCreatedMessage = page.getByText('Your account has been created');
    this.invalidPhoneError = page.getByText('Please enter a valid phone');
  }

  async expectDetailsStepVisible(){
    await expect(this.detailsStepHeading).toBeVisible();
  }

  async selectTitle(title: string) {
    await this.titleDropdown.click();
    await this.page.getByRole('option', { name: title }).click();
  }

  async fillPersonalDetails(details: PersonalDetails){
    await this.selectTitle(details.title);
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async expectPasswordStepVisible() {
    await expect(this.passwordStepHeading).toBeVisible();
  }

  async selectSexAtBirth(sex: string){
    await this.sexAtBirthDropdown.click();
    await this.page.getByRole('option', { name: sex, exact: true }).click();
  }

  async selectDateOfBirth(dob: DateOfBirth) {
    await this.dayDropdown.click();
    await this.page.getByRole('option', { name: dob.day }).click();

    await this.monthDropdown.click();
    await this.page.getByRole('option', { name: dob.month }).click();

    await this.yearDropdown.click();
    await this.page.getByText(dob.year).click();
  }

  async setPasswords(password: string) {
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
  }

  async acceptTerms() {
    await this.termsCheckbox.click();
  }

  async submit() {
    await this.createAccountButton.click();
  }

  async expectAccountCreated() {
    await expect(this.accountCreatedMessage).toBeVisible();
  }

  async expectInvalidPhoneError() {
    await expect(this.invalidPhoneError).toBeVisible();
  }
}
