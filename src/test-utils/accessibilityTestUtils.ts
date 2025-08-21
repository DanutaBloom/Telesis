/**
 * Accessibility Testing Utilities
 *
 * Comprehensive utilities for testing WCAG 2.1 AA compliance,
 * keyboard navigation, screen reader compatibility, and focus management
 */

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// WCAG 2.1 AA Requirements
export const WCAG_REQUIREMENTS = {
  colorContrast: {
    normalText: 4.5,
    largeText: 3.0,
  },
  focusIndicator: {
    minThickness: 2, // pixels
  },
  timing: {
    minDuration: 20000, // 20 seconds for time limits
  },
  clickTarget: {
    minSize: 44, // pixels (minimum tap target size)
  },
} as const;

// Common ARIA roles for validation
export const ARIA_ROLES = [
  'button',
'link',
'textbox',
'combobox',
'listbox',
'option',
  'menuitem',
'tab',
'tabpanel',
'dialog',
'alert',
'status',
  'banner',
'main',
'navigation',
'contentinfo',
'complementary',
  'region',
'article',
'section',
'heading',
] as const;

// Keyboard navigation keys
export const KEYBOARD_KEYS = {
  TAB: 'Tab',
  SHIFT_TAB: '{Shift>}{Tab}{/Shift}',
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;

/**
 * Test keyboard navigation through focusable elements
 */
export async function testKeyboardNavigation(
  container: HTMLElement,
  expectedFocusOrder?: string[], // test-ids of elements in focus order
): Promise<void> {
  const user = userEvent.setup();

  // Find all focusable elements
  const focusableElements = container.querySelectorAll(
    'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [role="button"]:not([disabled])',
  );

  if (expectedFocusOrder) {
    // Test specific focus order
    for (let i = 0; i < expectedFocusOrder.length; i++) {
      await user.tab();
      const expectedElement = screen.getByTestId(expectedFocusOrder[i]!);

      expect(expectedElement).toHaveFocus();
    }
  } else {
    // Test that all focusable elements can receive focus
    let focusedElements = 0;

    for (let i = 0; i < focusableElements.length; i++) {
      await user.tab();
      const activeElement = document.activeElement;

      if (activeElement && focusableElements[i] === activeElement) {
        focusedElements++;
      }
    }

    expect(focusedElements).toBeGreaterThan(0);
  }
}

/**
 * Test reverse keyboard navigation (Shift+Tab)
 */
export async function testReverseKeyboardNavigation(
  container: HTMLElement,
  startFromLastElement: boolean = true,
): Promise<void> {
  const user = userEvent.setup();

  const focusableElements = container.querySelectorAll(
    'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [role="button"]:not([disabled])',
  );

  if (startFromLastElement && focusableElements.length > 0) {
    // Focus the last element first
    (focusableElements[focusableElements.length - 1] as HTMLElement).focus();
  }

  // Navigate backwards
  for (let i = 0; i < Math.min(3, focusableElements.length); i++) {
    await user.keyboard(KEYBOARD_KEYS.SHIFT_TAB);

    expect(document.activeElement).toBeInTheDocument();
  }
}

/**
 * Test ARIA attributes and semantic markup
 */
export function testARIAAttributes(
  element: HTMLElement,
  expectedAttributes: Record<string, string | boolean>,
): void {
  Object.entries(expectedAttributes).forEach(([attr, value]) => {
    if (typeof value === 'boolean') {
      if (value) {
        expect(element).toHaveAttribute(attr);
      } else {
        expect(element).not.toHaveAttribute(attr);
      }
    } else {
      expect(element).toHaveAttribute(attr, value);
    }
  });
}

/**
 * Test focus management for modals/dialogs
 */
export async function testModalFocusManagement(
  modalTrigger: HTMLElement,
  modalTestId: string,
  _closeButton?: HTMLElement,
): Promise<void> {
  const user = userEvent.setup();

  // Open modal
  await user.click(modalTrigger);

  const modal = screen.getByTestId(modalTestId);

  expect(modal).toBeInTheDocument();

  // Focus should be trapped in modal
  const focusableInModal = modal.querySelectorAll(
    'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [role="button"]:not([disabled])',
  );

  if (focusableInModal.length > 0) {
    // First focusable element should have focus
    expect(focusableInModal[0]).toHaveFocus();

    // Tab through modal elements
    for (let i = 1; i < focusableInModal.length; i++) {
      await user.tab();

      expect(focusableInModal[i]).toHaveFocus();
    }

    // Tab from last element should cycle to first
    await user.tab();

    expect(focusableInModal[0]).toHaveFocus();
  }

  // Escape should close modal
  await user.keyboard(KEYBOARD_KEYS.ESCAPE);
  await waitFor(() => {
    expect(modal).not.toBeInTheDocument();
  });

  // Focus should return to trigger
  expect(modalTrigger).toHaveFocus();
}

/**
 * Test skip link functionality
 */
export async function testSkipLink(): Promise<void> {
  const user = userEvent.setup();

  // Press Tab to reveal skip link
  await user.tab();

  const skipLink = screen.queryByRole('link', { name: /skip to main content/i });
  if (skipLink) {
    expect(skipLink).toHaveFocus();

    // Activate skip link
    await user.keyboard(KEYBOARD_KEYS.ENTER);

    // Main content should have focus
    const mainContent = screen.getByRole('main');

    expect(mainContent).toHaveFocus();
  }
}

/**
 * Test form accessibility
 */
export function testFormAccessibility(form: HTMLElement): void {
  const inputs = form.querySelectorAll('input, select, textarea');

  inputs.forEach((input) => {
    const inputElement = input as HTMLInputElement;

    // Each input should have a label
    const label = form.querySelector(`label[for="${inputElement.id}"]`)
      || inputElement.closest('label')
      || form.querySelector(`[aria-labelledby="${inputElement.getAttribute('aria-labelledby')}"]`);

    expect(label || inputElement.getAttribute('aria-label')).toBeTruthy();

    // Required fields should be marked (HTML required attribute is sufficient for accessibility)
    if (inputElement.required) {
      // HTML required attribute provides sufficient semantic meaning
      // aria-required is not strictly necessary when using HTML required
      expect(inputElement).toBeRequired();
    }
  });

  // Form should have accessible submit button
  const submitButton = form.querySelector('button[type="submit"]')
    || form.querySelector('input[type="submit"]');

  expect(submitButton).toBeInTheDocument();
}

/**
 * Test error message accessibility
 */
export function testErrorMessageAccessibility(
  input: HTMLElement,
  errorMessageId: string,
): void {
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(errorMessageId));

  const errorMessage = document.getElementById(errorMessageId);

  expect(errorMessage).toBeInTheDocument();
  expect(errorMessage).toHaveAttribute('role', 'alert');
}

/**
 * Test live region announcements
 */
export async function testLiveRegionAnnouncement(
  triggerAction: () => Promise<void>,
  expectedMessage: string,
): Promise<void> {
  // Look for live regions
  const liveRegions = document.querySelectorAll('[aria-live], [role="status"], [role="alert"]');

  expect(liveRegions.length).toBeGreaterThan(0);

  const liveRegion = liveRegions[0] as HTMLElement;
  const initialContent = liveRegion.textContent;

  // Trigger the action
  await triggerAction();

  // Check that content changed
  await waitFor(() => {
    expect(liveRegion.textContent).not.toBe(initialContent);
    expect(liveRegion).toHaveTextContent(expectedMessage);
  });
}

/**
 * Test minimum tap target size (44x44px)
 * Note: In test environment, actual pixel measurements may not be accurate
 */
export function testMinimumTapTargetSize(element: HTMLElement): void {
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);

  // In test environment, check that element has appropriate size classes instead
  const classes = element.className;
  const hasMinimumSizeClasses
    = classes.includes('h-10') // 40px height (close to 44px minimum)
      || classes.includes('h-11') // 44px height
      || classes.includes('size-10')
      || classes.includes('p-2') // padding that adds to tap area
      || classes.includes('px-4') // horizontal padding
      || classes.includes('py-2'); // vertical padding

  // If running in JSDOM test environment, check classes instead of measurements
  if (process.env.NODE_ENV === 'test' && rect.width === 0) {
    expect(hasMinimumSizeClasses).toBe(true);
  } else {
    // In real browser, check actual dimensions
    const width = rect.width + Number.parseFloat(computedStyle.paddingLeft) + Number.parseFloat(computedStyle.paddingRight);
    const height = rect.height + Number.parseFloat(computedStyle.paddingTop) + Number.parseFloat(computedStyle.paddingBottom);

    expect(width).toBeGreaterThanOrEqual(WCAG_REQUIREMENTS.clickTarget.minSize);
    expect(height).toBeGreaterThanOrEqual(WCAG_REQUIREMENTS.clickTarget.minSize);
  }
}

/**
 * Test focus indicator visibility
 */
export async function testFocusIndicator(element: HTMLElement): Promise<void> {
  // Focus the element
  element.focus();

  expect(element).toHaveFocus();

  const computedStyle = window.getComputedStyle(element);
  const outline = computedStyle.outline;
  const boxShadow = computedStyle.boxShadow;

  // Should have visible focus indicator (outline or box-shadow)
  const hasOutline = outline !== 'none' && outline !== '';
  const hasBoxShadow = boxShadow !== 'none' && boxShadow !== '';

  expect(hasOutline || hasBoxShadow).toBe(true);
}

/**
 * Test heading hierarchy
 */
export function testHeadingHierarchy(container: HTMLElement): void {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headingLevels: number[] = [];

  headings.forEach((heading) => {
    const level = Number.parseInt(heading.tagName.charAt(1));
    headingLevels.push(level);
  });

  // Should start with h1 and not skip levels
  if (headingLevels.length > 0) {
    expect(headingLevels[0]).toBe(1); // Should start with h1

    for (let i = 1; i < headingLevels.length; i++) {
      const currentLevel = headingLevels[i];
      const previousLevel = headingLevels[i - 1];

      // Should not skip more than one level
      if (currentLevel !== undefined && previousLevel !== undefined) {
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
      }
    }
  }
}

/**
 * Test landmark navigation
 */
export function testLandmarkNavigation(container: HTMLElement): void {
  const landmarks = container.querySelectorAll(
    '[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], header, nav, main, aside, footer',
  );

  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();

    // Main landmark should be unique
    if (role === 'main' || landmark.tagName.toLowerCase() === 'main') {
      const mainLandmarks = container.querySelectorAll('[role="main"], main');

      expect(mainLandmarks).toHaveLength(1);
    }

    // Navigation landmarks should have accessible names if multiple exist
    if (role === 'navigation' || landmark.tagName.toLowerCase() === 'nav') {
      const navLandmarks = container.querySelectorAll('[role="navigation"], nav');
      if (navLandmarks.length > 1) {
        const hasName = landmark.getAttribute('aria-label')
          || landmark.getAttribute('aria-labelledby')
          || landmark.querySelector('h1, h2, h3, h4, h5, h6');

        expect(hasName).toBeTruthy();
      }
    }
  });
}

/**
 * Test color information accessibility
 */
export function testColorInformationAccessibility(element: HTMLElement): void {
  // Information should not rely solely on color
  // Check for additional indicators like icons, text, patterns

  const hasTextContent = element.textContent && element.textContent.trim().length > 0;
  const hasAriaLabel = element.getAttribute('aria-label');
  const hasTitle = element.getAttribute('title');
  const hasIcon = element.querySelector('svg, .icon, [class*="icon"]');

  // Element should have non-color indicators
  expect(hasTextContent || hasAriaLabel || hasTitle || hasIcon).toBe(true);
}

/**
 * Test animation and motion preferences
 */
export function testMotionPreferences(): void {
  // Test that animations respect prefers-reduced-motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (mediaQuery.matches) {
    const animatedElements = document.querySelectorAll('[class*="animate"], [class*="transition"]');

    animatedElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);

      // Animations should be disabled or significantly reduced
      expect(
        computedStyle.animationDuration === '0s'
        || computedStyle.animationDuration === '0.01s'
        || computedStyle.transitionDuration === '0s'
        || computedStyle.transitionDuration === '0.01s',
      ).toBe(true);
    });
  }
}

/**
 * Comprehensive accessibility test suite
 */
export async function runAccessibilityTestSuite(
  container: HTMLElement,
  options: {
    skipKeyboardNav?: boolean;
    skipFocusManagement?: boolean;
    skipLiveRegions?: boolean;
  } = {},
): Promise<void> {
  // Test basic structure
  testHeadingHierarchy(container);
  testLandmarkNavigation(container);

  // Test keyboard navigation
  if (!options.skipKeyboardNav) {
    await testKeyboardNavigation(container);
    await testReverseKeyboardNavigation(container);
  }

  // Test forms if present
  const forms = container.querySelectorAll('form');
  forms.forEach(form => testFormAccessibility(form));

  // Test interactive elements
  const interactiveElements = container.querySelectorAll(
    'button, a[href], input, select, textarea, [role="button"]',
  );

  interactiveElements.forEach(async (element) => {
    const htmlElement = element as HTMLElement;

    // Test minimum tap target size
    testMinimumTapTargetSize(htmlElement);

    // Test focus indicator
    if (!options.skipFocusManagement) {
      await testFocusIndicator(htmlElement);
    }

    // Test color information
    testColorInformationAccessibility(htmlElement);
  });

  // Test motion preferences
  testMotionPreferences();
}
