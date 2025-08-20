/**
 * Performance E2E Tests
 * Tests Core Web Vitals, page load times, and performance metrics
 * @performance
 */

import { test, expect } from '@playwright/test';

interface PerformanceMetrics {
  FCP: number;
  LCP: number;
  FID: number;
  CLS: number;
  TTFB: number;
  domContentLoaded: number;
  load: number;
}

test.describe('Performance Tests', () => {

  test.describe('@performance Core Web Vitals', () => {
    test('Landing page should meet Core Web Vitals thresholds', async ({ page }) => {
      // Navigate to landing page
      await page.goto('/');

      // Measure Core Web Vitals
      const metrics = await page.evaluate(() => {
        return new Promise<PerformanceMetrics>((resolve) => {
          const metrics: Partial<PerformanceMetrics> = {};
          
          // Get navigation timing
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            metrics.TTFB = navigation.responseStart - navigation.requestStart;
            metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
            metrics.load = navigation.loadEventEnd - navigation.navigationStart;
          }

          // Collect Web Vitals using PerformanceObserver
          let fcpCollected = false;
          let lcpCollected = false;
          let clsCollected = false;

          const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              switch (entry.entryType) {
                case 'paint':
                  if (entry.name === 'first-contentful-paint' && !fcpCollected) {
                    metrics.FCP = entry.startTime;
                    fcpCollected = true;
                  }
                  break;
                case 'largest-contentful-paint':
                  if (!lcpCollected) {
                    metrics.LCP = entry.startTime;
                    lcpCollected = true;
                  }
                  break;
                case 'layout-shift':
                  if (!entry.hadRecentInput && !clsCollected) {
                    // Simplified CLS calculation
                    metrics.CLS = (metrics.CLS || 0) + entry.value;
                  }
                  break;
              }
            });
          });

          try {
            observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
          } catch (e) {
            console.warn('Performance observer not supported:', e);
          }

          // FID measurement (simplified)
          let fidMeasured = false;
          const measureFID = () => {
            if (!fidMeasured) {
              const start = performance.now();
              setTimeout(() => {
                metrics.FID = performance.now() - start;
                fidMeasured = true;
                checkCompletion();
              }, 0);
            }
          };

          // Trigger FID measurement on first interaction
          document.addEventListener('click', measureFID, { once: true });
          document.addEventListener('keydown', measureFID, { once: true });

          // Auto-trigger after timeout if no interaction
          setTimeout(measureFID, 1000);

          const checkCompletion = () => {
            setTimeout(() => {
              resolve(metrics as PerformanceMetrics);
            }, 2000);
          };

          // Start completion check
          setTimeout(checkCompletion, 3000);
        });
      });

      console.log('Performance Metrics:', metrics);

      // Core Web Vitals thresholds (good thresholds)
      if (metrics.FCP) {
        expect(metrics.FCP).toBeLessThan(2500); // 2.5s for FCP
        console.log(`FCP: ${metrics.FCP.toFixed(2)}ms`);
      }

      if (metrics.LCP) {
        expect(metrics.LCP).toBeLessThan(4000); // 4s for LCP (relaxed for dev)
        console.log(`LCP: ${metrics.LCP.toFixed(2)}ms`);
      }

      if (metrics.CLS !== undefined) {
        expect(metrics.CLS).toBeLessThan(0.25); // 0.25 for CLS
        console.log(`CLS: ${metrics.CLS.toFixed(3)}`);
      }

      if (metrics.FID) {
        expect(metrics.FID).toBeLessThan(300); // 300ms for FID
        console.log(`FID: ${metrics.FID.toFixed(2)}ms`);
      }

      if (metrics.TTFB) {
        expect(metrics.TTFB).toBeLessThan(800); // 800ms for TTFB
        console.log(`TTFB: ${metrics.TTFB.toFixed(2)}ms`);
      }
    });

    test('Authentication pages should load quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/sign-in');
      
      // Wait for form to be visible
      await page.waitForSelector('form', { timeout: 5000 });
      
      const loadTime = Date.now() - startTime;
      console.log(`Sign-in page load time: ${loadTime}ms`);
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
      
      // Form should be interactive quickly
      const emailInput = page.locator('input[type="email"]').first();
      if (await emailInput.isVisible()) {
        const interactionStart = Date.now();
        await emailInput.click();
        await emailInput.fill('test@example.com');
        const interactionTime = Date.now() - interactionStart;
        
        console.log(`Form interaction time: ${interactionTime}ms`);
        expect(interactionTime).toBeLessThan(100); // Should be very responsive
      }
    });

    test('Dashboard should load within performance budget', async ({ page }) => {
      const startTime = Date.now();
      
      // Try to access dashboard
      await page.goto('/dashboard');
      
      // Wait for main content (dashboard or redirect to sign-in)
      try {
        await page.waitForSelector('main, form', { timeout: 10000 });
      } catch (e) {
        console.warn('Timeout waiting for main content, continuing with test');
      }
      
      const loadTime = Date.now() - startTime;
      console.log(`Dashboard/redirect load time: ${loadTime}ms`);
      
      // Should load within 5 seconds (including potential redirect)
      expect(loadTime).toBeLessThan(5000);
    });
  });

  test.describe('@performance Resource Loading', () => {
    test('Should not load excessive resources', async ({ page }) => {
      const resourceSizes: { [key: string]: number } = {};
      const resourceCounts: { [key: string]: number } = {};
      
      page.on('response', (response) => {
        const url = response.url();
        const resourceType = response.request().resourceType();
        
        // Track resource types
        resourceCounts[resourceType] = (resourceCounts[resourceType] || 0) + 1;
        
        // Track sizes for important resources
        if (['document', 'stylesheet', 'script', 'image'].includes(resourceType)) {
          response.body().then(body => {
            resourceSizes[resourceType] = (resourceSizes[resourceType] || 0) + body.length;
          }).catch(() => {
            // Ignore errors for cross-origin resources
          });
        }
      });

      await page.goto('/');
      
      // Wait for page to fully load
      await page.waitForLoadState('networkidle');
      
      console.log('Resource counts:', resourceCounts);
      console.log('Resource sizes (bytes):', resourceSizes);

      // Reasonable limits for resource counts
      expect(resourceCounts.script || 0).toBeLessThan(20); // Not too many scripts
      expect(resourceCounts.stylesheet || 0).toBeLessThan(10); // Reasonable CSS files
      expect(resourceCounts.image || 0).toBeLessThan(30); // Not too many images
      
      // Size limits (in bytes)
      if (resourceSizes.script) {
        expect(resourceSizes.script).toBeLessThan(2 * 1024 * 1024); // 2MB total JS
      }
      if (resourceSizes.stylesheet) {
        expect(resourceSizes.stylesheet).toBeLessThan(500 * 1024); // 500KB total CSS
      }
    });

    test('Critical resources should load first', async ({ page }) => {
      const resourceLoadOrder: Array<{url: string, type: string, time: number}> = [];
      
      page.on('response', (response) => {
        const url = response.url();
        const resourceType = response.request().resourceType();
        
        resourceLoadOrder.push({
          url,
          type: resourceType,
          time: Date.now()
        });
      });

      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      // Critical resources (HTML, critical CSS) should load early
      const htmlIndex = resourceLoadOrder.findIndex(r => r.type === 'document');
      const cssIndex = resourceLoadOrder.findIndex(r => r.type === 'stylesheet');
      
      if (htmlIndex !== -1 && cssIndex !== -1) {
        // CSS should load soon after HTML
        const htmlTime = resourceLoadOrder[htmlIndex].time;
        const cssTime = resourceLoadOrder[cssIndex].time;
        const timeDiff = cssTime - htmlTime;
        
        console.log(`CSS loaded ${timeDiff}ms after HTML`);
        expect(timeDiff).toBeLessThan(1000); // CSS should load within 1s of HTML
      }
    });
  });

  test.describe('@performance Image Performance', () => {
    test('Images should be optimized', async ({ page }) => {
      const imageInfo: Array<{url: string, size: number, type: string}> = [];
      
      page.on('response', async (response) => {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.startsWith('image/')) {
          try {
            const body = await response.body();
            imageInfo.push({
              url: response.url(),
              size: body.length,
              type: contentType
            });
          } catch (e) {
            // Ignore cross-origin images
          }
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      console.log('Image info:', imageInfo);
      
      // Check image optimization
      imageInfo.forEach(img => {
        console.log(`Image: ${img.url.split('/').pop()} (${img.type}) - ${(img.size / 1024).toFixed(2)}KB`);
        
        // Images should be reasonably sized
        if (img.type === 'image/png') {
          expect(img.size).toBeLessThan(1 * 1024 * 1024); // 1MB for PNG
        } else if (img.type === 'image/jpeg') {
          expect(img.size).toBeLessThan(500 * 1024); // 500KB for JPEG
        }
      });
      
      // Total image weight should be reasonable
      const totalImageSize = imageInfo.reduce((sum, img) => sum + img.size, 0);
      console.log(`Total image size: ${(totalImageSize / 1024).toFixed(2)}KB`);
      expect(totalImageSize).toBeLessThan(2 * 1024 * 1024); // 2MB total images
    });

    test('Images should have proper loading attributes', async ({ page }) => {
      await page.goto('/');
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      console.log(`Found ${imageCount} images`);
      
      // Check first few images for optimization attributes
      for (let i = 0; i < Math.min(imageCount, 10); i++) {
        const img = images.nth(i);
        const src = await img.getAttribute('src');
        const loading = await img.getAttribute('loading');
        const alt = await img.getAttribute('alt');
        
        console.log(`Image ${i + 1}: ${src?.split('/').pop()}`);
        
        // Below-the-fold images should be lazy loaded
        const isVisible = await img.isInViewport();
        if (!isVisible) {
          expect(loading).toBe('lazy');
        }
        
        // All images should have alt text
        expect(alt).toBeDefined();
      }
    });
  });

  test.describe('@performance JavaScript Performance', () => {
    test('Page should be interactive quickly', async ({ page }) => {
      await page.goto('/');
      
      // Measure Time to Interactive (simplified)
      const tti = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let startTime = performance.now();
          
          const checkInteractive = () => {
            // Simple interactivity check
            const button = document.querySelector('button, a[href]');
            if (button) {
              const interactiveTime = performance.now() - startTime;
              resolve(interactiveTime);
            } else {
              setTimeout(checkInteractive, 100);
            }
          };
          
          setTimeout(checkInteractive, 0);
        });
      });
      
      console.log(`Time to Interactive: ${tti.toFixed(2)}ms`);
      expect(tti).toBeLessThan(5000); // 5 seconds
    });

    test('Should not block main thread excessively', async ({ page }) => {
      await page.goto('/');
      
      // Test main thread responsiveness
      const responsivenessTimes: number[] = [];
      
      for (let i = 0; i < 5; i++) {
        const start = await page.evaluate(() => performance.now());
        
        // Simulate user interaction
        await page.mouse.move(100 + i * 10, 100);
        
        const end = await page.evaluate(() => performance.now());
        const responseTime = end - start;
        responsivenessTimes.push(responseTime);
        
        await page.waitForTimeout(200);
      }
      
      const avgResponseTime = responsivenessTimes.reduce((sum, time) => sum + time, 0) / responsivenessTimes.length;
      
      console.log(`Average response time: ${avgResponseTime.toFixed(2)}ms`);
      console.log(`Response times: ${responsivenessTimes.map(t => t.toFixed(2)).join(', ')}ms`);
      
      // Main thread should be responsive (< 50ms for simple interactions)
      expect(avgResponseTime).toBeLessThan(50);
    });
  });

  test.describe('@performance Memory Performance', () => {
    test('Should not have excessive memory usage', async ({ page, context }) => {
      // Enable memory profiling if available
      const session = await context.newCDPSession(page);
      
      try {
        await session.send('HeapProfiler.enable');
      } catch (e) {
        console.warn('Heap profiler not available, skipping memory test');
        test.skip();
        return;
      }

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Take initial memory snapshot
      const initialSnapshot = await session.send('HeapProfiler.takeHeapSnapshot');
      
      // Perform some interactions
      await page.mouse.move(200, 200);
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Wait a bit
      await page.waitForTimeout(2000);
      
      // Take final memory snapshot
      const finalSnapshot = await session.send('HeapProfiler.takeHeapSnapshot');
      
      // Get memory usage
      const memoryUsage = await page.evaluate(() => {
        if ('memory' in performance) {
          const mem = (performance as any).memory;
          return {
            used: mem.usedJSHeapSize,
            total: mem.totalJSHeapSize,
            limit: mem.jsHeapSizeLimit
          };
        }
        return null;
      });
      
      if (memoryUsage) {
        console.log('Memory usage:', {
          used: `${(memoryUsage.used / 1024 / 1024).toFixed(2)}MB`,
          total: `${(memoryUsage.total / 1024 / 1024).toFixed(2)}MB`,
          limit: `${(memoryUsage.limit / 1024 / 1024).toFixed(2)}MB`
        });
        
        // Memory usage should be reasonable
        expect(memoryUsage.used).toBeLessThan(100 * 1024 * 1024); // 100MB
      }
      
      await session.detach();
    });
  });
});