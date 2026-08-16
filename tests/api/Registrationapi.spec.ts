import { test, expect } from '@playwright/test';
import { uniqueEmail } from '@utils/test-data';

test('Create patient using API', async ({ request }) => {
  const email = uniqueEmail()

  const response = await request.post(
    'https://staging-rpc-api-824772294646.europe-west2.run.app/patients',
    {
      data: {
        title: 'Mrs.',
        firstName: 'basava',
        lastName: 'k',
        email: email,
        phoneNumber: '89767876787',
        dateOfBirth: '2004-05-03T00:00:00.000Z',
        sex: 'MALE',
        gender: 'MALE',
        password: 'Password@123',

        commsPreferences: {
          email: true,
          pushNotifications: true,
          marketingOptIn: true
        },

        clinicMembership: {
          clinicId: 7,
          status: 'PENDING'
        }
      }
    }
  );

  // Status code validation
  expect(response.status()).toBe(201);

  // Get response body
  const responseBody = await response.json();

  //console.log('Response:', responseBody);
  /*

  // Validate response
  expect(responseBody.success).toBe(true);

  expect(responseBody.actions.user.status).toBe('CREATED');

  */
});