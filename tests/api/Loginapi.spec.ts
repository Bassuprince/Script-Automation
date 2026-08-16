import { test, expect } from '@playwright/test';

test('Patient Login API', async ({ request }) => {

  const response = await request.post(
    'https://staging-rpc-api-824772294646.europe-west2.run.app/auth/login',
    {
      data: {
        email: 'basavar+1786615462766@gmail.com',
        password: 'Password@123',
        timezone: 'Asia/Calcutta',

        scope: {
          type: 'CLINIC',
          variant: 'SCRIPT_ASSIST'
        },

        platform: 'PATIENT'
      }
    }
  );

  // 1. Validate HTTP status
  expect(response.status()).toBe(201);

  // 2. Get response body
  const responseBody = await response.json();

  //console.log('Login Response:', responseBody);
  /*

  // 3. Validate login response
  expect(responseBody.success).toBe(true);

  expect(responseBody.message).toBe('Login successful');

  // 4. Validate access token
  expect(responseBody.access_token).toBeTruthy();

  // 5. Validate refresh token
  expect(responseBody.refresh_token).toBeTruthy();

  // 6. Validate user details
  expect(responseBody.user.id).toBe(94086);

  expect(responseBody.user.email)
    .toBe('basavar+1786615462766@gmail.com');

  expect(responseBody.user.firstName)
    .toBe('Basava');

  expect(responseBody.user.lastName)
    .toBe('K');

  // 7. Validate password flag
  expect(responseBody.mustChangePassword).toBe(false);
  */
});