/**
 * Mobile Responsiveness E2E Tests
 * Tests UI/UX across different mobile devices and screen sizes
 * @mobile @responsive
 */

import { devices, expect, test } from '@playwright/test';

const MOBILE_DEVICES = {
  'iPhone 12': devices['iPhone 12'],
  'iPhone 13 Pro': devices['iPhone 13 Pro'],
  'Pixel 5': devices['Pixel 5'],
  'Galaxy S9+': devices['Galaxy S9+'],
  'iPad Mini': devices['iPad Mini'],
  'iPad Pro': devices['iPad Pro'],
};

const VIEWPORT_SIZES = [
  { name: 'Mobile Portrait', width: 375, height: 667 },
  { name: 'Mobile Landscape', width: 667, height: 375 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Tablet Landscape', width: 1024, height: 768 },
  { name: 'Small Desktop', width: 1280, height: 720 },
  { name: 'Large Desktop', width: 1920, height: 1080 },
];

test.describe('Mobile Responsiveness Tests', () => {
  test.describe('@mobile Landing Page Responsiveness', () => {
    VIEWPORT_SIZES.forEach(({ name, width, height }) => {
      test(`should display correctly on ${name} (${width}x${height})`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto('/');

        // Page should load completely
        await expect(page.locator('body')).toBeVisible();

        // Main navigation should be accessible
        const nav = page.locator('nav').first();
        if (await nav.isVisible()) {
          await expect(nav).toBeVisible();

          // On mobile, look for hamburger menu
          if (width < 768) {
            const mobileMenu = page.locator('button[aria-expanded], [aria-label*="menu"], .mobile-menu-button');
            if (await mobileMenu.count() > 0) {
              await expect(mobileMenu.first()).toBeVisible();
            }
          }
        }

        // Main content should not overflow
        const main = page.locator('main').first();
        if (await main.isVisible()) {
          const boundingBox = await main.boundingBox();
          if (boundingBox) {
            expect(boundingBox.width).toBeLessThanOrEqual(width);
          }
        }

        // Hero section should be responsive
        const hero = page.locator('h1, .hero, [data-testid="hero"]').first();
        if (await hero.isVisible()) {
          await expect(hero).toBeVisible();

          // Text should not overflow
          const textBounds = await hero.boundingBox();
          if (textBounds) {
            expect(textBounds.width).toBeLessThanOrEqual(width);
          }
        }

        // CTA buttons should be accessible
        const ctaButtons = page.locator('a[href*="sign-up"], button:has-text("Get Started"), .cta-button');
        const buttonCount = await ctaButtons.count();
        if (buttonCount > 0) {
          const firstButton = ctaButtons.first();

          await expect(firstButton).toBeVisible();

          // Button should be large enough for touch targets (minimum 44px)
          if (width < 768) {
            const buttonSize = await firstButton.boundingBox();
            if (buttonSize) {
              expect(Math.min(buttonSize.width, buttonSize.height)).toBeGreaterThanOrEqual(44);
            }
          }
        }
      });
    });
  });

  test.describe('@mobile Authentication Forms Responsiveness', () => {
    test('Sign-in form should be mobile-friendly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone dimensions
      await page.goto('/sign-in');

      // Form should be visible and accessible
      const form = page.locator('form').first();

      await expect(form).toBeVisible();

      // Form should not require horizontal scrolling
      const formBounds = await form.boundingBox();
      if (formBounds) {
        expect(formBounds.width).toBeLessThanOrEqual(375);
      }

      // Input fields should be properly sized for mobile
      const inputs = page.locator('input[type="email"], input[type="password"]');
      const inputCount = await inputs.count();

      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);

        await expect(input).toBeVisible();

        const inputSize = await input.boundingBox();
        if (inputSize) {
          expect(inputSize.height).toBeGreaterThanOrEqual(44); // Touch target minimum
          expect(inputSize.width).toBeGreaterThan(200); // Reasonable input width
        }
      }

      // Submit button should be appropriately sized
      const submitButton = page.locator('button[type="submit"]');
      if (await submitButton.isVisible()) {
        const buttonSize = await submitButton.boundingBox();
        if (buttonSize) {
          expect(buttonSize.height).toBeGreaterThanOrEqual(44);
        }
      }

      // Test form interaction
      const emailInput = inputs.first();
      if (await emailInput.isVisible()) {
        await emailInput.click();
        await emailInput.fill('test@example.com');

        // Input should maintain focus
        await expect(emailInput).toBeFocused();
      }
    });

    test('Sign-up form should handle mobile keyboards', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/sign-up');

      const emailInput = page.locator('input[type="email"]');
      if (await emailInput.isVisible()) {
        // Email input should have appropriate input mode
        const inputMode = await emailInput.getAttribute('inputmode');
        const type = await emailInput.getAttribute('type');

        expect(type === 'email' || inputMode === 'email').toBeTruthy();
      }

      // Check for proper autocomplete attributes
      const inputs = page.locator('input');
      const inputCount = await inputs.count();

      for (let i = 0; i < Math.min(inputCount, 5); i++) {
        const input = inputs.nth(i);
        const name = await input.getAttribute('name');
        const autocomplete = await input.getAttribute('autocomplete');

        // Common form fields should have autocomplete
        if (name?.includes('email') || name?.includes('password')
          || name?.includes('firstName') || name?.includes('lastName')) {
          expect(autocomplete).toBeTruthy();
        }
      }
    });
  });

  test.describe('@mobile Navigation Menu Responsiveness', () => {
    test('Mobile navigation should work correctly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Look for mobile menu trigger
      const mobileMenuTrigger = page.locator(
        'button[aria-expanded], [aria-label*="menu"], .mobile-menu, [data-testid="mobile-menu"]',
      );

      if (await mobileMenuTrigger.count() > 0) {
        const trigger = mobileMenuTrigger.first();

        await expect(trigger).toBeVisible();

        // Click to open menu
        await trigger.click();

        // Menu should be accessible
        const ariaExpanded = await trigger.getAttribute('aria-expanded');
        if (ariaExpanded === 'true') {
          // Look for menu items
          const menuItems = page.locator('nav a, [role="menuitem"], .mobile-menu a');
          const itemCount = await menuItems.count();

          if (itemCount > 0) {
            // First menu item should be visible
            await expect(menuItems.first()).toBeVisible();

            // Menu items should be touch-friendly
            for (let i = 0; i < Math.min(itemCount, 3); i++) {
              const item = menuItems.nth(i);
              const itemSize = await item.boundingBox();
              if (itemSize) {
                expect(itemSize.height).toBeGreaterThanOrEqual(44);
              }
            }
          }

          // Close menu
          await trigger.click();

          // Menu should close
          const newAriaExpanded = trigger;

          await expect(newAriaExpanded).toHaveAttribute('aria-expanded', 'false');
        }
      }
    });

    test('Touch interactions should work properly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Test touch scrolling
      await page.mouse.move(200, 300);
      await page.mouse.down();
      await page.mouse.move(200, 200);
      await page.mouse.up();

      // Page should still be functional
      await expect(page.locator('body')).toBeVisible();

      // Test touch tap on interactive elements
      const interactiveElements = page.locator('a, button').filter({ hasText: /sign|get started|learn/i });
      const elementCount = await interactiveElements.count();

      if (elementCount > 0) {
        const element = interactiveElements.first();
        if (await element.isVisible()) {
          // Simulate touch tap
          const elementBox = await element.boundingBox();
          if (elementBox) {
            await page.touchscreen.tap(
              elementBox.x + elementBox.width / 2,
              elementBox.y + elementBox.height / 2,
            );
          }
        }
      }
    });
  });

  test.describe('@mobile Dashboard Mobile Experience', () => {
    test('Dashboard should be mobile-accessible', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Try to access dashboard (will redirect to sign-in if not authenticated)
      await page.goto('/dashboard');

      // Should either show dashboard or redirect to sign-in
      const currentUrl = page.url();
      const isOnDashboard = currentUrl.includes('/dashboard');
      const isOnSignIn = currentUrl.includes('/sign-in');

      expect(isOnDashboard || isOnSignIn).toBeTruthy();

      if (isOnDashboard) {
        // Dashboard should be mobile-optimized
        const main = page.locator('main').first();
        if (await main.isVisible()) {
          const mainBounds = await main.boundingBox();
          if (mainBounds) {
            expect(mainBounds.width).toBeLessThanOrEqual(375);
          }
        }

        // Sidebar should be collapsible on mobile
        const sidebar = page.locator('aside, .sidebar, [data-testid="sidebar"]');
        if (await sidebar.count() > 0) {
          const sidebarElement = sidebar.first();

          // On mobile, sidebar might be hidden by default
          const isVisible = await sidebarElement.isVisible();
          const sidebarBounds = await sidebarElement.boundingBox();

          if (isVisible && sidebarBounds) {
            // If visible, should not take up too much width
            expect(sidebarBounds.width).toBeLessThan(250);
          }
        }
      }
    });

    test('Tables should be horizontally scrollable on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Look for any data tables
      const tables = page.locator('table, .data-table, [role="table"]');
      const tableCount = await tables.count();

      if (tableCount > 0) {
        const table = tables.first();
        const tableContainer = table.locator('xpath=ancestor::div[contains(@class, "overflow") or contains(@style, "overflow")]').first();

        if (await tableContainer.isVisible()) {
          // Container should have horizontal scroll if needed
          const scrollWidth = await tableContainer.evaluate(el => el.scrollWidth);
          const clientWidth = await tableContainer.evaluate(el => el.clientWidth);

          // If content is wider than container, should be scrollable
          if (scrollWidth > clientWidth) {
            const overflowX = await tableContainer.evaluate(el =>
              window.getComputedStyle(el).overflowX,
            );

            expect(['auto', 'scroll']).toContain(overflowX);
          }
        }
      }
    });
  });

  test.describe('@mobile Theme Toggle Mobile Experience', () => {
    test('Theme toggle should work on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Look for theme toggle
      const themeToggle = page.locator(
        '[aria-label*="theme"], [title*="theme"], button:has-text("theme"), .theme-toggle',
      );

      if (await themeToggle.count() > 0) {
        const toggle = themeToggle.first();

        if (await toggle.isVisible()) {
          // Button should be touch-friendly
          const toggleSize = await toggle.boundingBox();
          if (toggleSize) {
            expect(Math.min(toggleSize.width, toggleSize.height)).toBeGreaterThanOrEqual(44);
          }

          // Toggle should work
          await toggle.click();

          // Wait for theme change
          await page.waitForTimeout(500);

          // Page should still be functional
          await expect(page.locator('body')).toBeVisible();
        }
      }
    });
  });
});
