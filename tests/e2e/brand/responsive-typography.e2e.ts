import { expect, test } from '@playwright/test';

/**
 * Responsive Typography and Brand Element Tests
 * Tests typography scaling, brand consistency across breakpoints, and responsive behavior
 */

test.describe('Responsive Typography and Brand Elements', () => {
  const breakpoints = [
    { name: 'Mobile Portrait', width: 375, height: 667 },
    { name: 'Mobile Landscape', width: 667, height: 375 },
    { name: 'Tablet Portrait', width: 768, height: 1024 },
    { name: 'Tablet Landscape', width: 1024, height: 768 },
    { name: 'Desktop Small', width: 1280, height: 720 },
    { name: 'Desktop Large', width: 1440, height: 900 },
    { name: 'Desktop XL', width: 1920, height: 1080 },
  ];

  test.describe('Typography Scaling Tests', () => {
    for (const breakpoint of breakpoints) {
      test(`should scale typography correctly at ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})`, async ({ page }) => {
        await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });

        // Create responsive typography test page
        await page.setContent(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Responsive Typography Test - ${breakpoint.name}</title>
              <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  margin: 0;
                  padding: 0;
                  line-height: 1.6;
                }
                .responsive-container {
                  max-width: 1200px;
                  margin: 0 auto;
                  padding: ${breakpoint.width < 768 ? '16px' : breakpoint.width < 1024 ? '24px' : '32px'};
                }
                .typography-section {
                  background: white;
                  border-radius: 8px;
                  padding: ${breakpoint.width < 768 ? '20px' : '30px'};
                  margin-bottom: 20px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .brand-header {
                  display: flex;
                  align-items: center;
                  gap: ${breakpoint.width < 768 ? '12px' : '16px'};
                  margin-bottom: 24px;
                  padding-bottom: 16px;
                  border-bottom: 2px solid hsl(171, 19%, 41%);
                }
                .typography-grid {
                  display: grid;
                  grid-template-columns: ${breakpoint.width < 768 ? '1fr' : breakpoint.width < 1024 ? '1fr 1fr' : '1fr 1fr 1fr'};
                  gap: 20px;
                }
                .typography-item {
                  border: 1px solid #e5e5e5;
                  border-radius: 6px;
                  padding: 16px;
                  background: #fafafa;
                }
                .breakpoint-info {
                  position: fixed;
                  top: 10px;
                  right: 10px;
                  background: rgba(0,0,0,0.8);
                  color: white;
                  padding: 8px 12px;
                  border-radius: 4px;
                  font-size: 12px;
                  z-index: 1000;
                }
              </style>
            </head>
            <body>
              <div class="breakpoint-info">
                ${breakpoint.name}<br>
                ${breakpoint.width} × ${breakpoint.height}
              </div>

              <div class="responsive-container">
                <header class="typography-section">
                  <div class="brand-header">
                    <div data-testid="responsive-logo"></div>
                    <div>
                      <h1 data-testid="main-heading" style="margin: 0; color: hsl(171, 19%, 41%);">
                        Responsive Typography Test
                      </h1>
                      <p style="margin: 4px 0 0 0; color: hsl(220, 8%, 46%);">
                        ${breakpoint.name} Viewport
                      </p>
                    </div>
                  </div>
                </header>

                <section class="typography-section">
                  <h2 data-testid="section-heading">Typography Hierarchy</h2>
                  <div class="typography-grid">
                    <div class="typography-item">
                      <h3 data-testid="h3-heading">Heading 3</h3>
                      <p data-testid="body-text">Body text with proper line height and spacing for optimal readability across devices.</p>
                    </div>
                    <div class="typography-item">
                      <h4 data-testid="h4-heading">Heading 4</h4>
                      <small data-testid="small-text">Small text for captions and secondary information.</small>
                    </div>
                    <div class="typography-item">
                      <div data-testid="brand-typography-logo"></div>
                      <p style="margin-top: 12px;">Logo with typography integration</p>
                    </div>
                  </div>
                </section>

                <section class="typography-section">
                  <h2>Brand Color Typography</h2>
                  <div style="display: flex; flex-direction: ${breakpoint.width < 768 ? 'column' : 'row'}; gap: 20px;">
                    <div style="flex: 1; padding: 20px; background: hsl(171, 19%, 96%); border-radius: 6px;">
                      <h3 style="color: hsl(171, 19%, 41%); margin-top: 0;" data-testid="sage-quietude-text">
                        Sage Quietude Text
                      </h3>
                      <p data-testid="sage-body-text">Primary brand color text with proper contrast ratios for accessibility.</p>
                    </div>
                    <div style="flex: 1; padding: 20px; background: hsl(102, 58%, 96%); border-radius: 6px;">
                      <h3 style="color: hsl(102, 58%, 32%); margin-top: 0;" data-testid="sage-growth-text">
                        Sage Growth Text
                      </h3>
                      <p data-testid="growth-body-text">Accent brand color text for highlights and actions.</p>
                    </div>
                  </div>
                </section>
              </div>
            </body>
          </html>
        `);

        // Determine logo sizing based on breakpoint
        const logoConfig = {
          size: breakpoint.width < 768 ? 'sm' : breakpoint.width < 1024 ? 'default' : breakpoint.width < 1440 ? 'lg' : 'xl',
          variant: breakpoint.width < 480 ? 'logomark' : 'horizontal'
        };

        const sizeMap = {
          sm: { width: 32, height: 12, textClass: 'text-sm' },
          default: { width: 48, height: 18, textClass: 'text-base' },
          lg: { width: 64, height: 24, textClass: 'text-lg' },
          xl: { width: 80, height: 30, textClass: 'text-xl' },
        };

        const { width: svgWidth, height: svgHeight, textClass } = sizeMap[logoConfig.size];

        await page.evaluate(({ logoConfig, svgWidth, svgHeight, textClass }) => {
          // Main responsive logo
          const responsiveLogo = document.querySelector('[data-testid="responsive-logo"]');
          const brandTypographyLogo = document.querySelector('[data-testid="brand-typography-logo"]');

          const logoHTML = logoConfig.variant === 'logomark'
            ? `
              <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 48 18" aria-hidden="true" role="img" aria-label="Telesis">
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

          if (responsiveLogo) {
 responsiveLogo.innerHTML = logoHTML;
}
          if (brandTypographyLogo) {
            brandTypographyLogo.innerHTML = `
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
            `;
          }
        }, { logoConfig, svgWidth, svgHeight, textClass });

        // Verify all elements are visible and properly sized
        await expect(page.locator('[data-testid="responsive-logo"]')).toBeVisible();
        await expect(page.locator('[data-testid="main-heading"]')).toBeVisible();
        await expect(page.locator('[data-testid="section-heading"]')).toBeVisible();
        await expect(page.locator('[data-testid="h3-heading"]')).toBeVisible();
        await expect(page.locator('[data-testid="body-text"]')).toBeVisible();
        await expect(page.locator('[data-testid="brand-typography-logo"]')).toBeVisible();

        // Test brand color accessibility
        await expect(page.locator('[data-testid="sage-quietude-text"]')).toBeVisible();
        await expect(page.locator('[data-testid="sage-growth-text"]')).toBeVisible();

        // Take comprehensive screenshot
        await expect(page.locator('body')).toHaveScreenshot(`responsive-typography-${breakpoint.name.toLowerCase().replace(/\s+/g, '-')}.png`, {
          fullPage: true,
          threshold: 0.2
        });
      });
    }
  });

  test.describe('Logo Responsive Behavior', () => {
    test('should adapt logo variants based on viewport constraints', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Adaptive Test</title>
            <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; }
              .adaptive-section { 
                background: white; 
                padding: 30px; 
                margin: 20px 0; 
                border-radius: 8px; 
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .navigation-bar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                background: white;
                border-bottom: 1px solid #e5e5e5;
                position: sticky;
                top: 0;
                z-index: 100;
              }
              .nav-menu {
                display: flex;
                gap: 20px;
                align-items: center;
              }
              @media (max-width: 768px) {
                .nav-menu { display: none; }
                .mobile-menu-toggle { display: block; }
              }
              @media (min-width: 769px) {
                .mobile-menu-toggle { display: none; }
              }
            </style>
          </head>
          <body>
            <nav class="navigation-bar">
              <div data-testid="adaptive-nav-logo"></div>
              <div class="nav-menu">
                <a href="#" style="text-decoration: none; color: hsl(171, 19%, 41%);">Products</a>
                <a href="#" style="text-decoration: none; color: hsl(171, 19%, 41%);">Solutions</a>
                <a href="#" style="text-decoration: none; color: hsl(171, 19%, 41%);">Support</a>
              </div>
              <button class="mobile-menu-toggle" style="background: none; border: none; font-size: 20px;">☰</button>
            </nav>

            <main>
              <section class="adaptive-section">
                <h1>Logo Adaptive Behavior Test</h1>
                <p>This test demonstrates how the Telesis logo adapts to different viewport constraints.</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0;">
                  <div style="border: 1px solid #e5e5e5; padding: 20px; border-radius: 6px;">
                    <h3>Container Constrained</h3>
                    <div style="max-width: 200px; overflow: hidden;">
                      <div data-testid="constrained-logo"></div>
                    </div>
                  </div>
                  
                  <div style="border: 1px solid #e5e5e5; padding: 20px; border-radius: 6px;">
                    <h3>Flexible Container</h3>
                    <div style="width: 100%;">
                      <div data-testid="flexible-logo"></div>
                    </div>
                  </div>
                  
                  <div style="border: 1px solid #e5e5e5; padding: 20px; border-radius: 6px; background: #f0f0f0;">
                    <h3>Sidebar Logo</h3>
                    <div style="max-width: 150px;">
                      <div data-testid="sidebar-logo"></div>
                    </div>
                  </div>
                </div>
              </section>

              <section class="adaptive-section">
                <h2>Responsive Logo Sizes</h2>
                <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-around; gap: 30px; padding: 20px; background: #f9f9f9; border-radius: 6px;">
                  <div style="text-align: center;">
                    <div data-testid="hero-logo"></div>
                    <p style="margin-top: 10px; font-size: 12px; color: #666;">Hero Size</p>
                  </div>
                  <div style="text-align: center;">
                    <div data-testid="header-logo"></div>
                    <p style="margin-top: 10px; font-size: 12px; color: #666;">Header Size</p>
                  </div>
                  <div style="text-align: center;">
                    <div data-testid="compact-logo"></div>
                    <p style="margin-top: 10px; font-size: 12px; color: #666;">Compact Size</p>
                  </div>
                </div>
              </section>
            </main>
          </body>
        </html>
      `);

      // Get viewport width to determine appropriate logo sizing
      const viewportSize = page.viewportSize();
      const width = viewportSize?.width || 1280;

      await page.evaluate(({ width }) => {
        const logos = [
          {
            selector: '[data-testid="adaptive-nav-logo"]',
            config: width < 768 ? { size: 'sm', variant: 'logomark' } : { size: 'default', variant: 'horizontal' }
          },
          {
            selector: '[data-testid="constrained-logo"]',
            config: { size: 'sm', variant: 'logomark' }
          },
          {
            selector: '[data-testid="flexible-logo"]',
            config: { size: 'default', variant: 'horizontal' }
          },
          {
            selector: '[data-testid="sidebar-logo"]',
            config: { size: 'sm', variant: 'stacked' }
          },
          {
            selector: '[data-testid="hero-logo"]',
            config: { size: '2xl', variant: 'stacked' }
          },
          {
            selector: '[data-testid="header-logo"]',
            config: { size: 'lg', variant: 'horizontal' }
          },
          {
            selector: '[data-testid="compact-logo"]',
            config: { size: 'sm', variant: 'horizontal' }
          }
        ];

        const sizeMap = {
          'sm': { width: 32, height: 12, textClass: 'text-sm' },
          'default': { width: 48, height: 18, textClass: 'text-base' },
          'lg': { width: 64, height: 24, textClass: 'text-lg' },
          'xl': { width: 80, height: 30, textClass: 'text-xl' },
          '2xl': { width: 96, height: 36, textClass: 'text-2xl' },
        };

        logos.forEach(({ selector, config }) => {
          const element = document.querySelector(selector);
          const { width: svgWidth, height: svgHeight, textClass } = sizeMap[config.size];

          if (element && svgWidth && svgHeight) {
            let html = '';

            if (config.variant === 'logomark') {
              html = `
                <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 48 18" aria-hidden="true" role="img" aria-label="Telesis">
                  <title>Telesis Logo</title>
                  <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                  <g id="three-olives-logomark">
                    <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
                    <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
                    <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none"/>
                  </g>
                </svg>
              `;
            } else if (config.variant === 'stacked') {
              html = `
                <div class="inline-flex flex-col gap-y-1 ${textClass} items-center" role="img" aria-label="Telesis - Ask, Think, Apply">
                  <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200 mb-1">
                    <title>Telesis Logo</title>
                    <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                    <g id="three-olives-logomark">
                      <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
                      <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
                      <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none"/>
                    </g>
                  </svg>
                  <div class="select-none font-semibold tracking-tight text-center text-foreground">
                    Telesis
                    <div class="text-xs font-normal opacity-75 mt-0.5 text-muted-foreground">Ask. Think. Apply.</div>
                  </div>
                </div>
              `;
            } else {
              html = `
                <div class="inline-flex items-center gap-x-2 ${textClass}" role="img" aria-label="Telesis - Ask, Think, Apply">
                  <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                    <title>Telesis Logo</title>
                    <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                    <g id="three-olives-logomark">
                      <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
                      <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
                      <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none"/>
                    </g>
                  </svg>
                  <div class="select-none font-semibold tracking-tight text-foreground">Telesis</div>
                </div>
              `;
            }

            element.innerHTML = html;
          }
        });
      }, { width });

      // Verify all adaptive logos are visible
      const logoTestIds = [
        'adaptive-nav-logo',
'constrained-logo',
'flexible-logo',
'sidebar-logo',
        'hero-logo',
'header-logo',
'compact-logo'
      ];

      for (const testId of logoTestIds) {
        await expect(page.locator(`[data-testid="${testId}"]`)).toBeVisible();
      }

      // Take screenshot
      await expect(page.locator('body')).toHaveScreenshot('logo-adaptive-behavior.png', {
        fullPage: true,
        threshold: 0.2
      });
    });

    test('should handle orientation changes gracefully', async ({ page }) => {
      // Test portrait to landscape orientation change
      await page.setViewportSize({ width: 375, height: 667 }); // Portrait

      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Orientation Change Test</title>
            <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 16px; }
              .orientation-section {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                text-align: center;
              }
              .orientation-info {
                position: fixed;
                bottom: 10px;
                left: 10px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
              }
            </style>
          </head>
          <body>
            <div class="orientation-info" data-testid="orientation-info">Portrait</div>
            
            <div class="orientation-section">
              <h1>Orientation Test - Portrait</h1>
              <div data-testid="portrait-logo" style="margin: 20px 0;"></div>
              <p>Logo in portrait orientation</p>
            </div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const portraitLogo = document.querySelector('[data-testid="portrait-logo"]');
        if (portraitLogo) {
          portraitLogo.innerHTML = `
            <div class="inline-flex flex-col gap-y-1 text-base items-center" role="img" aria-label="Telesis - Ask, Think, Apply">
              <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200 mb-1">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-center text-foreground">
                Telesis
                <div class="text-xs font-normal opacity-75 mt-0.5 text-muted-foreground">Ask. Think. Apply.</div>
              </div>
            </div>
          `;
        }
      });

      await expect(page.locator('[data-testid="portrait-logo"]')).toBeVisible();

      // Take portrait screenshot
      await expect(page.locator('body')).toHaveScreenshot('logo-portrait-orientation.png', {
        fullPage: true,
        threshold: 0.2
      });

      // Change to landscape
      await page.setViewportSize({ width: 667, height: 375 }); // Landscape

      await page.evaluate(() => {
        // Update orientation info
        const orientationInfo = document.querySelector('[data-testid="orientation-info"]');
        if (orientationInfo) {
          orientationInfo.textContent = 'Landscape';
        }

        // Update header
        const header = document.querySelector('h1');
        if (header) {
          header.textContent = 'Orientation Test - Landscape';
        }

        // Update logo for landscape (horizontal layout works better)
        const logo = document.querySelector('[data-testid="portrait-logo"]');
        if (logo) {
          logo.setAttribute('data-testid', 'landscape-logo');
          logo.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-base" role="img" aria-label="Telesis - Ask, Think, Apply">
              <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-foreground">Telesis</div>
            </div>
          `;
        }

        // Update description
        const description = document.querySelector('p');
        if (description) {
          description.textContent = 'Logo in landscape orientation';
        }
      });

      await expect(page.locator('[data-testid="landscape-logo"]')).toBeVisible();

      // Take landscape screenshot
      await expect(page.locator('body')).toHaveScreenshot('logo-landscape-orientation.png', {
        fullPage: true,
        threshold: 0.2
      });
    });
  });

  test.describe('Typography Brand Integration', () => {
    test('should integrate typography with brand colors consistently', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Typography Brand Integration</title>
            <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f9f9f9; }
              .integration-section {
                background: white;
                padding: 30px;
                border-radius: 8px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .brand-showcase {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 30px 0;
              }
              .showcase-item {
                border: 1px solid #e5e5e5;
                border-radius: 8px;
                padding: 24px;
                background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
              }
              .color-demo {
                padding: 16px;
                border-radius: 6px;
                margin: 16px 0;
              }
              .sage-quietude-bg { background: hsl(171, 19%, 96%); border-left: 4px solid hsl(171, 19%, 41%); }
              .sage-growth-bg { background: hsl(102, 58%, 96%); border-left: 4px solid hsl(102, 58%, 32%); }
              .sage-mist-bg { background: hsl(173, 15%, 92%); border-left: 4px solid hsl(173, 15%, 85%); }
            </style>
          </head>
          <body>
            <div class="integration-section">
              <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 2px solid hsl(171, 19%, 41%);">
                <div data-testid="integration-logo"></div>
                <div>
                  <h1 style="margin: 0; color: hsl(171, 19%, 41%); font-weight: 700;">Typography Brand Integration</h1>
                  <p style="margin: 8px 0 0 0; color: hsl(220, 8%, 46%);">Consistent brand experience across all text elements</p>
                </div>
              </div>
            </div>

            <div class="integration-section">
              <h2>Brand Color Typography System</h2>
              <div class="brand-showcase">
                <div class="showcase-item">
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div data-testid="quietude-logo"></div>
                    <h3 style="margin: 0; color: hsl(171, 19%, 41%);">Sage Quietude</h3>
                  </div>
                  <div class="color-demo sage-quietude-bg">
                    <h4 style="margin: 0 0 8px 0; color: hsl(171, 19%, 35%);" data-testid="quietude-heading">Primary Brand Heading</h4>
                    <p style="margin: 0; color: hsl(171, 19%, 25%);" data-testid="quietude-text">
                      This is body text using the Sage Quietude color palette. It maintains excellent readability while reinforcing brand identity.
                    </p>
                    <small style="color: hsl(171, 19%, 35%); margin-top: 8px; display: block;" data-testid="quietude-caption">
                      Caption text in Sage Quietude
                    </small>
                  </div>
                </div>

                <div class="showcase-item">
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div data-testid="growth-logo"></div>
                    <h3 style="margin: 0; color: hsl(102, 58%, 32%);">Sage Growth</h3>
                  </div>
                  <div class="color-demo sage-growth-bg">
                    <h4 style="margin: 0 0 8px 0; color: hsl(102, 58%, 28%);" data-testid="growth-heading">Accent Brand Heading</h4>
                    <p style="margin: 0; color: hsl(102, 58%, 22%);" data-testid="growth-text">
                      This is body text using the Sage Growth color palette. Perfect for highlighting actions and positive outcomes.
                    </p>
                    <small style="color: hsl(102, 58%, 28%); margin-top: 8px; display: block;" data-testid="growth-caption">
                      Caption text in Sage Growth
                    </small>
                  </div>
                </div>

                <div class="showcase-item">
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div data-testid="neutral-logo"></div>
                    <h3 style="margin: 0; color: hsl(220, 13%, 20%);">Neutral Typography</h3>
                  </div>
                  <div class="color-demo sage-mist-bg">
                    <h4 style="margin: 0 0 8px 0; color: hsl(220, 13%, 20%);" data-testid="neutral-heading">Standard Content Heading</h4>
                    <p style="margin: 0; color: hsl(220, 8%, 46%);" data-testid="neutral-text">
                      This is standard body text with optimal contrast ratios. Used for general content that doesn't require brand color emphasis.
                    </p>
                    <small style="color: hsl(220, 8%, 60%); margin-top: 8px; display: block;" data-testid="neutral-caption">
                      Caption text in neutral tones
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div class="integration-section">
              <h2>Typography Hierarchy with Brand Integration</h2>
              <div style="max-width: 800px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 40px;">
                  <div data-testid="hierarchy-logo" style="margin-bottom: 20px;"></div>
                  <h1 style="font-size: 2.5rem; font-weight: 700; color: hsl(171, 19%, 41%); margin: 0 0 8px 0;" data-testid="h1-brand">
                    Brand Typography System
                  </h1>
                  <p style="font-size: 1.25rem; color: hsl(220, 8%, 46%); margin: 0;" data-testid="lead-text">
                    Comprehensive typography that scales beautifully across all devices and contexts
                  </p>
                </div>

                <div style="margin: 40px 0;">
                  <h2 style="color: hsl(171, 19%, 35%); border-bottom: 2px solid hsl(171, 19%, 41%); padding-bottom: 8px;" data-testid="h2-brand">
                    Section Heading (H2)
                  </h2>
                  <p data-testid="body-paragraph">
                    This is a standard paragraph that demonstrates the body text styling. It maintains optimal line height, 
                    character spacing, and contrast ratios for excellent readability across all device types and viewing conditions.
                  </p>
                  
                  <h3 style="color: hsl(102, 58%, 32%); margin-top: 32px;" data-testid="h3-brand">Subsection Heading (H3)</h3>
                  <p data-testid="body-paragraph-2">
                    Subsection content that flows naturally from the heading, maintaining typographic rhythm and visual hierarchy.
                  </p>
                  
                  <blockquote style="border-left: 4px solid hsl(102, 58%, 32%); padding-left: 20px; margin: 24px 0; font-style: italic; color: hsl(220, 8%, 46%);" data-testid="blockquote">
                    "Great typography is invisible. It should never interfere with the reading experience, 
                    but rather enhance and support the message being conveyed."
                  </blockquote>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const logos = [
          {
            selector: '[data-testid="integration-logo"]',
            size: 'lg',
            variant: 'horizontal'
          },
          {
            selector: '[data-testid="quietude-logo"]',
            size: 'sm',
            variant: 'logomark'
          },
          {
            selector: '[data-testid="growth-logo"]',
            size: 'sm',
            variant: 'logomark'
          },
          {
            selector: '[data-testid="neutral-logo"]',
            size: 'sm',
            variant: 'logomark',
            monochrome: true
          },
          {
            selector: '[data-testid="hierarchy-logo"]',
            size: 'xl',
            variant: 'stacked'
          }
        ];

        const sizeMap = {
          sm: { width: 32, height: 12, textClass: 'text-sm' },
          default: { width: 48, height: 18, textClass: 'text-base' },
          lg: { width: 64, height: 24, textClass: 'text-lg' },
          xl: { width: 80, height: 30, textClass: 'text-xl' },
        };

        logos.forEach(({ selector, size, variant, monochrome }) => {
          const element = document.querySelector(selector);
          const { width: svgWidth, height: svgHeight, textClass } = sizeMap[size];

          if (element) {
            const colors = monochrome
              ? {
                  ask: 'currentColor',
                  think: 'currentColor',
                  apply: 'currentColor',
                  stroke: 'currentColor'
                }
              : {
                  ask: 'transparent',
                  think: 'hsl(171, 19%, 41%)',
                  apply: 'hsl(102, 58%, 32%)',
                  stroke: 'hsl(171, 19%, 41%)'
                };

            let html = '';

            if (variant === 'logomark') {
              html = `
                <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 48 18" aria-hidden="true" role="img" aria-label="Telesis">
                  <title>Telesis Logo</title>
                  <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                  <g id="three-olives-logomark">
                    <ellipse cx="8" cy="9" rx="6" ry="8" fill="${colors.ask}" stroke="${colors.stroke}" stroke-width="1.5"/>
                    <ellipse cx="24" cy="9" rx="6" ry="8" fill="${colors.think}" stroke="none"/>
                    <ellipse cx="40" cy="9" rx="6" ry="8" fill="${colors.apply}" stroke="none"/>
                  </g>
                </svg>
              `;
            } else if (variant === 'stacked') {
              html = `
                <div class="inline-flex flex-col gap-y-1 ${textClass} items-center" role="img" aria-label="Telesis - Ask, Think, Apply">
                  <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200 mb-1">
                    <title>Telesis Logo</title>
                    <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                    <g id="three-olives-logomark">
                      <ellipse cx="8" cy="9" rx="6" ry="8" fill="${colors.ask}" stroke="${colors.stroke}" stroke-width="1.5"/>
                      <ellipse cx="24" cy="9" rx="6" ry="8" fill="${colors.think}" stroke="none"/>
                      <ellipse cx="40" cy="9" rx="6" ry="8" fill="${colors.apply}" stroke="none"/>
                    </g>
                  </svg>
                  <div class="select-none font-semibold tracking-tight text-center text-foreground">
                    Telesis
                    <div class="text-xs font-normal opacity-75 mt-0.5 text-muted-foreground">Ask. Think. Apply.</div>
                  </div>
                </div>
              `;
            } else {
              html = `
                <div class="inline-flex items-center gap-x-2 ${textClass}" role="img" aria-label="Telesis - Ask, Think, Apply">
                  <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                    <title>Telesis Logo</title>
                    <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                    <g id="three-olives-logomark">
                      <ellipse cx="8" cy="9" rx="6" ry="8" fill="${colors.ask}" stroke="${colors.stroke}" stroke-width="1.5"/>
                      <ellipse cx="24" cy="9" rx="6" ry="8" fill="${colors.think}" stroke="none"/>
                      <ellipse cx="40" cy="9" rx="6" ry="8" fill="${colors.apply}" stroke="none"/>
                    </g>
                  </svg>
                  <div class="select-none font-semibold tracking-tight text-foreground">Telesis</div>
                </div>
              `;
            }

            element.innerHTML = html;
          }
        });
      });

      // Verify all typography and logo elements are visible
      const testElements = [
        'integration-logo',
'quietude-logo',
'growth-logo',
'neutral-logo',
'hierarchy-logo',
        'quietude-heading',
'quietude-text',
'growth-heading',
'growth-text',
        'h1-brand',
'h2-brand',
'h3-brand',
'body-paragraph',
'blockquote'
      ];

      for (const testId of testElements) {
        await expect(page.locator(`[data-testid="${testId}"]`)).toBeVisible();
      }

      // Take comprehensive screenshot
      await expect(page.locator('body')).toHaveScreenshot('typography-brand-integration.png', {
        fullPage: true,
        threshold: 0.2
      });
    });
  });
});
