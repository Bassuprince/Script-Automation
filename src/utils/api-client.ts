import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Thin, reusable wrapper around Playwright's APIRequestContext so API test
 * specs stay declarative ("what" is being verified) instead of repeating
 * endpoint paths and payload shapes ("how" the call is made).
 *
 * Targets the real Script Assist staging API (see API_BASE_URL in
 * playwright.config.ts / .env). Contract confirmed against
 * https://staging-rpc-api-824772294646.europe-west2.run.app.
 */

export interface RegisterPatientPayload {
  title?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  sex: string;
  gender: string;
  password: string;
  commsPreferences?: {
    email: boolean;
    pushNotifications: boolean;
    marketingOptIn: boolean;
  };
  clinicMembership?: {
    clinicId: number;
    status: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
  timezone?: string;
  scope?: { type: string; variant: string };
  platform?: string;
}

export class AuthApiClient {
  constructor(private readonly request: APIRequestContext) {}

  register(payload: RegisterPatientPayload): Promise<APIResponse> {
    return this.request.post('/patients', { data: payload });
  }

  login(payload: LoginPayload): Promise<APIResponse> {
    return this.request.post('/auth/login', { data: payload });
  }
}
