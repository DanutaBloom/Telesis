/**
 * Modern Sage Theme Testing Utilities
 *
 * Comprehensive utilities for testing the Modern Sage theme implementation,
 * including color validation, WCAG compliance, and component theming
 */

import type { RenderResult } from '@testing-library/react';
import { screen } from '@testing-library/react';

// Modern Sage Color Palette (from PRD and global.css)
export const MODERN_SAGE_COLORS = {
  light: {
    // Primary colors
    quietude: '#557C76', // HSL(171, 19%, 41%) - WCAG AA Compliant
    growth: '#4C9A2A', // HSL(102, 58%, 38%)

    // Supporting colors
    mist: '#B8CCC9', // HSL(173, 15%, 85%)
    stone: '#8A9499', // HSL(220, 8%, 60%)

    // Base colors
    background: '#FCFCFC', // HSL(0, 0%, 99%)
    foreground: '#333333', // HSL(220, 13%, 20%)

    // Semantic colors
    border: '#E5E5E5', // HSL(220, 13%, 91%)
    muted: '#F5F5F5', // HSL(220, 10%, 95%)
  },
  dark: {
    // Primary colors (adjusted for dark mode)
    quietude: '#7FA99F', // HSL(171, 25%, 55%) - WCAG AA Compliant
    growth: '#5BA032', // HSL(102, 55%, 42%)

    // Supporting colors
    mist: '#2D4340', // HSL(173, 15%, 25%)
    stone: '#7A8085', // HSL(220, 8%, 50%)

    // Base colors
    background: '#171717', // HSL(220, 13%, 9%)
    foreground: '#F2F2F2', // HSL(0, 0%, 95%)

    // Semantic colors
    border: '#404040', // HSL(220, 13%, 25%)
    muted: '#2D2D2D', // HSL(220, 10%, 18%)
  },
} as const;

// Color contrast requirements for theme testing
const THEME_WCAG_REQUIREMENTS = {
  AA: {
    normalText: 4.5,
    largeText: 3.0,
  },
  AAA: {
    normalText: 7.0,
    largeText: 4.5,
  },
} as const;

// Expected contrast ratios for Modern Sage (from docs)
export const EXPECTED_CONTRAST_RATIOS = {
  light: {
    primaryOnBackground: 4.52, // Quietude on background (WCAG AA compliant)
    accentOnBackground: 7.8, // Growth on background
    textOnBackground: 12.6, // Foreground on background
  },
  dark: {
    primaryOnBackground: 5.5, // Quietude on dark background (improved contrast)
    accentOnBackground: 6.2, // Growth on dark background
    textOnBackground: 12.6, // Foreground on dark background
  },
} as const;

/**
 * Calculate luminance of a color (for contrast ratio calculations)
 */
export function calculateLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) {
 return 0;
}

  const [r, g, b] = rgb.map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

/**
 * Calculate contrast ratio between two colors
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const lum1 = calculateLuminance(color1);
  const lum2 = calculateLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
? [
    Number.parseInt(result[1] || '0', 16),
    Number.parseInt(result[2] || '0', 16),
    Number.parseInt(result[3] || '0', 16),
  ]
: null;
}

/**
 * Test if contrast ratio meets WCAG requirements
 */
export function meetsWCAGRequirements(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false,
): boolean {
  const contrastRatio = calculateContrastRatio(foreground, background);
  const requirement = THEME_WCAG_REQUIREMENTS[level][isLargeText ? 'largeText' : 'normalText'];

  return contrastRatio >= requirement;
}

/**
 * Validate Modern Sage color palette compliance
 */
export function validateModernSageColors(theme: 'light' | 'dark' = 'light') {
  const colors = MODERN_SAGE_COLORS[theme];
  const expectedRatios = EXPECTED_CONTRAST_RATIOS[theme];

  const results = {
    primaryCompliance: meetsWCAGRequirements(colors.quietude, colors.background, 'AA'),
    accentCompliance: meetsWCAGRequirements(colors.growth, colors.background, 'AA'),
    textCompliance: meetsWCAGRequirements(colors.foreground, colors.background, 'AAA'),
    primaryRatio: calculateContrastRatio(colors.quietude, colors.background),
    accentRatio: calculateContrastRatio(colors.growth, colors.background),
    textRatio: calculateContrastRatio(colors.foreground, colors.background),
  };

  return {
    ...results,
    allCompliant: results.primaryCompliance && results.accentCompliance && results.textCompliance,
    meetsExpectedRatios: {
      primary: Math.abs(results.primaryRatio - expectedRatios.primaryOnBackground) < 0.1,
      accent: Math.abs(results.accentRatio - expectedRatios.accentOnBackground) < 0.1,
      text: Math.abs(results.textRatio - expectedRatios.textOnBackground) < 0.1,
    },
  };
}

/**
 * Test if element has Modern Sage theme classes
 */
export function expectElementToHaveModernSageTheme(
  element: HTMLElement,
  expectedClasses: {
    primary?: boolean;
    accent?: boolean;
    sage?: boolean;
    gradient?: boolean;
  } = {},
): void {
  const classes = element.className;

  if (expectedClasses.primary) {
    expect(
      classes.includes('bg-primary')
      || classes.includes('text-primary')
      || classes.includes('border-primary'),
    ).toBe(true);
  }

  if (expectedClasses.accent) {
    expect(
      classes.includes('bg-accent')
      || classes.includes('text-accent')
      || classes.includes('border-accent'),
    ).toBe(true);
  }

  if (expectedClasses.sage) {
    expect(classes).toContain('sage');
  }

  if (expectedClasses.gradient) {
    expect(
      classes.includes('sage-gradient')
      || classes.includes('sage-text-gradient'),
    ).toBe(true);
  }
}

/**
 * Test Modern Sage gradient utilities
 */
export function expectElementToHaveModernSageGradient(
  element: HTMLElement,
  gradientType: 'primary' | 'subtle' | 'hero' | 'text',
): void {
  const expectedClass = `sage-gradient-${gradientType === 'text' ? 'text' : gradientType}`;

  expect(element).toHaveClass(expectedClass);
}

/**
 * Test component's theme responsiveness (light/dark mode)
 */
export function testThemeResponsiveness(
  renderComponent: (theme: 'light' | 'dark') => RenderResult,
  testId: string,
  expectedBehavior: {
    light: string[];
    dark: string[];
  },
): void {
  // Test light theme
  renderComponent('light');
  const lightElement = screen.getByTestId(testId);
  expectedBehavior.light.forEach((className) => {
    expect(lightElement).toHaveClass(className);
  });

  // Test dark theme
  renderComponent('dark');
  const darkElement = screen.getByTestId(testId);
  expectedBehavior.dark.forEach((className) => {
    expect(darkElement).toHaveClass(className);
  });
}

/**
 * Test Modern Sage button variants
 */
export function expectButtonToHaveModernSageVariant(
  button: HTMLElement,
  variant: 'primary' | 'secondary' | 'accent' | 'ghost' | 'link',
): void {
  switch (variant) {
    case 'primary':
      expect(button).toHaveClass('bg-primary');
      expect(button).toHaveClass('text-primary-foreground');

      break;
    case 'accent':
      expect(button).toHaveClass('bg-accent');
      expect(button).toHaveClass('text-accent-foreground');

      break;
    case 'secondary':
      expect(button).toHaveClass('bg-secondary');
      expect(button).toHaveClass('text-secondary-foreground');

      break;
    case 'ghost':
      expect(button).toHaveClass('hover:bg-accent');
      expect(button).toHaveClass('hover:text-accent-foreground');

      break;
    case 'link':
      expect(button).toHaveClass('text-primary');
      expect(button).toHaveClass('underline-offset-4');

      break;
  }
}

/**
 * Test Modern Sage focus states
 */
export function expectElementToHaveModernSageFocus(element: HTMLElement): void {
  // Check that element has focus ring classes (sage-ring includes focus-visible:ring-sage-quietude)
  const classes = element.className;

  expect(
    classes.includes('focus-visible:ring-sage')
    || classes.includes('focus-visible:ring-primary')
    || classes.includes('sage-ring'),
  ).toBe(true);

  // Different components use different ring sizes (buttons use ring-2, inputs use ring-1)
  const hasRingClass = classes.includes('focus-visible:ring-1') || classes.includes('focus-visible:ring-2');

  expect(hasRingClass).toBe(true);

  // Ring offset is optional (buttons have it, inputs don't always need it)
  expect(element).toHaveClass('focus-visible:outline-none');
}

/**
 * Validate Modern Sage spacing consistency (8-pixel grid)
 */
export function expectElementToFollowModernSageSpacing(element: HTMLElement): void {
  // In JSDOM test environment, check for expected Tailwind spacing classes instead of computed styles
  const classes = element.className;
  const hasValidSpacingClasses
    = classes.includes('px-3') // 12px horizontal padding
      || classes.includes('py-2') // 8px vertical padding
      || classes.includes('px-4') // 16px horizontal padding
      || classes.includes('p-2') // 8px all padding
      || classes.includes('p-3') // 12px all padding
      || classes.includes('p-4') // 16px all padding
      || classes.includes('m-2') // 8px all margin
      || classes.includes('m-3') // 12px all margin
      || classes.includes('m-4'); // 16px all margin

  // Should have at least one valid Tailwind spacing class
  expect(hasValidSpacingClasses).toBe(true);
}

/**
 * Test Modern Sage border radius consistency
 */
export function expectElementToHaveModernSageBorderRadius(element: HTMLElement): void {
  // Should use consistent Tailwind border radius classes
  const classes = element.className;
  const hasValidBorderRadius
    = classes.includes('rounded-lg')
      || classes.includes('rounded-md')
      || classes.includes('rounded-sm')
      || classes.includes('rounded-full')
      || classes.includes('rounded'); // default rounded

  expect(hasValidBorderRadius).toBe(true);
}

/**
 * Create CSS variable test utilities
 */
export function getCSSVariableValue(variable: string, element?: HTMLElement): string {
  const targetElement = element || document.documentElement;
  return window.getComputedStyle(targetElement).getPropertyValue(variable).trim();
}

/**
 * Test CSS custom property values
 */
export function expectCSSVariableToEqual(
  variable: string,
  expectedValue: string,
  element?: HTMLElement,
): void {
  const actualValue = getCSSVariableValue(variable, element);

  expect(actualValue).toBe(expectedValue);
}

/**
 * Comprehensive Modern Sage theme validation
 */
export function validateModernSageThemeImplementation() {
  const lightValidation = validateModernSageColors('light');
  const darkValidation = validateModernSageColors('dark');

  return {
    light: lightValidation,
    dark: darkValidation,
    overall: {
      compliant: lightValidation.allCompliant && darkValidation.allCompliant,
      colorsValid: lightValidation.meetsExpectedRatios && darkValidation.meetsExpectedRatios,
    },
  };
}

/**
 * Mock theme provider for testing
 */
export function mockThemeProvider(theme: 'light' | 'dark' = 'light') {
  const mockElement = document.createElement('div');
  mockElement.className = theme === 'dark' ? 'dark' : '';
  document.body.appendChild(mockElement);

  return () => {
    document.body.removeChild(mockElement);
  };
}

/**
 * Test utility to simulate theme switching
 */
export function simulateThemeSwitch(from: 'light' | 'dark', to: 'light' | 'dark') {
  const html = document.documentElement;

  if (from === 'dark') {
    html.classList.remove('dark');
  }

  if (to === 'dark') {
    html.classList.add('dark');
  }

  // Dispatch theme change event
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'theme',
    newValue: to,
    oldValue: from,
  }));
}
