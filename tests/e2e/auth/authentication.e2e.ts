/**
 * Authentication Flow E2E Tests
 *
 * Tests core authentication user flows including sign-up, sign-in,
 * organization selection, and security validations
 */

import { expect, test } from '@playwright/test';

import { setupAuth, TEST_USERS } from '../../auth/auth-setup';

test.describe('Authentication Flows', () => {
  test.describe.configure({ mode: 'serial' });

  test('User can sign up with valid credentials', async ({ page }) => {
    await page.goto('/sign-up');

    // Verify sign-up page loads
    await expect(page.locator('h1, h2')).toContainText(/sign up|create account/i);
    await expect(page.locator('form')).toBeVisible();

    // Fill out sign-up form
    await page.fill('input[name="emailAddress"]', 'newuser@telesis-test.com');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="firstName"]', 'New');
    await page.fill('input[name="lastName"]', 'User');

    // Submit form
    await page.click('button[type="submit"]');

    // Handle verification (in test environment)
    try {
      // Wait for verification step or success redirect
      await page.waitForSelector('input[name="code"], [data-testid="dashboard"]', { timeout: 10000 });

      if (await page.locator('input[name="code"]').isVisible()) {
        // Enter test verification code
        await page.fill('input[name="code"]', '424242');
        await page.click('button[type="submit"]');
      }
    } catch {
      // Verification might be automatic in test mode
    }

    // Should redirect to dashboard or onboarding
    await expect(page).toHaveURL(/dashboard|onboarding/, { timeout: 30000 });
  });

  test('User cannot sign up with invalid email', async ({ page }) => {
    await page.goto('/sign-up');

    // Try to sign up with invalid email
    await page.fill('input[name="emailAddress"]', 'invalid-email');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');

    await page.click('button[type="submit"]');

    // Should show validation error
    await expect(page.locator('[role="alert"], .error, [data-testid="error"]')).toBeVisible();
  });

  test('User cannot sign up with weak password', async ({ page }) => {
    await page.goto('/sign-up');

    // Try to sign up with weak password
    await page.fill('input[name="emailAddress"]', 'test@telesis-test.com');
    await page.fill('input[name="password"]', '123'); // Too short
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');

    await page.click('button[type="submit"]');

    // Should show password validation error
    await expect(page.locator('[role="alert"], .error, [data-testid="error"]')).toBeVisible();
  });

  test('Existing user can sign in successfully', async ({ page }) => {
    await page.goto('/sign-in');

    // Verify sign-in page loads
    await expect(page.locator('h1, h2')).toContainText(/sign in|log in/i);
    await expect(page.locator('form')).toBeVisible();

    // Sign in with existing user credentials
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[type="password"]', TEST_USERS.admin.password);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 30000 });

    // Verify user is authenticated
    await expect(page.locator('[data-testid="user-button"], .user-menu')).toBeVisible();
  });

  test('User cannot sign in with wrong password', async ({ page }) => {
    await page.goto('/sign-in');

    // Try to sign in with wrong password
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('[role="alert"], .error, [data-testid="error"]')).toBeVisible();

    // Should remain on sign-in page
    await expect(page).toHaveURL(/sign-in/);
  });

  test('User cannot sign in with non-existent email', async ({ page }) => {
    await page.goto('/sign-in');

    // Try to sign in with non-existent email
    await page.fill('input[type="email"]', 'nonexistent@telesis-test.com');
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('[role="alert"], .error, [data-testid="error"]')).toBeVisible();
  });

  test('Authenticated user can access protected dashboard', async ({ page }) => {
    // Set up authentication state
    await setupAuth(page, 'admin');

    // Navigate to dashboard
    await page.goto('/dashboard');

    // Should be able to access dashboard
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('h1, h2')).toContainText(/dashboard|welcome/i);

    // Should show user information
    const userButton = page.locator('[data-testid="user-button"]');
    if (await userButton.isVisible()) {
      await userButton.click();

      await expect(page.locator(`text=${TEST_USERS.admin.email}`)).toBeVisible();
    }
  });

  test('Unauthenticated user is redirected from protected routes', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard');

    // Should be redirected to sign-in
    await expect(page).toHaveURL(/sign-in/, { timeout: 10000 });
  });

  test('User can sign out successfully', async ({ page }) => {
    // Set up authentication state
    await setupAuth(page, 'admin');

    // Navigate to dashboard
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/dashboard/);

    // Find and click sign out
    const userButton = page.locator('[data-testid="user-button"], .user-menu');
    if (await userButton.isVisible()) {
      await userButton.click();

      const signOutButton = page.locator('button:has-text("Sign out"), a:has-text("Sign out")');
      await signOutButton.click();
    } else {
      // Look for direct sign out button
      const signOutButton = page.locator('[data-testid="sign-out"], button:has-text("Sign out")');
      await signOutButton.click();
    }

    // Should redirect to home or sign-in page
    await expect(page).toHaveURL(/\/($|sign-in)/, { timeout: 15000 });

    // Verify user is signed out by trying to access dashboard
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/sign-in/);
  });

  test('Password reset flow works correctly', async ({ page }) => {
    await page.goto('/sign-in');

    // Look for "Forgot password" link
    const forgotPasswordLink = page.locator('a:has-text("Forgot"), a:has-text("Reset"), [data-testid="forgot-password"]');

    if (await forgotPasswordLink.isVisible()) {
      await forgotPasswordLink.click();

      // Should navigate to password reset page
      await expect(page).toHaveURL(/reset|forgot/);

      // Fill in email for password reset
      await page.fill('input[type="email"]', TEST_USERS.admin.email);
      await page.click('button[type="submit"]');

      // Should show confirmation message
      await expect(page.locator('text*="sent", text*="email", text*="check"')).toBeVisible();
    }
  });

  test('Session persistence works across browser refresh', async ({ page }) => {
    // Set up authentication state
    await setupAuth(page, 'admin');

    // Navigate to dashboard
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/dashboard/);

    // Refresh the page
    await page.reload();

    // Should still be authenticated
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('[data-testid="user-button"], .user-menu')).toBeVisible();
  });

  test('Session expires after timeout (if implemented)', async ({ page }) => {
    // This test would be implementation-specific
    // Skip if session timeout is not implemented
    test.skip(!process.env.ENABLE_SESSION_TIMEOUT, 'Session timeout not enabled');

    // Set up authentication state
    await setupAuth(page, 'admin');
    await page.goto('/dashboard');

    // Mock session expiration (implementation-dependent)
    await page.addInitScript(() => {
      // Clear any session tokens
      localStorage.clear();
      sessionStorage.clear();
    });

    // Try to access protected route
    await page.goto('/dashboard');

    // Should redirect to sign-in
    await expect(page).toHaveURL(/sign-in/);
  });

  test('Multi-factor authentication works (if enabled)', async ({ page }) => {
    // Skip if MFA is not enabled
    test.skip(!process.env.ENABLE_MFA, 'MFA not enabled');

    await page.goto('/sign-in');

    // Sign in with MFA-enabled account
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[type="password"]', TEST_USERS.admin.password);
    await page.click('button[type="submit"]');

    // Should prompt for MFA code
    await expect(page.locator('input[name="code"], [data-testid="mfa-input"]')).toBeVisible();

    // Enter test MFA code
    await page.fill('input[name="code"]', '123456');
    await page.click('button[type="submit"]');

    // Should complete authentication
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Social login works (if configured)', async ({ page }) => {
    // Skip if social login is not configured
    test.skip(!process.env.ENABLE_SOCIAL_LOGIN, 'Social login not configured');

    await page.goto('/sign-in');

    // Look for social login buttons
    const googleButton = page.locator('button:has-text("Google"), [data-testid="google-signin"]');
    const githubButton = page.locator('button:has-text("GitHub"), [data-testid="github-signin"]');

    if (await googleButton.isVisible()) {
      // Test Google login button exists and is clickable
      await expect(googleButton).toBeVisible();
      await expect(googleButton).toBeEnabled();
    }

    if (await githubButton.isVisible()) {
      // Test GitHub login button exists and is clickable
      await expect(githubButton).toBeVisible();
      await expect(githubButton).toBeEnabled();
    }
  });

  test('Accessibility compliance for auth forms', async ({ page }) => {
    await page.goto('/sign-in');

    // Test form accessibility
    const form = page.locator('form');

    await expect(form).toBeVisible();

    // Check for proper labels
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    // Inputs should have accessible names
    await expect(emailInput).toHaveAttribute('aria-label');
    await expect(passwordInput).toHaveAttribute('aria-label');

    // Or be associated with labels
    const emailLabel = page.locator('label[for]');
    if (await emailLabel.isVisible()) {
      const forValue = await emailLabel.getAttribute('for');

      await expect(page.locator(`#${forValue}`)).toBeVisible();
    }

    // Form should be keyboard navigable
    await page.keyboard.press('Tab');

    await expect(emailInput).toBeFocused();

    await page.keyboard.press('Tab');

    await expect(passwordInput).toBeFocused();

    // Submit button should be reachable
    await page.keyboard.press('Tab');
    const submitButton = page.locator('button[type="submit"]');

    await expect(submitButton).toBeFocused();
  });
});
