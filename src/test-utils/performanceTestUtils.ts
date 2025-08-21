/**
 * Performance Testing Utilities
 *
 * Utilities for testing performance metrics against PRD requirements:
 * - First Contentful Paint (FCP): < 1.2s
 * - Time to Interactive (TTI): < 2.5s
 * - Lighthouse Score: > 90
 * - Bundle size: < 200KB (initial)
 * - API response time: < 200ms (95th percentile)
 */

import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

// PRD Performance Requirements
export const PERFORMANCE_REQUIREMENTS = {
  fcp: 1200, // First Contentful Paint: < 1.2s (milliseconds)
  tti: 2500, // Time to Interactive: < 2.5s (milliseconds)
  lighthouse: 90, // Lighthouse Score: > 90
  bundleSize: 200 * 1024, // Bundle size: < 200KB (bytes)
  apiResponse: 200, // API response time: < 200ms
  lcp: 2500, // Largest Contentful Paint: < 2.5s
  cls: 0.1, // Cumulative Layout Shift: < 0.1
  fid: 100, // First Input Delay: < 100ms
} as const;

// Performance metrics interface
export type PerformanceMetrics = {
  fcp: number;
  lcp: number;
  tti: number;
  cls: number;
  fid?: number;
  navigationStart: number;
  loadEventEnd: number;
  totalLoadTime: number;
};

// Lighthouse metrics interface
export type LighthouseMetrics = {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa?: number;
};

// API performance metrics
export type APIPerformanceMetrics = {
  responseTime: number;
  ttfb: number; // Time to First Byte
  endpoint: string;
  method: string;
  statusCode: number;
};

/**
 * Measure Core Web Vitals using browser APIs
 */
export async function measureCoreWebVitals(page: Page): Promise<PerformanceMetrics> {
  // Wait for page to load completely
  await page.waitForLoadState('networkidle');

  const metrics = await page.evaluate(() => {
    return new Promise<PerformanceMetrics>((resolve) => {
      // Get navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');

      const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

      // Initialize metrics object
      const metrics: PerformanceMetrics = {
        fcp,
        lcp: 0,
        tti: 0,
        cls: 0,
        fid: 0,
        navigationStart: navigation.navigationStart || performance.timeOrigin,
        loadEventEnd: navigation.loadEventEnd,
        totalLoadTime: navigation.loadEventEnd - navigation.navigationStart,
      };

      // Use Web Vitals library if available
      if ('web-vitals' in window) {
        // This would require the web-vitals library to be loaded
        // For now, we'll use performance observer
      }

      // Create performance observer for LCP and CLS
      let lcpObserver: PerformanceObserver | null = null;
      let clsObserver: PerformanceObserver | null = null;
      let ttiCalculated = false;

      try {
        // Observe LCP
        lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metrics.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Observe CLS
        clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          metrics.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Calculate TTI approximation
        // TTI is complex to calculate precisely, so we'll approximate
        const calculateTTI = () => {
          if (ttiCalculated) {
 return;
}

          const longTasks = performance.getEntriesByType('longtask');
          const lastLongTask = longTasks[longTasks.length - 1];

          // Simplified TTI: FCP + 5 seconds or when no long tasks for 5 seconds
          if (lastLongTask) {
            metrics.tti = Math.max(fcp, lastLongTask.startTime + lastLongTask.duration);
          } else {
            metrics.tti = fcp;
          }

          ttiCalculated = true;
        };

        // Calculate TTI after a delay
        setTimeout(calculateTTI, 1000);
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }

      // Return metrics after a delay to allow observers to collect data
      setTimeout(() => {
        if (lcpObserver) {
 lcpObserver.disconnect();
}
        if (clsObserver) {
 clsObserver.disconnect();
}

        // Fallback TTI calculation if not calculated
        if (!ttiCalculated) {
          metrics.tti = Math.max(fcp, navigation.domContentLoadedEventEnd - navigation.navigationStart);
        }

        resolve(metrics);
      }, 2000);
    });
  });

  return metrics;
}

/**
 * Validate performance metrics against PRD requirements
 */
export function validatePerformanceRequirements(metrics: PerformanceMetrics): {
  passed: boolean;
  failures: string[];
  results: Record<string, { actual: number; required: number; passed: boolean }>;
} {
  const results = {
    fcp: {
      actual: metrics.fcp,
      required: PERFORMANCE_REQUIREMENTS.fcp,
      passed: metrics.fcp < PERFORMANCE_REQUIREMENTS.fcp,
    },
    lcp: {
      actual: metrics.lcp,
      required: PERFORMANCE_REQUIREMENTS.lcp,
      passed: metrics.lcp < PERFORMANCE_REQUIREMENTS.lcp,
    },
    tti: {
      actual: metrics.tti,
      required: PERFORMANCE_REQUIREMENTS.tti,
      passed: metrics.tti < PERFORMANCE_REQUIREMENTS.tti,
    },
    cls: {
      actual: metrics.cls,
      required: PERFORMANCE_REQUIREMENTS.cls,
      passed: metrics.cls < PERFORMANCE_REQUIREMENTS.cls,
    },
  };

  if (metrics.fid !== undefined) {
    results.fid = {
      actual: metrics.fid,
      required: PERFORMANCE_REQUIREMENTS.fid,
      passed: metrics.fid < PERFORMANCE_REQUIREMENTS.fid,
    };
  }

  const failures: string[] = [];

  Object.entries(results).forEach(([metric, result]) => {
    if (!result.passed) {
      failures.push(`${metric.toUpperCase()}: ${result.actual}ms > ${result.required}ms`);
    }
  });

  return {
    passed: failures.length === 0,
    failures,
    results,
  };
}

/**
 * Measure API response time
 */
export async function measureAPIPerformance(
  page: Page,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  payload?: any,
): Promise<APIPerformanceMetrics> {
  const startTime = performance.now();

  // Listen for network requests
  const responsePromise = page.waitForResponse(response =>
    response.url().includes(endpoint) && response.request().method() === method,
  );

  // Make the API request
  if (method === 'GET') {
    await page.goto(endpoint);
  } else {
    await page.evaluate(async ({ endpoint, method, payload }) => {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload ? JSON.stringify(payload) : undefined,
      });
      return response.json();
    }, { endpoint, method, payload });
  }

  const response = await responsePromise;
  const endTime = performance.now();

  // Get detailed timing from browser
  const timing = await page.evaluate(() => {
    const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (entries.length > 0) {
      const entry = entries[0];
      return {
        ttfb: entry.responseStart - entry.requestStart,
        responseTime: entry.responseEnd - entry.requestStart,
      };
    }
    return { ttfb: 0, responseTime: 0 };
  });

  return {
    responseTime: endTime - startTime,
    ttfb: timing.ttfb,
    endpoint,
    method,
    statusCode: response.status(),
  };
}

/**
 * Validate API performance requirements
 */
export function validateAPIPerformance(metrics: APIPerformanceMetrics[]): {
  passed: boolean;
  failures: string[];
  p95ResponseTime: number;
} {
  if (metrics.length === 0) {
    return { passed: false, failures: ['No API metrics collected'], p95ResponseTime: 0 };
  }

  // Calculate 95th percentile response time
  const responseTimes = metrics.map(m => m.responseTime).sort((a, b) => a - b);
  const p95Index = Math.floor(responseTimes.length * 0.95);
  const p95ResponseTime = responseTimes[p95Index];

  const failures: string[] = [];

  if (p95ResponseTime > PERFORMANCE_REQUIREMENTS.apiResponse) {
    failures.push(`API P95 response time: ${p95ResponseTime.toFixed(2)}ms > ${PERFORMANCE_REQUIREMENTS.apiResponse}ms`);
  }

  // Check individual endpoints
  metrics.forEach((metric) => {
    if (metric.statusCode >= 400) {
      failures.push(`${metric.method} ${metric.endpoint}: HTTP ${metric.statusCode}`);
    }

    if (metric.responseTime > PERFORMANCE_REQUIREMENTS.apiResponse * 2) {
      failures.push(`${metric.method} ${metric.endpoint}: ${metric.responseTime.toFixed(2)}ms (very slow)`);
    }
  });

  return {
    passed: failures.length === 0,
    failures,
    p95ResponseTime,
  };
}

/**
 * Measure bundle size (requires build analysis)
 */
export async function measureBundleSize(page: Page): Promise<{
  totalSize: number;
  initialChunks: Array<{ name: string; size: number }>;
}> {
  // Navigate to the page and wait for all resources to load
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Get all loaded resources
  const resources = await page.evaluate(() => {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return entries
      .filter(entry => entry.name.includes('.js') || entry.name.includes('.css'))
      .map(entry => ({
        name: entry.name.split('/').pop() || entry.name,
        size: entry.transferSize || entry.encodedBodySize || 0,
        type: entry.name.includes('.js') ? 'js' : 'css',
      }));
  });

  const initialChunks = resources.filter(resource =>
    resource.name.includes('main')
    || resource.name.includes('chunk')
    || resource.name.includes('index'),
  );

  const totalSize = initialChunks.reduce((sum, chunk) => sum + chunk.size, 0);

  return {
    totalSize,
    initialChunks,
  };
}

/**
 * Validate bundle size requirements
 */
export function validateBundleSize(bundleInfo: { totalSize: number; initialChunks: Array<{ name: string; size: number }> }): {
  passed: boolean;
  failures: string[];
} {
  const failures: string[] = [];

  if (bundleInfo.totalSize > PERFORMANCE_REQUIREMENTS.bundleSize) {
    failures.push(`Initial bundle size: ${(bundleInfo.totalSize / 1024).toFixed(2)}KB > ${PERFORMANCE_REQUIREMENTS.bundleSize / 1024}KB`);
  }

  // Check for oversized individual chunks
  bundleInfo.initialChunks.forEach((chunk) => {
    if (chunk.size > PERFORMANCE_REQUIREMENTS.bundleSize / 2) {
      failures.push(`Large chunk ${chunk.name}: ${(chunk.size / 1024).toFixed(2)}KB`);
    }
  });

  return {
    passed: failures.length === 0,
    failures,
  };
}

/**
 * Run comprehensive performance test
 */
export async function runPerformanceTest(
  page: Page,
  options: {
    testCoreWebVitals?: boolean;
    testAPI?: boolean;
    testBundleSize?: boolean;
    apiEndpoints?: string[];
  } = {},
): Promise<{
  coreWebVitals?: ReturnType<typeof validatePerformanceRequirements>;
  apiPerformance?: ReturnType<typeof validateAPIPerformance>;
  bundleSize?: ReturnType<typeof validateBundleSize>;
  overallPassed: boolean;
}> {
  const {
    testCoreWebVitals = true,
    testAPI = true,
    testBundleSize = true,
    apiEndpoints = ['/api/health', '/api/materials', '/api/organizations'],
  } = options;

  const results: any = {};

  // Test Core Web Vitals
  if (testCoreWebVitals) {
    console.log('📊 Measuring Core Web Vitals...');
    const metrics = await measureCoreWebVitals(page);
    results.coreWebVitals = validatePerformanceRequirements(metrics);

    console.log('Core Web Vitals Results:', {
      FCP: `${metrics.fcp.toFixed(2)}ms`,
      LCP: `${metrics.lcp.toFixed(2)}ms`,
      TTI: `${metrics.tti.toFixed(2)}ms`,
      CLS: metrics.cls.toFixed(3),
    });
  }

  // Test API Performance
  if (testAPI && apiEndpoints.length > 0) {
    console.log('⚡ Measuring API Performance...');
    const apiMetrics: APIPerformanceMetrics[] = [];

    for (const endpoint of apiEndpoints) {
      try {
        const metric = await measureAPIPerformance(page, endpoint);
        apiMetrics.push(metric);
      } catch (error) {
        console.warn(`Failed to measure ${endpoint}:`, error);
      }
    }

    results.apiPerformance = validateAPIPerformance(apiMetrics);
  }

  // Test Bundle Size
  if (testBundleSize) {
    console.log('📦 Measuring Bundle Size...');
    const bundleInfo = await measureBundleSize(page);
    results.bundleSize = validateBundleSize(bundleInfo);

    console.log('Bundle Size Results:', {
      totalSize: `${(bundleInfo.totalSize / 1024).toFixed(2)}KB`,
      chunks: bundleInfo.initialChunks.length,
    });
  }

  // Determine overall pass/fail
  const overallPassed = Object.values(results).every((result: any) => result?.passed !== false);

  return {
    ...results,
    overallPassed,
  };
}

/**
 * Performance test assertions for use in test files
 */
export function expectPerformanceRequirements(
  results: ReturnType<typeof runPerformanceTest> extends Promise<infer T> ? T : never,
): void {
  if (results.coreWebVitals) {
    expect(results.coreWebVitals.passed).toBe(true);

    if (!results.coreWebVitals.passed) {
      throw new Error(`Core Web Vitals failed: ${results.coreWebVitals.failures.join(', ')}`);
    }
  }

  if (results.apiPerformance) {
    expect(results.apiPerformance.passed).toBe(true);

    if (!results.apiPerformance.passed) {
      throw new Error(`API Performance failed: ${results.apiPerformance.failures.join(', ')}`);
    }
  }

  if (results.bundleSize) {
    expect(results.bundleSize.passed).toBe(true);

    if (!results.bundleSize.passed) {
      throw new Error(`Bundle Size failed: ${results.bundleSize.failures.join(', ')}`);
    }
  }

  expect(results.overallPassed).toBe(true);
}

/**
 * Create performance monitoring script for continuous monitoring
 */
export function createPerformanceMonitoringScript(): string {
  return `
    // Performance monitoring script for Telesis
    (function() {
      const PERFORMANCE_THRESHOLDS = {
        FCP: ${PERFORMANCE_REQUIREMENTS.fcp},
        LCP: ${PERFORMANCE_REQUIREMENTS.lcp},
        TTI: ${PERFORMANCE_REQUIREMENTS.tti},
        CLS: ${PERFORMANCE_REQUIREMENTS.cls},
        FID: ${PERFORMANCE_REQUIREMENTS.fid},
      };
      
      function reportPerformanceMetric(name, value) {
        // Send to analytics or monitoring service
        console.log(\`Performance Metric: \${name} = \${value}ms\`);
        
        // Check against thresholds
        const threshold = PERFORMANCE_THRESHOLDS[name];
        if (threshold && value > threshold) {
          console.warn(\`⚠️ Performance threshold exceeded: \${name} (\${value}ms > \${threshold}ms)\`);
        }
      }
      
      // Monitor Core Web Vitals
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            reportPerformanceMetric('FCP', entry.startTime);
          }
        }
      }).observe({ entryTypes: ['paint'] });
      
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        reportPerformanceMetric('LCP', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        reportPerformanceMetric('CLS', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });
      
      // Monitor API performance
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const startTime = performance.now();
        return originalFetch.apply(this, args).then(response => {
          const endTime = performance.now();
          const responseTime = endTime - startTime;
          
          if (args[0] && typeof args[0] === 'string' && args[0].includes('/api/')) {
            reportPerformanceMetric('API_' + args[0].split('/api/')[1].toUpperCase(), responseTime);
          }
          
          return response;
        });
      };
    })();
  `;
}
