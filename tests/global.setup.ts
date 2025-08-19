import { expect, test as setup } from '@playwright/test';

/**
 * Global setup file for Playwright tests
 * This runs once before all test files
 */
setup('Global Setup', async ({ page }) => {
  // Add any global setup logic here
  // For example, you might want to:
  // - Create test data
  // - Initialize services
  // - Set up authentication state

  // Navigate to the app to ensure it's running
  await page.goto('/');

  // Verify the app is accessible
  await expect(page).toHaveTitle(/Telesis/);
});
