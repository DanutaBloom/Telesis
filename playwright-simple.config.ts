import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT || 3001;
const baseURL = `http://localhost:${PORT}`;

/**
 * Simple Playwright configuration for basic testing without complex auth setup
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '*.@(spec|e2e|perf).?(c|m)[jt]s?(x)',
  timeout: 60 * 1000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,

  reporter: [
    ['list'],
    ['html', { outputFolder: './test-results/playwright-report', open: 'on-failure' }],
  ],

  expect: {
    timeout: 10 * 1000,
    toHaveScreenshot: {
      threshold: 0.2,
      animations: 'disabled',
    },
  },

  webServer: {
    command: 'echo "Using existing server"',
    url: baseURL,
    timeout: 10 * 1000,
    reuseExistingServer: true,
  },

  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    userAgent: 'Telesis-E2E-Tests/1.0',
  },

  projects: [
    // Chrome testing
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Firefox testing
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    // Safari testing
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile Chrome
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },

    // Mobile Safari
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  outputDir: './test-results/playwright-artifacts',
});
