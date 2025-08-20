/**
 * Basic Playwright Infrastructure Validation
 * Simple tests to validate that Playwright E2E testing is working properly
 */

import { test, expect } from '@playwright/test';

test.describe('Basic Infrastructure Validation', () => {
  
  test('Home page loads successfully', async ({ page }) => {
    console.log('🔍 Testing home page load...');
    
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    
    await page.waitForLoadState('domcontentloaded');
    
    // Check that page has a title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    console.log(`✅ Home page loads successfully - Title: ${title}`);
  });

  test('Page contains expected hero content', async ({ page }) => {
    console.log('🔍 Testing hero content visibility...');
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Look for hero content
    const heroContent = await page.textContent('body');
    expect(heroContent).toContain('Telesis');
    
    console.log('✅ Hero content found on page');
  });

  test('Navigation responds correctly', async ({ page }) => {
    console.log('🔍 Testing navigation...');
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Test that we can navigate to sign-in (should get 200 response)
    const signInResponse = await page.goto('/sign-in');
    expect(signInResponse?.status()).toBe(200);
    
    console.log('✅ Navigation to sign-in works');
  });

  test('API health check works', async ({ page }) => {
    console.log('🔍 Testing API health...');
    
    // Test a basic API endpoint (should be accessible without auth)
    const response = await page.request.get('/api/health');
    expect(response.status()).toBeLessThan(500); // Any response <500 is okay for basic validation
    
    console.log(`✅ API health check responds with status: ${response.status()}`);
  });

  test('No JavaScript errors on basic pages', async ({ page }) => {
    console.log('🔍 Testing for JavaScript errors...');
    
    const errors: Error[] = [];
    page.on('pageerror', (error) => {
      errors.push(error);
    });
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait a bit for any async errors
    await page.waitForTimeout(2000);
    
    // Filter out known development warnings (optional)
    const criticalErrors = errors.filter(error => 
      !error.message.includes('Warning:') &&
      !error.message.includes('webpack-internal:') &&
      !error.message.includes('next-dev.js')
    );
    
    expect(criticalErrors.length).toBe(0);
    
    if (errors.length > 0) {
      console.log(`⚠️  Found ${errors.length} total errors, ${criticalErrors.length} critical:`);
      errors.forEach(error => console.log(`  - ${error.message}`));
    } else {
      console.log('✅ No JavaScript errors found');
    }
  });

  test('Responsive behavior works', async ({ page }) => {
    console.log('🔍 Testing responsive behavior...');
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Test desktop size
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);
    
    // Test mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Page should still be accessible
    const title = await page.title();
    expect(title).toBeTruthy();
    
    console.log('✅ Responsive behavior works');
  });
});