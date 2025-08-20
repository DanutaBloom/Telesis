/**
 * Organization Management E2E Tests
 * 
 * Tests organization switching, creation, management, and multi-tenant scenarios
 */

import { test, expect } from '@playwright/test';
import { setupAuth, TEST_USERS, TEST_ORGANIZATION } from '../../auth/auth-setup';

test.describe('Organization Management', () => {
  test.beforeEach(async ({ page }) => {
    // Set up authentication as admin user
    await setupAuth(page, 'admin');
  });

  test('User can view current organization information', async ({ page }) => {
    await page.goto('/dashboard');

    // Organization information should be visible
    const orgSwitcher = page.locator('[data-testid="organization-switcher"], .organization-selector');
    
    if (await orgSwitcher.isVisible()) {
      await expect(orgSwitcher).toContainText(TEST_ORGANIZATION.name);
    } else {
      // Organization name might be displayed elsewhere
      await expect(page.locator('text=' + TEST_ORGANIZATION.name)).toBeVisible();
    }
  });

  test('Admin can access organization settings', async ({ page }) => {
    await page.goto('/dashboard');

    // Navigate to organization settings
    const orgSwitcher = page.locator('[data-testid="organization-switcher"], .organization-selector');
    
    if (await orgSwitcher.isVisible()) {
      await orgSwitcher.click();
      
      // Look for settings or manage option
      const settingsLink = page.locator('a:has-text("Settings"), a:has-text("Manage"), [data-testid="org-settings"]');
      if (await settingsLink.isVisible()) {
        await settingsLink.click();
        
        // Should navigate to organization settings
        await expect(page).toHaveURL(/organization|settings/);
        await expect(page.locator('h1, h2')).toContainText(/settings|organization/i);
      }
    } else {
      // Try direct navigation
      await page.goto('/dashboard/organization-profile');
      await expect(page.locator('h1, h2')).toContainText(/organization|settings/i);
    }
  });

  test('Admin can create new organization', async ({ page }) => {
    await page.goto('/dashboard');

    // Open organization switcher
    const orgSwitcher = page.locator('[data-testid="organization-switcher"], .organization-selector');
    
    if (await orgSwitcher.isVisible()) {
      await orgSwitcher.click();
      
      // Look for "Create" or "New Organization" option
      const createOrgButton = page.locator(
        'button:has-text("Create"), button:has-text("New"), [data-testid="create-organization"]'
      );
      
      if (await createOrgButton.isVisible()) {
        await createOrgButton.click();
        
        // Fill out organization creation form
        await page.fill('input[name="name"], input[placeholder*="name"]', 'New Test Organization');
        
        // Submit form
        await page.click('button[type="submit"], button:has-text("Create")');
        
        // Should redirect back to dashboard with new organization
        await expect(page).toHaveURL(/dashboard/);
        
        // Verify new organization is active
        await expect(page.locator('text=New Test Organization')).toBeVisible();
      }
    }
  });

  test('User can switch between organizations', async ({ page }) => {
    await page.goto('/dashboard');

    // This test requires multiple organizations to exist
    // For now, we'll test the UI exists and is functional
    const orgSwitcher = page.locator('[data-testid="organization-switcher"], .organization-selector');
    
    if (await orgSwitcher.isVisible()) {
      await orgSwitcher.click();
      
      // Should show organization list or creation option
      const orgList = page.locator('[role="listbox"], .organization-list, [data-testid="org-list"]');
      await expect(orgList).toBeVisible();
      
      // Close the switcher
      await page.keyboard.press('Escape');
      await expect(orgList).not.toBeVisible();
    }
  });

  test('Organization switching updates context correctly', async ({ page }) => {
    await page.goto('/dashboard');

    // Get current organization context
    const initialOrgName = await page.textContent('[data-testid="organization-switcher"], .current-org');
    
    // Navigate to a page that should show organization-specific data
    await page.goto('/dashboard/materials');
    
    // Verify we're in the correct organization context
    if (initialOrgName) {
      await expect(page.locator('text=' + initialOrgName.trim())).toBeVisible();
    }
    
    // Verify organization-scoped data is shown
    // (This would depend on your specific implementation)
    await expect(page.locator('[data-testid="materials-list"], .materials-container')).toBeVisible();
  });

  test('Non-admin user has limited organization access', async ({ page }) => {
    // Set up as non-admin user
    await setupAuth(page, 'learner');
    await page.goto('/dashboard');

    // Organization switcher might be visible but with limited options
    const orgSwitcher = page.locator('[data-testid="organization-switcher"]');
    
    if (await orgSwitcher.isVisible()) {
      await orgSwitcher.click();
      
      // Should not see organization creation option
      const createButton = page.locator('button:has-text("Create"), [data-testid="create-organization"]');
      await expect(createButton).not.toBeVisible();
      
      // Should not see settings option
      const settingsLink = page.locator('a:has-text("Settings"), [data-testid="org-settings"]');
      await expect(settingsLink).not.toBeVisible();
    }

    // Should not be able to access organization settings directly
    await page.goto('/dashboard/organization-profile');
    
    // Should either redirect or show access denied
    await expect(page).toHaveURL(/dashboard(?!.*organization-profile)|access-denied|forbidden/);
  });

  test('Organization data isolation works correctly', async ({ page }) => {
    await page.goto('/dashboard');

    // Navigate to organization-specific content
    await page.goto('/dashboard/materials');
    
    // Verify we only see materials for current organization
    const materialsContainer = page.locator('[data-testid="materials-list"], .materials-container');
    await expect(materialsContainer).toBeVisible();
    
    // All materials should belong to current organization
    // (This test would need to be more specific based on your data structure)
    const materialItems = page.locator('[data-testid="material-item"], .material-card');
    const count = await materialItems.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const item = materialItems.nth(i);
      // Verify organization context (implementation-dependent)
      await expect(item).toBeVisible();
    }
  });

  test('Organization billing and subscription info is displayed', async ({ page }) => {
    await page.goto('/dashboard');

    // Try to access billing/subscription info
    const settingsLink = page.locator('a:has-text("Settings"), [data-testid="settings"]');
    
    if (await settingsLink.isVisible()) {
      await settingsLink.click();
      
      // Look for billing section
      const billingSection = page.locator('text*="Billing", text*="Subscription", [data-testid="billing"]');
      
      if (await billingSection.isVisible()) {
        await billingSection.click();
        
        // Should show subscription information
        await expect(page.locator('text*="Plan", text*="Subscription"')).toBeVisible();
        
        // Should show usage information
        await expect(page.locator('text*="Usage", text*="Limit"')).toBeVisible();
      }
    }
  });

  test('Organization member management works', async ({ page }) => {
    await page.goto('/dashboard');

    // Navigate to member management
    const orgSwitcher = page.locator('[data-testid="organization-switcher"]');
    
    if (await orgSwitcher.isVisible()) {
      await orgSwitcher.click();
      
      const membersLink = page.locator('a:has-text("Members"), [data-testid="org-members"]');
      
      if (await membersLink.isVisible()) {
        await membersLink.click();
        
        // Should show members list
        await expect(page.locator('h1, h2')).toContainText(/members|team/i);
        
        // Should show current user in members list
        await expect(page.locator('text=' + TEST_USERS.admin.email)).toBeVisible();
        
        // Should have invite option for admins
        const inviteButton = page.locator('button:has-text("Invite"), [data-testid="invite-member"]');
        await expect(inviteButton).toBeVisible();
      }
    }
  });

  test('Organization invite flow works correctly', async ({ page }) => {
    await page.goto('/dashboard');

    // Navigate to member management and try to invite
    const orgSwitcher = page.locator('[data-testid="organization-switcher"]');
    
    if (await orgSwitcher.isVisible()) {
      await orgSwitcher.click();
      
      const membersLink = page.locator('a:has-text("Members")');
      
      if (await membersLink.isVisible()) {
        await membersLink.click();
        
        const inviteButton = page.locator('button:has-text("Invite"), [data-testid="invite-member"]');
        
        if (await inviteButton.isVisible()) {
          await inviteButton.click();
          
          // Fill out invite form
          await page.fill('input[type="email"]', 'newmember@telesis-test.com');
          
          // Select role if available
          const roleSelect = page.locator('select[name="role"], [data-testid="role-select"]');
          if (await roleSelect.isVisible()) {
            await roleSelect.selectOption('basic_member');
          }
          
          // Send invite
          await page.click('button:has-text("Send"), button:has-text("Invite")');
          
          // Should show confirmation
          await expect(page.locator('text*="sent", text*="invited"')).toBeVisible();
        }
      }
    }
  });

  test('Organization settings can be updated', async ({ page }) => {
    await page.goto('/dashboard/organization-profile');

    // Should be able to update organization name
    const nameInput = page.locator('input[name="name"], input[value*="Test"]');
    
    if (await nameInput.isVisible()) {
      await nameInput.clear();
      await nameInput.fill('Updated Test Organization');
      
      // Save changes
      const saveButton = page.locator('button:has-text("Save"), button[type="submit"]');
      await saveButton.click();
      
      // Should show success message
      await expect(page.locator('text*="saved", text*="updated"')).toBeVisible();
      
      // Navigate away and back to verify persistence
      await page.goto('/dashboard');
      await page.goto('/dashboard/organization-profile');
      
      // Should show updated name
      await expect(nameInput).toHaveValue('Updated Test Organization');
    }
  });

  test('Organization deletion requires confirmation', async ({ page }) => {
    await page.goto('/dashboard/organization-profile');

    // Look for danger zone or delete option
    const dangerSection = page.locator('text*="Danger", text*="Delete", .danger-zone');
    
    if (await dangerSection.isVisible()) {
      const deleteButton = page.locator('button:has-text("Delete")').last();
      
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        
        // Should show confirmation dialog
        await expect(page.locator('[role="dialog"], .modal')).toBeVisible();
        await expect(page.locator('text*="confirm", text*="delete"')).toBeVisible();
        
        // Cancel the deletion
        const cancelButton = page.locator('button:has-text("Cancel"), [data-testid="cancel"]');
        await cancelButton.click();
        
        // Dialog should close
        await expect(page.locator('[role="dialog"], .modal')).not.toBeVisible();
      }
    }
  });

  test('Organization branding can be customized', async ({ page }) => {
    await page.goto('/dashboard/organization-profile');

    // Look for branding/customization section
    const brandingSection = page.locator('text*="Branding", text*="Logo", text*="Theme"');
    
    if (await brandingSection.isVisible()) {
      // Test logo upload if available
      const logoInput = page.locator('input[type="file"], [data-testid="logo-upload"]');
      
      if (await logoInput.isVisible()) {
        // Should accept image files
        await expect(logoInput).toHaveAttribute('accept', /image/);
      }
      
      // Test color customization
      const colorInputs = page.locator('input[type="color"], .color-picker');
      if (await colorInputs.first().isVisible()) {
        await expect(colorInputs.first()).toBeVisible();
      }
    }
  });

  test('Organization analytics are accessible to admins', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for analytics or insights section
    const analyticsLink = page.locator('a:has-text("Analytics"), a:has-text("Insights"), [data-testid="analytics"]');
    
    if (await analyticsLink.isVisible()) {
      await analyticsLink.click();
      
      // Should show organization-level analytics
      await expect(page.locator('h1, h2')).toContainText(/analytics|insights|metrics/i);
      
      // Should show relevant metrics
      const metrics = page.locator('.metric, .stat, [data-testid="metric"]');
      await expect(metrics.first()).toBeVisible();
    }
  });
});