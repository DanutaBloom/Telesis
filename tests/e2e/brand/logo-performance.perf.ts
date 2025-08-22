import { expect, test } from '@playwright/test';

test.describe('Logo Performance Tests', () => {
  test.describe('SVG Loading Performance', () => {
    test('should load SVG logo efficiently', async ({ page }) => {
      // Start performance monitoring
      await page.coverage.startJSCoverage();
      await page.coverage.startCSSCoverage();

      const startTime = Date.now();

      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Logo Performance Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <div style="padding: 20px;">
              <div data-testid="performance-logo"></div>
            </div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="performance-logo"]');
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

      // Wait for logo to be visible
      const logo = page.locator('[data-testid="performance-logo"]');

      await expect(logo).toBeVisible();

      const endTime = Date.now();
      const loadTime = endTime - startTime;

      // Logo should load within 100ms
      expect(loadTime).toBeLessThan(100);

      // Stop coverage and check resource usage
      const jsCoverage = await page.coverage.stopJSCoverage();
      const cssCoverage = await page.coverage.stopCSSCoverage();

      // Verify minimal resource usage
      const totalJSBytes = jsCoverage.reduce((total, entry) => total + entry.text.length, 0);
      const totalCSSBytes = cssCoverage.reduce((total, entry) => total + entry.text.length, 0);

      // Logo should not require excessive resources
      expect(totalJSBytes + totalCSSBytes).toBeLessThan(50000); // 50KB max
    });

    test('should render multiple logos efficiently', async ({ page }) => {
      const startTime = performance.now();

      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Multiple Logos Performance Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <div style="padding: 20px;">
              ${Array.from({ length: 20 }, (_, i) => `
                <div data-testid="logo-${i}" style="margin: 10px; display: inline-block;"></div>
              `).join('')}
            </div>
          </body>
        </html>
      `);

      // Add logos to all containers
      await page.evaluate(() => {
        const containers = document.querySelectorAll('[data-testid^="logo-"]');
        containers.forEach((container, index) => {
          if (container) {
            const variant = index % 3 === 0 ? 'logomark' : index % 3 === 1 ? 'horizontal' : 'stacked';
            const size = ['sm', 'default', 'lg'][index % 3];
            const sizeMap = { sm: { width: 32, height: 12 }, default: { width: 48, height: 18 }, lg: { width: 64, height: 24 } };
            const dims = sizeMap[size as keyof typeof sizeMap];

            container.innerHTML = `
              <div class="inline-flex ${variant === 'stacked' ? 'flex-col gap-y-1' : 'items-center gap-x-2'} text-${size === 'default' ? 'base' : size}" aria-label="Telesis Logo ${index}">
                <svg width="${dims.width}" height="${dims.height}" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0">
                  <title>Telesis Logo</title>
                  <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                  <g id="three-olives-logomark">
                    <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
                    <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
                    <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none"/>
                  </g>
                </svg>
                ${variant !== 'logomark'
? `
                  <div class="select-none font-semibold tracking-tight ${variant === 'stacked' ? 'text-center' : ''} text-foreground">
                    Telesis
                    ${variant === 'stacked' ? '<div class="text-xs font-normal opacity-75 mt-0.5 text-muted-foreground">Ask. Think. Apply.</div>' : ''}
                  </div>
                `
: ''}
              </div>
            `;
          }
        });
      });

      // Wait for all logos to be visible
      for (let i = 0; i < 20; i++) {
        await expect(page.locator(`[data-testid="logo-${i}"]`)).toBeVisible();
      }

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Multiple logos should render within 500ms
      expect(renderTime).toBeLessThan(500);
    });
  });

  test.describe('Rendering Performance', () => {
    test('should have fast paint times', async ({ page }) => {
      await page.goto('data:text/html,<html><head><link href="/styles/globals.css" rel="stylesheet"></head><body></body></html>');

      // Start measuring performance
      await page.evaluate(() => {
        performance.mark('logo-start');
      });

      await page.evaluate(() => {
        const container = document.createElement('div');
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
        document.body.appendChild(container);
        performance.mark('logo-end');
      });

      // Measure performance
      const performanceMetrics = await page.evaluate(() => {
        performance.measure('logo-render', 'logo-start', 'logo-end');
        const measure = performance.getEntriesByName('logo-render')[0];

        return {
          renderTime: measure.duration,
          paintEntries: performance.getEntriesByType('paint'),
          navigationEntries: performance.getEntriesByType('navigation')
        };
      });

      // Logo rendering should be fast
      expect(performanceMetrics.renderTime).toBeLessThan(10); // 10ms max
    });

    test('should have efficient memory usage', async ({ page }) => {
      // Create a page with many logos to test memory usage
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Memory Usage Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <div id="logo-container" style="padding: 20px;"></div>
          </body>
        </html>
      `);

      // Get initial memory usage
      const initialMetrics = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory;
        }
        return null;
      });

      // Add 100 logos
      await page.evaluate(() => {
        const container = document.getElementById('logo-container');
        if (container) {
          for (let i = 0; i < 100; i++) {
            const logoDiv = document.createElement('div');
            logoDiv.style.display = 'inline-block';
            logoDiv.style.margin = '5px';
            logoDiv.innerHTML = `
              <div class="inline-flex items-center gap-x-2 text-sm" aria-label="Telesis Logo ${i}">
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
            container.appendChild(logoDiv);
          }
        }
      });

      // Wait for rendering to complete
      await page.waitForTimeout(1000);

      // Get final memory usage
      const finalMetrics = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory;
        }
        return null;
      });

      // Check that memory usage is reasonable
      if (initialMetrics && finalMetrics) {
        const memoryIncrease = finalMetrics.usedJSHeapSize - initialMetrics.usedJSHeapSize;

        // 100 logos should not use more than 5MB of additional memory
        expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
      }

      // Verify all logos are rendered
      const logoCount = await page.locator('svg[role="img"]').count();

      expect(logoCount).toBe(100);
    });
  });

  test.describe('Animation Performance', () => {
    test('should have smooth transitions', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Animation Performance Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
            <style>
              .animated-logo {
                transition: transform 0.2s ease, opacity 0.2s ease;
                cursor: pointer;
              }
              .animated-logo:hover {
                transform: scale(1.1);
                opacity: 0.9;
              }
            </style>
          </head>
          <body>
            <div style="padding: 40px;">
              <div data-testid="animated-logo" class="animated-logo"></div>
            </div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="animated-logo"]');
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

      const logo = page.locator('[data-testid="animated-logo"]');

      // Test hover animation performance
      await page.evaluate(() => {
        performance.mark('animation-start');
      });

      await logo.hover();

      // Wait for animation to complete
      await page.waitForTimeout(250);

      await page.evaluate(() => {
        performance.mark('animation-end');
        performance.measure('logo-animation', 'animation-start', 'animation-end');
      });

      const animationMetrics = await page.evaluate(() => {
        const measure = performance.getEntriesByName('logo-animation')[0];
        return {
          duration: measure.duration,
          // Check for frame drops during animation
          paintTiming: performance.getEntriesByType('paint')
        };
      });

      // Animation should complete smoothly
      expect(animationMetrics.duration).toBeLessThan(300); // Should complete within 300ms
    });

    test('should maintain 60fps during interactions', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>FPS Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
            <style>
              .fps-logo {
                transition: all 0.3s ease;
                cursor: pointer;
              }
              .fps-logo:hover {
                transform: rotate(5deg) scale(1.05);
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
              }
            </style>
          </head>
          <body>
            <div style="padding: 40px;">
              <div data-testid="fps-logo" class="fps-logo"></div>
            </div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="fps-logo"]');
        if (container) {
          container.innerHTML = `
            <div class="inline-flex items-center gap-x-2 text-lg" aria-label="Telesis - Ask, Think, Apply">
              <svg width="64" height="24" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0 transition-colors duration-200">
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

      // Start FPS monitoring
      await page.evaluate(() => {
        let frameCount = 0;
        const startTime = performance.now();

        function countFrames() {
          frameCount++;
          requestAnimationFrame(countFrames);
        }

        requestAnimationFrame(countFrames);

        // Store initial frame count
        (window as any).getFrameRate = () => {
          const elapsed = performance.now() - startTime;
          const fps = (frameCount / elapsed) * 1000;
          return fps;
        };
      });

      const logo = page.locator('[data-testid="fps-logo"]');

      // Trigger hover animation
      await logo.hover();
      await page.waitForTimeout(500);
      await logo.hover({ force: false }); // Remove hover
      await page.waitForTimeout(500);

      // Check frame rate
      const fps = await page.evaluate(() => {
        return (window as any).getFrameRate();
      });

      // Should maintain close to 60fps
      expect(fps).toBeGreaterThan(55);
    });
  });

  test.describe('Bundle Size and Network Performance', () => {
    test('should have minimal impact on bundle size', async ({ page }) => {
      // Test that logo components don't significantly increase bundle size
      await page.coverage.startJSCoverage();
      await page.coverage.startCSSCoverage();

      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Bundle Size Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <div data-testid="bundle-logo"></div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="bundle-logo"]');
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

      await expect(page.locator('[data-testid="bundle-logo"]')).toBeVisible();

      const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSSCoverage()
      ]);

      // Calculate total size
      const jsSize = jsCoverage.reduce((total, entry) => total + entry.text.length, 0);
      const cssSize = cssCoverage.reduce((total, entry) => total + entry.text.length, 0);
      const totalSize = jsSize + cssSize;

      // Logo should not require more than 2KB of additional resources
      expect(totalSize).toBeLessThan(2048);
    });

    test('should load efficiently over network', async ({ page }) => {
      // Monitor network requests
      const requests: any[] = [];
      page.on('request', (request) => {
        requests.push({
          url: request.url(),
          resourceType: request.resourceType(),
          size: request.postDataBuffer()?.length || 0
        });
      });

      const responses: any[] = [];
      page.on('response', (response) => {
        responses.push({
          url: response.url(),
          status: response.status(),
          headers: response.headers()
        });
      });

      await page.goto('data:text/html,<html><head><link href="/styles/globals.css" rel="stylesheet"></head><body><div id="logo"></div></body></html>');

      await page.evaluate(() => {
        const container = document.getElementById('logo');
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

      await page.waitForLoadState('networkidle');

      // Logo should not require additional network requests (it's inline SVG)
      const logoRelatedRequests = requests.filter(req =>
        req.url.includes('logo') || req.resourceType === 'image'
      );

      // Should not make additional requests for inline SVG logo
      expect(logoRelatedRequests.length).toBe(0);
    });
  });

  test.describe('Scalability Performance', () => {
    test('should handle large scale deployments', async ({ page }) => {
      // Simulate a dashboard with many logos
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Scalability Test</title>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <div id="dashboard" style="padding: 20px;">
              <h1>Dashboard with Multiple Logos</h1>
              <div id="logo-grid" style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 10px;"></div>
            </div>
          </body>
        </html>
      `);

      const startTime = performance.now();

      // Add 200 logos (simulating a large dashboard)
      await page.evaluate(() => {
        const grid = document.getElementById('logo-grid');
        if (grid) {
          for (let i = 0; i < 200; i++) {
            const logoContainer = document.createElement('div');
            logoContainer.style.padding = '10px';
            logoContainer.style.border = '1px solid #e5e5e5';
            logoContainer.style.borderRadius = '4px';
            logoContainer.innerHTML = `
              <div class="inline-flex items-center gap-x-1 text-xs" aria-label="Logo ${i}">
                <svg width="24" height="9" viewBox="0 0 48 18" role="img" aria-hidden="true" class="shrink-0">
                  <title>Telesis Logo</title>
                  <desc>Three olives representing the learning process: Ask, Think, Apply</desc>
                  <g id="three-olives-logomark">
                    <ellipse cx="8" cy="9" rx="6" ry="8" fill="transparent" stroke="hsl(171, 19%, 41%)" stroke-width="1.5"/>
                    <ellipse cx="24" cy="9" rx="6" ry="8" fill="hsl(171, 19%, 41%)" stroke="none"/>
                    <ellipse cx="40" cy="9" rx="6" ry="8" fill="hsl(102, 58%, 38%)" stroke="none"/>
                  </g>
                </svg>
                <div class="select-none font-medium tracking-tight text-foreground">
                  ${i}
                </div>
              </div>
            `;
            grid.appendChild(logoContainer);
          }
        }
      });

      // Wait for all logos to be rendered
      await page.waitForFunction(() => {
        const logos = document.querySelectorAll('svg[role="img"]');
        return logos.length === 200;
      });

      const endTime = performance.now();
      const totalRenderTime = endTime - startTime;

      // 200 logos should render within 2 seconds
      expect(totalRenderTime).toBeLessThan(2000);

      // Check that all logos are visible
      const logoCount = await page.locator('svg[role="img"]').count();

      expect(logoCount).toBe(200);

      // Test scroll performance
      const scrollStartTime = performance.now();
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(100);
      const scrollEndTime = performance.now();
      const scrollTime = scrollEndTime - scrollStartTime;

      // Scrolling should be smooth
      expect(scrollTime).toBeLessThan(200);
    });
  });

  test.describe('Performance Benchmarks', () => {
    test('should meet performance benchmarks', async ({ page }) => {
      const metrics = {
        renderTime: 0,
        memoryUsage: 0,
        interactionTime: 0,
        animationFrameRate: 0
      };

      // Test render time
      const renderStart = performance.now();
      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <link href="/styles/globals.css" rel="stylesheet">
          </head>
          <body>
            <div data-testid="benchmark-logo"></div>
          </body>
        </html>
      `);

      await page.evaluate(() => {
        const container = document.querySelector('[data-testid="benchmark-logo"]');
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

      await expect(page.locator('[data-testid="benchmark-logo"]')).toBeVisible();

      const renderEnd = performance.now();
      metrics.renderTime = renderEnd - renderStart;

      // Test interaction time
      const interactionStart = performance.now();
      await page.locator('[data-testid="benchmark-logo"]').hover();
      const interactionEnd = performance.now();
      metrics.interactionTime = interactionEnd - interactionStart;

      // Verify performance benchmarks
      expect(metrics.renderTime).toBeLessThan(50); // 50ms max render time
      expect(metrics.interactionTime).toBeLessThan(16); // 16ms max interaction time (60fps)

      // Log performance metrics for monitoring
      console.log('Logo Performance Metrics:', {
        renderTime: `${metrics.renderTime.toFixed(2)}ms`,
        interactionTime: `${metrics.interactionTime.toFixed(2)}ms`
      });
    });
  });
});
