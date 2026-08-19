import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Central config. Base URLs are environment-driven so the same suite can target
 * staging, a future QA env, or CI without any code changes.
 */
const BASE_URL = process.env.BASE_URL
const API_BASE_URL = process.env.API_BASE_URL 

const STORAGE_STATE = path.resolve(__dirname, 'playwright/.auth/patient.json');

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
 // expect: {timeout: 5_000,},
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on',
    screenshot: 'only-on-failure',
    video:'retain-on-failure',
   // actionTimeout: 10_000,
  },
  projects: [
    {
      name: 'setup',
      testDir: './tests/setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'ui-chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    
    {
      name: 'api',
      testDir: './tests/api',
      // Staging API runs on Cloud Run (scales to zero); cold starts after an
      use: { baseURL: API_BASE_URL, actionTimeout: 30_000 },
    },
  ],
});
