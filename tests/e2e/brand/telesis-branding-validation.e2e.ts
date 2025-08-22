import { expect, test } from '@playwright/test';

test.describe('Telesis Branding E2E Validation', () => {
  test.describe('Landing Page Branding', () => {
    test('should display correct Telesis branding on landing page', async ({ page }) => {
      await page.goto('/');

      // Check page title
      await expect(page).toHaveTitle(/Telesis.*AI-Powered Micro-Learning Platform/);

      // Check hero section
      await expect(page.locator('h1, h2').filter({ hasText: /Transform training into.*micro-learning/ })).toBeVisible();
      await expect(page.getByText(/Ask\. Think\. Apply\./)).toBeVisible();

      // Check main CTAs
      await expect(page.getByRole('button', { name: /Start Learning Free/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Watch Demo/i })).toBeVisible();

      // Verify no old branding exists
      await expect(page.getByText(/SaaS Boilerplate/i)).toBeHidden();
      await expect(page.getByText(/SaaS Template/i)).toBeHidden();
      await expect(page.getByText(/Lorem ipsum/i)).toBeHidden();
    });

    test('should display Telesis features section correctly', async ({ page }) => {
      await page.goto('/');

      // Scroll to features section
      await page.locator('text=AI-Powered Learning That Adapts to You').scrollIntoViewIfNeeded();

      // Check features section title
      await expect(page.getByText(/AI-Powered Learning That Adapts to You/)).toBeVisible();
      await expect(page.getByText(/Telesis transforms traditional training content/)).toBeVisible();

      // Check specific Telesis features
      await expect(page.getByText(/Smart Upload/)).toBeVisible();
      await expect(page.getByText(/AI Micro-Modules/)).toBeVisible();
      await expect(page.getByText(/Audio Briefs/)).toBeVisible();
      await expect(page.getByText(/Visual Learning Maps/)).toBeVisible();
      await expect(page.getByText(/Practice Cards/)).toBeVisible();
      await expect(page.getByText(/Personal Learning Style/)).toBeVisible();

      // Verify feature descriptions contain Telesis-specific content
      await expect(page.getByText(/Upload any training material.*PDFs, videos, presentations/)).toBeVisible();
      await expect(page.getByText(/Break down complex content into bite-sized learning modules/)).toBeVisible();
    });

    test('should display Telesis FAQ section correctly', async ({ page }) => {
      await page.goto('/');

      // Scroll to FAQ section
      await page.locator('text=Everything You Need to Know About Telesis').scrollIntoViewIfNeeded();

      // Check FAQ section
      await expect(page.getByText(/Everything You Need to Know About Telesis/)).toBeVisible();
      await expect(page.getByText(/What types of content can I upload to Telesis/)).toBeVisible();
      await expect(page.getByText(/Telesis supports PDFs, videos.*presentations/)).toBeVisible();
      await expect(page.getByText(/How does the AI create personalized learning experiences/)).toBeVisible();
    });

    test('should display Telesis CTA section correctly', async ({ page }) => {
      await page.goto('/');

      // Scroll to CTA section
      await page.locator('text=Ready to Transform Your Learning').scrollIntoViewIfNeeded();

      // Check CTA section
      await expect(page.getByText(/Ready to Transform Your Learning/)).toBeVisible();
      await expect(page.getByText(/AI-powered micro-learning/)).toBeVisible();
      await expect(page.getByRole('button', { name: /Start Free Trial/i })).toBeVisible();
    });

    test('should have working navigation with correct Telesis links', async ({ page }) => {
      await page.goto('/');

      // Check navigation items
      await expect(page.getByRole('link', { name: /Product/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Docs/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Blog/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Community/i })).toBeVisible();

      // Check auth buttons
      await expect(page.getByRole('link', { name: /Sign In/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Sign Up/i })).toBeVisible();
    });

    test('should have footer with correct Telesis structure', async ({ page }) => {
      await page.goto('/');

      // Scroll to footer
      await page.locator('footer').scrollIntoViewIfNeeded();

      // Check footer content
      await expect(page.locator('footer').getByText(/Product/)).toBeVisible();
      await expect(page.locator('footer').getByText(/Docs/)).toBeVisible();
      await expect(page.locator('footer').getByText(/Blog/)).toBeVisible();
      await expect(page.locator('footer').getByText(/Community/)).toBeVisible();
    });
  });

  test.describe('Sign-up Flow Branding', () => {
    test('should display Telesis branding in sign-up flow', async ({ page }) => {
      await page.goto('/');

      // Click sign up button
      await page.getByRole('link', { name: /Sign Up/i }).first().click();

      // Wait for sign-up page to load
      await page.waitForURL(/sign-up/);

      // Check sign-up page title
      await expect(page).toHaveTitle(/Sign up/);

      // Verify Telesis context is maintained (check for logo or branding elements)
      // This will depend on how Clerk is configured, but we should see consistent theming
      await expect(page.locator('body')).not.toHaveText(/SaaS Boilerplate/);
      await expect(page.locator('body')).not.toHaveText(/Template/);
    });

    test('should display Telesis branding in sign-in flow', async ({ page }) => {
      await page.goto('/');

      // Click sign in button
      await page.getByRole('link', { name: /Sign In/i }).first().click();

      // Wait for sign-in page to load
      await page.waitForURL(/sign-in/);

      // Check sign-in page title
      await expect(page).toHaveTitle(/Sign in/);

      // Verify no old branding
      await expect(page.locator('body')).not.toHaveText(/SaaS Boilerplate/);
      await expect(page.locator('body')).not.toHaveText(/Template/);
    });
  });

  test.describe('Dashboard Branding (Authenticated)', () => {
    test('should display Telesis dashboard branding for authenticated users', async ({ page }) => {
      // Note: This test assumes authentication state is set up via auth setup files
      // For now, we'll test the dashboard page directly
      await page.goto('/dashboard');

      // If redirected to auth, skip this test or handle auth flow
      if (page.url().includes('sign-in')) {
        test.skip(true, 'User not authenticated - skipping dashboard test');

        return;
      }

      // Check dashboard page title
      await expect(page).toHaveTitle(/Telesis Learning Dashboard/);

      // Check dashboard header
      await expect(page.getByText(/Learning Dashboard/)).toBeVisible();
      await expect(page.getByText(/personalized learning workspace/)).toBeVisible();

      // Check onboarding content
      await expect(page.getByText(/Ready to Ask, Think, and Apply/)).toBeVisible();
      await expect(page.getByText(/AI-powered micro-learning journey/)).toBeVisible();

      // Check dashboard CTA
      await expect(page.getByRole('button', { name: /Upload Content/i })).toBeVisible();

      // Verify no old branding
      await expect(page.locator('body')).not.toHaveText(/SaaS Boilerplate/);
      await expect(page.locator('body')).not.toHaveText(/Welcome to your dashboard/);
    });

    test('should have working dashboard navigation with Telesis branding', async ({ page }) => {
      await page.goto('/dashboard');

      if (page.url().includes('sign-in')) {
        test.skip(true, 'User not authenticated - skipping dashboard navigation test');

        return;
      }

      // Check dashboard navigation items
      await expect(page.getByRole('link', { name: /Home/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Billing/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Settings/i })).toBeVisible();
    });
  });

  test.describe('Complete User Journey Validation', () => {
    test('should maintain Telesis branding throughout complete user journey', async ({ page }) => {
      // Start at landing page
      await page.goto('/');

      // Verify landing page branding
      await expect(page.getByText(/Transform training into.*micro-learning/)).toBeVisible();
      await expect(page.getByText(/Ask\. Think\. Apply\./)).toBeVisible();

      // Navigate through key sections
      await page.locator('text=AI-Powered Learning That Adapts to You').scrollIntoViewIfNeeded();

      await expect(page.getByText(/Telesis transforms traditional training/)).toBeVisible();

      await page.locator('text=Everything You Need to Know About Telesis').scrollIntoViewIfNeeded();

      await expect(page.getByText(/What types of content can I upload to Telesis/)).toBeVisible();

      await page.locator('text=Ready to Transform Your Learning').scrollIntoViewIfNeeded();

      await expect(page.getByText(/AI-powered micro-learning/)).toBeVisible();

      // Navigate to sign-up (without completing it)
      await page.getByRole('link', { name: /Sign Up/i }).first().click();
      await page.waitForURL(/sign-up/);

      // Verify no old branding throughout the journey
      await page.goBack();

      await expect(page.locator('body')).not.toHaveText(/SaaS Boilerplate/);
      await expect(page.locator('body')).not.toHaveText(/Lorem ipsum/);
    });

    test('should display consistent pricing with Telesis context', async ({ page }) => {
      await page.goto('/');

      // Look for pricing section (if visible on landing page)
      const pricingSection = page.locator('text=Choose the Perfect Plan for Your Learning Goals');
      if (await pricingSection.isVisible()) {
        await pricingSection.scrollIntoViewIfNeeded();

        await expect(page.getByText(/Choose the Perfect Plan for Your Learning Goals/)).toBeVisible();
        await expect(page.getByText(/AI transformations/i)).toBeVisible();
      }
    });
  });

  test.describe('Content Validation - No Legacy References', () => {
    test('should not contain any SaaS boilerplate references on any page', async ({ page }) => {
      const pagesToTest = ['/', '/sign-in', '/sign-up'];

      for (const pageUrl of pagesToTest) {
        await page.goto(pageUrl);

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        // Check for forbidden terms
        const forbiddenTerms = [
          'SaaS Boilerplate',
          'SaaS Template',
          'Next.js Boilerplate',
          'Lorem ipsum',
          'placeholder text',
          'sample content',
          'template content',
        ];

        for (const term of forbiddenTerms) {
          await expect(page.locator('body')).not.toHaveText(new RegExp(term, 'i'));
        }
      }
    });

    test('should have consistent Telesis tagline usage', async ({ page }) => {
      await page.goto('/');

      // Check for tagline
      await expect(page.getByText(/Ask\. Think\. Apply\./)).toBeVisible();

      // Check for consistent micro-learning messaging
      const microLearningElements = page.locator('text=micro-learning');
      const count = await microLearningElements.count();

      expect(count).toBeGreaterThan(0);
    });

    test('should have proper meta tags for Telesis', async ({ page }) => {
      await page.goto('/');

      // Check meta description
      const metaDescription = page.locator('meta[name="description"]');

      await expect(metaDescription).toHaveAttribute('content', /Transform training content into personalized micro-learning/);

      // Check title
      await expect(page).toHaveTitle(/Telesis.*AI-Powered Micro-Learning Platform/);
    });
  });

  test.describe('Accessibility with New Branding', () => {
    test('should maintain accessibility standards with Telesis content', async ({ page }) => {
      await page.goto('/');

      // Check for proper heading hierarchy
      const h1Elements = page.locator('h1');
      const h1Count = await h1Elements.count();

      expect(h1Count).toBeGreaterThanOrEqual(1);

      // Check for alt text on images (if any)
      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const ariaLabel = await img.getAttribute('aria-label');

        // Should have either alt text or aria-label
        expect(alt !== null || ariaLabel !== null).toBeTruthy();
      }

      // Check for proper button accessibility
      const buttons = page.locator('button, a[role="button"]');
      const buttonCount = await buttons.count();

      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');

        // Should have either visible text or aria-label
        expect((text && text.trim().length > 0) || ariaLabel !== null).toBeTruthy();
      }
    });

    test('should have proper color contrast with Telesis branding', async ({ page }) => {
      await page.goto('/');

      // This is a basic test - in a real scenario you'd use accessibility testing tools
      // Check that text is visible and readable
      await expect(page.getByText(/Transform training into.*micro-learning/)).toBeVisible();
      await expect(page.getByText(/Ask\. Think\. Apply\./)).toBeVisible();

      // Verify buttons have proper contrast (they should be visible and clickable)
      await expect(page.getByRole('button', { name: /Start Learning Free/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Watch Demo/i })).toBeVisible();
    });
  });

  test.describe('Performance with New Content', () => {
    test('should load Telesis landing page within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      // Should load within 5 seconds (adjust as needed)
      expect(loadTime).toBeLessThan(5000);

      // Check that core content is loaded
      await expect(page.getByText(/Transform training into.*micro-learning/)).toBeVisible();
    });

    test('should not have broken links in Telesis content', async ({ page }) => {
      await page.goto('/');

      // Get all links
      const links = page.locator('a[href]');
      const linkCount = await links.count();

      // Test a sample of internal links (not external ones)
      for (let i = 0; i < Math.min(linkCount, 10); i++) {
        const link = links.nth(i);
        const href = await link.getAttribute('href');

        if (href && href.startsWith('/')) {
          // This is an internal link - we can test it
          const response = await page.request.get(href);

          expect(response.status()).toBeLessThan(400);
        }
      }
    });
  });
});
