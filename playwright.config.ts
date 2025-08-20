import { defineConfig, devices } from '@playwright/test';

// Use process.env.PORT by default and fallback to port 3001 (dev server is running on 3001)
const PORT = process.env.PORT || 3001;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = `http://localhost:${PORT}`;

/**
 * Enhanced Playwright configuration for Telesis
 * Includes authentication state management, performance testing, and security validation
 */
export default defineConfig({
  testDir: './tests',
  // Look for files with multiple extensions for different test types
  testMatch: '*.@(spec|e2e|security|perf).?(c|m)[jt]s?(x)',
  // Timeout per test - longer for performance tests
  timeout: 60 * 1000, // 1 minute
  // Global timeout for entire test run
  globalTimeout: 30 * 60 * 1000, // 30 minutes
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  // Retry on CI for flaky tests
  retries: process.env.CI ? 2 : 0,
  // Run tests in parallel
  workers: process.env.CI ? '50%' : undefined,
  
  // Reporter configuration with multiple formats
  reporter: process.env.CI 
    ? [
        ['github'],
        ['junit', { outputFile: './test-results/playwright-results.xml' }],
        ['html', { outputFolder: './test-results/playwright-report', open: 'never' }],
        ['json', { outputFile: './test-results/playwright-results.json' }],
      ]
    : [
        ['list'],
        ['html', { outputFolder: './test-results/playwright-report', open: 'on-failure' }],
      ],

  expect: {
    // Set timeout for async expect matchers
    timeout: 10 * 1000,
    toHaveScreenshot: {
      // Screenshot comparison threshold
      threshold: 0.2,
      // Animation handling
      animations: 'disabled',
    },
  },

  // Global test configuration
  globalSetup: './tests/global.setup.ts',
  globalTeardown: './tests/global.teardown.ts',

  // Run your local dev server before starting the tests
  webServer: {
    command: process.env.CI ? 'npm run start' : 'npm run dev:next',
    url: baseURL,
    timeout: 3 * 60 * 1000, // 3 minutes for startup
    reuseExistingServer: true, // Use existing server since we already have one running
    stdout: 'pipe',
    stderr: 'pipe',
  },

  // Shared settings for all the projects below
  use: {
    // Use baseURL for relative navigations
    baseURL,

    // Collect trace when retrying the failed test
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',

    // Record videos when retrying the failed test
    video: process.env.CI ? 'retain-on-failure' : 'on-first-retry',

    // Take screenshots on failure
    screenshot: 'only-on-failure',

    // Set viewport size for consistent testing
    viewport: { width: 1280, height: 720 },

    // Ignore HTTPS errors for local development
    ignoreHTTPSErrors: true,

    // Set user agent for testing
    userAgent: 'Telesis-E2E-Tests/1.0',

    // Emulate timezone
    timezoneId: 'Europe/Amsterdam',

    // Emulate locale
    locale: 'en-US',

    // Extra HTTP headers
    extraHTTPHeaders: {
      'X-Test-Environment': 'playwright',
    },
  },

  projects: [
    // Authentication setup and teardown
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      teardown: 'teardown',
      // No storage state for setup - it creates the storage state
    },
    {
      name: 'teardown',
      testMatch: /.*\.teardown\.ts/,
    },

    // Main browser testing - Authenticated as admin
    {
      name: 'chromium-admin',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './tests/auth/admin-auth.json',
      },
      dependencies: ['setup'],
      testMatch: ['**/auth/**/*.e2e.ts', '**/admin/**/*.e2e.ts'],
    },

    // Trainer role testing
    {
      name: 'chromium-trainer',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './tests/auth/trainer-auth.json',
      },
      dependencies: ['setup'],
      testMatch: ['**/trainer/**/*.e2e.ts', '**/content/**/*.e2e.ts'],
    },

    // Learner role testing
    {
      name: 'chromium-learner',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './tests/auth/learner-auth.json',
      },
      dependencies: ['setup'],
      testMatch: ['**/learner/**/*.e2e.ts', '**/learning/**/*.e2e.ts'],
    },

    // Unauthenticated public pages testing
    {
      name: 'chromium-public',
      use: {
        ...devices['Desktop Chrome'],
        // No storage state = unauthenticated
      },
      testMatch: ['**/public/**/*.e2e.ts', '**/marketing/**/*.e2e.ts'],
    },

    // Security testing - special configuration
    {
      name: 'chromium-security',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './tests/auth/admin-auth.json',
        // More aggressive timeouts for security tests
        actionTimeout: 30 * 1000,
        navigationTimeout: 30 * 1000,
      },
      dependencies: ['setup'],
      testMatch: ['**/*.security.ts'],
      timeout: 2 * 60 * 1000, // 2 minutes for security tests
    },

    // Performance testing
    {
      name: 'chromium-performance',
      use: {
        ...devices['Desktop Chrome'],
        storageState: './tests/auth/admin-auth.json',
      },
      dependencies: ['setup'],
      testMatch: ['**/*.perf.ts'],
      timeout: 5 * 60 * 1000, // 5 minutes for performance tests
    },

    // Mobile testing
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        storageState: './tests/auth/admin-auth.json',
      },
      dependencies: ['setup'],
      testMatch: ['**/mobile/**/*.e2e.ts'],
    },

    // Cross-browser testing (CI only)
    ...(process.env.CI
      ? [
          {
            name: 'firefox',
            use: {
              ...devices['Desktop Firefox'],
              storageState: './tests/auth/admin-auth.json',
            },
            dependencies: ['setup'],
            testMatch: ['**/critical/**/*.e2e.ts'],
          },
          {
            name: 'webkit',
            use: {
              ...devices['Desktop Safari'],
              storageState: './tests/auth/admin-auth.json',
            },
            dependencies: ['setup'],
            testMatch: ['**/critical/**/*.e2e.ts'],
          },
        ]
      : []),

    // Visual regression testing (CI only)
    ...(process.env.CI
      ? [
          {
            name: 'visual-regression',
            use: {
              ...devices['Desktop Chrome'],
              storageState: './tests/auth/admin-auth.json',
            },
            dependencies: ['setup'],
            testMatch: ['**/visual/**/*.spec.ts'],
          },
        ]
      : []),
  ],

  // Output directories
  outputDir: './test-results/playwright-artifacts',
});
