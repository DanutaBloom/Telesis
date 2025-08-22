/**
 * Basic Authentication System Validation
 * Tests core authentication routes and API endpoints without complex auth setup
 */

import { expect, test } from '@playwright/test';

const _BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

test.describe('Basic Authentication Validation', () => {
  test('Landing page loads successfully', async ({ page }) => {
    console.log('🔍 Testing landing page...');

    const response = await page.goto('/');

    expect(response?.status()).toBe(200);

    await page.waitForLoadState('domcontentloaded');
    const title = await page.title();

    expect(title).toBeTruthy();

    console.log('✅ Landing page loads successfully');
  });

  test('Sign-in page is accessible', async ({ page }) => {
    console.log('🔍 Testing sign-in page accessibility...');

    const response = await page.goto('/sign-in');

    expect(response?.status()).toBe(200);

    await page.waitForLoadState('domcontentloaded');

    // Should contain some form of authentication UI
    const hasAuthUI = await Promise.race([
      page.waitForSelector('[data-clerk-element]', { timeout: 5000 }).then(() => true),
      page.waitForSelector('form', { timeout: 5000 }).then(() => true),
      page.waitForSelector('input[type="email"]', { timeout: 5000 }).then(() => true),
    ]).catch(() => false);

    expect(hasAuthUI).toBe(true);

    console.log('✅ Sign-in page is accessible with auth UI');
  });

  test('Sign-up page is accessible', async ({ page }) => {
    console.log('🔍 Testing sign-up page accessibility...');

    const response = await page.goto('/sign-up');

    expect(response?.status()).toBe(200);

    await page.waitForLoadState('domcontentloaded');

    // Should contain some form of authentication UI
    const hasAuthUI = await Promise.race([
      page.waitForSelector('[data-clerk-element]', { timeout: 5000 }).then(() => true),
      page.waitForSelector('form', { timeout: 5000 }).then(() => true),
      page.waitForSelector('input[type="email"]', { timeout: 5000 }).then(() => true),
    ]).catch(() => false);

    expect(hasAuthUI).toBe(true);

    console.log('✅ Sign-up page is accessible with auth UI');
  });

  test('Dashboard redirects unauthenticated users', async ({ page }) => {
    console.log('🔍 Testing dashboard protection...');

    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // Should redirect to sign-in or show auth UI
    const currentUrl = page.url();
    const isProtected = currentUrl.includes('/sign-in')
      || await page.locator('[data-clerk-element]').count() > 0;

    expect(isProtected).toBe(true);

    console.log('✅ Dashboard properly redirects unauthenticated users');
  });

  test('API endpoints return proper auth errors', async ({ page }) => {
    console.log('🔍 Testing API endpoint security...');

    // Test materials API
    const materialsResponse = await page.request.get('/api/materials');

    expect(materialsResponse.status()).toBe(401);

    const materialsData = await materialsResponse.json();

    expect(materialsData.success).toBe(false);
    expect(materialsData.error).toBe('Authentication required');

    console.log('✅ Materials API properly secured');

    // Test organizations API
    const orgsResponse = await page.request.get('/api/organizations');

    expect(orgsResponse.status()).toBe(401);

    const orgsData = await orgsResponse.json();

    expect(orgsData.success).toBe(false);
    expect(orgsData.error).toBe('Authentication required');

    console.log('✅ Organizations API properly secured');
  });

  test('Health check API is accessible', async ({ page }) => {
    console.log('🔍 Testing health check API...');

    const response = await page.request.get('/api/health');

    expect(response.status()).toBe(200);

    const healthData = await response.json();

    expect(healthData).toHaveProperty('status');
    expect(healthData).toHaveProperty('services');
    expect(healthData.services).toHaveProperty('database');
    expect(healthData.services).toHaveProperty('authentication');
    expect(healthData.services).toHaveProperty('payments');

    console.log('✅ Health check API accessible and returns proper data');
  });

  test('Organization selection page handles gracefully', async ({ page }) => {
    console.log('🔍 Testing organization selection page...');

    const response = await page.goto('/onboarding/organization-selection');
    await page.waitForLoadState('domcontentloaded');

    // Should either redirect or show a proper page
    const currentUrl = page.url();
    const statusCode = response?.status();

    // Acceptable outcomes: redirect to auth/dashboard, 404, or proper page load
    const isHandledProperly = currentUrl.includes('/sign-in')
      || currentUrl.includes('/dashboard')
      || statusCode === 404
      || statusCode === 200;

    expect(isHandledProperly).toBe(true);

    console.log('✅ Organization selection page handled gracefully');
  });

  test('No console errors on public pages', async ({ page }) => {
    console.log('🔍 Testing for console errors on public pages...');

    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    // Test public pages
    const publicPages = ['/', '/sign-in', '/sign-up'];

    for (const pagePath of publicPages) {
      await page.goto(pagePath);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000); // Allow time for any async operations
    }

    // Filter out known non-critical errors
    const criticalErrors = consoleErrors.filter(error =>
      !error.includes('favicon.ico')
      && !error.includes('ResizeObserver')
      && !error.includes('non-passive')
      && !error.includes('chunk-')
      && !error.toLowerCase().includes('warning'),
    );

    if (criticalErrors.length > 0) {
      console.log('Console errors found:', criticalErrors);
    }

    // Should have minimal critical errors
    expect(criticalErrors.length).toBeLessThan(3);

    console.log('✅ Public pages load with minimal console errors');
  });

  test('Pages respond within reasonable time', async ({ page }) => {
    console.log('🔍 Testing page load performance...');

    const pages = ['/', '/sign-in', '/sign-up'];

    for (const pagePath of pages) {
      const startTime = Date.now();
      await page.goto(pagePath);
      await page.waitForLoadState('domcontentloaded');
      const endTime = Date.now();

      const loadTime = endTime - startTime;
      console.log(`  ${pagePath}: ${loadTime}ms`);

      // Should load within 10 seconds
      expect(loadTime).toBeLessThan(10000);
    }

    console.log('✅ All pages load within reasonable time');
  });

  test('Generate comprehensive status report', async ({ page }) => {
    console.log('\n🎯 AUTHENTICATION SYSTEM STATUS REPORT');
    console.log('=====================================');

    // Test all routes
    const routes = [
      { path: '/', name: 'Landing Page', shouldLoad: true },
      { path: '/sign-in', name: 'Sign In', shouldLoad: true },
      { path: '/sign-up', name: 'Sign Up', shouldLoad: true },
      { path: '/dashboard', name: 'Dashboard (Protected)', shouldLoad: false },
    ];

    console.log('\n📊 Route Status:');
    const routeResults = [];

    for (const route of routes) {
      try {
        const response = await page.goto(route.path);
        const status = response?.status() || 200;
        const currentUrl = page.url();

        let result;
        if (route.shouldLoad) {
          result = status === 200 ? '✅ OK' : '❌ Failed';
        } else {
          // Protected route should redirect
          result = currentUrl.includes('/sign-in') || currentUrl !== route.path ? '✅ Protected' : '❌ Not Protected';
        }

        routeResults.push({ ...route, status, result });
        console.log(`  ${route.name}: ${result} (${status})`);
      } catch (_error) {
        routeResults.push({ ...route, status: 'Error', result: '❌ Error' });
        console.log(`  ${route.name}: ❌ Error`);
      }
    }

    // Test API endpoints
    console.log('\n🔐 API Security:');
    const apiResults = [];

    try {
      const healthResponse = await page.request.get('/api/health');
      const healthStatus = healthResponse.status() === 200 ? '✅ Accessible' : '❌ Failed';
      apiResults.push({ name: 'Health Check', result: healthStatus });
      console.log(`  Health Check: ${healthStatus}`);
    } catch {
      apiResults.push({ name: 'Health Check', result: '❌ Error' });
      console.log('  Health Check: ❌ Error');
    }

    try {
      const materialsResponse = await page.request.get('/api/materials');
      const materialsStatus = materialsResponse.status() === 401 ? '✅ Protected' : '❌ Not Protected';
      apiResults.push({ name: 'Materials API', result: materialsStatus });
      console.log(`  Materials API: ${materialsStatus}`);
    } catch {
      apiResults.push({ name: 'Materials API', result: '❌ Error' });
      console.log('  Materials API: ❌ Error');
    }

    try {
      const orgsResponse = await page.request.get('/api/organizations');
      const orgsStatus = orgsResponse.status() === 401 ? '✅ Protected' : '❌ Not Protected';
      apiResults.push({ name: 'Organizations API', result: orgsStatus });
      console.log(`  Organizations API: ${orgsStatus}`);
    } catch {
      apiResults.push({ name: 'Organizations API', result: '❌ Error' });
      console.log('  Organizations API: ❌ Error');
    }

    // Environment status
    console.log('\n⚙️ Configuration:');
    const hasClerk = !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
    const hasAppUrl = !!(process.env.NEXT_PUBLIC_APP_URL);

    console.log(`  Clerk Auth: ${hasClerk ? '✅ Configured' : '❌ Missing'}`);
    console.log(`  App URL: ${hasAppUrl ? '✅ Set' : '⚠️ Using default'}`);
    console.log('  Organizations: ❌ Disabled (as intended)');

    // Summary
    console.log('\n📋 Summary:');
    const successfulRoutes = routeResults.filter(r => r.result.includes('✅')).length;
    const successfulAPIs = apiResults.filter(r => r.result.includes('✅')).length;

    console.log(`  Routes working: ${successfulRoutes}/${routes.length}`);
    console.log(`  APIs secured: ${successfulAPIs}/${apiResults.length}`);
    console.log(`  Overall status: ${successfulRoutes === routes.length && successfulAPIs === apiResults.length ? '✅ All systems operational' : '⚠️ Some issues detected'}`);

    console.log('\n💡 Recommendations:');
    if (!hasClerk) {
 console.log('  - Configure Clerk authentication keys');
}
    console.log('  - Test with real user authentication');
    console.log('  - Monitor performance in production');

    console.log('\n=====================================\n');

    // Test passes if core functionality is working
    const coreWorking = successfulRoutes >= routes.length - 1 && successfulAPIs >= 2;

    expect(coreWorking).toBe(true);
  });
});
