/**
 * Cross-Browser Compatibility E2E Tests
 * Tests functionality across Chrome, Firefox, and Safari
 * @browser @compatibility
 */

import { expect, test } from '@playwright/test';

const CRITICAL_USER_FLOWS = [
  {
    name: 'Landing Page Visit',
    path: '/',
    checks: [
      { selector: 'h1', description: 'Main heading visible' },
      { selector: 'nav', description: 'Navigation accessible' },
      { selector: 'a[href*="sign"], button:has-text("Get Started")', description: 'CTA buttons present' },
    ],
  },
  {
    name: 'Sign-in Page',
    path: '/sign-in',
    checks: [
      { selector: 'form', description: 'Sign-in form present' },
      { selector: 'input[type="email"]', description: 'Email input accessible' },
      { selector: 'input[type="password"]', description: 'Password input accessible' },
      { selector: 'button[type="submit"]', description: 'Submit button functional' },
    ],
  },
  {
    name: 'Sign-up Page',
    path: '/sign-up',
    checks: [
      { selector: 'form', description: 'Sign-up form present' },
      { selector: 'input[name*="email"], input[type="email"]', description: 'Email field accessible' },
      { selector: 'input[name*="password"], input[type="password"]', description: 'Password field accessible' },
      { selector: 'button[type="submit"]', description: 'Submit button functional' },
    ],
  },
  {
    name: 'Dashboard Access',
    path: '/dashboard',
    checks: [
      { selector: 'main, form', description: 'Main content or redirect to auth' },
    ],
  },
];

test.describe('Cross-Browser Compatibility', () => {
  test.describe('@browser Core Functionality Tests', () => {
    CRITICAL_USER_FLOWS.forEach((flow) => {
      test(`${flow.name} should work consistently across browsers`, async ({ page, browserName }) => {
        console.log(`Testing ${flow.name} on ${browserName}`);

        await page.goto(flow.path);

        // Check each required element
        for (const check of flow.checks) {
          const element = page.locator(check.selector).first();

          try {
            await expect(element).toBeVisible({ timeout: 10000 });

            console.log(`✓ ${check.description} - ${browserName}`);
          } catch (error) {
            console.error(`✗ ${check.description} failed on ${browserName}:`, error);

            // Take screenshot for debugging
            await page.screenshot({
              path: `test-results/browser-${browserName}-${flow.name.replace(/\s+/g, '-')}-failure.png`,
              fullPage: true,
            });

            throw error;
          }
        }

        // Browser-specific checks
        if (browserName === 'webkit') {
          // Safari-specific checks
          await checkSafariSpecificFeatures(page);
        } else if (browserName === 'firefox') {
          // Firefox-specific checks
          await checkFirefoxSpecificFeatures(page);
        } else if (browserName === 'chromium') {
          // Chrome-specific checks
          await checkChromeSpecificFeatures(page);
        }
      });
    });
  });

  test.describe('@browser CSS and Styling Compatibility', () => {
    test('Modern CSS features should work across browsers', async ({ page, browserName }) => {
      await page.goto('/');

      // Test CSS Grid support
      const gridElements = page.locator('[style*="grid"], .grid, [class*="grid"]');
      const gridCount = await gridElements.count();

      if (gridCount > 0) {
        const gridElement = gridElements.first();
        const gridDisplay = await gridElement.evaluate(el =>
          window.getComputedStyle(el).display,
        );

        if (browserName !== 'webkit' || process.env.CI) {
          // Grid should be supported in modern browsers
          expect(['grid', 'inline-grid']).toContain(gridDisplay);
        }
      }

      // Test Flexbox support
      const flexElements = page.locator('[style*="flex"], .flex, [class*="flex"]');
      const flexCount = await flexElements.count();

      if (flexCount > 0) {
        const flexElement = flexElements.first();
        const flexDisplay = await flexElement.evaluate(el =>
          window.getComputedStyle(el).display,
        );

        // Flexbox should be universally supported
        expect(['flex', 'inline-flex']).toContain(flexDisplay);
      }

      // Test CSS Custom Properties (CSS Variables)
      const hasCustomProps = await page.evaluate(() => {
        const el = document.documentElement;
        const styles = window.getComputedStyle(el);

        // Look for common CSS custom properties
        for (let i = 0; i < styles.length; i++) {
          const prop = styles[i];
          if (prop.startsWith('--')) {
            return true;
          }
        }
        return false;
      });

      console.log(`CSS Custom Properties supported: ${hasCustomProps} (${browserName})`);

      // Modern browsers should support CSS variables
      if (browserName !== 'webkit' || Number.parseFloat(process.env.WEBKIT_VERSION || '14') >= 14) {
        expect(hasCustomProps).toBe(true);
      }
    });

    test('Theme switching should work across browsers', async ({ page, browserName }) => {
      await page.goto('/');

      // Look for theme toggle
      const themeToggle = page.locator(
        '[aria-label*="theme"], [title*="theme"], button:has-text("theme"), .theme-toggle',
      );

      if (await themeToggle.count() > 0) {
        const toggle = themeToggle.first();

        if (await toggle.isVisible()) {
          // Get initial theme state
          const initialTheme = await page.evaluate(() => {
            return document.documentElement.classList.contains('dark')
              || document.documentElement.getAttribute('data-theme')
              || localStorage.getItem('theme');
          });

          console.log(`Initial theme state (${browserName}):`, initialTheme);

          // Toggle theme
          await toggle.click();
          await page.waitForTimeout(500);

          // Check theme changed
          const newTheme = await page.evaluate(() => {
            return document.documentElement.classList.contains('dark')
              || document.documentElement.getAttribute('data-theme')
              || localStorage.getItem('theme');
          });

          console.log(`New theme state (${browserName}):`, newTheme);

          // Theme should have changed
          expect(newTheme).not.toBe(initialTheme);
        }
      }
    });
  });

  test.describe('@browser JavaScript Feature Compatibility', () => {
    test('Modern JavaScript features should work', async ({ page, browserName }) => {
      await page.goto('/');

      const jsFeatures = await page.evaluate(() => {
        const features = {
          asyncAwait: typeof async function () {} === 'function',
          arrow: (() => true)(),
          destructuring: (() => {
 try {
 const { a } = { a: 1 };
return a === 1;
} catch {
 return false;
}
})(),
          templateLiterals: (() => {
 try {
 return `test${1}` === 'test1';
} catch {
 return false;
}
})(),
          fetch: typeof fetch === 'function',
          promise: typeof Promise === 'function',
          classes: (() => {
 try {
 class _Test {}
return true;
} catch {
 return false;
}
})(),
          modules: 'import' in window,
          const: (() => {
 try {
 const _a = 1;
return true;
} catch {
 return false;
}
})(),
          let: (() => {
 try {
 const _a = 1;
return true;
} catch {
 return false;
}
})(),
        };

        return features;
      });

      console.log(`JavaScript features (${browserName}):`, jsFeatures);

      // Core features that should work in all modern browsers
      expect(jsFeatures.promise).toBe(true);
      expect(jsFeatures.arrow).toBe(true);
      expect(jsFeatures.const).toBe(true);
      expect(jsFeatures.let).toBe(true);

      // Fetch should be available in modern browsers
      if (browserName !== 'webkit' || process.env.CI) {
        expect(jsFeatures.fetch).toBe(true);
      }
    });

    test('Form validation should work consistently', async ({ page, browserName }) => {
      await page.goto('/sign-in');

      // Test HTML5 form validation
      const emailInput = page.locator('input[type="email"]').first();

      if (await emailInput.isVisible()) {
        // Test invalid email
        await emailInput.fill('invalid-email');

        const validationMessage = await emailInput.evaluate((input: HTMLInputElement) => {
          return input.validationMessage;
        });

        console.log(`Validation message (${browserName}):`, validationMessage);

        // Should have some validation message for invalid email
        expect(validationMessage).toBeTruthy();

        // Test valid email
        await emailInput.fill('test@example.com');

        const validValidationMessage = await emailInput.evaluate((input: HTMLInputElement) => {
          return input.validationMessage;
        });

        // Should be valid now
        expect(validValidationMessage).toBe('');
      }
    });
  });

  test.describe('@browser Event Handling Compatibility', () => {
    test('Click events should work across browsers', async ({ page, browserName }) => {
      await page.goto('/');

      // Find clickable elements
      const clickables = page.locator('button, a[href], [role="button"]');
      const clickableCount = await clickables.count();

      if (clickableCount > 0) {
        const element = clickables.first();

        // Test regular click
        let clicked = false;
        await page.evaluate(() => {
          window.testClickWorked = false;
          document.addEventListener('click', () => {
            window.testClickWorked = true;
          });
        });

        await element.click();

        clicked = await page.evaluate(() => window.testClickWorked);

        expect(clicked).toBe(true);

        console.log(`Click event works on ${browserName}`);
      }
    });

    test('Keyboard navigation should work consistently', async ({ page, browserName }) => {
      await page.goto('/sign-in');

      // Test tab navigation
      await page.keyboard.press('Tab');

      const firstFocused = await page.locator(':focus').count();

      expect(firstFocused).toBeGreaterThan(0);

      // Continue tabbing
      await page.keyboard.press('Tab');

      const secondFocused = await page.locator(':focus').count();

      expect(secondFocused).toBeGreaterThan(0);

      console.log(`Keyboard navigation works on ${browserName}`);
    });
  });

  test.describe('@browser Local Storage and Session Compatibility', () => {
    test('Local storage should work consistently', async ({ page, browserName }) => {
      await page.goto('/');

      // Test localStorage
      const localStorageWorks = await page.evaluate(() => {
        try {
          localStorage.setItem('test', 'value');
          const retrieved = localStorage.getItem('test');
          localStorage.removeItem('test');
          return retrieved === 'value';
        } catch {
          return false;
        }
      });

      expect(localStorageWorks).toBe(true);

      console.log(`localStorage works on ${browserName}`);

      // Test sessionStorage
      const sessionStorageWorks = await page.evaluate(() => {
        try {
          sessionStorage.setItem('test', 'value');
          const retrieved = sessionStorage.getItem('test');
          sessionStorage.removeItem('test');
          return retrieved === 'value';
        } catch {
          return false;
        }
      });

      expect(sessionStorageWorks).toBe(true);

      console.log(`sessionStorage works on ${browserName}`);
    });
  });
});

// Browser-specific helper functions
async function checkSafariSpecificFeatures(page: any) {
  // Check Safari-specific behaviors
  const safariFeatures = await page.evaluate(() => {
    const isSafari = /^(?:(?!chrome|android).)*safari/i.test(navigator.userAgent);
    return {
      isSafari,
      webkitPrefixes: 'webkitRequestAnimationFrame' in window,
      touchSupport: 'ontouchstart' in window,
    };
  });

  console.log('Safari-specific features:', safariFeatures);
}

async function checkFirefoxSpecificFeatures(page: any) {
  // Check Firefox-specific behaviors
  const firefoxFeatures = await page.evaluate(() => {
    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
    return {
      isFirefox,
      mozPrefixes: 'mozRequestAnimationFrame' in window,
      firefoxVersion: navigator.userAgent.match(/Firefox\/(\d+)/)?.[1],
    };
  });

  console.log('Firefox-specific features:', firefoxFeatures);
}

async function checkChromeSpecificFeatures(page: any) {
  // Check Chrome-specific behaviors
  const chromeFeatures = await page.evaluate(() => {
    const isChrome = navigator.userAgent.toLowerCase().includes('chrome');
    return {
      isChrome,
      chromeVersion: navigator.userAgent.match(/Chrome\/(\d+)/)?.[1],
      performance: 'performance' in window && 'memory' in (performance as any),
    };
  });

  console.log('Chrome-specific features:', chromeFeatures);
}
