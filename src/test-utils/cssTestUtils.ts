import { screen } from '@testing-library/react';

/**
 * Test utilities for working with CSS and Tailwind classes in tests
 */

/**
 * Assert that an element has the expected Tailwind classes
 */
export function expectElementToHaveClasses(
  element: HTMLElement,
  classes: string[],
): void {
  classes.forEach((className) => {
    expect(element).toHaveClass(className);
  });
}

/**
 * Assert that an element has the expected Tailwind classes by test ID
 */
export function expectElementByTestIdToHaveClasses(
  testId: string,
  classes: string[],
): void {
  const element = screen.getByTestId(testId);
  expectElementToHaveClasses(element, classes);
}

/**
 * Get computed styles for an element (useful for debugging CSS processing)
 */
export function getComputedStyles(element: HTMLElement): Record<string, string> {
  const computedStyle = window.getComputedStyle(element);
  return {
    display: computedStyle.display,
    backgroundColor: computedStyle.backgroundColor,
    color: computedStyle.color,
    padding: computedStyle.padding,
    margin: computedStyle.margin,
    width: computedStyle.width,
    height: computedStyle.height,
    flexDirection: computedStyle.flexDirection,
    alignItems: computedStyle.alignItems,
    justifyContent: computedStyle.justifyContent,
    fontSize: computedStyle.fontSize,
    fontWeight: computedStyle.fontWeight,
  };
}

/**
 * Assert that an element has expected accessibility attributes
 */
export function expectElementToHaveA11yAttributes(
  element: HTMLElement,
  attributes: Record<string, string>,
): void {
  Object.entries(attributes).forEach(([attribute, value]) => {
    expect(element).toHaveAttribute(attribute, value);
  });
}

/**
 * Test responsive behavior by checking for responsive classes
 */
export function expectElementToHaveResponsiveClasses(
  element: HTMLElement,
  responsiveClasses: {
    base?: string[];
    sm?: string[];
    md?: string[];
    lg?: string[];
    xl?: string[];
  },
): void {
  if (responsiveClasses.base) {
    expectElementToHaveClasses(element, responsiveClasses.base);
  }
  if (responsiveClasses.sm) {
    expectElementToHaveClasses(element, responsiveClasses.sm);
  }
  if (responsiveClasses.md) {
    expectElementToHaveClasses(element, responsiveClasses.md);
  }
  if (responsiveClasses.lg) {
    expectElementToHaveClasses(element, responsiveClasses.lg);
  }
  if (responsiveClasses.xl) {
    expectElementToHaveClasses(element, responsiveClasses.xl);
  }
}

/**
 * Test dark mode classes
 */
export function expectElementToHaveDarkModeClasses(
  element: HTMLElement,
  lightClasses: string[],
  darkClasses: string[],
): void {
  expectElementToHaveClasses(element, lightClasses);
  expectElementToHaveClasses(element, darkClasses);
}

/**
 * Utility to log computed styles for debugging (should be used with console.log mocking)
 */
export function logComputedStyles(element: HTMLElement, label?: string): void {
  const styles = getComputedStyles(element);
  // Log computed styles in development mode only
  if (process.env.NODE_ENV === 'development') {
    if (label) {
      // eslint-disable-next-line no-console
      console.log(`${label} computed styles:`, styles);
    } else {
      // eslint-disable-next-line no-console
      console.log('Computed styles:', styles);
    }
  }
}
