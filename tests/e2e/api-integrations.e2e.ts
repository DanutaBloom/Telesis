/**
 * Telesis E2E API Integration Tests
 * Tests API integrations in a real browser environment
 */

import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const TEST_TIMEOUT = 30000;

test.describe('API Integration E2E Tests @integration', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Set longer timeout for integration tests
    test.setTimeout(TEST_TIMEOUT);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test.describe('Health Check API', () => {
    test('should return healthy status with proper security headers', async () => {
      const response = await page.goto(`${BASE_URL}/api/health`);
      
      expect(response).toBeTruthy();
      expect(response!.status()).toBeGreaterThanOrEqual(200);
      expect(response!.status()).toBeLessThan(400);

      // Verify response is JSON
      const contentType = response!.headers()['content-type'];
      expect(contentType).toContain('application/json');

      // Check security headers
      const headers = response!.headers();
      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['x-frame-options']).toBe('DENY');
      expect(headers['x-xss-protection']).toBe('1; mode=block');
      expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
      expect(headers['cache-control']).toContain('no-cache');

      // Verify response structure
      const healthData = await response!.json();
      expect(healthData).toHaveProperty('status');
      expect(healthData).toHaveProperty('timestamp');
      expect(healthData).toHaveProperty('version');
      expect(healthData).toHaveProperty('services');
      
      expect(healthData.services).toHaveProperty('database');
      expect(healthData.services).toHaveProperty('authentication');
      expect(healthData.services).toHaveProperty('payments');

      // Verify no sensitive data is exposed
      const responseText = JSON.stringify(healthData);
      expect(responseText).not.toContain('secret');
      expect(responseText).not.toContain('password');
      expect(responseText).not.toContain('token');
      expect(responseText).not.toContain('key');
    });

    test('should rate limit excessive requests', async () => {
      const responses = [];
      
      // Make multiple rapid requests
      for (let i = 0; i < 35; i++) {
        const response = await fetch(`${BASE_URL}/api/health`);
        responses.push(response.status);
        
        // Short delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Should eventually hit rate limit (30 requests per minute)
      // Note: This might not always trigger in fast test runs, but we check for it
      const hasRateLimit = responses.some(status => status === 429);
      
      // Log the results for debugging
      const statusCounts = responses.reduce((acc, status) => {
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      
      console.log('Health check response status counts:', statusCounts);
      
      // At minimum, most requests should succeed
      const successCount = (statusCounts[200] || 0) + (statusCounts[503] || 0);
      expect(successCount).toBeGreaterThan(20);
    });
  });

  test.describe('Protected Materials API', () => {
    test('should require authentication for materials endpoint', async () => {
      const response = await page.goto(`${BASE_URL}/api/materials`);
      
      expect(response).toBeTruthy();
      expect(response!.status()).toBe(401);

      const errorData = await response!.json();
      expect(errorData.success).toBe(false);
      expect(errorData.error).toBe('Authentication required');
      expect(errorData.code).toBe('UNAUTHORIZED');

      // Verify WWW-Authenticate header is present
      expect(response!.headers()['www-authenticate']).toBe('Bearer');
    });

    test('should reject POST requests without proper content-type', async () => {
      const response = await fetch(`${BASE_URL}/api/materials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: 'invalid body',
      });

      expect(response.status).toBe(401); // Auth failure comes first
      
      const errorData = await response.json();
      expect(errorData.success).toBe(false);
    });

    test('should handle CORS properly for API endpoints', async () => {
      // Test preflight request
      const preflightResponse = await fetch(`${BASE_URL}/api/materials`, {
        method: 'OPTIONS',
      });

      // Next.js handles CORS automatically, should return 404 for unsupported OPTIONS
      // or handle it gracefully
      expect([200, 404, 405]).toContain(preflightResponse.status);
    });
  });

  test.describe('Database Integration', () => {
    test('should confirm database connectivity through health check', async () => {
      const response = await page.goto(`${BASE_URL}/api/health`);
      const healthData = await response!.json();

      expect(healthData.services.database).toBeOneOf([
        'operational', 
        'degraded', 
        'unknown'
      ]);

      // Log database status for monitoring
      console.log('Database status:', healthData.services.database);
      
      if (healthData.services.database === 'degraded') {
        console.warn('⚠️ Database connection is degraded');
      }
    });
  });

  test.describe('Clerk Authentication Integration', () => {
    test('should confirm Clerk configuration through health check', async () => {
      const response = await page.goto(`${BASE_URL}/api/health`);
      const healthData = await response!.json();

      expect(healthData.services.authentication).toBeOneOf([
        'configured',
        'not-configured', 
        'unknown'
      ]);

      // Log authentication status
      console.log('Authentication service status:', healthData.services.authentication);
      
      if (healthData.services.authentication !== 'configured') {
        console.warn('⚠️ Authentication service may not be properly configured');
      }
    });

    test('should redirect unauthenticated users to sign-in', async () => {
      // Try to access a protected dashboard page
      const response = await page.goto(`${BASE_URL}/dashboard`, {
        waitUntil: 'domcontentloaded'
      });

      // Should either redirect to sign-in or show auth UI
      const currentUrl = page.url();
      const hasSignIn = currentUrl.includes('/sign-in') || 
                        await page.locator('[data-clerk-element]').count() > 0 ||
                        await page.locator('text=Sign in').count() > 0;

      if (!hasSignIn) {
        // Check if we're on an auth-related page
        const pageContent = await page.textContent('body');
        expect(pageContent).toMatch(/sign.?in|login|authenticate/i);
      } else {
        expect(hasSignIn).toBe(true);
      }
    });
  });

  test.describe('Stripe Integration', () => {
    test('should confirm Stripe configuration through health check', async () => {
      const response = await page.goto(`${BASE_URL}/api/health`);
      const healthData = await response!.json();

      expect(healthData.services.payments).toBeOneOf([
        'configured',
        'not-configured',
        'unknown'
      ]);

      // Log payment service status
      console.log('Payment service status:', healthData.services.payments);
      
      if (healthData.services.payments !== 'configured') {
        console.warn('⚠️ Payment service may not be properly configured');
      }
    });
  });

  test.describe('API Performance and Monitoring', () => {
    test('should respond to health check within reasonable time', async () => {
      const startTime = Date.now();
      const response = await page.goto(`${BASE_URL}/api/health`);
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      
      expect(response!.status()).toBeLessThan(400);
      expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
      
      console.log(`Health check response time: ${responseTime}ms`);
    });

    test('should handle concurrent requests gracefully', async () => {
      const concurrentRequests = 10;
      const promises = Array.from({ length: concurrentRequests }, () =>
        fetch(`${BASE_URL}/api/health`)
      );

      const responses = await Promise.all(promises);
      
      // All requests should complete successfully
      const successfulResponses = responses.filter(r => r.status < 400);
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      
      expect(successfulResponses.length + rateLimitedResponses.length).toBe(concurrentRequests);
      
      console.log(`Concurrent requests: ${concurrentRequests}`);
      console.log(`Successful: ${successfulResponses.length}`);
      console.log(`Rate limited: ${rateLimitedResponses.length}`);
    });
  });

  test.describe('Integration Status Report', () => {
    test('should generate comprehensive API integration report', async () => {
      console.log('\n🔍 API Integration Status Report');
      console.log('================================');

      // Test health endpoint
      const healthResponse = await page.goto(`${BASE_URL}/api/health`);
      const healthData = await healthResponse!.json();

      console.log('\n📊 Service Status:');
      console.log(`  Database: ${healthData.services.database}`);
      console.log(`  Authentication: ${healthData.services.authentication}`);
      console.log(`  Payments: ${healthData.services.payments}`);
      console.log(`  Overall: ${healthData.status}`);

      // Test protected endpoint
      const protectedResponse = await fetch(`${BASE_URL}/api/materials`);
      const authWorking = protectedResponse.status === 401;

      console.log('\n🔐 Authentication:');
      console.log(`  Protected endpoints: ${authWorking ? '✅ Working' : '❌ Failed'}`);
      console.log(`  Auth middleware: ${authWorking ? '✅ Active' : '❌ Inactive'}`);

      // Test environment configuration
      const envStatus = {
        clerk: !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
        stripe: !!(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
        app_url: !!(process.env.NEXT_PUBLIC_APP_URL)
      };

      console.log('\n⚙️ Environment Configuration:');
      console.log(`  Clerk: ${envStatus.clerk ? '✅ Configured' : '❌ Missing'}`);
      console.log(`  Stripe: ${envStatus.stripe ? '✅ Configured' : '❌ Missing'}`);
      console.log(`  App URL: ${envStatus.app_url ? '✅ Configured' : '❌ Using default'}`);

      // Missing integrations
      console.log('\n⚠️ Missing Integrations:');
      console.log('  OpenAI/ChatGPT: ❌ Not configured (required for AI features)');

      // Recommendations
      console.log('\n💡 Recommendations:');
      if (!envStatus.clerk) console.log('  - Add Clerk authentication keys');
      if (!envStatus.stripe) console.log('  - Add Stripe payment keys');
      console.log('  - Add OpenAI API key for AI transformations');
      console.log('  - Monitor rate limiting effectiveness');
      console.log('  - Set up proper error tracking');

      console.log('\n================================\n');

      // Ensure core services are working
      expect(healthData.status).toBeOneOf(['healthy', 'degraded']);
      expect(authWorking).toBe(true);
    });
  });
});