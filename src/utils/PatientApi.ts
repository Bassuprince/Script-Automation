import { APIRequestContext, expect } from '@playwright/test';

export class PatientApi {
  private readonly baseUrl =
    'https://staging-rpc-api-824772294646.europe-west2.run.app';

  constructor(private request: APIRequestContext) {}

  async createPatient(patientData: object) {
    const response = await this.request.post(
      `${this.baseUrl}/patients`,
      {
        data: patientData
      }
    );

    expect(response.status()).toBe(201);

    return response;
  }
}