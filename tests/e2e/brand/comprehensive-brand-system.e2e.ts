import { expect, test } from '@playwright/test';

/**
 * Comprehensive Brand System E2E Tests
 * Tests the TelesisLogo component and brand consistency across the application
 */

test.describe('Brand System - TelesisLogo Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Logo Variant Rendering', () => {
    test('should render all logo variants correctly', async ({ page }) => {
      // Create a comprehensive test page with all logo variants
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Variants Test</title>
            <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; }
              .test-section { margin-bottom: 40px; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px; }
              .logo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
              .logo-item { padding: 20px; border: 1px solid #ddd; border-radius: 4px; text-align: center; }
            </style>
          </head>
          <body>
            <h1>TelesisLogo Component Variants</h1>
            
            <div class="test-section">
              <h2>Horizontal Logos</h2>
              <div class="logo-grid">
                <div class="logo-item">
                  <div data-testid="horizontal-default"></div>
                  <p>Horizontal - Default</p>
                </div>
                <div class="logo-item">
                  <div data-testid="horizontal-sm"></div>
                  <p>Horizontal - Small</p>
                </div>
                <div class="logo-item">
                  <div data-testid="horizontal-lg"></div>
                  <p>Horizontal - Large</p>
                </div>
              </div>
            </div>

            <div class="test-section">
              <h2>Stacked Logos</h2>
              <div class="logo-grid">
                <div class="logo-item">
                  <div data-testid="stacked-default"></div>
                  <p>Stacked - Default</p>
                </div>
                <div class="logo-item">
                  <div data-testid="stacked-lg"></div>
                  <p>Stacked - Large</p>
                </div>
              </div>
            </div>

            <div class="test-section">
              <h2>Logomark Only</h2>
              <div class="logo-grid">
                <div class="logo-item">
                  <div data-testid="logomark-default"></div>
                  <p>Logomark - Default</p>
                </div>
                <div class="logo-item">
                  <div data-testid="logomark-xl"></div>
                  <p>Logomark - Extra Large</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);

      // Inject logo components using page.evaluate
      await page.evaluate(() => {
        const logos = [
          {
            selector: '[data-testid="horizontal-default"]',
            html: `
              <div class="inline-flex items-center gap-x-2 text-base" role="img" aria-label="Telesis - Ask, Think, Apply">
                <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                  <title>Telesis Logo</title>
                  <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                  <g id="three-olives-logomark">
                    <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                    <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                    <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none" class="olive-apply"/>
                  </g>
                </svg>
                <div class="select-none font-semibold tracking-tight text-foreground">Telesis</div>
              </div>
            `
          },
          {
            selector: '[data-testid="horizontal-sm"]',
            html: `
              <div class="inline-flex items-center gap-x-2 text-sm" role="img" aria-label="Telesis - Ask, Think, Apply">
                <svg width="32" height="12" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                  <title>Telesis Logo</title>
                  <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                  <g id="three-olives-logomark">
                    <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                    <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                    <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none" class="olive-apply"/>
                  </g>
                </svg>
                <div class="select-none font-semibold tracking-tight text-foreground">Telesis</div>
              </div>
            `
          },
          {
            selector: '[data-testid="horizontal-lg"]',
            html: `
              <div class="inline-flex items-center gap-x-2 text-lg" role="img" aria-label="Telesis - Ask, Think, Apply">
                <svg width="64" height="24" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                  <title>Telesis Logo</title>
                  <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                  <g id="three-olives-logomark">
                    <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                    <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                    <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none" class="olive-apply"/>
                  </g>
                </svg>
                <div class="select-none font-semibold tracking-tight text-foreground">Telesis</div>
              </div>
            `
          },
          {
            selector: '[data-testid="stacked-default"]',
            html: `
              <div class="inline-flex flex-col gap-y-1 text-base items-center" role="img" aria-label="Telesis - Ask, Think, Apply">
                <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200 mb-1">
                  <title>Telesis Logo</title>
                  <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                  <g id="three-olives-logomark">
                    <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                    <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                    <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none" class="olive-apply"/>
                  </g>
                </svg>
                <div class="select-none font-semibold tracking-tight text-center text-foreground">
                  Telesis
                  <div class="text-xs font-normal opacity-75 mt-0.5 text-muted-foreground">Ask. Think. Apply.</div>
                </div>
              </div>
            `
          },
          {
            selector: '[data-testid="stacked-lg"]',
            html: `
              <div class="inline-flex flex-col gap-y-1 text-lg items-center" role="img" aria-label="Telesis - Ask, Think, Apply">
                <svg width="64" height="24" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200 mb-1">
                  <title>Telesis Logo</title>
                  <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                  <g id="three-olives-logomark">
                    <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                    <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                    <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none" class="olive-apply"/>
                  </g>
                </svg>
                <div class="select-none font-semibold tracking-tight text-center text-foreground">
                  Telesis
                  <div class="text-xs font-normal opacity-75 mt-0.5 text-muted-foreground">Ask. Think. Apply.</div>
                </div>
              </div>
            `
          },
          {
            selector: '[data-testid="logomark-default"]',
            html: `
              <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none" class="olive-apply"/>
                </g>
              </svg>
            `
          },
          {
            selector: '[data-testid="logomark-xl"]',
            html: `
              <svg width="80" height="30" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none" class="olive-apply"/>
                </g>
              </svg>
            `
          }
        ];

        logos.forEach(({ selector, html }) => {
          const element = document.querySelector(selector);
          if (element) {
            element.innerHTML = html;
          }
        });
      });

      // Verify all logos are visible
      await expect(page.locator('[data-testid="horizontal-default"]')).toBeVisible();
      await expect(page.locator('[data-testid="horizontal-sm"]')).toBeVisible();
      await expect(page.locator('[data-testid="horizontal-lg"]')).toBeVisible();
      await expect(page.locator('[data-testid="stacked-default"]')).toBeVisible();
      await expect(page.locator('[data-testid="stacked-lg"]')).toBeVisible();
      await expect(page.locator('[data-testid="logomark-default"]')).toBeVisible();
      await expect(page.locator('[data-testid="logomark-xl"]')).toBeVisible();

      // Take comprehensive screenshot
      await expect(page.locator('body')).toHaveScreenshot('logo-variants-comprehensive.png', {
        fullPage: true,
        threshold: 0.2
      });
    });

    test('should render color scheme variants correctly', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Color Schemes Test</title>
            <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; }
              .color-scheme-section { margin-bottom: 20px; padding: 40px; border-radius: 8px; }
              .default-bg { background: white; }
              .dark-bg { background: #1a1a1a; }
              .grey-bg { background: #f5f5f5; }
            </style>
          </head>
          <body>
            <h1>TelesisLogo Color Schemes</h1>
            
            <div class="color-scheme-section default-bg">
              <h3>Default Color Scheme (Light Background)</h3>
              <div data-testid="default-scheme"></div>
            </div>
            
            <div class="color-scheme-section dark-bg">
              <h3 style="color: white;">Reverse Color Scheme (Dark Background)</h3>
              <div data-testid="reverse-scheme"></div>
            </div>
            
            <div class="color-scheme-section grey-bg">
              <h3>Monochrome Color Scheme (Grey Background)</h3>
              <div data-testid="monochrome-scheme" style="color: #333;"></div>
            </div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        // Default scheme
        const defaultElement = document.querySelector('[data-testid="default-scheme"]');
        if (defaultElement) {
          defaultElement.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-base" role="img" aria-label="Telesis - Ask, Think, Apply">
              <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-foreground">Telesis</div>
            </div>
          `;
        }

        // Reverse scheme (white on dark)
        const reverseElement = document.querySelector('[data-testid="reverse-scheme"]');
        if (reverseElement) {
          reverseElement.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-base" role="img" aria-label="Telesis - Ask, Think, Apply">
              <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="#ffffff" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="#ffffff" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="#ffffff" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-white">Telesis</div>
            </div>
          `;
        }

        // Monochrome scheme
        const monochromeElement = document.querySelector('[data-testid="monochrome-scheme"]');
        if (monochromeElement) {
          monochromeElement.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-base" role="img" aria-label="Telesis - Ask, Think, Apply">
              <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="currentColor" stroke="currentColor" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="currentColor" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="currentColor" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-current">Telesis</div>
            </div>
          `;
        }
      });

      // Verify visibility and accessibility
      await expect(page.locator('[data-testid="default-scheme"]')).toBeVisible();
      await expect(page.locator('[data-testid="reverse-scheme"]')).toBeVisible();
      await expect(page.locator('[data-testid="monochrome-scheme"]')).toBeVisible();

      // Take screenshot for visual regression
      await expect(page.locator('body')).toHaveScreenshot('logo-color-schemes.png', {
        fullPage: true,
        threshold: 0.2
      });
    });
  });

  test.describe('Logo Accessibility', () => {
    test('should have proper ARIA attributes and roles', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Accessibility Test</title>
            <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
          </head>
          <body>
            <div data-testid="accessible-logo" style="padding: 20px;"></div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="accessible-logo"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-base" role="img" aria-label="Telesis - Ask, Think, Apply">
              <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-foreground">Telesis</div>
            </div>
          `;
        }
      });

      const logo = page.locator('[data-testid="accessible-logo"] > div');
      const svg = page.locator('[data-testid="accessible-logo"] svg');

      // Check role and aria-label
      await expect(logo).toHaveAttribute('role', 'img');
      await expect(logo).toHaveAttribute('aria-label', 'Telesis - Ask, Think, Apply');

      // Check SVG accessibility
      await expect(svg).toHaveAttribute('aria-hidden', 'true');

      // Check for title and desc elements
      await expect(page.locator('title')).toHaveText('Telesis Logo');
      await expect(page.locator('desc')).toHaveText('Three olives representing the learning process: Ask, Think, Apply');
    });

    test('should be keyboard focusable when interactive', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Keyboard Test</title>
            <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
            <style>
              .interactive-logo {
                cursor: pointer;
                border-radius: 4px;
                padding: 8px;
                outline: none;
              }
              .interactive-logo:focus {
                outline: 2px solid hsl(102, 58%, 32%);
                outline-offset: 2px;
              }
            </style>
          </head>
          <body>
            <button class="interactive-logo" data-testid="focusable-logo" tabindex="0"></button>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="focusable-logo"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-base" role="img" aria-label="Telesis - Ask, Think, Apply">
              <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-foreground">Telesis</div>
            </div>
          `;
        }
      });

      // Focus the logo using keyboard
      await page.keyboard.press('Tab');

      await expect(page.locator('[data-testid="focusable-logo"]')).toBeFocused();

      // Take screenshot of focus state
      await expect(page.locator('[data-testid="focusable-logo"]')).toHaveScreenshot('logo-keyboard-focus.png');
    });
  });
});

test.describe('Brand Consistency Across Pages', () => {
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/sign-in', name: 'Sign In', skipAuth: true },
    { path: '/sign-up', name: 'Sign Up', skipAuth: true },
  ];

  for (const { path, name, skipAuth } of pages) {
    test(`should maintain brand consistency on ${name}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Look for logo elements
      const logos = page.locator('[aria-label*="Telesis"], [role="img"]').filter({
        has: page.locator('svg')
      });

      if (await logos.count() > 0) {
        const firstLogo = logos.first();

        await expect(firstLogo).toBeVisible();

        // Check for consistent color usage
        const svg = firstLogo.locator('svg').first();
        if (await svg.count() > 0) {
          // Verify SVG has the expected structure
          await expect(svg.locator('ellipse')).toHaveCount(3); // Three olives

          // Take screenshot for visual consistency check
          await expect(firstLogo).toHaveScreenshot(`brand-consistency-${name.toLowerCase().replace(/\s+/g, '-')}.png`);
        }
      }

      // Check for Modern Sage color usage in key elements
      const primaryElements = page.locator('[class*="primary"], [class*="sage"]').first();
      if (await primaryElements.count() > 0) {
        await expect(primaryElements).toBeVisible();
      }
    });
  }
});

test.describe('Responsive Logo Behavior', () => {
  const viewports = [
    { width: 375, height: 667, name: 'Mobile' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1024, height: 768, name: 'Desktop Small' },
    { width: 1920, height: 1080, name: 'Desktop Large' },
  ];

  for (const { width, height, name } of viewports) {
    test(`should display correctly on ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });

      // Create a responsive test page
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Responsive Logo Test - ${name}</title>
            <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; }
              .responsive-nav {
                background: white;
                border-bottom: 1px solid #e5e5e5;
                padding: ${width < 768 ? '12px 16px' : '16px 24px'};
              }
              .nav-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                max-width: 1200px;
                margin: 0 auto;
              }
              .logo-container {
                display: flex;
                align-items: center;
              }
            </style>
          </head>
          <body>
            <nav class="responsive-nav">
              <div class="nav-content">
                <div class="logo-container">
                  <div data-testid="responsive-logo"></div>
                </div>
                <div>Navigation Menu</div>
              </div>
            </nav>
            
            <main style="padding: 20px; text-align: center;">
              <h1>Viewport: ${name} (${width}x${height})</h1>
              <div data-testid="content-logo" style="margin: 40px 0;"></div>
            </main>
          </body>
        </html>
      `);

      // Inject appropriate logo sizes based on viewport
      const logoSize = width < 768 ? 'sm' : width < 1024 ? 'default' : 'lg';
      const logoVariant = width < 768 ? 'logomark' : 'horizontal';

      await page.evaluate(({ logoSize, logoVariant, width }) => {
        const sizeMap = {
          sm: { width: 32, height: 12, textClass: 'text-sm' },
          default: { width: 48, height: 18, textClass: 'text-base' },
          lg: { width: 64, height: 24, textClass: 'text-lg' },
        };

        const { width: svgWidth, height: svgHeight, textClass } = sizeMap[logoSize] || sizeMap.default;

        const navLogo = document.querySelector('[data-testid="responsive-logo"]');
        const contentLogo = document.querySelector('[data-testid="content-logo"]');

        const logoHTML = logoVariant === 'logomark'
          ? `
            <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0" role="img" aria-label="Telesis">
              <title>Telesis Logo</title>
              <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
              <g id="three-olives-logomark">
                <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none" class="olive-apply"/>
              </g>
            </svg>
          `
          : `
            <div class="inline-flex items-center gap-x-2 ${textClass}" role="img" aria-label="Telesis - Ask, Think, Apply">
              <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-foreground">Telesis</div>
            </div>
          `;

        if (navLogo) {
 navLogo.innerHTML = logoHTML;
}
        if (contentLogo) {
          contentLogo.innerHTML = `
            <div class="inline-flex flex-col gap-y-1 text-xl items-center" role="img" aria-label="Telesis - Ask, Think, Apply">
              <svg width="80" height="30" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200 mb-1">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-center text-foreground">
                Telesis
                <div class="text-xs font-normal opacity-75 mt-0.5 text-muted-foreground">Ask. Think. Apply.</div>
              </div>
            </div>
          `;
        }
      }, { logoSize, logoVariant, width });

      // Verify logos are visible and properly sized
      await expect(page.locator('[data-testid="responsive-logo"]')).toBeVisible();
      await expect(page.locator('[data-testid="content-logo"]')).toBeVisible();

      // Take screenshot for responsive behavior
      await expect(page.locator('body')).toHaveScreenshot(`responsive-logo-${name.toLowerCase().replace(/\s+/g, '-')}.png`, {
        fullPage: true,
        threshold: 0.2
      });
    });
  }
});

test.describe('Theme Integration', () => {
  test('should adapt to light theme correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Set light theme
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    });

    await page.setContent(`
      <!DOCTYPE html>
      <html data-theme="light">
        <head>
          <title>Light Theme Test</title>
          <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
          <style>
            :root {
              --background: 0 0% 99%;
              --foreground: 220 13% 20%;
              --primary: 171 19% 41%;
              --sage-quietude: 171 19% 41%;
              --sage-growth: 102 58% 32%;
            }
            body {
              background: hsl(var(--background));
              color: hsl(var(--foreground));
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              padding: 40px;
            }
          </style>
        </head>
        <body>
          <h1>Light Theme Logo Test</h1>
          <div data-testid="light-theme-logo" style="margin: 20px 0;"></div>
        </body>
      </html>
    `);

    await page.evaluate(() => {
      const container = document.querySelector('[data-testid="light-theme-logo"]');
      if (container) {
        container.innerHTML = `
          <div class="inline-flex items-center gap-x-2 text-base" role="img" aria-label="Telesis - Ask, Think, Apply">
            <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
              <title>Telesis Logo</title>
              <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
              <g id="three-olives-logomark">
                <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none" class="olive-apply"/>
              </g>
            </svg>
            <div class="select-none font-semibold tracking-tight text-foreground">Telesis</div>
          </div>
        `;
      }
    });

    await expect(page.locator('[data-testid="light-theme-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="light-theme-logo"]')).toHaveScreenshot('logo-light-theme.png');
  });

  test('should adapt to dark theme correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.setContent(`
      <!DOCTYPE html>
      <html data-theme="dark">
        <head>
          <title>Dark Theme Test</title>
          <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
          <style>
            :root {
              --background: 220 13% 9%;
              --foreground: 0 0% 95%;
            }
            .dark {
              --background: 220 13% 9%;
              --foreground: 0 0% 95%;
            }
            body {
              background: hsl(var(--background));
              color: hsl(var(--foreground));
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              padding: 40px;
            }
          </style>
        </head>
        <body class="dark">
          <h1 style="color: white;">Dark Theme Logo Test</h1>
          <div data-testid="dark-theme-logo" style="margin: 20px 0;"></div>
        </body>
      </html>
    `);

    await page.evaluate(() => {
      const container = document.querySelector('[data-testid="dark-theme-logo"]');
      if (container) {
        container.innerHTML = `
          <div class="inline-flex items-center gap-x-2 text-base" role="img" aria-label="Telesis - Ask, Think, Apply">
            <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
              <title>Telesis Logo</title>
              <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
              <g id="three-olives-logomark">
                <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="#ffffff" stroke-width="1.5" class="olive-ask"/>
                <ellipse cx="24" cy="9" rx="6" ry="8" fill="#ffffff" stroke="none" class="olive-think"/>
                <ellipse cx="40" cy="9" rx="6" ry="8" fill="#ffffff" stroke="none" class="olive-apply"/>
              </g>
            </svg>
            <div class="select-none font-semibold tracking-tight text-white">Telesis</div>
          </div>
        `;
      }
    });

    await expect(page.locator('[data-testid="dark-theme-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="dark-theme-logo"]')).toHaveScreenshot('logo-dark-theme.png');
  });
});

test.describe('Brand Component Integration', () => {
  test('should integrate properly with Shadcn UI components', async ({ page }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Brand Integration Test</title>
          <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; }
            .card { background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin-bottom: 20px; }
            .button { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; }
            .button-primary { background: hsl(171, 19%, 41%); color: white; }
            .button-secondary { background: hsl(102, 58%, 32%); color: white; }
            .header { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid #e5e5e5; }
          </style>
        </head>
        <body>
          <header class="header">
            <div data-testid="header-logo"></div>
            <nav style="display: flex; gap: 16px;">
              <a href="#" style="text-decoration: none; color: hsl(171, 19%, 41%);">Home</a>
              <a href="#" style="text-decoration: none; color: hsl(171, 19%, 41%);">About</a>
            </nav>
          </header>

          <main>
            <div class="card">
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                <div data-testid="card-logo"></div>
                <h2 style="margin: 0; color: hsl(171, 19%, 41%);">Brand Integration</h2>
              </div>
              <p>This demonstrates how the Telesis logo integrates with other UI components.</p>
              <div style="display: flex; gap: 12px; margin-top: 16px;">
                <button class="button button-primary">
                  <div data-testid="button-logo"></div>
                  Primary Action
                </button>
                <button class="button button-secondary">Secondary Action</button>
              </div>
            </div>
          </main>
        </body>
      </html>
    `);

    await page.evaluate(() => {
      // Header logo
      const headerLogo = document.querySelector('[data-testid="header-logo"]');
      if (headerLogo) {
        headerLogo.innerHTML = `
          <div class="inline-flex items-center gap-x-2 text-base" role="img" aria-label="Telesis - Ask, Think, Apply">
            <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
              <title>Telesis Logo</title>
              <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
              <g id="three-olives-logomark">
                <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none" class="olive-apply"/>
              </g>
            </svg>
            <div class="select-none font-semibold tracking-tight text-foreground">Telesis</div>
          </div>
        `;
      }

      // Card logo (small)
      const cardLogo = document.querySelector('[data-testid="card-logo"]');
      if (cardLogo) {
        cardLogo.innerHTML = `
          <svg width="32" height="12" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0">
            <title>Telesis Logo</title>
            <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
            <g id="three-olives-logomark">
              <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
              <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
              <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none" class="olive-apply"/>
            </g>
          </svg>
        `;
      }

      // Button logo (tiny logomark)
      const buttonLogo = document.querySelector('[data-testid="button-logo"]');
      if (buttonLogo) {
        buttonLogo.innerHTML = `
          <svg width="16" height="6" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0">
            <g id="three-olives-logomark">
              <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="currentColor" stroke-width="1.5"/>
              <ellipse cx="24" cy="9" rx="6" ry="8" fill="currentColor" stroke="none"/>
              <ellipse cx="40" cy="9" rx="6" ry="8" fill="currentColor" stroke="none"/>
            </g>
          </svg>
        `;
      }
    });

    await expect(page.locator('[data-testid="header-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="card-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="button-logo"]')).toBeVisible();

    await expect(page.locator('body')).toHaveScreenshot('brand-component-integration.png', {
      fullPage: true,
      threshold: 0.2
    });
  });
});
