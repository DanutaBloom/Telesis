/**
 * Color Contrast Testing Utilities
 *
 * Comprehensive utilities for testing WCAG 2.1 AA color contrast compliance
 * in both unit tests and E2E tests.
 */

// WCAG 2.1 AA color contrast requirements
export const WCAG_CONTRAST_RATIOS = {
  NORMAL_TEXT_AA: 4.5,
  LARGE_TEXT_AA: 3.0,
  NORMAL_TEXT_AAA: 7.0,
  LARGE_TEXT_AAA: 4.5,
  NON_TEXT_AA: 3.0,
} as const;

// Text size thresholds for WCAG compliance
export const TEXT_SIZE_THRESHOLDS = {
  LARGE_TEXT_PX: 18, // 18px = large text
  LARGE_BOLD_TEXT_PX: 14, // 14px bold = large text
  LARGE_TEXT_PT: 14, // 14pt = large text
  LARGE_BOLD_TEXT_PT: 12, // 12pt bold = large text
} as const;

/**
 * Parse RGB color string to RGB values
 */
function parseRGB(rgb: string): { r: number; g: number; b: number } | null {
  // Handle rgb(r, g, b) and rgba(r, g, b, a)
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (!match) {
 return null;
}

  return {
    r: Number.parseInt(match[1]!, 10),
    g: Number.parseInt(match[2]!, 10),
    b: Number.parseInt(match[3]!, 10),
  };
}

/**
 * Convert RGB to relative luminance
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const rs = r / 255;
  const gs = g / 255;
  const bs = b / 255;

  const rLinear = rs <= 0.03928 ? rs / 12.92 : ((rs + 0.055) / 1.055) ** 2.4;
  const gLinear = gs <= 0.03928 ? gs / 12.92 : ((gs + 0.055) / 1.055) ** 2.4;
  const bLinear = bs <= 0.03928 ? bs / 12.92 : ((bs + 0.055) / 1.055) ** 2.4;

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/WAI/GL/wiki/Contrast_ratio
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = parseRGB(color1);
  const rgb2 = parseRGB(color2);

  if (!rgb1 || !rgb2) {
    console.warn(`Unable to parse colors: ${color1}, ${color2}`);
    return 0;
  }

  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if text size qualifies as "large text" for WCAG
 */
export function isLargeText(fontSize: number, fontWeight: string | number, unit: 'px' | 'pt' = 'px'): boolean {
  const isBold = typeof fontWeight === 'string'
    ? ['bold', 'bolder', '700', '800', '900'].includes(fontWeight)
    : fontWeight >= 700;

  if (unit === 'pt') {
    return fontSize >= TEXT_SIZE_THRESHOLDS.LARGE_TEXT_PT
      || (isBold && fontSize >= TEXT_SIZE_THRESHOLDS.LARGE_BOLD_TEXT_PT);
  }

  return fontSize >= TEXT_SIZE_THRESHOLDS.LARGE_TEXT_PX
    || (isBold && fontSize >= TEXT_SIZE_THRESHOLDS.LARGE_BOLD_TEXT_PX);
}

/**
 * Test color contrast compliance for an element
 */
export function testElementColorContrast(
  element: HTMLElement,
  level: 'AA' | 'AAA' = 'AA'
): {
  passes: boolean;
  ratio: number;
  requiredRatio: number;
  isLarge: boolean;
  foreground: string;
  background: string;
} {
  const computed = window.getComputedStyle(element);
  const foreground = computed.color;
  const background = computed.backgroundColor;

  // Get font size and weight
  const fontSize = Number.parseFloat(computed.fontSize);
  const fontWeight = computed.fontWeight;
  const isLarge = isLargeText(fontSize, fontWeight);

  const ratio = calculateContrastRatio(foreground, background);

  let requiredRatio: number;
  if (level === 'AAA') {
    requiredRatio = isLarge ? WCAG_CONTRAST_RATIOS.LARGE_TEXT_AAA : WCAG_CONTRAST_RATIOS.NORMAL_TEXT_AAA;
  } else {
    requiredRatio = isLarge ? WCAG_CONTRAST_RATIOS.LARGE_TEXT_AA : WCAG_CONTRAST_RATIOS.NORMAL_TEXT_AA;
  }

  return {
    passes: ratio >= requiredRatio,
    ratio,
    requiredRatio,
    isLarge,
    foreground,
    background,
  };
}

/**
 * Test color contrast for all text elements in a container
 */
export function testContainerColorContrast(
  container: HTMLElement,
  level: 'AA' | 'AAA' = 'AA'
): {
  results: Array<{
    element: HTMLElement;
    selector: string;
    passes: boolean;
    ratio: number;
    requiredRatio: number;
    isLarge: boolean;
  }>;
  allPassing: boolean;
  failureCount: number;
} {
  // Find all text elements
  const textElements = container.querySelectorAll(
    'p, span, div, h1, h2, h3, h4, h5, h6, a, button, label, input, textarea, li, td, th, [role="button"], [role="link"]'
  );

  const results: Array<{
    element: HTMLElement;
    selector: string;
    passes: boolean;
    ratio: number;
    requiredRatio: number;
    isLarge: boolean;
  }> = [];

  let failureCount = 0;

  textElements.forEach((element, index) => {
    const htmlElement = element as HTMLElement;

    // Skip elements with no visible text content
    if (!htmlElement.textContent?.trim()) {
 return;
}

    // Skip hidden elements
    if (htmlElement.offsetHeight === 0 && htmlElement.offsetWidth === 0) {
 return;
}

    const testResult = testElementColorContrast(htmlElement, level);

    // Create a more specific selector
    const selector = htmlElement.id
      ? `#${htmlElement.id}`
      : htmlElement.className
        ? `.${htmlElement.className.split(' ')[0]}`
        : `${htmlElement.tagName.toLowerCase()}:nth-of-type(${index + 1})`;

    results.push({
      element: htmlElement,
      selector,
      passes: testResult.passes,
      ratio: testResult.ratio,
      requiredRatio: testResult.requiredRatio,
      isLarge: testResult.isLarge,
    });

    if (!testResult.passes) {
      failureCount++;
    }
  });

  return {
    results,
    allPassing: failureCount === 0,
    failureCount,
  };
}

/**
 * Generate detailed color contrast report
 */
export function generateContrastReport(
  container: HTMLElement,
  level: 'AA' | 'AAA' = 'AA'
): string {
  const testResults = testContainerColorContrast(container, level);

  let report = `Color Contrast Report (WCAG ${level})\n`;
  report += `====================================\n\n`;
  report += `Total elements tested: ${testResults.results.length}\n`;
  report += `Passing: ${testResults.results.length - testResults.failureCount}\n`;
  report += `Failing: ${testResults.failureCount}\n`;
  report += `Overall status: ${testResults.allPassing ? 'PASS' : 'FAIL'}\n\n`;

  if (testResults.failureCount > 0) {
    report += `Failures:\n`;
    report += `---------\n`;

    testResults.results
      .filter(result => !result.passes)
      .forEach((result, index) => {
        const computed = window.getComputedStyle(result.element);
        report += `${index + 1}. ${result.selector}\n`;
        report += `   Text: "${result.element.textContent?.trim().substring(0, 50)}${result.element.textContent && result.element.textContent.length > 50 ? '...' : ''}"\n`;
        report += `   Contrast ratio: ${result.ratio.toFixed(2)}\n`;
        report += `   Required ratio: ${result.requiredRatio}\n`;
        report += `   Text size: ${result.isLarge ? 'Large' : 'Normal'}\n`;
        report += `   Foreground: ${computed.color}\n`;
        report += `   Background: ${computed.backgroundColor}\n\n`;
      });
  }

  return report;
}

/**
 * Modern Sage theme color combinations for testing
 */
export const MODERN_SAGE_COLOR_COMBINATIONS = [
  // Light mode combinations
  {
    name: 'Primary button - light',
    foreground: 'rgb(255, 255, 255)', // white
    background: 'rgb(34, 197, 94)', // green-500
    context: 'Primary CTA buttons'
  },
  {
    name: 'Secondary button - light',
    foreground: 'rgb(34, 197, 94)', // green-500
    background: 'rgb(255, 255, 255)', // white
    context: 'Secondary buttons with border'
  },
  {
    name: 'Body text - light',
    foreground: 'rgb(15, 23, 42)', // slate-900
    background: 'rgb(255, 255, 255)', // white
    context: 'Main body text'
  },
  {
    name: 'Muted text - light',
    foreground: 'rgb(100, 116, 139)', // slate-500
    background: 'rgb(255, 255, 255)', // white
    context: 'Secondary/muted text'
  },
  // Dark mode combinations
  {
    name: 'Body text - dark',
    foreground: 'rgb(248, 250, 252)', // slate-50
    background: 'rgb(15, 23, 42)', // slate-900
    context: 'Main body text in dark mode'
  },
  {
    name: 'Muted text - dark',
    foreground: 'rgb(148, 163, 184)', // slate-400
    background: 'rgb(15, 23, 42)', // slate-900
    context: 'Secondary/muted text in dark mode'
  },
  {
    name: 'Link text - light',
    foreground: 'rgb(34, 197, 94)', // green-500
    background: 'rgb(255, 255, 255)', // white
    context: 'Interactive links'
  },
  {
    name: 'Link text - dark',
    foreground: 'rgb(74, 222, 128)', // green-400
    background: 'rgb(15, 23, 42)', // slate-900
    context: 'Interactive links in dark mode'
  }
] as const;

/**
 * Test all Modern Sage color combinations
 */
export function testModernSageColorContrast(): {
  results: Array<{
    combination: typeof MODERN_SAGE_COLOR_COMBINATIONS[number];
    passes: boolean;
    ratio: number;
    level: 'AA' | 'AAA';
  }>;
  allPassing: boolean;
  summary: string;
} {
  const results = MODERN_SAGE_COLOR_COMBINATIONS.map((combination) => {
    const ratio = calculateContrastRatio(combination.foreground, combination.background);
    const passesAA = ratio >= WCAG_CONTRAST_RATIOS.NORMAL_TEXT_AA;
    const passesAAA = ratio >= WCAG_CONTRAST_RATIOS.NORMAL_TEXT_AAA;

    return {
      combination,
      passes: passesAA,
      ratio,
      level: (passesAAA ? 'AAA' : passesAA ? 'AA' : 'FAIL') as 'AA' | 'AAA',
    };
  });

  const failureCount = results.filter(r => !r.passes).length;
  const allPassing = failureCount === 0;

  let summary = `Modern Sage Color Contrast Test Results:\n`;
  summary += `Total combinations: ${results.length}\n`;
  summary += `Passing AA: ${results.filter(r => r.passes).length}\n`;
  summary += `Passing AAA: ${results.filter(r => r.level === 'AAA').length}\n`;
  summary += `Failing: ${failureCount}\n`;

  if (failureCount > 0) {
    summary += `\nFailed combinations:\n`;
    results
      .filter(r => !r.passes)
      .forEach((r) => {
        summary += `- ${r.combination.name}: ${r.ratio.toFixed(2)} (needs ${WCAG_CONTRAST_RATIOS.NORMAL_TEXT_AA})\n`;
      });
  }

  return {
    results,
    allPassing,
    summary,
  };
}

/**
 * Playwright helper for color contrast testing
 */
export async function testPageColorContrast(
  page: any, // Playwright Page type
  level: 'AA' | 'AAA' = 'AA'
): Promise<{
  allPassing: boolean;
  failureCount: number;
  report: string;
}> {
  const results = await page.evaluate(
    ({ level }: { level: 'AA' | 'AAA' }) => {
      // Note: This code runs in the browser context
      // We need to inline the functions or make them available globally

      const WCAG_CONTRAST_RATIOS = {
        NORMAL_TEXT_AA: 4.5,
        LARGE_TEXT_AA: 3.0,
        NORMAL_TEXT_AAA: 7.0,
        LARGE_TEXT_AAA: 4.5,
      } as const;

      function parseRGB(rgb: string): { r: number; g: number; b: number } | null {
        const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (!match) {
 return null;
}

        return {
          r: Number.parseInt(match[1]!, 10),
          g: Number.parseInt(match[2]!, 10),
          b: Number.parseInt(match[3]!, 10),
        };
      }

      function getRelativeLuminance(r: number, g: number, b: number): number {
        const rs = r / 255;
        const gs = g / 255;
        const bs = b / 255;

        const rLinear = rs <= 0.03928 ? rs / 12.92 : ((rs + 0.055) / 1.055) ** 2.4;
        const gLinear = gs <= 0.03928 ? gs / 12.92 : ((gs + 0.055) / 1.055) ** 2.4;
        const bLinear = bs <= 0.03928 ? bs / 12.92 : ((bs + 0.055) / 1.055) ** 2.4;

        return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
      }

      function calculateContrastRatio(color1: string, color2: string): number {
        const rgb1 = parseRGB(color1);
        const rgb2 = parseRGB(color2);

        if (!rgb1 || !rgb2) {
 return 0;
}

        const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
        const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);

        return (lighter + 0.05) / (darker + 0.05);
      }

      function isLargeText(fontSize: number, fontWeight: string | number): boolean {
        const isBold = typeof fontWeight === 'string'
          ? ['bold', 'bolder', '700', '800', '900'].includes(fontWeight)
          : fontWeight >= 700;

        return fontSize >= 18 || (isBold && fontSize >= 14);
      }

      const textElements = document.querySelectorAll(
        'p, span, div, h1, h2, h3, h4, h5, h6, a, button, label, input, textarea, li, td, th, [role="button"], [role="link"]'
      );

      const failures: Array<{
        selector: string;
        text: string;
        ratio: number;
        requiredRatio: number;
        foreground: string;
        background: string;
      }> = [];

      textElements.forEach((element, index) => {
        const htmlElement = element as HTMLElement;

        // Skip elements with no visible text content
        if (!htmlElement.textContent?.trim()) {
 return;
}

        // Skip hidden elements
        if (htmlElement.offsetHeight === 0 && htmlElement.offsetWidth === 0) {
 return;
}

        const computed = window.getComputedStyle(htmlElement);
        const foreground = computed.color;
        const background = computed.backgroundColor;

        const fontSize = Number.parseFloat(computed.fontSize);
        const fontWeight = computed.fontWeight;
        const isLarge = isLargeText(fontSize, fontWeight);

        const ratio = calculateContrastRatio(foreground, background);

        let requiredRatio: number;
        if (level === 'AAA') {
          requiredRatio = isLarge ? WCAG_CONTRAST_RATIOS.LARGE_TEXT_AAA : WCAG_CONTRAST_RATIOS.NORMAL_TEXT_AAA;
        } else {
          requiredRatio = isLarge ? WCAG_CONTRAST_RATIOS.LARGE_TEXT_AA : WCAG_CONTRAST_RATIOS.NORMAL_TEXT_AA;
        }

        if (ratio < requiredRatio && ratio > 0) {
          const selector = htmlElement.id
            ? `#${htmlElement.id}`
            : htmlElement.className
              ? `.${htmlElement.className.split(' ')[0]}`
              : `${htmlElement.tagName.toLowerCase()}:nth-of-type(${index + 1})`;

          failures.push({
            selector,
            text: htmlElement.textContent?.trim().substring(0, 50) || '',
            ratio,
            requiredRatio,
            foreground,
            background,
          });
        }
      });

      let report = `Color Contrast Report (WCAG ${level})\n`;
      report += `====================================\n\n`;
      report += `Total elements tested: ${textElements.length}\n`;
      report += `Failing: ${failures.length}\n`;
      report += `Overall status: ${failures.length === 0 ? 'PASS' : 'FAIL'}\n\n`;

      if (failures.length > 0) {
        report += `Failures:\n`;
        report += `---------\n`;

        failures.forEach((failure, index) => {
          report += `${index + 1}. ${failure.selector}\n`;
          report += `   Text: "${failure.text}${failure.text.length === 50 ? '...' : ''}"\n`;
          report += `   Contrast ratio: ${failure.ratio.toFixed(2)}\n`;
          report += `   Required ratio: ${failure.requiredRatio}\n`;
          report += `   Foreground: ${failure.foreground}\n`;
          report += `   Background: ${failure.background}\n\n`;
        });
      }

      return {
        allPassing: failures.length === 0,
        failureCount: failures.length,
        report,
      };
    },
    { level }
  );

  return results;
}

/**
 * Export common test patterns for easy use in tests
 */
export const COLOR_CONTRAST_TEST_PATTERNS = {
  /** Skip color contrast for decorative elements */
  SKIP_DECORATIVE: '[role="presentation"], [aria-hidden="true"], .decorative',

  /** Focus on interactive elements */
  INTERACTIVE_ONLY: 'button, a[href], input, select, textarea, [role="button"], [role="link"]',

  /** Focus on text content */
  TEXT_CONTENT: 'p, span, h1, h2, h3, h4, h5, h6, li, td, th, label',

  /** High priority elements that must pass */
  CRITICAL_ELEMENTS: 'button, a[href], h1, h2, [role="alert"], [role="button"]',
} as const;
