import { expect, test } from '@playwright/test';

/**
 * Cross-Browser Brand Component Compatibility Tests
 * Tests brand components across different browsers and devices
 */

test.describe('Cross-Browser Brand Compatibility', () => {
  const brandTestContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Cross-Browser Brand Test</title>
        <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f9f9f9;
          }
          .browser-test-section {
            background: white;
            padding: 30px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .logo-showcase {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
          }
          .logo-item {
            padding: 20px;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            text-align: center;
            background: #fff;
          }
          .dark-bg { background: #1a1a1a; color: white; }
          .grey-bg { background: #f5f5f5; }
        </style>
      </head>
      <body>
        <h1>Brand Component Cross-Browser Test</h1>
        <p>Testing Telesis brand components across different browser engines</p>

        <div class="browser-test-section">
          <h2>Logo Variants</h2>
          <div class="logo-showcase">
            <div class="logo-item">
              <div data-testid="horizontal-logo"></div>
              <p><strong>Horizontal</strong><br/>Default layout</p>
            </div>
            <div class="logo-item">
              <div data-testid="stacked-logo"></div>
              <p><strong>Stacked</strong><br/>Vertical layout</p>
            </div>
            <div class="logo-item">
              <div data-testid="logomark-only"></div>
              <p><strong>Logomark</strong><br/>Icon only</p>
            </div>
          </div>
        </div>

        <div class="browser-test-section dark-bg">
          <h2>Dark Theme Integration</h2>
          <div style="text-align: center; padding: 20px;">
            <div data-testid="dark-logo"></div>
          </div>
        </div>

        <div class="browser-test-section">
          <h2>Responsive Sizes</h2>
          <div style="display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: 20px;">
            <div style="text-align: center;">
              <div data-testid="logo-sm"></div>
              <p>Small</p>
            </div>
            <div style="text-align: center;">
              <div data-testid="logo-default"></div>
              <p>Default</p>
            </div>
            <div style="text-align: center;">
              <div data-testid="logo-lg"></div>
              <p>Large</p>
            </div>
            <div style="text-align: center;">
              <div data-testid="logo-xl"></div>
              <p>Extra Large</p>
            </div>
          </div>
        </div>

        <div class="browser-test-section grey-bg">
          <h2>Monochrome Integration</h2>
          <div style="text-align: center; padding: 20px; color: #333;">
            <div data-testid="monochrome-logo"></div>
          </div>
        </div>
      </body>
    </html>
  `;

  test.beforeEach(async ({ page }) => {
    await page.setContent(brandTestContent);
  });

  // Core logo functionality test that should work across all browsers
  test('should render all logo variants consistently', async ({ page }) => {
    await page.evaluate(() => {
      const logos = [
        {
          selector: '[data-testid="horizontal-logo"]',
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
          selector: '[data-testid="stacked-logo"]',
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
          selector: '[data-testid="logomark-only"]',
          html: `
            <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0" role="img" aria-label="Telesis">
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
          selector: '[data-testid="dark-logo"]',
          html: `
            <div class="inline-flex items-center gap-x-2 text-lg" role="img" aria-label="Telesis - Ask, Think, Apply">
              <svg width="64" height="24" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
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
          `
        },
        {
          selector: '[data-testid="logo-sm"]',
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
          selector: '[data-testid="logo-default"]',
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
          selector: '[data-testid="logo-lg"]',
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
          selector: '[data-testid="logo-xl"]',
          html: `
            <div class="inline-flex items-center gap-x-2 text-xl" role="img" aria-label="Telesis - Ask, Think, Apply">
              <svg width="80" height="30" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
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
          selector: '[data-testid="monochrome-logo"]',
          html: `
            <div class="inline-flex items-center gap-x-2 text-base" role="img" aria-label="Telesis - Ask, Think, Apply" style="color: inherit;">
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

    // Verify all logos are visible and properly rendered
    const testIds = [
      'horizontal-logo',
'stacked-logo',
'logomark-only',
'dark-logo',
      'logo-sm',
'logo-default',
'logo-lg',
'logo-xl',
'monochrome-logo'
    ];

    for (const testId of testIds) {
      await expect(page.locator(`[data-testid="${testId}"]`)).toBeVisible();
    }

    // Verify SVG structure is consistent
    const svgs = page.locator('svg');
    const svgCount = await svgs.count();

    expect(svgCount).toBeGreaterThan(0);

    // Check that all SVGs have the expected ellipse elements (3 olives each)
    for (let i = 0; i < svgCount; i++) {
      const svg = svgs.nth(i);
      const ellipses = svg.locator('ellipse');

      await expect(ellipses).toHaveCount(3);
    }

    // Take comprehensive screenshot for visual regression
    await expect(page.locator('body')).toHaveScreenshot('cross-browser-brand-comprehensive.png', {
      fullPage: true,
      threshold: 0.3 // Allow for browser rendering differences
    });
  });

  test('should handle color rendering consistently', async ({ page }) => {
    // Test specific to Modern Sage brand colors
    await page.evaluate(() => {
      // Set up a color test container
      const colorTest = document.createElement('div');
      colorTest.innerHTML = `
        <div style="padding: 20px; background: white; border-radius: 8px; margin: 20px 0;">
          <h3>Brand Color Consistency Test</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <h4>Sage Quietude (Primary)</h4>
              <div data-testid="color-sage-quietude" style="background: hsl(171, 19%, 41%); width: 100px; height: 50px; border-radius: 4px;"></div>
              <p>hsl(171, 19%, 41%)</p>
            </div>
            <div>
              <h4>Sage Growth (Accent)</h4>
              <div data-testid="color-sage-growth" style="background: hsl(102, 58%, 32%); width: 100px; height: 50px; border-radius: 4px;"></div>
              <p>hsl(102, 58%, 32%)</p>
            </div>
          </div>
          <div style="margin-top: 20px;">
            <h4>Logo with Brand Colors</h4>
            <div data-testid="color-test-logo"></div>
          </div>
        </div>
      `;
      document.body.appendChild(colorTest);

      // Add logo with exact brand colors
      const logoContainer = document.querySelector('[data-testid="color-test-logo"]');
      if (logoContainer) {
        logoContainer.innerHTML = `
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
            <div class="select-none font-semibold tracking-tight" style="color: hsl(171, 19%, 41%);">Telesis</div>
          </div>
        `;
      }
    });

    // Verify color elements are visible
    await expect(page.locator('[data-testid="color-sage-quietude"]')).toBeVisible();
    await expect(page.locator('[data-testid="color-sage-growth"]')).toBeVisible();
    await expect(page.locator('[data-testid="color-test-logo"]')).toBeVisible();

    // Take screenshot to verify color consistency
    await expect(page.locator('body')).toHaveScreenshot('cross-browser-color-consistency.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('should render typography consistently', async ({ page }) => {
    // Test font rendering and typography scaling
    await page.evaluate(() => {
      const typographyTest = document.createElement('div');
      typographyTest.innerHTML = `
        <div style="padding: 20px; background: white; border-radius: 8px; margin: 20px 0;">
          <h3>Typography Consistency Test</h3>
          <div style="display: grid; gap: 20px;">
            <div style="border: 1px solid #e5e5e5; padding: 15px; border-radius: 4px;">
              <h4>Small Logo (text-sm)</h4>
              <div data-testid="typography-sm"></div>
            </div>
            <div style="border: 1px solid #e5e5e5; padding: 15px; border-radius: 4px;">
              <h4>Default Logo (text-base)</h4>
              <div data-testid="typography-default"></div>
            </div>
            <div style="border: 1px solid #e5e5e5; padding: 15px; border-radius: 4px;">
              <h4>Large Logo (text-lg)</h4>
              <div data-testid="typography-lg"></div>
            </div>
            <div style="border: 1px solid #e5e5e5; padding: 15px; border-radius: 4px;">
              <h4>Extra Large Logo (text-xl)</h4>
              <div data-testid="typography-xl"></div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(typographyTest);

      const typographyLogos = [
        { selector: '[data-testid="typography-sm"]', size: { width: 32, height: 12 }, textClass: 'text-sm' },
        { selector: '[data-testid="typography-default"]', size: { width: 48, height: 18 }, textClass: 'text-base' },
        { selector: '[data-testid="typography-lg"]', size: { width: 64, height: 24 }, textClass: 'text-lg' },
        { selector: '[data-testid="typography-xl"]', size: { width: 80, height: 30 }, textClass: 'text-xl' },
      ];

      typographyLogos.forEach(({ selector, size, textClass }) => {
        const element = document.querySelector(selector);
        if (element) {
          element.innerHTML = `
            <div class="inline-flex items-center gap-x-2 ${textClass}" role="img" aria-label="Telesis - Ask, Think, Apply">
              <svg width="${size.width}" height="${size.height}" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
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
    });

    // Verify typography elements are visible and correctly sized
    const typographyTestIds = ['typography-sm', 'typography-default', 'typography-lg', 'typography-xl'];

    for (const testId of typographyTestIds) {
      await expect(page.locator(`[data-testid="${testId}"]`)).toBeVisible();
    }

    // Take screenshot for typography consistency
    await expect(page.locator('body')).toHaveScreenshot('cross-browser-typography.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('should handle SVG rendering across browsers', async ({ page }) => {
    // Specific SVG rendering tests
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SVG Cross-Browser Test</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; }
            .svg-test { background: white; padding: 30px; margin: 20px 0; border-radius: 8px; text-align: center; }
            .svg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
            .svg-item { border: 1px solid #ddd; padding: 20px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="svg-test">
            <h2>SVG Rendering Test</h2>
            <p>Testing Three Olives SVG across browser engines</p>
            
            <div class="svg-grid">
              <div class="svg-item">
                <h4>Standard SVG</h4>
                <div data-testid="standard-svg"></div>
              </div>
              <div class="svg-item">
                <h4>Scaled SVG (2x)</h4>
                <div data-testid="scaled-svg"></div>
              </div>
              <div class="svg-item">
                <h4>Inline SVG with CSS</h4>
                <div data-testid="css-svg"></div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);

    await page.evaluate(() => {
      // Standard SVG
      const standardSvg = document.querySelector('[data-testid="standard-svg"]');
      if (standardSvg) {
        standardSvg.innerHTML = `
          <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden="true">
            <title>Telesis Logo</title>
            <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
            <g id="three-olives-logomark">
              <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
              <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
              <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none"/>
            </g>
          </svg>
        `;
      }

      // Scaled SVG
      const scaledSvg = document.querySelector('[data-testid="scaled-svg"]');
      if (scaledSvg) {
        scaledSvg.innerHTML = `
          <svg width="96" height="36" viewBox="0 0 48 18" aria-hidden="true" style="transform: scale(1.0);">
            <title>Telesis Logo</title>
            <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
            <g id="three-olives-logomark">
              <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
              <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
              <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none"/>
            </g>
          </svg>
        `;
      }

      // CSS-styled SVG
      const cssSvg = document.querySelector('[data-testid="css-svg"]');
      if (cssSvg) {
        cssSvg.innerHTML = `
          <svg width="48" height="18" viewBox="0 0 48 18" aria-hidden="true" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));">
            <title>Telesis Logo</title>
            <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
            <style>
              .svg-olive-ask { fill: transparent; stroke: hsl(171, 19%, 41%); stroke-width: 1.5; }
              .svg-olive-think { fill: hsl(171, 19%, 41%); stroke: none; }
              .svg-olive-apply { fill: hsl(102, 58%, 32%); stroke: none; }
              .svg-olive-ask:hover, .svg-olive-think:hover, .svg-olive-apply:hover { opacity: 0.8; }
            </style>
            <g id="three-olives-logomark">
              <ellipse cx="8" cy="9" rx="6" ry="8" class="svg-olive-ask"/>
              <ellipse cx="24" cy="9" rx="6" ry="8" class="svg-olive-think"/>
              <ellipse cx="40" cy="9" rx="6" ry="8" class="svg-olive-apply"/>
            </g>
          </svg>
        `;
      }
    });

    // Verify all SVG variants are rendered correctly
    await expect(page.locator('[data-testid="standard-svg"] svg')).toBeVisible();
    await expect(page.locator('[data-testid="scaled-svg"] svg')).toBeVisible();
    await expect(page.locator('[data-testid="css-svg"] svg')).toBeVisible();

    // Verify SVG structure integrity
    const allSvgs = page.locator('svg');
    const svgCount = await allSvgs.count();

    for (let i = 0; i < svgCount; i++) {
      const svg = allSvgs.nth(i);

      await expect(svg.locator('ellipse')).toHaveCount(3);
      await expect(svg).toHaveAttribute('viewBox', '0 0 48 18');
    }

    // Test interactive SVG behavior
    const interactiveSvg = page.locator('[data-testid="css-svg"] svg .svg-olive-ask');
    await interactiveSvg.hover();

    // Take screenshot for SVG rendering verification
    await expect(page.locator('body')).toHaveScreenshot('cross-browser-svg-rendering.png', {
      fullPage: true,
      threshold: 0.2
    });
  });
});

test.describe('Mobile Cross-Browser Brand Tests', () => {
  test('should render correctly on mobile browsers', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mobile Brand Test</title>
          <link href="http://localhost:3001/_next/static/css/globals.css" rel="stylesheet">
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              margin: 0;
              padding: 0;
              touch-action: manipulation;
            }
            .mobile-header {
              background: white;
              border-bottom: 1px solid #e5e5e5;
              padding: 12px 16px;
              position: sticky;
              top: 0;
              z-index: 10;
            }
            .header-content {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .mobile-content {
              padding: 20px 16px;
            }
            .mobile-logo-showcase {
              display: flex;
              flex-direction: column;
              gap: 20px;
              margin: 20px 0;
            }
            .mobile-logo-item {
              background: #f9f9f9;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <header class="mobile-header">
            <div class="header-content">
              <div data-testid="mobile-header-logo"></div>
              <button style="background: none; border: none; font-size: 20px; padding: 8px;">☰</button>
            </div>
          </header>

          <main class="mobile-content">
            <h1 style="font-size: 24px; margin-bottom: 20px;">Mobile Brand Test</h1>
            
            <div class="mobile-logo-showcase">
              <div class="mobile-logo-item">
                <h3>Compact Logo</h3>
                <div data-testid="mobile-compact-logo"></div>
              </div>
              
              <div class="mobile-logo-item">
                <h3>Logomark Only</h3>
                <div data-testid="mobile-logomark"></div>
              </div>
              
              <div class="mobile-logo-item">
                <h3>Stacked Layout</h3>
                <div data-testid="mobile-stacked-logo"></div>
              </div>
            </div>
          </main>
        </body>
      </html>
    `);

    await page.evaluate(() => {
      const mobileLogos = [
        {
          selector: '[data-testid="mobile-header-logo"]',
          html: `
            <div class="inline-flex items-center gap-x-2 text-sm" role="img" aria-label="Telesis - Ask, Think, Apply">
              <svg width="32" height="12" viewBox="0 0 48 18" aria-hidden="true" class="shrink-0 transition-colors duration-200">
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
          `
        },
        {
          selector: '[data-testid="mobile-compact-logo"]',
          html: `
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
          `
        },
        {
          selector: '[data-testid="mobile-logomark"]',
          html: `
            <svg width="64" height="24" viewBox="0 0 48 18" aria-hidden="true" role="img" aria-label="Telesis">
              <title>Telesis Logo</title>
              <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
              <g id="three-olives-logomark">
                <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
                <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
                <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 32%)" stroke="none"/>
              </g>
            </svg>
          `
        },
        {
          selector: '[data-testid="mobile-stacked-logo"]',
          html: `
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
          `
        }
      ];

      mobileLogos.forEach(({ selector, html }) => {
        const element = document.querySelector(selector);
        if (element) {
          element.innerHTML = html;
        }
      });
    });

    // Verify mobile logos are visible and touch-friendly
    await expect(page.locator('[data-testid="mobile-header-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-compact-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-logomark"]')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-stacked-logo"]')).toBeVisible();

    // Test touch interaction
    const headerLogo = page.locator('[data-testid="mobile-header-logo"]');
    await headerLogo.tap();

    // Take mobile screenshot
    await expect(page.locator('body')).toHaveScreenshot('cross-browser-mobile.png', {
      fullPage: true,
      threshold: 0.2
    });
  });
});
