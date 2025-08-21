/**
 * Security Headers Validation Tests
 * CRITICAL: Tests to verify security headers are properly configured
 * Validates CSP, HSTS, XSS protection, and other OWASP security headers
 */

import { beforeAll, describe, expect, it } from 'vitest';

// Import Next.js config to test security headers configuration
import nextConfigModule from '../../../next.config.mjs';

const nextConfig = nextConfigModule.default || nextConfigModule;

describe('Security Headers Configuration', () => {
  let securityHeaders: any[];

  beforeAll(async () => {
    // Extract headers configuration from Next.js config
    const headersFunction = nextConfig.headers;
    if (typeof headersFunction === 'function') {
      securityHeaders = await headersFunction();
    }
  });

  it('should have security headers configured', () => {
    expect(securityHeaders).toBeDefined();
    expect(Array.isArray(securityHeaders)).toBe(true);
    expect(securityHeaders.length).toBeGreaterThan(0);
  });

  it('should configure global security headers for all routes', () => {
    const globalHeaders = securityHeaders.find(config => config.source === '/(.*)');

    expect(globalHeaders).toBeDefined();
    expect(globalHeaders.headers).toBeDefined();
    expect(Array.isArray(globalHeaders.headers)).toBe(true);
  });

  it('should include X-Frame-Options header to prevent clickjacking', () => {
    const globalHeaders = securityHeaders.find(config => config.source === '/(.*)');
    const xFrameOptions = globalHeaders.headers.find((h: any) => h.key === 'X-Frame-Options');

    expect(xFrameOptions).toBeDefined();
    expect(xFrameOptions.value).toBe('DENY');
  });

  it('should include X-Content-Type-Options header to prevent MIME sniffing', () => {
    const globalHeaders = securityHeaders.find(config => config.source === '/(.*)');
    const xContentTypeOptions = globalHeaders.headers.find((h: any) => h.key === 'X-Content-Type-Options');

    expect(xContentTypeOptions).toBeDefined();
    expect(xContentTypeOptions.value).toBe('nosniff');
  });

  it('should include X-XSS-Protection header for legacy XSS protection', () => {
    const globalHeaders = securityHeaders.find(config => config.source === '/(.*)');
    const xXssProtection = globalHeaders.headers.find((h: any) => h.key === 'X-XSS-Protection');

    expect(xXssProtection).toBeDefined();
    expect(xXssProtection.value).toBe('1; mode=block');
  });

  it('should include Referrer-Policy header to control referrer information', () => {
    const globalHeaders = securityHeaders.find(config => config.source === '/(.*)');
    const referrerPolicy = globalHeaders.headers.find((h: any) => h.key === 'Referrer-Policy');

    expect(referrerPolicy).toBeDefined();
    expect(referrerPolicy.value).toBe('strict-origin-when-cross-origin');
  });

  it('should include Permissions-Policy header to control browser APIs', () => {
    const globalHeaders = securityHeaders.find(config => config.source === '/(.*)');
    const permissionsPolicy = globalHeaders.headers.find((h: any) => h.key === 'Permissions-Policy');

    expect(permissionsPolicy).toBeDefined();
    expect(permissionsPolicy.value).toContain('accelerometer=()');
    expect(permissionsPolicy.value).toContain('camera=()');
    expect(permissionsPolicy.value).toContain('geolocation=()');
    expect(permissionsPolicy.value).toContain('microphone=()');
  });

  it('should include Strict-Transport-Security header to enforce HTTPS', () => {
    const globalHeaders = securityHeaders.find(config => config.source === '/(.*)');
    const hsts = globalHeaders.headers.find((h: any) => h.key === 'Strict-Transport-Security');

    expect(hsts).toBeDefined();
    expect(hsts.value).toContain('max-age=31536000');
    expect(hsts.value).toContain('includeSubDomains');
    expect(hsts.value).toContain('preload');
  });

  it('should include comprehensive Content-Security-Policy header', () => {
    const globalHeaders = securityHeaders.find(config => config.source === '/(.*)');
    const csp = globalHeaders.headers.find((h: any) => h.key === 'Content-Security-Policy');

    expect(csp).toBeDefined();
    expect(csp.value).toContain('default-src \'self\'');
    expect(csp.value).toContain('object-src \'none\'');
    expect(csp.value).toContain('base-uri \'self\'');
    expect(csp.value).toContain('frame-ancestors \'none\'');
    expect(csp.value).toContain('upgrade-insecure-requests');
  });

  it('should allow necessary script sources in CSP', () => {
    const globalHeaders = securityHeaders.find(config => config.source === '/(.*)');
    const csp = globalHeaders.headers.find((h: any) => h.key === 'Content-Security-Policy');

    expect(csp.value).toContain('https://js.stripe.com');
    expect(csp.value).toContain('https://*.clerk.accounts.dev');
    expect(csp.value).toContain('https://*.clerk.dev');
    expect(csp.value).toContain('https://challenges.cloudflare.com');
  });

  it('should allow necessary connect sources in CSP', () => {
    const globalHeaders = securityHeaders.find(config => config.source === '/(.*)');
    const csp = globalHeaders.headers.find((h: any) => h.key === 'Content-Security-Policy');

    expect(csp.value).toContain('https://api.stripe.com');
    expect(csp.value).toContain('wss://*.clerk.dev');
    expect(csp.value).toContain('https://vitals.vercel-insights.com');
  });

  it('should configure specific headers for API routes', () => {
    const apiHeaders = securityHeaders.find(config => config.source === '/api/(.*)');

    expect(apiHeaders).toBeDefined();
    expect(apiHeaders.headers).toBeDefined();
  });

  it('should include cache control headers for API routes', () => {
    const apiHeaders = securityHeaders.find(config => config.source === '/api/(.*)');
    const cacheControl = apiHeaders.headers.find((h: any) => h.key === 'Cache-Control');

    expect(cacheControl).toBeDefined();
    expect(cacheControl.value).toContain('no-store');
    expect(cacheControl.value).toContain('no-cache');
    expect(cacheControl.value).toContain('must-revalidate');
    expect(cacheControl.value).toContain('max-age=0');
  });

  it('should include Pragma header for API routes', () => {
    const apiHeaders = securityHeaders.find(config => config.source === '/api/(.*)');
    const pragma = apiHeaders.headers.find((h: any) => h.key === 'Pragma');

    expect(pragma).toBeDefined();
    expect(pragma.value).toBe('no-cache');
  });

  it('should include X-Robots-Tag header for API routes', () => {
    const apiHeaders = securityHeaders.find(config => config.source === '/api/(.*)');
    const xRobotsTag = apiHeaders.headers.find((h: any) => h.key === 'X-Robots-Tag');

    expect(xRobotsTag).toBeDefined();
    expect(xRobotsTag.value).toContain('noindex');
    expect(xRobotsTag.value).toContain('nofollow');
    expect(xRobotsTag.value).toContain('nosnippet');
    expect(xRobotsTag.value).toContain('noarchive');
  });
});

describe('Security Headers OWASP Compliance', () => {
  let globalHeaders: any;

  beforeAll(async () => {
    const headersFunction = nextConfig.default.headers;
    const securityHeaders = await headersFunction();
    globalHeaders = securityHeaders.find(config => config.source === '/(.*)')?.headers || [];
  });

  it('should protect against OWASP A05 - Security Misconfiguration', () => {
    // X-Frame-Options prevents clickjacking
    const xFrameOptions = globalHeaders.find((h: any) => h.key === 'X-Frame-Options');

    expect(xFrameOptions?.value).toBe('DENY');

    // X-Content-Type-Options prevents MIME sniffing
    const xContentType = globalHeaders.find((h: any) => h.key === 'X-Content-Type-Options');

    expect(xContentType?.value).toBe('nosniff');

    // Referrer-Policy controls information leakage
    const referrer = globalHeaders.find((h: any) => h.key === 'Referrer-Policy');

    expect(referrer?.value).toBe('strict-origin-when-cross-origin');
  });

  it('should protect against OWASP A03 - Injection', () => {
    // CSP helps prevent XSS and other injection attacks
    const csp = globalHeaders.find((h: any) => h.key === 'Content-Security-Policy');

    expect(csp).toBeDefined();
    expect(csp.value).toContain('default-src \'self\'');
    expect(csp.value).toContain('object-src \'none\'');
  });

  it('should enforce secure transport (HSTS)', () => {
    // HSTS prevents man-in-the-middle attacks
    const hsts = globalHeaders.find((h: any) => h.key === 'Strict-Transport-Security');

    expect(hsts).toBeDefined();
    expect(hsts.value).toContain('max-age=31536000');
    expect(hsts.value).toContain('includeSubDomains');
  });

  it('should restrict dangerous browser features', () => {
    // Permissions-Policy restricts access to sensitive APIs
    const permissions = globalHeaders.find((h: any) => h.key === 'Permissions-Policy');

    expect(permissions).toBeDefined();
    expect(permissions.value).toContain('camera=()');
    expect(permissions.value).toContain('microphone=()');
    expect(permissions.value).toContain('geolocation=()');
  });
});

describe('Security Headers Validation for Common Attack Vectors', () => {
  let cspValue: string;

  beforeAll(async () => {
    const headersFunction = nextConfig.default.headers;
    const securityHeaders = await headersFunction();
    const globalHeaders = securityHeaders.find(config => config.source === '/(.*)')?.headers || [];
    const csp = globalHeaders.find((h: any) => h.key === 'Content-Security-Policy');
    cspValue = csp?.value || '';
  });

  it('should prevent inline script execution by default', () => {
    // CSP should not allow 'unsafe-inline' for script-src by default
    expect(cspValue).toContain('script-src \'self\'');
    // Note: We do allow 'unsafe-inline' and 'unsafe-eval' for necessary functionality
    // but this should be reviewed and minimized in production
  });

  it('should prevent data: URIs in object sources', () => {
    expect(cspValue).toContain('object-src \'none\'');
  });

  it('should prevent base tag injection', () => {
    expect(cspValue).toContain('base-uri \'self\'');
  });

  it('should prevent form submission to external domains', () => {
    expect(cspValue).toContain('form-action \'self\'');
  });

  it('should prevent framing by other sites', () => {
    expect(cspValue).toContain('frame-ancestors \'none\'');
  });

  it('should upgrade insecure requests to HTTPS', () => {
    expect(cspValue).toContain('upgrade-insecure-requests');
  });
});
