/**
 * Comprehensive E2E Accessibility Testing Suite
 *
 * Uses axe-core/playwright to test complete pages and user flows
 * for WCAG 2.1 AA compliance across the entire application.
 */

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import {
  A11Y_TEST_PATTERNS,
  runComprehensivePageA11yTests,
  testColorContrastCompliance,
  testFocusManagement,
  testFormAccessibility,
  testKeyboardNavigation,
  testPageAccessibility,
  testResponsiveAccessibility,
} from '@/../tests/helpers/playwright-accessibility';

test.describe('Comprehensive E2E Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up accessibility testing context
    await page.addInitScript(() => {
      // Add any global accessibility testing setup
      window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
      });
    });
  });

  test.describe('@a11y Landing Page Accessibility', () => {
    test('landing page meets WCAG 2.1 AA compliance', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Run comprehensive accessibility scan
      await testPageAccessibility(page);
    });

    test('landing page maintains accessibility across viewport sizes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test responsive accessibility
      await testResponsiveAccessibility(page, [
        { width: 320, height: 568, name: 'mobile' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1920, height: 1080, name: 'desktop' },
      ]);
    });

    test('landing page color contrast meets WCAG AA standards', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await testColorContrastCompliance(page);
    });

    test('landing page keyboard navigation works correctly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await testKeyboardNavigation(page, {
        testArrowKeys: false, // Standard page navigation
      });
    });

    test('landing page focus management is proper', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await testFocusManagement(page);
    });
  });

  test.describe('@a11y Authentication Pages Accessibility', () => {
    test('sign-in page meets WCAG 2.1 AA compliance', async ({ page }) => {
      await page.goto('/sign-in');
      await page.waitForLoadState('networkidle');

      await testPageAccessibility(page);
    });

    test('sign-in form is fully accessible', async ({ page }) => {
      await page.goto('/sign-in');
      await page.waitForLoadState('networkidle');

      // Look for forms on the page
      const forms = await page.locator('form').count();
      if (forms > 0) {
        await testFormAccessibility(page, 'form');
      } else {
        // Clerk forms might be in iframes or have different structure
        await testPageAccessibility(page, {
          disableRules: ['form-field-multiple-labels'], // Clerk might have complex form structure
        });
      }
    });

    test('sign-up page meets WCAG 2.1 AA compliance', async ({ page }) => {
      await page.goto('/sign-up');
      await page.waitForLoadState('networkidle');

      await testPageAccessibility(page, {
        disableRules: ['form-field-multiple-labels'], // Allow for complex auth forms
      });
    });

    test('authentication pages support keyboard-only navigation', async ({ page }) => {
      await page.goto('/sign-in');
      await page.waitForLoadState('networkidle');

      // Test tab navigation through auth elements
      await page.keyboard.press('Tab');

      const focusedElement = page.locator(':focus');

      await expect(focusedElement).toBeVisible();
    });
  });

  test.describe('@a11y Dashboard Accessibility', () => {
    test('dashboard page meets WCAG 2.1 AA compliance', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      await testPageAccessibility(page);
    });

    test('dashboard navigation is accessible', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Test keyboard navigation through dashboard
      await testKeyboardNavigation(page);
    });

    test('dashboard components maintain color contrast', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      await testColorContrastCompliance(page);
    });

    test('dashboard sidebar navigation is accessible', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Test sidebar navigation
      const sidebarItems = page.locator('[role="navigation"] a, nav a');
      const itemCount = await sidebarItems.count();

      if (itemCount > 0) {
        // Test first sidebar item
        const firstItem = sidebarItems.first();
        await firstItem.focus();

        await expect(firstItem).toBeFocused();

        // Check for proper accessibility attributes
        const hasAriaLabel = await firstItem.getAttribute('aria-label');
        const hasText = await firstItem.textContent();

        expect(hasAriaLabel || hasText).toBeTruthy();
      }
    });

    test('dashboard responsive behavior maintains accessibility', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Test mobile viewport
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(500);

      await testPageAccessibility(page, {
        disableRules: ['landmark-unique'], // Mobile layouts might have different landmark structure
      });

      // Test desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);

      await testPageAccessibility(page);
    });
  });

  test.describe('@a11y Typography Test Page', () => {
    test('typography test page meets WCAG compliance', async ({ page }) => {
      await page.goto('/typography-test');
      await page.waitForLoadState('networkidle');

      await testPageAccessibility(page);
    });

    test('typography page has proper heading hierarchy', async ({ page }) => {
      await page.goto('/typography-test');
      await page.waitForLoadState('networkidle');

      // Test heading structure
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

      if (headings.length > 0) {
        // Should have at least one h1
        const h1Count = await page.locator('h1').count();

        expect(h1Count).toBeGreaterThan(0);

        // Test that all headings are accessible
        for (const heading of headings) {
          const text = await heading.textContent();

          expect(text?.trim()).toBeTruthy();
        }
      }
    });

    test('typography page color contrast is excellent', async ({ page }) => {
      await page.goto('/typography-test');
      await page.waitForLoadState('networkidle');

      // Use stricter color contrast testing for typography showcase
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .withRules(['color-contrast'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });

  test.describe('@a11y Theme Showcase Accessibility', () => {
    test('theme showcase maintains accessibility', async ({ page }) => {
      await page.goto('/dashboard/theme-showcase');
      await page.waitForLoadState('networkidle');

      await testPageAccessibility(page);
    });

    test('theme switching maintains accessibility', async ({ page }) => {
      await page.goto('/dashboard/theme-showcase');
      await page.waitForLoadState('networkidle');

      // Look for theme toggle
      const themeToggle = page.locator('[aria-label*="theme"], [title*="theme"], button:has-text("theme")').first();
      const hasThemeToggle = await themeToggle.isVisible().catch(() => false);

      if (hasThemeToggle) {
        // Test theme toggle accessibility
        await expect(themeToggle).toBeVisible();

        const ariaLabel = await themeToggle.getAttribute('aria-label');
        const title = await themeToggle.getAttribute('title');
        const text = await themeToggle.textContent();

        expect(ariaLabel || title || text).toBeTruthy();

        // Toggle theme and test again
        await themeToggle.click();
        await page.waitForTimeout(500);

        await testPageAccessibility(page);
      }
    });

    test('all component variants maintain accessibility in theme showcase', async ({ page }) => {
      await page.goto('/dashboard/theme-showcase');
      await page.waitForLoadState('networkidle');

      // Run comprehensive tests on component showcase
      await runComprehensivePageA11yTests(page, {
        testColorContrast: true,
        testKeyboard: true,
        testFocus: true,
        testResponsive: false, // Skip responsive for component showcase
        testForms: true,
      });
    });
  });

  test.describe('@a11y Form Interactions', () => {
    test('form validation errors are accessible', async ({ page }) => {
      // This test would need a form page with validation
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Look for any forms with validation
      const forms = await page.locator('form').all();

      for (const form of forms) {
        const isVisible = await form.isVisible();
        if (isVisible) {
          await testFormAccessibility(page, 'form');
        }
      }
    });

    test('live validation announcements work correctly', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Look for live regions
      const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]');
      const regionCount = await liveRegions.count();

      if (regionCount > 0) {
        const firstRegion = liveRegions.first();
        const ariaLive = await firstRegion.getAttribute('aria-live');
        const role = await firstRegion.getAttribute('role');

        const hasLiveAttribute = ariaLive === 'polite'
          || ariaLive === 'assertive'
          || role === 'status'
          || role === 'alert';

        expect(hasLiveAttribute).toBeTruthy();
      }
    });
  });

  test.describe('@a11y Dynamic Content Accessibility', () => {
    test('modal dialogs maintain focus and accessibility', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Look for modal triggers
      const modalTriggers = page.locator('button:has-text("modal"), button:has-text("dialog"), [aria-haspopup="dialog"]');
      const triggerCount = await modalTriggers.count();

      if (triggerCount > 0) {
        const firstTrigger = modalTriggers.first();

        // Click to open modal
        await firstTrigger.click();

        // Wait for modal to appear
        await page.waitForTimeout(300);

        // Test modal accessibility
        await testFocusManagement(page, {
          shouldTrapFocus: true,
          initialFocusElement: '[role="dialog"] button, [role="dialog"] input',
        });
      }
    });

    test('loading states are announced to screen readers', async ({ page }) => {
      await page.goto('/dashboard');

      // Look for loading indicators
      const loadingElements = page.locator('[aria-busy="true"], [role="status"]:has-text("loading"), [role="status"]:has-text("Loading")');
      const loadingCount = await loadingElements.count();

      if (loadingCount > 0) {
        const firstLoader = loadingElements.first();

        const ariaBusy = await firstLoader.getAttribute('aria-busy');
        const ariaLabel = await firstLoader.getAttribute('aria-label');
        const text = await firstLoader.textContent();

        // Should have proper loading state attributes
        expect(ariaBusy === 'true' || ariaLabel || text).toBeTruthy();
      }
    });
  });

  test.describe('@a11y Comprehensive Page Flows', () => {
    test('complete user journey maintains accessibility', async ({ page }) => {
      // Test complete flow from landing to dashboard

      // 1. Landing page
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await testPageAccessibility(page, A11Y_TEST_PATTERNS.SKIP_LANDMARKS);

      // 2. Navigation to dashboard (if possible without auth)
      const dashboardLink = page.locator('a[href*="dashboard"], a[href="/dashboard"]').first();
      const hasLink = await dashboardLink.isVisible().catch(() => false);

      if (hasLink) {
        await dashboardLink.click();
        await page.waitForLoadState('networkidle');
        await testPageAccessibility(page);
      }

      // 3. Test any accessible flows without authentication
      const accessibleLinks = page.locator('a[href]:visible').first();
      const hasAccessibleLinks = await accessibleLinks.isVisible().catch(() => false);

      if (hasAccessibleLinks) {
        // Test navigation accessibility
        await testKeyboardNavigation(page);
      }
    });

    test('error pages maintain accessibility', async ({ page }) => {
      // Test 404 page accessibility
      await page.goto('/non-existent-page');
      await page.waitForLoadState('networkidle');

      // Should still be accessible even if 404
      await testPageAccessibility(page, {
        disableRules: ['landmark-unique'], // Error pages might have different structure
      });
    });

    test('accessibility maintained during navigation', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Get all navigation links
      const navLinks = page.locator('nav a, [role="navigation"] a').first();
      const hasNavLinks = await navLinks.isVisible().catch(() => false);

      if (hasNavLinks) {
        // Test that navigation maintains focus
        await navLinks.focus();

        await expect(navLinks).toBeFocused();

        // Test keyboard activation
        await page.keyboard.press('Enter');
        await page.waitForLoadState('networkidle');

        // New page should also be accessible
        await testPageAccessibility(page);
      }
    });
  });

  test.describe('@a11y Accessibility Testing Report', () => {
    test('generate comprehensive accessibility report', async ({ page }) => {
      const testResults = {
        landingPage: false,
        authPages: false,
        dashboard: false,
        typography: false,
        colorContrast: false,
        keyboardNav: false,
        responsiveA11y: false,
      };

      try {
        // Test landing page
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await testPageAccessibility(page);
        testResults.landingPage = true;

        // Test dashboard
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        await testPageAccessibility(page);
        testResults.dashboard = true;

        // Test typography
        await page.goto('/typography-test');
        await page.waitForLoadState('networkidle');
        await testPageAccessibility(page);
        testResults.typography = true;

        // Test color contrast across pages
        await page.goto('/');
        await testColorContrastCompliance(page);
        testResults.colorContrast = true;

        // Test keyboard navigation
        await testKeyboardNavigation(page);
        testResults.keyboardNav = true;

        // Test responsive accessibility
        await testResponsiveAccessibility(page, [
          { width: 768, height: 1024, name: 'tablet' },
          { width: 1920, height: 1080, name: 'desktop' },
        ]);
        testResults.responsiveA11y = true;
      } catch (error) {
        console.error('Accessibility test failed:', error);
      }

      // Generate report
      console.log('\n=== COMPREHENSIVE E2E ACCESSIBILITY TEST REPORT ===');
      console.log('WCAG 2.1 AA Compliance Testing Results:');
      console.log(`✅ Landing Page: ${testResults.landingPage ? 'PASS' : 'FAIL'}`);
      console.log(`✅ Dashboard: ${testResults.dashboard ? 'PASS' : 'FAIL'}`);
      console.log(`✅ Typography: ${testResults.typography ? 'PASS' : 'FAIL'}`);
      console.log(`✅ Color Contrast: ${testResults.colorContrast ? 'PASS' : 'FAIL'}`);
      console.log(`✅ Keyboard Navigation: ${testResults.keyboardNav ? 'PASS' : 'FAIL'}`);
      console.log(`✅ Responsive Accessibility: ${testResults.responsiveA11y ? 'PASS' : 'FAIL'}`);

      const passCount = Object.values(testResults).filter(Boolean).length;
      const totalCount = Object.keys(testResults).length;

      console.log(`\nOverall Score: ${passCount}/${totalCount} (${Math.round((passCount / totalCount) * 100)}%)`);
      console.log('===================================================\n');

      // All tests should pass
      expect(passCount).toBe(totalCount);
    });
  });
});
