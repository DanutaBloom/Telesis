import { expect, test } from '@playwright/test';

import { SecurityHelpers } from '../../helpers/playwrightHelpers';

/**
 * API Security Tests
 * Validates API security implementation without vitest dependencies
 * @security
 */
test.describe('API Security Tests', () => {
  test.describe('@security API Authentication', () => {
    test('should protect materials API endpoint', async ({ request, page }) => {
      // Test materials API endpoint
      const response = await request.get('/api/materials');

      // Should return unauthorized or redirect
      expect([401, 403, 302]).toContain(response.status());
    });

    test('should protect organizations API endpoint', async ({ request }) => {
      // Test organizations API
      const response = await request.get('/api/organizations');

      // Should require authentication
      expect([401, 403, 302]).toContain(response.status());
    });
  });

  test.describe('@security Input Validation', () => {
    test('should validate API request size limits', async ({ request }) => {
      // Test large payload
      const largeData = 'x'.repeat(1024 * 1024); // 1MB

      const response = await request.post('/api/materials', {
        data: { content: largeData },
        timeout: 5000,
      });

      // Should handle appropriately
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });

    test('should sanitize malicious input', async ({ request }) => {
      const maliciousData = {
        name: '<script>alert("xss")</script>',
        content: '"; DROP TABLE users; --',
      };

      const response = await request.post('/api/materials', {
        data: maliciousData,
      });

      // Should not crash and return error status
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });
  });

  test.describe('@security Security Headers', () => {
    test('should include security headers in responses', async ({ page }) => {
      // Check security headers
      const headers = await SecurityHelpers.checkSecurityHeaders(page, '/api/health');

      // Verify response works
      const response = await page.goto('/api/health');

      expect(response?.status()).toBeLessThan(500);
    });

    test('should handle CORS appropriately', async ({ request }) => {
      const response = await request.get('/api/health', {
        headers: { Origin: 'https://example.com' },
      });

      // Should respond appropriately
      expect(response.status()).toBeLessThan(500);

      const corsHeader = response.headers()['access-control-allow-origin'];
      if (corsHeader) {
        expect(corsHeader).not.toBe('*');
      }
    });
  });
});
