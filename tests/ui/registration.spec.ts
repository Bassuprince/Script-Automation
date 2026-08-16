import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { RegistrationPage } from '../../src/pages/RegistrationPage';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { uniqueName,uniqueEmail } from '../../src/utils/test-data';
import data from '../../TestData/registration.json';

test.describe('Registration Test cases', () => {
  test.describe.configure({ mode: 'parallel' })
  // These tests exercise sign-up/login themselves, so they must start logged out
  // even though the ui-chromium project defaults to an authenticated storageState.
  test.use({ storageState: { cookies: [], origins: [] } });

  test('@smoke @sanity a new patient can complete sign up and see the account-created confirmation and login', async ({page}) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const registrationPage = new RegistrationPage(page);
    await loginPage.goto();
    await expect(page).toHaveURL(/login/);
    await loginPage.goToSignUp();
    const registeredEmail = uniqueEmail();
    const FirstName = uniqueName();
    await registrationPage.expectDetailsStepVisible();
    await registrationPage.fillPersonalDetails({title: data.title,firstName: FirstName,lastName:data.lastName,email: registeredEmail,phone: data.phone,});
    console.log("New registration email",registeredEmail)
    await registrationPage.clickNext();
    await registrationPage.expectPasswordStepVisible();
    await registrationPage.selectSexAtBirth(data.sex);
    await registrationPage.selectDateOfBirth(data.dateOfBirth);
    await registrationPage.setPasswords(data.password);
    await registrationPage.acceptTerms();
    await registrationPage.submit();
    await registrationPage.expectAccountCreated();
    await expect(page.getByTestId('login-submit-button')).toBeVisible();

    await loginPage.goto();
    await expect(page).toHaveURL(/login/);
    await loginPage.login(registeredEmail, data.password);
    await dashboardPage.acceptLegalDocumentsUpdate();
    await dashboardPage.expectLoaded();
  });
  test.skip('@smoke the newly registered patient can log in with their new credentials', async ({ page }) => {
    const registeredEmail = uniqueEmail();
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await expect(page).toHaveURL(/login/);
    await loginPage.login(registeredEmail, data.password);
    await dashboardPage.acceptLegalDocumentsUpdate();
    await dashboardPage.expectLoaded();
  });
  test('registering with an invalid phone number shows a validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registrationPage = new RegistrationPage(page);

    await loginPage.goto();
    await expect(page).toHaveURL(/login/);
    await loginPage.goToSignUp();

    await registrationPage.expectDetailsStepVisible();
    await registrationPage.fillPersonalDetails({title: data.title,firstName: uniqueName(),lastName: data.lastName,email: uniqueEmail(),phone: '78987890',});
    await registrationPage.clickNext();
    await registrationPage.expectInvalidPhoneError();
  });
});
