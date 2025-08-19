import { test as teardown } from '@playwright/test';

/**
 * Global teardown file for Playwright tests
 * This runs once after all test files
 */
teardown('Global Teardown', async () => {
  // Add any global cleanup logic here
  // For example, you might want to:
  // - Clean up test data
  // - Close services
  // - Clean up authentication state

  // Add cleanup logic here
});
