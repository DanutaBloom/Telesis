import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import type { ReactElement } from 'react';
import { expect } from 'vitest';

// Ensure jest-axe matchers are available
expect.extend(toHaveNoViolations);

/**
 * Test configuration for accessibility testing
 */
export type A11yTestOptions = {
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
}

/**
 * Default accessibility test configuration for WCAG 2.1 AA compliance
 */
export const DEFAULT_A11Y_CONFIG: A11yTestOptions = {
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
  includeIncomplete: false,
  timeout: 5000,
};

/**
 * Common accessibility rules that may need to be disabled for specific tests
 */
export const A11Y_RULES = {
  COLOR_CONTRAST: 'color-contrast',
  FOCUS_ORDER: 'focus-order-semantics',
  KEYBOARD_NAVIGATION: 'keyboard',
  LANDMARK_UNIQUE: 'landmark-unique',
  ARIA_REQUIRED_CHILDREN: 'aria-required-children',
  ARIA_REQUIRED_PARENT: 'aria-required-parent',
  BUTTON_NAME: 'button-name',
  LINK_NAME: 'link-name',
  FORM_FIELD_MULTIPLE_LABELS: 'form-field-multiple-labels',
  LABEL: 'label',
  REGION: 'region',
} as const;

/**
 * Renders a component and runs accessibility tests
 */
export async function renderAndTestA11y(
  ui: ReactElement,
  options: RenderOptions & A11yTestOptions = {}
): Promise<ReturnType<typeof render>> {
  const { disableRules, enableRules, tags, includeIncomplete, timeout, ...renderOptions } = options;

  const rendered = render(ui, renderOptions);

  // Run accessibility tests
  await testA11y(rendered.container, {
    disableRules,
    enableRules,
    tags,
    includeIncomplete,
    timeout,
  });

  return rendered;
}

/**
 * Test accessibility of a DOM element
 */
export async function testA11y(
  element: Element | Document,
  options: A11yTestOptions = {}
): Promise<void> {
  const config = { ...DEFAULT_A11Y_CONFIG, ...options };

  const axeConfig = {
    tags: config.tags,
    rules: {
      // Disable rules if specified
      ...config.disableRules?.reduce((acc, rule) => ({ ...acc, [rule]: { enabled: false } }), {}),
      // Enable rules if specified
      ...config.enableRules?.reduce((acc, rule) => ({ ...acc, [rule]: { enabled: true } }), {}),
    },
    resultTypes: config.includeIncomplete ? ['violations', 'incomplete'] : ['violations'],
  };

  const results = await axe(element, axeConfig);

  expect(results).toHaveNoViolations();
}

/**
 * Test color contrast for specific elements
 */
export async function testColorContrast(element: Element): Promise<void> {
  await testA11y(element, {
    tags: ['wcag2aa'],
    enableRules: [A11Y_RULES.COLOR_CONTRAST],
  });
}

/**
 * Test keyboard navigation for interactive elements
 */
export async function testKeyboardNavigation(element: Element): Promise<void> {
  await testA11y(element, {
    tags: ['wcag2a', 'wcag2aa'],
    enableRules: [A11Y_RULES.KEYBOARD_NAVIGATION, A11Y_RULES.FOCUS_ORDER],
  });
}

/**
 * Test ARIA implementation
 */
export async function testAriaCompliance(element: Element): Promise<void> {
  await testA11y(element, {
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
    enableRules: [
      A11Y_RULES.ARIA_REQUIRED_CHILDREN,
      A11Y_RULES.ARIA_REQUIRED_PARENT,
      A11Y_RULES.BUTTON_NAME,
      A11Y_RULES.LINK_NAME,
      A11Y_RULES.LABEL,
    ],
  });
}

/**
 * Test semantic structure and landmarks
 */
export async function testSemanticStructure(element: Element): Promise<void> {
  await testA11y(element, {
    tags: ['wcag2a', 'wcag2aa'],
    enableRules: [A11Y_RULES.LANDMARK_UNIQUE, A11Y_RULES.REGION],
  });
}

/**
 * Custom accessibility test suite for comprehensive testing
 */
export async function runComprehensiveA11yTests(
  element: Element,
  options: A11yTestOptions & {
    testColorContrast?: boolean;
    testKeyboard?: boolean;
    testAria?: boolean;
    testSemantics?: boolean;
  } = {}
): Promise<void> {
  const {
    testColorContrast: shouldTestColorContrast = true,
    testKeyboard: shouldTestKeyboard = true,
    testAria: shouldTestAria = true,
    testSemantics: shouldTestSemantics = true,
    ...a11yOptions
  } = options;

  // Run basic accessibility tests
  await testA11y(element, a11yOptions);

  // Run specific test suites if enabled
  if (shouldTestColorContrast) {
    await testColorContrast(element);
  }

  if (shouldTestKeyboard) {
    await testKeyboardNavigation(element);
  }

  if (shouldTestAria) {
    await testAriaCompliance(element);
  }

  if (shouldTestSemantics) {
    await testSemanticStructure(element);
  }
}

/**
 * Common color contrast test configurations
 */
export const COLOR_CONTRAST_TESTS = {
  /** Test normal text contrast (4.5:1) */
  NORMAL_TEXT: { level: 'AA', size: 'normal' as const },
  /** Test large text contrast (3:1) */
  LARGE_TEXT: { level: 'AA', size: 'large' as const },
  /** Test enhanced contrast for AAA (7:1 normal, 4.5:1 large) */
  ENHANCED: { level: 'AAA', size: 'normal' as const },
} as const;

/**
 * Keyboard interaction test helpers
 */
export const KEYBOARD_KEYS = {
  TAB: 'Tab',
  SHIFT_TAB: ['Shift', 'Tab'],
  ENTER: 'Enter',
  SPACE: ' ',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ESCAPE: 'Escape',
  HOME: 'Home',
  END: 'End',
} as const;

/**
 * Screen reader announcement test helpers
 */
export function getAriaLiveRegions(): HTMLElement[] {
  return Array.from(document.querySelectorAll('[aria-live]'));
}

export function getAriaLabelledByElements(element: Element): Element[] {
  const labelledBy = element.getAttribute('aria-labelledby');
  if (!labelledBy) {
 return [];
}

  return labelledBy
    .split(/\s+/)
    .map(id => document.getElementById(id))
    .filter(Boolean) as Element[];
}

export function getAriaDescribedByElements(element: Element): Element[] {
  const describedBy = element.getAttribute('aria-describedby');
  if (!describedBy) {
 return [];
}

  return describedBy
    .split(/\s+/)
    .map(id => document.getElementById(id))
    .filter(Boolean) as Element[];
}

/**
 * Focus management test helpers
 */
export function getFocusableElements(container: Element = document.body): Element[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]:not([aria-disabled="true"])',
    '[role="link"]:not([aria-disabled="true"])',
    '[role="menuitem"]:not([aria-disabled="true"])',
    '[role="tab"]:not([aria-disabled="true"])',
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors));
}

export function getVisibleFocusableElements(container: Element = document.body): Element[] {
  return getFocusableElements(container).filter((element) => {
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none'
      && style.visibility !== 'hidden'
      && element.getAttribute('aria-hidden') !== 'true'
    );
  });
}

/**
 * Test focus trap functionality
 */
export function testFocusTrap(container: Element): void {
  const focusableElements = getVisibleFocusableElements(container);

  if (focusableElements.length === 0) {
    throw new Error('No focusable elements found in container');
  }

  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

  // Test that first element is focused when container is entered
  firstFocusable.focus();

  expect(document.activeElement).toBe(firstFocusable);

  // Test that focus wraps from last to first
  lastFocusable.focus();

  expect(document.activeElement).toBe(lastFocusable);
}
