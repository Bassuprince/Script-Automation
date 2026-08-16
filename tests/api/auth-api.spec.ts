import { test, expect } from '@playwright/test';
import { AuthApiClient } from '../../src/utils/api-client';
import { uniqueEmail } from '../../src/utils/test-data';

/**
 * Exercises the real Script Assist staging API via the reusable AuthApiClient
 * (src/utils/api-client.ts). Each test is self-contained and generates its
 * own data, so they can run in isolation or in parallel.
 */
test.describe('Auth API', () => {
  test('@smoke @sanity POST /patients registers a new patient', async ({ request }) => {
    const client = new AuthApiClient(request);

    const response = await client.register({
      title: 'Mrs.',
      firstName: 'basava',
      lastName: 'k',
      email: uniqueEmail(),
      phoneNumber: '89767876787',
      dateOfBirth: '2004-05-03T00:00:00.000Z',
      sex: 'MALE',
      gender: 'MALE',
      password: 'Password@123',
      commsPreferences: { email: true, pushNotifications: true, marketingOptIn: true },
      clinicMembership: { clinicId: 7, status: 'PENDING' },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.actions.user.status).toBe('CREATED');
    expect(body.patientId).toBeTruthy();
    expect(body.patientClinicMembershipId).toBeTruthy();
  });

  test('@smoke @sanity POST /auth/login succeeds with valid credentials and returns tokens', async ({ request }) => {
    const client = new AuthApiClient(request);

    const response = await client.login({
      email: process.env.USER_EMAIL!,
      password: process.env.USER_PASSWORD!,
      timezone: 'Asia/Calcutta',
      scope: { type: 'CLINIC', variant: 'SCRIPT_ASSIST' },
      platform: 'PATIENT',
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe('Login successful');
    expect(body.access_token).toBeTruthy();
    expect(body.refresh_token).toBeTruthy();
  });

  test('POST /auth/login fails with 401 for invalid credentials', async ({ request }) => {
    const client = new AuthApiClient(request);

    const response = await client.login({
      email: process.env.USER_EMAIL!,
      password: 'WrongPassword@999',
      timezone: 'Asia/Calcutta',
      scope: { type: 'CLINIC', variant: 'SCRIPT_ASSIST' },
      platform: 'PATIENT',
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toBe('Invalid login credentials');
  });
});
