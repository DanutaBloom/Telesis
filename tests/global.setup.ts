import { chromium, expect, FullConfig } from '@playwright/test';
import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Global setup function for Playwright tests
 * This runs once before all test files
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');
  
  // Launch a browser to verify the app is accessible
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the app to ensure it's running
    const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';
    await page.goto(baseURL);

    // Verify the app is accessible
    await expect(page).toHaveTitle(/Telesis/);
    console.log('✅ App is accessible and ready for testing');

    // Ensure auth directories exist
    const authDir = './tests/auth';
    try {
      await fs.access(authDir);
    } catch {
      await fs.mkdir(authDir, { recursive: true });
      console.log('📁 Created auth directory for state storage');
    }

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
