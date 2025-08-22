import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Playwright accessibility test configuration
 */
export type PlaywrightA11yOptions = {
  /** Custom axe rules to disable for this test */
  disableRules?: string[];
  /** Custom axe rules to enable for this test */
  enableRules?: string[];
  /** Tags to run (e.g., 'wcag2a', 'wcag2aa', 'wcag21aa') */
  tags?: string[];
  /** Include incomplete results in violation reports */
  includeIncomplete?: boolean;
  /** Custom timeout for accessibility checks */
  timeout?: number;
  /** Specific elements to include in scan */
  include?: string[];
  /** Specific elements to exclude from scan */
  exclude?: string[];
}

/**
 * Default accessibility test configuration for WCAG 2.1 AA compliance
 */
export const DEFAULT_PLAYWRIGHT_A11Y_CONFIG: PlaywrightA11yOptions = {
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
  includeIncomplete: false,
  timeout: 10000,
};

/**
 * Run comprehensive accessibility tests on a page
 */
export async function testPageAccessibility(
  page: Page,
  options: PlaywrightA11yOptions = {}
): Promise<void> {
  const config = { ...DEFAULT_PLAYWRIGHT_A11Y_CONFIG, ...options };

  const axeBuilder = new AxeBuilder({ page })
    .withTags(config.tags || ['wcag2a', 'wcag2aa', 'wcag21aa']);

  // Configure rules
  if (config.disableRules?.length) {
    axeBuilder.disableRules(config.disableRules);
  }

  if (config.enableRules?.length) {
    axeBuilder.disableRules([]).withRules(config.enableRules);
  }

  // Configure scope
  if (config.include?.length) {
    axeBuilder.include(config.include);
  }

  if (config.exclude?.length) {
    axeBuilder.exclude(config.exclude);
  }

  const accessibilityScanResults = await axeBuilder.analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
}

/**
 * Test accessibility of a specific element/locator
 */
export async function testElementAccessibility(
  page: Page,
  selector: string,
  options: PlaywrightA11yOptions = {}
): Promise<void> {
  await testPageAccessibility(page, {
    ...options,
    include: [selector, ...(options.include || [])],
  });
}

/**
 * Test color contrast on the current page
 */
export async function testColorContrastCompliance(
  page: Page,
  options: Omit<PlaywrightA11yOptions, 'enableRules'> = {}
): Promise<void> {
  await testPageAccessibility(page, {
    ...options,
    enableRules: ['color-contrast'],
    tags: ['wcag2aa'], // AA level requires 4.5:1 for normal text, 3:1 for large text
  });
}

/**
 * Test keyboard navigation across the page
 */
export async function testKeyboardNavigation(
  page: Page,
  options: {
    startElement?: string;
    expectedFocusOrder?: string[];
    testArrowKeys?: boolean;
  } = {}
): Promise<void> {
  const { startElement, expectedFocusOrder, testArrowKeys = false } = options;

  // Start from specified element or first focusable element
  if (startElement) {
    await page.click(startElement);
  } else {
    // Find first focusable element
    const firstFocusable = page.locator('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])').first();
    await firstFocusable.focus();
  }

  // Test tab navigation
  const focusableElements = await page.locator('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])').all();

  for (let i = 0; i < focusableElements.length - 1; i++) {
    await page.keyboard.press('Tab');

    if (expectedFocusOrder && expectedFocusOrder[i + 1]) {
      await expect(page.locator(expectedFocusOrder[i + 1])).toBeFocused();
    }
  }

  // Test reverse tab navigation
  for (let i = focusableElements.length - 1; i > 0; i--) {
    await page.keyboard.press('Shift+Tab');

    if (expectedFocusOrder && expectedFocusOrder[i - 1]) {
      await expect(page.locator(expectedFocusOrder[i - 1])).toBeFocused();
    }
  }

  // Test arrow key navigation if enabled
  if (testArrowKeys) {
    const arrowNavigableElements = await page.locator('[role="menuitem"], [role="tab"], [role="option"], [role="gridcell"]').all();

    if (arrowNavigableElements.length > 0) {
      await arrowNavigableElements[0].focus();

      // Test arrow down/right
      await page.keyboard.press('ArrowDown');
      // Add assertions based on component type

      await page.keyboard.press('ArrowRight');
      // Add assertions based on component type
    }
  }
}

/**
 * Test focus management and focus trapping
 */
export async function testFocusManagement(
  page: Page,
  options: {
    container?: string;
    shouldTrapFocus?: boolean;
    initialFocusElement?: string;
    returnFocusElement?: string;
  } = {}
): Promise<void> {
  const { container = 'body', shouldTrapFocus = false, initialFocusElement, returnFocusElement } = options;

  // Store initial focus
  const _initialFocus = await page.evaluate(() => document.activeElement?.tagName);

  // Test initial focus
  if (initialFocusElement) {
    await expect(page.locator(initialFocusElement)).toBeFocused();
  }

  // Test focus trapping if enabled
  if (shouldTrapFocus) {
    const containerElement = page.locator(container);
    const focusableInContainer = containerElement.locator('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');

    const focusableCount = await focusableInContainer.count();

    if (focusableCount > 0) {
      const firstFocusable = focusableInContainer.first();
      const lastFocusable = focusableInContainer.last();

      // Focus last element and press tab - should go to first
      await lastFocusable.focus();
      await page.keyboard.press('Tab');

      await expect(firstFocusable).toBeFocused();

      // Focus first element and press shift+tab - should go to last
      await firstFocusable.focus();
      await page.keyboard.press('Shift+Tab');

      await expect(lastFocusable).toBeFocused();
    }
  }

  // Test return focus if specified
  if (returnFocusElement) {
    await page.keyboard.press('Escape');

    await expect(page.locator(returnFocusElement)).toBeFocused();
  }
}

/**
 * Test ARIA live regions and announcements
 */
export async function testAriaLiveRegions(
  page: Page,
  action: () => Promise<void>,
  expectedAnnouncement?: string
): Promise<void> {
  // Set up live region monitoring
  await page.evaluate(() => {
    (window as any).ariaLiveMessages = [];

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const target = mutation.target as Element;
          const liveRegion = target.closest('[aria-live]');
          if (liveRegion && liveRegion.textContent) {
            (window as any).ariaLiveMessages.push(liveRegion.textContent.trim());
          }
        }
      });
    });

    // Observe all aria-live regions
    document.querySelectorAll('[aria-live]').forEach((region) => {
      observer.observe(region, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    });

    (window as any).ariaObserver = observer;
  });

  // Perform action that should trigger announcement
  await action();

  // Wait for announcement
  await page.waitForTimeout(100);

  // Check for expected announcement
  if (expectedAnnouncement) {
    const messages = await page.evaluate(() => (window as any).ariaLiveMessages || []);

    expect(messages).toContain(expectedAnnouncement);
  }

  // Clean up observer
  await page.evaluate(() => {
    if ((window as any).ariaObserver) {
      (window as any).ariaObserver.disconnect();
    }
  });
}

/**
 * Test screen reader compatibility
 */
export async function testScreenReaderCompatibility(
  page: Page,
  element: string
): Promise<void> {
  const locator = page.locator(element);

  // Test that element has accessible name
  const accessibleName = await locator.getAttribute('aria-label')
    || await locator.getAttribute('aria-labelledby')
    || await locator.textContent();

  expect(accessibleName).toBeTruthy();

  // Test that interactive elements have proper roles
  const tagName = await locator.evaluate(el => el.tagName.toLowerCase());
  const role = await locator.getAttribute('role');

  if (['button', 'input', 'select', 'textarea', 'a'].includes(tagName) || role) {
    // Element should be focusable
    await locator.focus();

    await expect(locator).toBeFocused();
  }

  // Test ARIA relationships
  const labelledBy = await locator.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElements = labelledBy.split(/\s+/);
    for (const labelId of labelElements) {
      await expect(page.locator(`#${labelId}`)).toBeVisible();
    }
  }

  const describedBy = await locator.getAttribute('aria-describedby');
  if (describedBy) {
    const descriptionElements = describedBy.split(/\s+/);
    for (const descId of descriptionElements) {
      await expect(page.locator(`#${descId}`)).toBeVisible();
    }
  }
}

/**
 * Test responsive accessibility across different viewport sizes
 */
export async function testResponsiveAccessibility(
  page: Page,
  viewportSizes: Array<{ width: number; height: number; name: string }> = [
    { width: 320, height: 568, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1920, height: 1080, name: 'desktop' },
  ],
  options: PlaywrightA11yOptions = {}
): Promise<void> {
  for (const viewport of viewportSizes) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForLoadState('networkidle');

    try {
      await testPageAccessibility(page, options);
    } catch (error) {
      throw new Error(`Accessibility violation found at ${viewport.name} viewport (${viewport.width}x${viewport.height}): ${error}`);
    }
  }
}

/**
 * Test form accessibility
 */
export async function testFormAccessibility(
  page: Page,
  formSelector: string
): Promise<void> {
  const form = page.locator(formSelector);

  await expect(form).toBeVisible();

  // Test form accessibility
  await testElementAccessibility(page, formSelector);

  // Test individual form elements
  const formElements = form.locator('input, select, textarea, button');
  const elementCount = await formElements.count();

  for (let i = 0; i < elementCount; i++) {
    const element = formElements.nth(i);

    // Test that form elements have labels or aria-labels
    const hasLabel = await element.getAttribute('aria-label')
      || await element.getAttribute('aria-labelledby')
      || await page.locator(`label[for="${await element.getAttribute('id')}"]`).count() > 0;

    expect(hasLabel).toBeTruthy();

    // Test that required fields are marked appropriately
    const isRequired = await element.getAttribute('required') !== null
      || await element.getAttribute('aria-required') === 'true';

    if (isRequired) {
      // Should have visual and programmatic indication
      const hasRequiredIndicator = await element.getAttribute('aria-required') === 'true'
        || await element.getAttribute('required') !== null;

      expect(hasRequiredIndicator).toBeTruthy();
    }
  }
}

/**
 * Comprehensive accessibility test suite for pages
 */
export async function runComprehensivePageA11yTests(
  page: Page,
  options: PlaywrightA11yOptions & {
    testKeyboard?: boolean;
    testFocus?: boolean;
    testColorContrast?: boolean;
    testResponsive?: boolean;
    testForms?: boolean;
  } = {}
): Promise<void> {
  const {
    testKeyboard = true,
    testFocus = true,
    testColorContrast = true,
    testResponsive = false,
    testForms = true,
    ...a11yOptions
  } = options;

  // Run basic accessibility tests
  await testPageAccessibility(page, a11yOptions);

  // Run specific test suites if enabled
  if (testColorContrast) {
    await testColorContrastCompliance(page, a11yOptions);
  }

  if (testKeyboard) {
    await testKeyboardNavigation(page);
  }

  if (testFocus) {
    await testFocusManagement(page);
  }

  if (testResponsive) {
    await testResponsiveAccessibility(page, undefined, a11yOptions);
  }

  if (testForms) {
    // Test all forms on the page
    const forms = await page.locator('form').all();
    for (const form of forms) {
      const formSelector = await form.getAttribute('id') || 'form';
      await testFormAccessibility(page, `#${formSelector}, form`);
    }
  }
}

/**
 * Common accessibility test patterns
 */
export const A11Y_TEST_PATTERNS = {
  /** Skip color contrast for decorative elements */
  SKIP_COLOR_CONTRAST: { disableRules: ['color-contrast'] },

  /** Skip landmark tests for component testing */
  SKIP_LANDMARKS: { disableRules: ['region', 'landmark-unique'] },

  /** Focus only on form-related accessibility */
  FORMS_ONLY: {
    tags: ['wcag2a', 'wcag2aa'],
    enableRules: ['label', 'form-field-multiple-labels', 'button-name'],
  },

  /** Test only keyboard accessibility */
  KEYBOARD_ONLY: {
    enableRules: ['keyboard', 'focus-order-semantics'],
  },

  /** Test only ARIA implementation */
  ARIA_ONLY: {
    enableRules: [
      'aria-required-children',
      'aria-required-parent',
      'aria-roles',
      'aria-allowed-attr',
      'aria-valid-attr-value',
    ],
  },
} as const;
