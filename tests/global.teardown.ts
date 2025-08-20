import { FullConfig } from '@playwright/test';
import { promises as fs } from 'fs';

/**
 * Global teardown function for Playwright tests
 * This runs once after all test files have completed
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Running global teardown...');
  
  try {
    // Clean up authentication state files
    const authFiles = [
      './tests/auth/admin-auth.json',
      './tests/auth/trainer-auth.json',
      './tests/auth/learner-auth.json',
    ];
    
    for (const authFile of authFiles) {
      try {
        await fs.access(authFile);
        console.log(`🗑️  Cleaning up ${authFile}`);
        await fs.unlink(authFile);
      } catch (error) {
        // File doesn't exist, which is fine
      }
    }
    
    // Clean up any temporary test files or directories
    const tempDirs = [
      './test-uploads',
      './test-tmp',
    ];
    
    for (const dir of tempDirs) {
      try {
        await fs.rmdir(dir, { recursive: true });
        console.log(`🗑️  Cleaned up temporary directory: ${dir}`);
      } catch (error) {
        // Directory doesn't exist, which is fine
      }
    }
    
    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.log('⚠️ Global teardown encountered issues:', error);
    // Don't fail the test run due to cleanup issues
  }
}

export default globalTeardown;
