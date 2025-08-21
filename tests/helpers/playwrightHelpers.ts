/**
 * Playwright Test Helpers
 * Utilities for Playwright E2E tests without vitest dependencies
 */

import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Wait for element to be visible and return it
 */
export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  const element = page.locator(selector);

  await expect(element).toBeVisible({ timeout });

  return element;
}

/**
 * Check if element exists without throwing if not found
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  try {
    const element = page.locator(selector);
    return await element.isVisible({ timeout: 1000 });
  } catch {
    return false;
  }
}

/**
 * Get element text content safely
 */
export async function getTextContent(page: Page, selector: string): Promise<string | null> {
  try {
    const element = page.locator(selector);
    return await element.textContent({ timeout: 2000 });
  } catch {
    return null;
  }
}

/**
 * Check if page has specific text content
 */
export async function pageHasText(page: Page, text: string): Promise<boolean> {
  try {
    await expect(page.locator(`text=${text}`)).toBeVisible({ timeout: 2000 });

    return true;
  } catch {
    return false;
  }
}

/**
 * Common accessibility checks
 */
export class AccessibilityHelpers {
  /**
   * Check if element has accessible name
   */
  static async hasAccessibleName(page: Page, selector: string): Promise<boolean> {
    const element = page.locator(selector);

    const text = await element.textContent().catch(() => null);
    const ariaLabel = await element.getAttribute('aria-label').catch(() => null);
    const ariaLabelledby = await element.getAttribute('aria-labelledby').catch(() => null);
    const title = await element.getAttribute('title').catch(() => null);

    return !!(text?.trim() || ariaLabel || ariaLabelledby || title);
  }

  /**
   * Check if element has proper heading hierarchy
   */
  static async validateHeadingHierarchy(page: Page): Promise<{ valid: boolean; issues: string[] }> {
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const issues: string[] = [];
    let valid = true;

    if (headings.length === 0) {
      return { valid: true, issues: [] };
    }

    // Check for h1 presence
    const h1Count = await page.locator('h1').count();
    if (h1Count === 0) {
      issues.push('No h1 element found');
      valid = false;
    }

    if (h1Count > 1) {
      issues.push('Multiple h1 elements found');
      valid = false;
    }

    return { valid, issues };
  }
}

/**
 * Security test helpers
 */
export class SecurityHelpers {
  /**
   * Check if response includes security headers
   */
  static async checkSecurityHeaders(page: Page, url: string): Promise<{ [key: string]: string | null }> {
    const response = await page.goto(url);

    if (!response) {
      return {};
    }

    const headers = response.headers();

    return {
      'x-content-type-options': headers['x-content-type-options'] || null,
      'x-frame-options': headers['x-frame-options'] || null,
      'x-xss-protection': headers['x-xss-protection'] || null,
      'strict-transport-security': headers['strict-transport-security'] || null,
      'content-security-policy': headers['content-security-policy'] || null,
    };
  }

  /**
   * Check if input sanitizes dangerous content
   */
  static async testInputSanitization(page: Page, inputSelector: string, dangerousValue: string): Promise<boolean> {
    try {
      const input = page.locator(inputSelector);
      await input.fill(dangerousValue);

      const value = await input.inputValue();

      // Check if dangerous content was sanitized
      return !value.includes('<script>') && !value.includes('javascript:');
    } catch {
      return false;
    }
  }
}

/**
 * Theme test helpers
 */
export class ThemeHelpers {
  /**
   * Check if element has expected Modern Sage classes
   */
  static async hasModernSageClasses(page: Page, selector: string): Promise<boolean> {
    try {
      const element = page.locator(selector);
      const classes = await element.getAttribute('class') || '';

      // Check for common Modern Sage theme classes
      const hasThemeClasses
        = classes.includes('bg-primary')
          || classes.includes('bg-secondary')
          || classes.includes('text-primary-foreground')
          || classes.includes('border')
          || classes.includes('rounded-md');

      return hasThemeClasses;
    } catch {
      return false;
    }
  }

  /**
   * Get computed styles for accessibility contrast checking
   */
  static async getComputedStyles(page: Page, selector: string): Promise<{ [key: string]: string }> {
    try {
      const element = page.locator(selector);
      return await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          lineHeight: computed.lineHeight,
        };
      });
    } catch {
      return {};
    }
  }
}
