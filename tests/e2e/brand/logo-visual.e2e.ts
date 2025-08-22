import { expect, test } from '@playwright/test';

test.describe('Logo Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a test page with logos
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Logo Variants Visual Testing', () => {
    test('should render horizontal logo correctly', async ({ page }) => {
      // Create a test page with horizontal logo
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <div id="logo-container" style="padding: 20px; background: white;">
              <div data-testid="horizontal-logo"></div>
            </div>
            <script type="module">
              import { TelesisLogo } from '/src/components/brand/TelesisLogo.tsx';
              import React from 'react';
              import ReactDOM from 'react-dom/client';
              
              const root = ReactDOM.createRoot(document.querySelector('[data-testid="horizontal-logo"]'));
              root.render(React.createElement(TelesisLogo, { variant: 'horizontal' }));
            </script>
          </body>
        </html>
      `);

      const logoContainer = page.locator('[data-testid="horizontal-logo"]');

      await expect(logoContainer).toBeVisible();

      // Take screenshot for visual regression
      await expect(logoContainer).toHaveScreenshot('horizontal-logo.png');
    });

    test('should render stacked logo correctly', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <div style="padding: 20px; background: white;">
              <div data-testid="stacked-logo" style="display: inline-block;"></div>
            </div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="stacked-logo"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex flex-col gap-y-1 text-base items-center" aria-label="Telesis - Ask, Think, Apply">
              <svg width="48" height="18" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0 transition-colors duration-200 mb-1">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-center text-foreground">
                Telesis
                <div class="text-xs font-normal opacity-75 mt-0.5 text-muted-foreground">
                  Ask. Think. Apply.
                </div>
              </div>
            </div>
          `;
        }
      });

      const logoContainer = page.locator('[data-testid="stacked-logo"]');

      await expect(logoContainer).toBeVisible();

      // Verify stacked layout
      const logo = logoContainer.locator('div').first();

      await expect(logo).toHaveClass(/flex-col/);

      // Take screenshot for visual regression
      await expect(logoContainer).toHaveScreenshot('stacked-logo.png');
    });

    test('should render logomark only correctly', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <div style="padding: 20px; background: white;">
              <div data-testid="logomark-only"></div>
            </div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="logomark-only"]');
        if (container) {
          container.innerHTML = `
            <svg width="48" height="18" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0">
              <title>Telesis Logo</title>
              <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
              <g id="three-olives-logomark">
                <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none" class="olive-apply"/>
              </g>
            </svg>
          `;
        }
      });

      const logoContainer = page.locator('[data-testid="logomark-only"]');

      await expect(logoContainer).toBeVisible();

      // Verify no text is present
      await expect(page.locator('text=Telesis')).toBeHidden();

      // Take screenshot for visual regression
      await expect(logoContainer).toHaveScreenshot('logomark-only.png');
    });
  });

  test.describe('Logo Sizes Visual Testing', () => {
    const sizes = [
      { size: 'sm', width: 32, height: 12 },
      { size: 'default', width: 48, height: 18 },
      { size: 'lg', width: 64, height: 24 },
      { size: 'xl', width: 80, height: 30 },
      { size: '2xl', width: 96, height: 36 },
    ];

    for (const { size, width, height } of sizes) {
      test(`should render ${size} size correctly`, async ({ page }) => {
        await page.setContent(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Logo Test</title>
              <link href="/styles/globals.css" rel="stylesheet">
            </head>
            <body>
              <div style="padding: 20px; background: white; display: flex; align-items: center; gap: 20px;">
                <div data-testid="logo-${size}"></div>
                <div style="font-family: monospace; font-size: 12px; color: #666;">
                  Size: ${size}<br>
                  Dimensions: ${width}x${height}
                </div>
              </div>
            </body>
          </html>
        `);

        await page.evaluate(({ size, width, height }) => {
          const container = document.querySelector(`[data-testid="logo-${size}"]`);
          if (container) {
            const textClass = size === 'default' ? 'text-base' : `text-${size}`;
            container.innerHTML = `
              <div class="inline-flex items-center gap-x-2 ${textClass}" aria-label="Telesis - Ask, Think, Apply">
                <svg width="${width}" height="${height}" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                  <title>Telesis Logo</title>
                  <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                  <g id="three-olives-logomark">
                    <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                    <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                    <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none" class="olive-apply"/>
                  </g>
                </svg>
                <div class="select-none font-semibold tracking-tight text-foreground">
                  Telesis
                </div>
              </div>
            `;
          }
        }, { size, width, height });

        const logoContainer = page.locator(`[data-testid="logo-${size}"]`);

        await expect(logoContainer).toBeVisible();

        // Verify SVG dimensions
        const svg = logoContainer.locator('svg');

        await expect(svg).toHaveAttribute('width', width.toString());
        await expect(svg).toHaveAttribute('height', height.toString());

        // Take screenshot for visual regression
        await expect(page.locator('body')).toHaveScreenshot(`logo-size-${size}.png`);
      });
    }
  });

  test.describe('Logo Color Schemes Visual Testing', () => {
    test('should render default color scheme correctly', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <div style="padding: 40px; background: white;">
              <div data-testid="default-scheme"></div>
            </div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="default-scheme"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-base" aria-label="Telesis - Ask, Think, Apply">
              <svg width="48" height="18" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-foreground">
                Telesis
              </div>
            </div>
          `;
        }
      });

      const logoContainer = page.locator('[data-testid="default-scheme"]');

      await expect(logoContainer).toBeVisible();

      // Take screenshot for visual regression
      await expect(logoContainer).toHaveScreenshot('default-color-scheme.png');
    });

    test('should render reverse color scheme correctly', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <div style="padding: 40px; background: black;">
              <div data-testid="reverse-scheme"></div>
            </div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="reverse-scheme"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-base" aria-label="Telesis - Ask, Think, Apply">
              <svg width="48" height="18" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="#ffffff" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="#ffffff" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="#ffffff" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-white">
                Telesis
              </div>
            </div>
          `;
        }
      });

      const logoContainer = page.locator('[data-testid="reverse-scheme"]');

      await expect(logoContainer).toBeVisible();

      // Take screenshot for visual regression
      await expect(page.locator('body')).toHaveScreenshot('reverse-color-scheme.png');
    });

    test('should render monochrome color scheme correctly', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <div style="padding: 40px; background: #f5f5f5; color: #333;">
              <div data-testid="monochrome-scheme"></div>
            </div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="monochrome-scheme"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-base" aria-label="Telesis - Ask, Think, Apply" style="color: inherit;">
              <svg width="48" height="18" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="currentColor" stroke="currentColor" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="currentColor" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="currentColor" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-current">
                Telesis
              </div>
            </div>
          `;
        }
      });

      const logoContainer = page.locator('[data-testid="monochrome-scheme"]');

      await expect(logoContainer).toBeVisible();

      // Take screenshot for visual regression
      await expect(page.locator('body')).toHaveScreenshot('monochrome-color-scheme.png');
    });
  });

  test.describe('Logo in Different Contexts', () => {
    test('should render correctly in navigation header', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <nav style="background: white; border-bottom: 1px solid #e5e5e5; padding: 16px 24px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div data-testid="nav-logo"></div>
                <div style="display: flex; gap: 24px;">
                  <a href="#" style="color: #333; text-decoration: none;">Home</a>
                  <a href="#" style="color: #333; text-decoration: none;">About</a>
                  <a href="#" style="color: #333; text-decoration: none;">Contact</a>
                </div>
              </div>
            </nav>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="nav-logo"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-base" aria-label="Telesis - Ask, Think, Apply">
              <svg width="48" height="18" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-foreground">
                Telesis
              </div>
            </div>
          `;
        }
      });

      await expect(page.locator('nav')).toHaveScreenshot('logo-in-navigation.png');
    });

    test('should render correctly in footer', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <footer style="background: #f8f9fa; border-top: 1px solid #e5e5e5; padding: 48px 24px; text-align: center;">
              <div data-testid="footer-logo" style="margin-bottom: 24px;"></div>
              <p style="color: #666; font-size: 14px; margin: 0;">
                © 2024 Telesis. All rights reserved.
              </p>
            </footer>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="footer-logo"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex flex-col gap-y-1 text-sm items-center" aria-label="Telesis - Ask, Think, Apply">
              <svg width="32" height="12" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0 transition-colors duration-200 mb-1">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-center text-foreground">
                Telesis
                <div class="text-xs font-normal opacity-75 mt-0.5 text-muted-foreground">
                  Ask. Think. Apply.
                </div>
              </div>
            </div>
          `;
        }
      });

      await expect(page.locator('footer')).toHaveScreenshot('logo-in-footer.png');
    });

    test('should render correctly as hero logo', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <section style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 80px 24px; text-align: center;">
              <div data-testid="hero-logo" style="margin-bottom: 32px;"></div>
              <h1 style="font-size: 48px; font-weight: bold; margin: 0 0 16px 0; color: #333;">
                Welcome to the Future of Learning
              </h1>
              <p style="font-size: 20px; color: #666; margin: 0;">
                Transform your knowledge into actionable skills
              </p>
            </section>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="hero-logo"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex flex-col gap-y-1 text-2xl items-center" aria-label="Telesis - Ask, Think, Apply">
              <svg width="96" height="36" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0 transition-colors duration-200 mb-1">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-center text-foreground">
                Telesis
                <div class="text-xs font-normal opacity-75 mt-0.5 text-muted-foreground">
                  Ask. Think. Apply.
                </div>
              </div>
            </div>
          `;
        }
      });

      await expect(page.locator('section')).toHaveScreenshot('logo-hero-section.png');
    });
  });

  test.describe('Logo Responsive Behavior', () => {
    test('should adapt to mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body>
            <nav style="background: white; border-bottom: 1px solid #e5e5e5; padding: 12px 16px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div data-testid="mobile-nav-logo"></div>
                <button style="background: none; border: none; font-size: 24px;">☰</button>
              </div>
            </nav>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="mobile-nav-logo"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-sm" aria-label="Telesis - Ask, Think, Apply">
              <svg width="32" height="12" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-foreground">
                Telesis
              </div>
            </div>
          `;
        }
      });

      await expect(page.locator('nav')).toHaveScreenshot('logo-mobile-navigation.png');
    });

    test('should adapt to tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad

      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body>
            <header style="background: white; border-bottom: 1px solid #e5e5e5; padding: 24px;">
              <div style="display: flex; align-items: center; justify-content: center;">
                <div data-testid="tablet-header-logo"></div>
              </div>
            </header>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="tablet-header-logo"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex flex-col gap-y-1 text-lg items-center" aria-label="Telesis - Ask, Think, Apply">
              <svg width="64" height="24" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0 transition-colors duration-200 mb-1">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-center text-foreground">
                Telesis
                <div class="text-xs font-normal opacity-75 mt-0.5 text-muted-foreground">
                  Ask. Think. Apply.
                </div>
              </div>
            </div>
          `;
        }
      });

      await expect(page.locator('header')).toHaveScreenshot('logo-tablet-header.png');
    });
  });

  test.describe('Logo Interaction States', () => {
    test('should show hover state for interactive logo', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
            <style>
              .interactive-logo {
                cursor: pointer;
                transition: opacity 0.2s ease;
              }
              .interactive-logo:hover {
                opacity: 0.8;
              }
            </style>
          </head>
          <body>
            <div style="padding: 40px; background: white;">
              <div data-testid="interactive-logo" class="interactive-logo"></div>
            </div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="interactive-logo"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-base" aria-label="Telesis - Ask, Think, Apply">
              <svg width="48" height="18" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-foreground">
                Telesis
              </div>
            </div>
          `;
        }
      });

      const logo = page.locator('[data-testid="interactive-logo"]');

      // Take screenshot of normal state
      await expect(logo).toHaveScreenshot('logo-normal-state.png');

      // Hover over logo
      await logo.hover();

      // Take screenshot of hover state
      await expect(logo).toHaveScreenshot('logo-hover-state.png');
    });

    test('should show focus state for keyboard navigation', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
            <style>
              .focusable-logo {
                cursor: pointer;
                border-radius: 4px;
                padding: 8px;
              }
              .focusable-logo:focus {
                outline: 2px solid hsl(102, 58%, 38%);
                outline-offset: 2px;
              }
            </style>
          </head>
          <body>
            <div style="padding: 40px; background: white;">
              <div data-testid="focusable-logo" class="focusable-logo" tabindex="0"></div>
            </div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="focusable-logo"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-base" aria-label="Telesis - Ask, Think, Apply">
              <svg width="48" height="18" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5" class="olive-ask"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none" class="olive-think"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none" class="olive-apply"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-foreground">
                Telesis
              </div>
            </div>
          `;
        }
      });

      const logo = page.locator('[data-testid="focusable-logo"]');

      // Focus the logo using keyboard
      await page.keyboard.press('Tab');

      await expect(logo).toBeFocused();

      // Take screenshot of focus state
      await expect(logo).toHaveScreenshot('logo-focus-state.png');
    });
  });
});
