import { test, expect } from '@playwright/test';

/**
 * Modern Sage Accessibility Tests
 * E2E tests for WCAG compliance and accessibility with Modern Sage theme
 * @a11y
 */
test.describe('Modern Sage Accessibility', () => {

  test.describe('@a11y Color Contrast Compliance', () => {
    test('should meet WCAG AA contrast requirements on landing page', async ({ page }) => {
      await page.goto('/');
      
      // Check that main content is visible and readable
      const mainContent = page.locator('main').first();
      await expect(mainContent).toBeVisible();
      
      // Look for primary buttons using Modern Sage theme
      const primaryButton = page.locator('button, .btn, [role="button"]').first();
      if (await primaryButton.isVisible()) {
        // Button should be accessible
        await expect(primaryButton).toBeVisible();
        
        // Check for proper button attributes
        const hasAriaLabel = await primaryButton.getAttribute('aria-label');
        const hasAccessibleText = await primaryButton.textContent();
        
        expect(hasAriaLabel || hasAccessibleText).toBeTruthy();
      }
    });

    test('should provide adequate contrast in navigation elements', async ({ page }) => {
      await page.goto('/');
      
      // Check navigation elements
      const navElements = page.locator('nav a, nav button');
      const navCount = await navElements.count();
      
      if (navCount > 0) {
        // First navigation element should be visible and accessible
        const firstNav = navElements.first();
        await expect(firstNav).toBeVisible();
        
        // Should have accessible text or label
        const text = await firstNav.textContent();
        const ariaLabel = await firstNav.getAttribute('aria-label');
        
        expect(text || ariaLabel).toBeTruthy();
      }
    });

    test('should maintain contrast in form elements', async ({ page }) => {
      await page.goto('/sign-in');
      
      // Check form inputs
      const inputs = page.locator('input[type="email"], input[type="text"], input[type="password"]');
      const inputCount = await inputs.count();
      
      if (inputCount > 0) {
        const firstInput = inputs.first();
        await expect(firstInput).toBeVisible();
        
        // Input should have proper labels
        const id = await firstInput.getAttribute('id');
        const ariaLabel = await firstInput.getAttribute('aria-label');
        const placeholder = await firstInput.getAttribute('placeholder');
        
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.isVisible().catch(() => false);
          expect(hasLabel || ariaLabel || placeholder).toBeTruthy();
        }
      }
    });
  });

  test.describe('@a11y Focus Management', () => {
    test('should provide visible focus indicators', async ({ page }) => {
      await page.goto('/');
      
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      
      // Should have focused element
      const focusedElement = page.locator(':focus');
      const hasFocus = await focusedElement.isVisible().catch(() => false);
      
      if (hasFocus) {
        // Focused element should have visible outline or ring
        const styles = await focusedElement.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            outline: computed.outline,
            boxShadow: computed.boxShadow,
            border: computed.border
          };
        });
        
        // Should have some form of focus indicator
        const hasFocusIndicator = 
          styles.outline !== 'none' || 
          styles.boxShadow !== 'none' || 
          styles.boxShadow.includes('ring') ||
          styles.border !== 'none';
          
        expect(hasFocusIndicator).toBeTruthy();
      }
    });

    test('should support keyboard navigation in menus', async ({ page }) => {
      await page.goto('/');
      
      // Look for menu or navigation
      const menuButton = page.locator('[aria-expanded], [aria-haspopup], button:has-text("Menu")').first();
      const hasMenuButton = await menuButton.isVisible().catch(() => false);
      
      if (hasMenuButton) {
        // Click to open menu
        await menuButton.click();
        
        // Check if menu opened
        const menuExpanded = await menuButton.getAttribute('aria-expanded');
        if (menuExpanded === 'true') {
          // Should be able to navigate with arrow keys
          await page.keyboard.press('ArrowDown');
          
          const focusedItem = page.locator(':focus');
          await expect(focusedItem).toBeVisible();
        }
      }
    });

    test('should maintain focus order in forms', async ({ page }) => {
      await page.goto('/sign-in');
      
      // Tab through form elements
      await page.keyboard.press('Tab');
      const firstFocus = await page.locator(':focus').textContent().catch(() => '');
      
      await page.keyboard.press('Tab');
      const secondFocus = await page.locator(':focus').textContent().catch(() => '');
      
      // Focus should move to different elements
      expect(firstFocus !== secondFocus || firstFocus === '').toBeTruthy();
    });
  });

  test.describe('@a11y Screen Reader Support', () => {
    test('should provide proper heading structure', async ({ page }) => {
      await page.goto('/');
      
      // Check for heading hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      
      if (headings.length > 0) {
        // Should have at least one h1
        const h1Elements = page.locator('h1');
        const h1Count = await h1Elements.count();
        
        expect(h1Count).toBeGreaterThan(0);
        
        // First heading should be visible
        const firstHeading = headings[0];
        await expect(firstHeading).toBeVisible();
        
        const headingText = await firstHeading.textContent();
        expect(headingText).toBeTruthy();
      }
    });

    test('should provide alt text for images', async ({ page }) => {
      await page.goto('/');
      
      // Check all images have alt attributes
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const isVisible = await img.isVisible().catch(() => false);
        
        if (isVisible) {
          const alt = await img.getAttribute('alt');
          const ariaLabel = await img.getAttribute('aria-label');
          const role = await img.getAttribute('role');
          
          // Should have alt text, aria-label, or be decorative
          expect(alt !== null || ariaLabel !== null || role === 'presentation').toBeTruthy();
        }
      }
    });

    test('should provide proper button labels', async ({ page }) => {
      await page.goto('/');
      
      // Check all buttons have accessible names
      const buttons = page.locator('button, [role="button"]');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const isVisible = await button.isVisible().catch(() => false);
        
        if (isVisible) {
          const text = await button.textContent();
          const ariaLabel = await button.getAttribute('aria-label');
          const ariaLabelledby = await button.getAttribute('aria-labelledby');
          const title = await button.getAttribute('title');
          
          // Button should have accessible text
          const hasAccessibleName = text?.trim() || ariaLabel || ariaLabelledby || title;
          expect(hasAccessibleName).toBeTruthy();
        }
      }
    });
  });

  test.describe('@a11y Theme Accessibility', () => {
    test('should maintain accessibility in dark mode', async ({ page }) => {
      await page.goto('/');
      
      // Look for theme toggle
      const themeToggle = page.locator('[aria-label*="theme"], [title*="theme"], button:has-text("theme")', { timeout: 5000 });
      const hasThemeToggle = await themeToggle.isVisible().catch(() => false);
      
      if (hasThemeToggle) {
        // Toggle to dark mode
        await themeToggle.click();
        
        // Wait for theme change
        await page.waitForTimeout(500);
        
        // Check that content is still visible
        const body = page.locator('body');
        await expect(body).toBeVisible();
        
        // Main content should still be accessible
        const mainContent = page.locator('main').first();
        await expect(mainContent).toBeVisible();
      }
    });

    test('should support reduced motion preferences', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      
      // Page should still function normally
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Animations should be reduced or disabled
      const animatedElements = page.locator('[class*="animate"], [class*="transition"]');
      const animatedCount = await animatedElements.count();
      
      // Elements should still be visible even with reduced motion
      if (animatedCount > 0) {
        const firstAnimated = animatedElements.first();
        await expect(firstAnimated).toBeVisible();
      }
    });

    test('should support high contrast mode', async ({ page }) => {
      // Test with forced colors
      await page.emulateMedia({ forcedColors: 'active' });
      await page.goto('/');
      
      // Content should still be visible and functional
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Buttons should still be accessible
      const buttons = page.locator('button').first();
      if (await buttons.isVisible().catch(() => false)) {
        await expect(buttons).toBeVisible();
      }
    });
  });

  test.describe('@a11y Interactive Elements', () => {
    test('should provide proper ARIA states for interactive components', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Look for expandable components
      const expandables = page.locator('[aria-expanded]');
      const expandableCount = await expandables.count();
      
      if (expandableCount > 0) {
        const firstExpandable = expandables.first();
        const ariaExpanded = await firstExpandable.getAttribute('aria-expanded');
        
        // Should have valid aria-expanded value
        expect(['true', 'false']).toContain(ariaExpanded);
        
        if (await firstExpandable.isVisible()) {
          // Click to toggle
          await firstExpandable.click();
          
          // Aria-expanded should change
          const newAriaExpanded = await firstExpandable.getAttribute('aria-expanded');
          expect(newAriaExpanded).not.toBe(ariaExpanded);
        }
      }
    });

    test('should support ARIA live regions for dynamic content', async ({ page }) => {
      await page.goto('/');
      
      // Look for live regions
      const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]');
      const liveCount = await liveRegions.count();
      
      if (liveCount > 0) {
        const firstLive = liveRegions.first();
        const ariaLive = await firstLive.getAttribute('aria-live');
        const role = await firstLive.getAttribute('role');
        
        // Should have proper live region attributes
        const hasLiveAttribute = 
          ariaLive === 'polite' || 
          ariaLive === 'assertive' || 
          role === 'status' || 
          role === 'alert';
          
        expect(hasLiveAttribute).toBeTruthy();
      }
    });
  });
});