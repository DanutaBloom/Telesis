import AxeBuilder from '@axe-core/playwright';
import type { Locator, Page} from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Configuration for logo testing
 */
export type LogoConfig = {
  variant?: 'logomark' | 'horizontal' | 'stacked';
  size?: 'sm' | 'default' | 'lg' | 'xl' | '2xl';
  colorScheme?: 'default' | 'monochrome' | 'reverse';
  showText?: boolean;
  ariaLabel?: string;
  className?: string;
  interactive?: boolean;
}

/**
 * Logo test page setup
 */
export type LogoPageSetup = {
  backgroundColor?: string;
  containerPadding?: string;
  includeNavigation?: boolean;
  includeMobileViewport?: boolean;
}

/**
 * Performance metrics for logo testing
 */
export type LogoPerformanceMetrics = {
  renderTime: number;
  loadTime: number;
  interactionTime: number;
  memoryUsage?: number;
  frameRate?: number;
}

/**
 * Visual regression test options
 */
export type VisualTestOptions = {
  threshold?: number;
  animations?: 'disabled' | 'allow';
  mask?: Locator[];
  fullPage?: boolean;
}

/**
 * Playwright helper utilities for logo testing
 */
export class LogoPlaywrightHelpers {
  constructor(private page: Page) {}

  /**
   * Create a test page with logo component
   */
  async setupLogoTestPage(config: LogoConfig = {}, pageSetup: LogoPageSetup = {}): Promise<Locator> {
    const {
      backgroundColor = 'white',
      containerPadding = '40px',
      includeNavigation = false,
      includeMobileViewport = false
    } = pageSetup;

    const viewportMeta = includeMobileViewport ? '<meta name="viewport" content="width=device-width, initial-scale=1">' : '';
    const navigation = includeNavigation
? `
      <nav style="background: white; border-bottom: 1px solid #e5e5e5; padding: 16px 24px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div data-testid="nav-logo"></div>
          <div style="display: flex; gap: 24px;">
            <a href="#" style="color: #333; text-decoration: none;">Home</a>
            <a href="#" style="color: #333; text-decoration: none;">About</a>
          </div>
        </div>
      </nav>
    `
: '';

    await this.page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Logo Test</title>
          ${viewportMeta}
          <link href="/styles/globals.css" rel="stylesheet">
        </head>
        <body>
          ${navigation}
          <div style="padding: ${containerPadding}; background: ${backgroundColor};">
            <div data-testid="test-logo"></div>
          </div>
        </body>
      </html>
    `);

    await this.addLogoToContainer('[data-testid="test-logo"]', config);

    if (includeNavigation) {
      await this.addLogoToContainer('[data-testid="nav-logo"]', { ...config, size: 'default' });
    }

    return this.page.locator('[data-testid="test-logo"]');
  }

  /**
   * Add logo component to a specific container
   */
  async addLogoToContainer(selector: string, config: LogoConfig = {}): Promise<void> {
    const {
      variant = 'horizontal',
      size = 'default',
      colorScheme = 'default',
      showText = true,
      ariaLabel = 'Telesis - Ask, Think, Apply',
      className = '',
      interactive = false
    } = config;

    await this.page.evaluate(({ selector, variant, size, colorScheme, showText, ariaLabel, className, interactive }) => {
      const container = document.querySelector(selector);
      if (!container) {
 return;
}

      const sizeMap = {
        "sm": { width: 32, height: 12, textClass: 'text-sm' },
        "default": { width: 48, height: 18, textClass: 'text-base' },
        "lg": { width: 64, height: 24, textClass: 'text-lg' },
        "xl": { width: 80, height: 30, textClass: 'text-xl' },
        '2xl': { width: 96, height: 36, textClass: 'text-2xl' }
      };

      const dimensions = sizeMap[size as keyof typeof sizeMap];
      const isStacked = variant === 'stacked';
      const isLogomark = variant === 'logomark' || !showText;

      // Color scheme configuration
      let colors = {
        ask: 'transparent',
        askStroke: 'hsl(171, 19%, 41%)',
        think: 'hsl(171, 19%, 41%)',
        apply: 'hsl(102, 58%, 38%)',
        textClass: 'text-foreground'
      };

      if (colorScheme === 'monochrome') {
        colors = {
          ask: 'currentColor',
          askStroke: 'currentColor',
          think: 'currentColor',
          apply: 'currentColor',
          textClass: 'text-current'
        };
      } else if (colorScheme === 'reverse') {
        colors = {
          ask: 'transparent',
          askStroke: '#ffffff',
          think: '#ffffff',
          apply: '#ffffff',
          textClass: 'text-white'
        };
      }

      const interactiveClass = interactive ? 'cursor-pointer' : '';
      const containerClass = `inline-flex ${isStacked ? 'flex-col gap-y-1' : 'items-center gap-x-2'} ${dimensions.textClass} ${className} ${interactiveClass}`.trim();

      container.innerHTML = `
        <div class="${containerClass}" aria-label="${ariaLabel}" ${interactive ? 'tabindex="0"' : ''}>
          <svg width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0 transition-colors duration-200 ${isStacked ? 'mb-1' : ''}">
            <title>Telesis Logo</title>
            <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
            <g id="three-olives-logomark">
              <ellipse cx="8" cy="9" rx="6" ry="8" fill="${colors.ask}" stroke="${colors.askStroke}" stroke-width="1.5" class="olive-ask"/>
              <ellipse cx="24" cy="9" rx="6" ry="8" fill="${colors.think}" stroke="none" class="olive-think"/>
              <ellipse cx="40" cy="9" rx="6" ry="8" fill="${colors.apply}" stroke="none" class="olive-apply"/>
            </g>
          </svg>
          ${!isLogomark
? `
            <div class="select-none font-semibold tracking-tight ${isStacked ? 'text-center' : ''} ${colors.textClass}">
              Telesis
              ${isStacked ? `<div class="text-xs font-normal opacity-75 mt-0.5 ${colorScheme === 'reverse' ? 'text-white/80' : colorScheme === 'monochrome' ? 'text-current/80' : 'text-muted-foreground'}">Ask. Think. Apply.</div>` : ''}
            </div>
          `
: ''}
        </div>
      `;
    }, { selector, variant, size, colorScheme, showText, ariaLabel, className, interactive });
  }

  /**
   * Test visual regression with comprehensive options
   */
  async testVisualRegression(
    locator: Locator,
    screenshotName: string,
    options: VisualTestOptions = {}
  ): Promise<void> {
    const {
      threshold = 0.2,
      animations = 'disabled',
      mask = [],
      fullPage = false
    } = options;

    await expect(locator).toHaveScreenshot(screenshotName, {
      threshold,
      animations,
      mask,
      fullPage
    });
  }

  /**
   * Comprehensive accessibility testing
   */
  async testAccessibility(options: {
    include?: string[];
    exclude?: string[];
    tags?: string[];
  } = {}): Promise<void> {
    const { include, exclude, tags = ['wcag2a', 'wcag2aa'] } = options;

    let axeBuilder = new AxeBuilder({ page: this.page });

    if (include) {
      axeBuilder = axeBuilder.include(include);
    }

    if (exclude) {
      axeBuilder = axeBuilder.exclude(exclude);
    }

    const accessibilityScanResults = await axeBuilder.withTags(tags).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation(logoLocator: Locator): Promise<void> {
    // Test Tab navigation
    await this.page.keyboard.press('Tab');

    // If logo is focusable, it should receive focus
    const isFocusable = await logoLocator.evaluate(el => el.hasAttribute('tabindex'));

    if (isFocusable) {
      await expect(logoLocator).toBeFocused();

      // Test Enter key activation
      await this.page.keyboard.press('Enter');
    }
  }

  /**
   * Test responsive behavior across viewports
   */
  async testResponsiveBehavior(logoLocator: Locator, configs: {
    mobile: LogoConfig;
    tablet: LogoConfig;
    desktop: LogoConfig;
  }): Promise<void> {
    // Mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.addLogoToContainer('[data-testid="test-logo"]', configs.mobile);

    await expect(logoLocator).toBeVisible();

    await this.testVisualRegression(logoLocator, 'logo-mobile.png');

    // Tablet viewport
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.addLogoToContainer('[data-testid="test-logo"]', configs.tablet);

    await expect(logoLocator).toBeVisible();

    await this.testVisualRegression(logoLocator, 'logo-tablet.png');

    // Desktop viewport
    await this.page.setViewportSize({ width: 1280, height: 720 });
    await this.addLogoToContainer('[data-testid="test-logo"]', configs.desktop);

    await expect(logoLocator).toBeVisible();

    await this.testVisualRegression(logoLocator, 'logo-desktop.png');
  }

  /**
   * Measure performance metrics
   */
  async measurePerformance(logoLocator: Locator): Promise<LogoPerformanceMetrics> {
    // Start performance monitoring
    await this.page.evaluate(() => {
      performance.mark('logo-test-start');
    });

    // Ensure logo is visible
    await expect(logoLocator).toBeVisible();

    await this.page.evaluate(() => {
      performance.mark('logo-test-end');
      performance.measure('logo-render', 'logo-test-start', 'logo-test-end');
    });

    const metrics = await this.page.evaluate(() => {
      const renderMeasure = performance.getEntriesByName('logo-render')[0];
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      let memoryUsage;
      if ('memory' in performance) {
        memoryUsage = (performance as any).memory.usedJSHeapSize;
      }

      return {
        renderTime: renderMeasure ? renderMeasure.duration : 0,
        loadTime: navigationEntry ? navigationEntry.loadEventEnd - navigationEntry.loadEventStart : 0,
        memoryUsage
      };
    });

    // Test interaction performance
    const interactionStart = performance.now();
    await logoLocator.hover();
    const interactionEnd = performance.now();

    return {
      ...metrics,
      interactionTime: interactionEnd - interactionStart
    };
  }

  /**
   * Test color schemes in different contexts
   */
  async testColorSchemes(): Promise<void> {
    const schemes = [
      { name: 'default', background: 'white', scheme: 'default' as const },
      { name: 'reverse', background: 'black', scheme: 'reverse' as const },
      { name: 'monochrome', background: '#f5f5f5', scheme: 'monochrome' as const }
    ];

    for (const { name, background, scheme } of schemes) {
      await this.page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body style="background: ${background}; padding: 40px;">
            <div data-testid="color-test-logo"></div>
          </body>
        </html>
      `);

      await this.addLogoToContainer('[data-testid="color-test-logo"]', { colorScheme: scheme });

      const logoLocator = this.page.locator('[data-testid="color-test-logo"]');

      await expect(logoLocator).toBeVisible();

      await this.testVisualRegression(logoLocator, `logo-${name}-scheme.png`);
      await this.testAccessibility();
    }
  }

  /**
   * Test logo in different usage contexts
   */
  async testUsageContexts(): Promise<void> {
    const contexts = [
      {
        name: 'navigation',
        html: `
          <nav style="background: white; border-bottom: 1px solid #e5e5e5; padding: 16px 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div data-testid="context-logo"></div>
              <div>Navigation items</div>
            </div>
          </nav>
        `,
        config: { size: 'default' as const }
      },
      {
        name: 'footer',
        html: `
          <footer style="background: #f8f9fa; border-top: 1px solid #e5e5e5; padding: 48px 24px; text-align: center;">
            <div data-testid="context-logo" style="margin-bottom: 24px;"></div>
            <p>© 2024 Telesis. All rights reserved.</p>
          </footer>
        `,
        config: { variant: 'stacked' as const, size: 'sm' as const }
      },
      {
        name: 'hero',
        html: `
          <section style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 80px 24px; text-align: center;">
            <div data-testid="context-logo" style="margin-bottom: 32px;"></div>
            <h1>Welcome to Telesis</h1>
          </section>
        `,
        config: { variant: 'stacked' as const, size: '2xl' as const }
      }
    ];

    for (const { name, html, config } of contexts) {
      await this.page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            ${html}
          </body>
        </html>
      `);

      await this.addLogoToContainer('[data-testid="context-logo"]', config);

      const contextElement = this.page.locator(name === 'navigation' ? 'nav' : name === 'footer' ? 'footer' : 'section');
      await this.testVisualRegression(contextElement, `logo-in-${name}.png`, { fullPage: true });
    }
  }

  /**
   * Test animation and interaction states
   */
  async testInteractionStates(logoLocator: Locator): Promise<void> {
    // Test normal state
    await this.testVisualRegression(logoLocator, 'logo-normal-state.png');

    // Test hover state (for interactive logos)
    await logoLocator.hover();
    await this.testVisualRegression(logoLocator, 'logo-hover-state.png');

    // Test focus state (for focusable logos)
    const isFocusable = await logoLocator.evaluate(el => el.hasAttribute('tabindex'));
    if (isFocusable) {
      await logoLocator.focus();
      await this.testVisualRegression(logoLocator, 'logo-focus-state.png');
    }
  }

  /**
   * Validate SVG structure and properties
   */
  async validateSVGStructure(logoLocator: Locator): Promise<void> {
    const svg = logoLocator.locator('svg[role="img"]');

    // Check SVG attributes
    await expect(svg).toHaveAttribute('role', 'img');
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
    await expect(svg).toHaveAttribute('viewBox', '0 0 48 18');

    // Check for title and description
    await expect(svg.locator('title')).toHaveText('Telesis Logo');
    await expect(svg.locator('desc')).toHaveText('Three olives representing the learning process: Ask, Think, Apply');

    // Check for three olives
    const olives = svg.locator('ellipse');

    await expect(olives).toHaveCount(3);

    // Check olive positioning
    const oliveCenters = [8, 24, 40];
    for (let i = 0; i < 3; i++) {
      await expect(olives.nth(i)).toHaveAttribute('cx', oliveCenters[i].toString());
    }
  }

  /**
   * Test high contrast mode compatibility
   */
  async testHighContrastMode(): Promise<void> {
    // Simulate high contrast mode
    await this.page.addStyleTag({
      content: `
        @media (prefers-contrast: high) {
          * {
            background-color: Canvas !important;
            color: CanvasText !important;
            border-color: CanvasText !important;
          }
          svg ellipse {
            fill: CanvasText !important;
            stroke: CanvasText !important;
          }
        }
      `
    });

    await this.setupLogoTestPage({ colorScheme: 'monochrome' });
    const logoLocator = this.page.locator('[data-testid="test-logo"]');

    await expect(logoLocator).toBeVisible();

    await this.testAccessibility();
    await this.testVisualRegression(logoLocator, 'logo-high-contrast.png');
  }

  /**
   * Comprehensive logo test suite
   */
  async runComprehensiveLogoTests(config: LogoConfig = {}): Promise<void> {
    // Setup logo
    const logoLocator = await this.setupLogoTestPage(config);

    // Visual regression tests
    await this.testVisualRegression(logoLocator, `logo-${config.variant || 'horizontal'}-${config.size || 'default'}-${config.colorScheme || 'default'}.png`);

    // Accessibility tests
    await this.testAccessibility();

    // Structure validation
    await this.validateSVGStructure(logoLocator);

    // Performance testing
    const metrics = await this.measurePerformance(logoLocator);

    expect(metrics.renderTime).toBeLessThan(50);
    expect(metrics.interactionTime).toBeLessThan(16);

    // Keyboard navigation (if interactive)
    if (config.interactive) {
      await this.testKeyboardNavigation(logoLocator);
    }

    // Interaction states
    await this.testInteractionStates(logoLocator);
  }
}

/**
 * Factory function to create logo test helpers
 */
export function createLogoHelpers(page: Page): LogoPlaywrightHelpers {
  return new LogoPlaywrightHelpers(page);
}

/**
 * Common test assertions for logos
 */
export const logoAssertions = {
  async expectVisibleLogo(logoLocator: Locator): Promise<void> {
    await expect(logoLocator).toBeVisible();
    await expect(logoLocator.locator('svg[role="img"]')).toBeVisible();
  },

  async expectAccessibleLogo(logoLocator: Locator): Promise<void> {
    await expect(logoLocator).toHaveAttribute('aria-label');
    await expect(logoLocator.locator('svg[role="img"]')).toHaveAttribute('aria-hidden', 'true');
  },

  async expectCorrectSVGStructure(logoLocator: Locator): Promise<void> {
    const svg = logoLocator.locator('svg[role="img"]');

    await expect(svg).toHaveAttribute('viewBox', '0 0 48 18');
    await expect(svg.locator('ellipse')).toHaveCount(3);
  },

  async expectFastPerformance(metrics: LogoPerformanceMetrics): Promise<void> {
    expect(metrics.renderTime).toBeLessThan(50);
    expect(metrics.interactionTime).toBeLessThan(16);
  }
};
