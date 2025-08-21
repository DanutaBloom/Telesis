import type { Page } from '@playwright/test';
import { expect, test as setup } from '@playwright/test';

/**
 * Authentication setup for different user roles
 * This creates auth state files that other tests can use
 */

// Test user configurations
export const TEST_USERS = {
  admin: {
    email: 'admin@telesis-test.com',
    password: 'TestPassword123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
  trainer: {
    email: 'trainer@telesis-test.com',
    password: 'TestPassword123!',
    firstName: 'Trainer',
    lastName: 'User',
    role: 'trainer',
  },
  learner: {
    email: 'learner@telesis-test.com',
    password: 'TestPassword123!',
    firstName: 'Learner',
    lastName: 'User',
    role: 'learner',
  },
};

// Test organization configuration
export const TEST_ORGANIZATION = {
  name: 'Telesis Test Organization',
  description: 'Test organization for E2E testing',
  domain: 'telesis-test.com',
};

/**
 * Set up authentication for a specific user role
 * @param page - Playwright Page object
 * @param userRole - Role of the user to authenticate as
 */
export async function setupAuth(page: Page, userRole: keyof typeof TEST_USERS) {
  const user = TEST_USERS[userRole];

  // For now, create mock authentication state
  // In a real implementation, you would sign in and save the state
  await page.context().addCookies([
    {
      name: '__session',
      value: `mock-${userRole}-session-token`,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
    },
  ]);

  // Add localStorage items that might be used for auth state
  await page.addInitScript((userData) => {
    localStorage.setItem('auth-user', JSON.stringify(userData));
    localStorage.setItem('auth-role', userData.role);
  }, user);
}

/**
 * Verify authentication state
 * @param page - Playwright Page object
 * @param expectedRole - Expected user role
 */
export async function verifyAuthState(page: Page, expectedRole: string) {
  const authRole = await page.evaluate(() => localStorage.getItem('auth-role'));

  expect(authRole).toBe(expectedRole);
}

setup('authenticate as admin', async ({ page }) => {
  try {
    // Navigate to home page first
    await page.goto('/');

    // Set up mock authentication state
    await setupAuth(page, 'admin');

    // Save authentication state
    await page.context().storageState({ path: './tests/auth/admin-auth.json' });
    console.log('✅ Admin authentication state created');
  } catch (error) {
    console.error('❌ Failed to create admin auth state:', error);

    // Create minimal state file to prevent errors
    await page.context().storageState({ path: './tests/auth/admin-auth.json' });
  }
});

setup('authenticate as trainer', async ({ page }) => {
  try {
    await page.goto('/');
    await setupAuth(page, 'trainer');
    await page.context().storageState({ path: './tests/auth/trainer-auth.json' });
    console.log('✅ Trainer authentication state created');
  } catch (error) {
    console.error('❌ Failed to create trainer auth state:', error);
    await page.context().storageState({ path: './tests/auth/trainer-auth.json' });
  }
});

setup('authenticate as learner', async ({ page }) => {
  try {
    await page.goto('/');
    await setupAuth(page, 'learner');
    await page.context().storageState({ path: './tests/auth/learner-auth.json' });
    console.log('✅ Learner authentication state created');
  } catch (error) {
    console.error('❌ Failed to create learner auth state:', error);
    await page.context().storageState({ path: './tests/auth/learner-auth.json' });
  }
});
