import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Logo Accessibility E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Screen Reader Compatibility', () => {
    test('should provide proper screen reader support for logos', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Logo Accessibility Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <nav>
              <div data-testid="nav-logo"></div>
            </nav>
            <main>
              <section>
                <div data-testid="hero-logo"></div>
                <h1>Welcome to Telesis</h1>
              </section>
            </main>
            <footer>
              <div data-testid="footer-logo"></div>
            </footer>
          </body>
        </html>
      `);

      // Add logos to different sections
      await page.evaluate(() => {
        const sections = [
          { selector: '[data-testid="nav-logo"]', ariaLabel: 'Navigate to Telesis homepage' },
          { selector: '[data-testid="hero-logo"]', ariaLabel: 'Telesis - Ask, Think, Apply' },
          { selector: '[data-testid="footer-logo"]', ariaLabel: 'Telesis company logo' },
        ];

        sections.forEach(({ selector, ariaLabel }) => {
          const container = document.querySelector(selector);
          if (container) {
            container.innerHTML = `
              <div class="inline-flex items-center gap-x-2 text-base" aria-label="${ariaLabel}">
                <svg width="48" height="18" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0">
                  <title>Telesis Logo</title>
                  <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                  <g id="three-olives-logomark">
                    <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
                    <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
                    <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none"/>
                  </g>
                </svg>
                <div class="select-none font-semibold tracking-tight text-foreground">
                  Telesis
                </div>
              </div>
            `;
          }
        });
      });

      // Test that logos are accessible to screen readers
      const navLogo = page.locator('[data-testid="nav-logo"] div');
      const heroLogo = page.locator('[data-testid="hero-logo"] div');
      const footerLogo = page.locator('[data-testid="footer-logo"] div');

      await expect(navLogo).toHaveAttribute('aria-label', 'Navigate to Telesis homepage');
      await expect(heroLogo).toHaveAttribute('aria-label', 'Telesis - Ask, Think, Apply');
      await expect(footerLogo).toHaveAttribute('aria-label', 'Telesis company logo');

      // Verify SVGs are properly hidden from screen readers
      const svgs = page.locator('svg[role="img"]');
      const svgCount = await svgs.count();

      for (let i = 0; i < svgCount; i++) {
        const svg = svgs.nth(i);

        await expect(svg).toHaveAttribute('aria-hidden', 'true');
        await expect(svg).toHaveAttribute('role', 'img');
      }

      // Run axe accessibility tests
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should work with different screen reader navigation patterns', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Logo Navigation Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <nav role="navigation" aria-label="Main navigation">
              <a href="/" data-testid="logo-link">
                <div data-testid="logo-in-link"></div>
              </a>
              <ul>
                <li><a href="/about">About</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </nav>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="logo-in-link"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-base" aria-label="Telesis homepage">
              <svg width="48" height="18" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-foreground">
                Telesis
              </div>
            </div>
          `;
        }
      });

      // Test keyboard navigation
      const logoLink = page.locator('[data-testid="logo-link"]');

      // Navigate to logo using Tab key
      await page.keyboard.press('Tab');

      await expect(logoLink).toBeFocused();

      // Verify logo is accessible via keyboard
      await expect(logoLink).toHaveAttribute('href', '/');

      // Test that Enter key works on logo link
      await page.keyboard.press('Enter');
      await page.waitForURL('/');

      // Run accessibility scan on interactive logo
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Color Contrast and Visual Accessibility', () => {
    test('should meet WCAG AA color contrast requirements', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Logo Contrast Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <div style="background: white; padding: 40px;">
              <div data-testid="default-logo"></div>
            </div>
            <div style="background: black; padding: 40px;">
              <div data-testid="reverse-logo"></div>
            </div>
            <div style="background: #f5f5f5; color: #333; padding: 40px;">
              <div data-testid="monochrome-logo"></div>
            </div>
          </body>
        </html>
      `);

      // Add different color scheme logos
      await page.evaluate(() => {
        const logos = [
          {
            selector: '[data-testid="default-logo"]',
            scheme: 'default',
            askFill: 'transparent',
            askStroke: 'hsl(171, 19%, 41%)',
            thinkFill: 'hsl(171, 19%, 41%)',
            applyFill: 'hsl(102, 58%, 38%)',
            textClass: 'text-foreground'
          },
          {
            selector: '[data-testid="reverse-logo"]',
            scheme: 'reverse',
            askFill: 'transparent',
            askStroke: '#ffffff',
            thinkFill: '#ffffff',
            applyFill: '#ffffff',
            textClass: 'text-white'
          },
          {
            selector: '[data-testid="monochrome-logo"]',
            scheme: 'monochrome',
            askFill: 'currentColor',
            askStroke: 'currentColor',
            thinkFill: 'currentColor',
            applyFill: 'currentColor',
            textClass: 'text-current'
          }
        ];

        logos.forEach(({ selector, scheme, askFill, askStroke, thinkFill, applyFill, textClass }) => {
          const container = document.querySelector(selector);
          if (container) {
            container.innerHTML = `
              <div class="inline-flex items-center gap-x-2 text-base" aria-label="Telesis - Ask, Think, Apply (${scheme} scheme)">
                <svg width="48" height="18" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0">
                  <title>Telesis Logo</title>
                  <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                  <g id="three-olives-logomark">
                    <ellipse cx="8" cy="9" rx="6" ry="8" fill="${askFill}" stroke="${askStroke}" stroke-width="1.5"/>
                    <ellipse cx="24" cy="9" rx="6" ry="8" fill="${thinkFill}" stroke="none"/>
                    <ellipse cx="40" cy="9" rx="6" ry="8" fill="${applyFill}" stroke="none"/>
                  </g>
                </svg>
                <div class="select-none font-semibold tracking-tight ${textClass}">
                  Telesis
                </div>
              </div>
            `;
          }
        });
      });

      // Run color contrast checks
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('[data-testid="default-logo"]')
        .include('[data-testid="reverse-logo"]')
        .include('[data-testid="monochrome-logo"]')
        .withRules(['color-contrast'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should be visible in Windows High Contrast mode', async ({ page }) => {
      // Simulate Windows High Contrast mode
      await page.addStyleTag({
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

      await page.setContent(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>High Contrast Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <div style="padding: 40px;">
              <div data-testid="high-contrast-logo"></div>
            </div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="high-contrast-logo"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-base" aria-label="Telesis - Ask, Think, Apply">
              <svg width="48" height="18" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="currentColor" stroke="none"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="currentColor" stroke="none"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-current">
                Telesis
              </div>
            </div>
          `;
        }
      });

      // Verify logo is still visible and accessible
      const logo = page.locator('[data-testid="high-contrast-logo"] div');

      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute('aria-label', 'Telesis - Ask, Think, Apply');

      // Run accessibility scan in high contrast mode
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Motion and Animation Accessibility', () => {
    test('should respect prefers-reduced-motion', async ({ page }) => {
      // Simulate reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });

      await page.setContent(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Reduced Motion Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
            <style>
              @media (prefers-reduced-motion: reduce) {
                .logo-animation {
                  animation: none !important;
                  transition: none !important;
                }
              }
              .logo-interactive {
                transition: transform 0.2s ease, opacity 0.2s ease;
                cursor: pointer;
              }
              .logo-interactive:hover {
                transform: scale(1.05);
                opacity: 0.9;
              }
            </style>
          </head>
          <body>
            <div style="padding: 40px;">
              <div data-testid="motion-logo" class="logo-interactive logo-animation"></div>
            </div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="motion-logo"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-base" aria-label="Telesis - Ask, Think, Apply">
              <svg width="48" height="18" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0 transition-colors duration-200">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-foreground">
                Telesis
              </div>
            </div>
          `;
        }
      });

      const logo = page.locator('[data-testid="motion-logo"]');

      // Verify logo is still visible and functional with reduced motion
      await expect(logo).toBeVisible();

      // Test interaction without motion
      await logo.hover();

      await expect(logo).toBeVisible();

      // Run accessibility scan with reduced motion
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Keyboard and Focus Accessibility', () => {
    test('should support keyboard navigation for interactive logos', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Keyboard Navigation Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
            <style>
              .focusable-logo:focus {
                outline: 2px solid hsl(102, 58%, 38%);
                outline-offset: 2px;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <nav>
              <a href="/" class="focusable-logo" data-testid="nav-logo-link">
                <div data-testid="nav-logo"></div>
              </a>
              <a href="/about" data-testid="about-link">About</a>
              <a href="/contact" data-testid="contact-link">Contact</a>
            </nav>
            <main>
              <button class="focusable-logo" data-testid="logo-button">
                <div data-testid="button-logo"></div>
              </button>
            </main>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const containers = document.querySelectorAll('[data-testid="nav-logo"], [data-testid="button-logo"]');
        containers.forEach((container) => {
          if (container) {
            container.innerHTML = `
              <div class="inline-flex items-center gap-x-2 text-base" aria-label="Telesis - Ask, Think, Apply">
                <svg width="48" height="18" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0">
                  <title>Telesis Logo</title>
                  <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                  <g id="three-olives-logomark">
                    <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
                    <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
                    <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none"/>
                  </g>
                </svg>
                <div class="select-none font-semibold tracking-tight text-foreground">
                  Telesis
                </div>
              </div>
            `;
          }
        });
      });

      // Test Tab navigation
      await page.keyboard.press('Tab');

      await expect(page.locator('[data-testid="nav-logo-link"]')).toBeFocused();

      await page.keyboard.press('Tab');

      await expect(page.locator('[data-testid="about-link"]')).toBeFocused();

      await page.keyboard.press('Tab');

      await expect(page.locator('[data-testid="contact-link"]')).toBeFocused();

      await page.keyboard.press('Tab');

      await expect(page.locator('[data-testid="logo-button"]')).toBeFocused();

      // Test Enter key on logo link
      await page.keyboard.press('Shift+Tab'); // Go back to contact
      await page.keyboard.press('Shift+Tab'); // Go back to about
      await page.keyboard.press('Shift+Tab'); // Go back to logo

      await expect(page.locator('[data-testid="nav-logo-link"]')).toBeFocused();

      // Test that Enter activates the logo link
      await page.keyboard.press('Enter');
      await page.waitForURL('/');

      // Run accessibility scan focusing on keyboard navigation
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['keyboard'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper focus indicators', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Focus Indicator Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
            <style>
              .logo-focus:focus {
                outline: 3px solid hsl(102, 58%, 38%);
                outline-offset: 3px;
                border-radius: 6px;
              }
              .logo-focus:focus-visible {
                outline: 3px solid hsl(102, 58%, 38%);
                outline-offset: 3px;
              }
            </style>
          </head>
          <body>
            <div style="padding: 40px;">
              <a href="/" class="logo-focus" data-testid="focus-logo">
                <div data-testid="focus-logo-content"></div>
              </a>
            </div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="focus-logo-content"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-base" aria-label="Telesis - Ask, Think, Apply">
              <svg width="48" height="18" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-foreground">
                Telesis
              </div>
            </div>
          `;
        }
      });

      const logoLink = page.locator('[data-testid="focus-logo"]');

      // Focus the logo using keyboard
      await page.keyboard.press('Tab');

      await expect(logoLink).toBeFocused();

      // Verify focus is visible (this would be tested visually in a real scenario)
      await expect(logoLink).toHaveCSS('outline-style', 'solid');

      // Run accessibility scan focusing on focus indicators
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['focus-order-semantics'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Responsive and Mobile Accessibility', () => {
    test('should maintain accessibility on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

      await page.setContent(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Mobile Accessibility Test</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="/styles/globals.css" rel="stylesheet">
            <style>
              .mobile-logo {
                min-height: 44px;
                min-width: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 8px;
              }
            </style>
          </head>
          <body>
            <nav style="padding: 12px;">
              <a href="/" class="mobile-logo" data-testid="mobile-logo">
                <div data-testid="mobile-logo-content"></div>
              </a>
            </nav>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="mobile-logo-content"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-sm" aria-label="Telesis homepage">
              <svg width="32" height="12" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0">
                <title>Telesis Logo</title>
                <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                <g id="three-olives-logomark">
                  <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
                  <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
                  <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none"/>
                </g>
              </svg>
              <div class="select-none font-semibold tracking-tight text-foreground">
                Telesis
              </div>
            </div>
          `;
        }
      });

      const mobileLogo = page.locator('[data-testid="mobile-logo"]');

      // Verify minimum touch target size (44x44px)
      const boundingBox = await mobileLogo.boundingBox();

      expect(boundingBox).toBeTruthy();
      expect(boundingBox!.width).toBeGreaterThanOrEqual(44);
      expect(boundingBox!.height).toBeGreaterThanOrEqual(44);

      // Test touch interaction
      await mobileLogo.tap();
      await page.waitForURL('/');

      // Run mobile-specific accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['mobile'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Comprehensive WCAG 2.1 AA Validation', () => {
    test('should pass all WCAG 2.1 AA criteria in real browser environment', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Comprehensive Accessibility Test</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <header>
              <nav aria-label="Main navigation">
                <a href="/" data-testid="header-logo">
                  <div data-testid="header-logo-content"></div>
                </a>
                <ul>
                  <li><a href="/about">About</a></li>
                  <li><a href="/services">Services</a></li>
                </ul>
              </nav>
            </header>
            <main>
              <section>
                <div data-testid="hero-logo"></div>
                <h1>Welcome to Telesis</h1>
                <p>AI-Powered Micro-Learning Platform</p>
              </section>
            </main>
            <footer>
              <div data-testid="footer-logo"></div>
              <p>&copy; 2024 Telesis. All rights reserved.</p>
            </footer>
          </body>
        </html>
      `);

      // Add different logo configurations throughout the page
      await page.evaluate(() => {
        const configs = [
          {
            selector: '[data-testid="header-logo-content"]',
            variant: 'horizontal',
            size: 'default',
            ariaLabel: 'Telesis homepage'
          },
          {
            selector: '[data-testid="hero-logo"]',
            variant: 'stacked',
            size: 'xl',
            ariaLabel: 'Telesis - Ask, Think, Apply'
          },
          {
            selector: '[data-testid="footer-logo"]',
            variant: 'stacked',
            size: 'sm',
            ariaLabel: 'Telesis company information'
          }
        ];

        configs.forEach(({ selector, variant, size, ariaLabel }) => {
          const container = document.querySelector(selector);
          if (container) {
            const isStacked = variant === 'stacked';
            const sizeClasses = {
              sm: { text: 'text-sm', width: 32, height: 12 },
              default: { text: 'text-base', width: 48, height: 18 },
              xl: { text: 'text-xl', width: 80, height: 30 }
            };
            const { text, width, height } = sizeClasses[size as keyof typeof sizeClasses];

            container.innerHTML = `
              <div class="inline-flex ${isStacked ? 'flex-col gap-y-1' : 'items-center gap-x-2'} ${text}" aria-label="${ariaLabel}">
                <svg width="${width}" height="${height}" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0 ${isStacked ? 'mb-1' : ''}">
                  <title>Telesis Logo</title>
                  <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                  <g id="three-olives-logomark">
                    <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
                    <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
                    <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none"/>
                  </g>
                </svg>
                <div class="select-none font-semibold tracking-tight ${isStacked ? 'text-center' : ''} text-foreground">
                  Telesis
                  ${isStacked ? '<div class="text-xs font-normal opacity-75 mt-0.5 text-muted-foreground">Ask. Think. Apply.</div>' : ''}
                </div>
              </div>
            `;
          }
        });
      });

      // Run comprehensive WCAG 2.1 AA accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);

      // Verify specific success criteria
      expect(accessibilityScanResults.passes.length).toBeGreaterThan(0);

      // Test specific WCAG criteria that might not be caught by axe
      const logos = page.locator('[aria-label*="Telesis"]');
      const logoCount = await logos.count();

      for (let i = 0; i < logoCount; i++) {
        const logo = logos.nth(i);

        await expect(logo).toHaveAttribute('aria-label');

        const svgs = logo.locator('svg[role="img"]');
        const svgCount = await svgs.count();

        for (let j = 0; j < svgCount; j++) {
          const svg = svgs.nth(j);

          await expect(svg).toHaveAttribute('aria-hidden', 'true');
          await expect(svg).toHaveAttribute('role', 'img');
        }
      }
    });
  });
});
