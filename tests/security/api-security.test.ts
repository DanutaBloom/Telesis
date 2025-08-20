/**
 * API Security Validation Tests
 * CRITICAL: Tests to verify security protections are working correctly
 * Validates authentication, authorization, input validation, and security headers
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { NextRequest } from 'next/server';
import { GET as materialsGET, POST as materialsPOST } from '@/app/api/materials/route';
import { GET as organizationsGET, POST as organizationsPOST } from '@/app/api/organizations/route';

// Mock Clerk auth for testing
let mockAuth: any;

// Mock successful authentication
const mockAuthSuccess = {
  userId: 'user_test123',
  orgId: 'org_test456',
  sessionId: 'session_789',
};

// Mock failed authentication
const mockAuthFail = null;

beforeAll(async () => {
  // Mock Clerk's auth function
  const { auth } = await import('@clerk/nextjs/server');
  mockAuth = auth as any;
});

describe('API Security - Authentication Tests', () => {
  it('should reject unauthenticated requests to /api/materials GET', async () => {
    // Mock auth to return null (unauthenticated)
    mockAuth.mockResolvedValueOnce(mockAuthFail);

    const request = new Request('http://localhost:3000/api/materials', {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });

    const response = await materialsGET(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Authentication required');
    expect(data.code).toBe('UNAUTHORIZED');
    expect(response.headers.get('WWW-Authenticate')).toBe('Bearer');
  });

  it('should reject unauthenticated requests to /api/materials POST', async () => {
    // Mock auth to return null (unauthenticated)
    mockAuth.mockResolvedValueOnce(mockAuthFail);

    const request = new Request('http://localhost:3000/api/materials', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        organizationId: 'org_test',
        trainerId: 'user_test',
        title: 'Test Material',
        fileType: 'pdf',
        originalUri: 'https://example.com/file.pdf',
      }),
    });

    const response = await materialsPOST(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Authentication required');
  });

  it('should reject unauthenticated requests to /api/organizations GET', async () => {
    // Mock auth to return null (unauthenticated)
    mockAuth.mockResolvedValueOnce(mockAuthFail);

    const request = new Request('http://localhost:3000/api/organizations', {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });

    const response = await organizationsGET(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Authentication required');
  });

  it('should reject unauthenticated requests to /api/organizations POST', async () => {
    // Mock auth to return null (unauthenticated)
    mockAuth.mockResolvedValueOnce(mockAuthFail);

    const request = new Request('http://localhost:3000/api/organizations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        id: 'org_test',
        stripeCustomerId: 'cus_test123',
      }),
    });

    const response = await organizationsPOST(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Authentication required');
  });
});

describe('API Security - Authorization Tests', () => {
  it('should prevent cross-tenant access in materials GET', async () => {
    // Mock auth to return valid auth but different org
    mockAuth.mockResolvedValueOnce({
      userId: 'user_test123',
      orgId: 'org_user456', // User's org
      sessionId: 'session_789',
    });

    // Try to access materials from different organization
    const request = new Request('http://localhost:3000/api/materials?organizationId=org_different789', {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });

    const response = await materialsGET(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Cannot access materials from other organizations');
    expect(data.code).toBe('FORBIDDEN_CROSS_TENANT_ACCESS');
  });

  it('should prevent cross-tenant creation in materials POST', async () => {
    // Mock auth to return valid auth
    mockAuth.mockResolvedValueOnce({
      userId: 'user_test123',
      orgId: 'org_user456', // User's org
      sessionId: 'session_789',
    });

    const request = new Request('http://localhost:3000/api/materials', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        organizationId: 'org_different789', // Try to create for different org
        trainerId: 'user_test123',
        title: 'Test Material',
        fileType: 'pdf',
        originalUri: 'https://example.com/file.pdf',
      }),
    });

    const response = await materialsPOST(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Cannot create materials for other organizations');
    expect(data.code).toBe('FORBIDDEN_CROSS_TENANT_CREATE');
  });

  it('should prevent trainer impersonation in materials POST', async () => {
    // Mock auth to return valid auth
    mockAuth.mockResolvedValueOnce({
      userId: 'user_test123',
      orgId: 'org_user456',
      sessionId: 'session_789',
    });

    const request = new Request('http://localhost:3000/api/materials', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        organizationId: 'org_user456',
        trainerId: 'user_different999', // Try to create as different trainer
        title: 'Test Material',
        fileType: 'pdf',
        originalUri: 'https://example.com/file.pdf',
      }),
    });

    const response = await materialsPOST(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Cannot create materials for other trainers');
    expect(data.code).toBe('FORBIDDEN_IMPERSONATION');
  });
});

describe('API Security - Input Validation Tests', () => {
  it('should reject materials POST with invalid content-type', async () => {
    // Mock auth to return valid auth
    mockAuth.mockResolvedValueOnce(mockAuthSuccess);

    const request = new Request('http://localhost:3000/api/materials', {
      method: 'POST',
      headers: { 'content-type': 'text/plain' }, // Invalid content type
      body: 'invalid body',
    });

    const response = await materialsPOST(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Content-Type must be application/json');
  });

  it('should reject materials POST with invalid JSON', async () => {
    // Mock auth to return valid auth
    mockAuth.mockResolvedValueOnce(mockAuthSuccess);

    const request = new Request('http://localhost:3000/api/materials', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'invalid json{',
    });

    const response = await materialsPOST(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Invalid JSON format');
  });

  it('should reject materials POST with XSS attempt in title', async () => {
    // Mock auth to return valid auth
    mockAuth.mockResolvedValueOnce(mockAuthSuccess);

    const request = new Request('http://localhost:3000/api/materials', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        organizationId: mockAuthSuccess.orgId,
        trainerId: mockAuthSuccess.userId,
        title: '<script>alert("XSS")</script>Test Material', // XSS attempt
        fileType: 'pdf',
        originalUri: 'https://example.com/file.pdf',
      }),
    });

    const response = await materialsPOST(request as NextRequest);
    
    if (response.status === 200 || response.status === 201) {
      const data = await response.json();
      // Verify XSS was sanitized
      expect(data.data.title).not.toContain('<script>');
      expect(data.data.title).toBe('Test Material'); // HTML tags should be stripped
    }
  });

  it('should reject materials POST with missing required fields', async () => {
    // Mock auth to return valid auth
    mockAuth.mockResolvedValueOnce(mockAuthSuccess);

    const request = new Request('http://localhost:3000/api/materials', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        organizationId: mockAuthSuccess.orgId,
        // Missing required fields: trainerId, title, fileType, originalUri
      }),
    });

    const response = await materialsPOST(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Invalid request data');
    expect(data.details).toBeTruthy();
  });

  it('should reject materials POST with invalid file type', async () => {
    // Mock auth to return valid auth
    mockAuth.mockResolvedValueOnce(mockAuthSuccess);

    const request = new Request('http://localhost:3000/api/materials', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        organizationId: mockAuthSuccess.orgId,
        trainerId: mockAuthSuccess.userId,
        title: 'Test Material',
        fileType: 'malicious_exe', // Invalid file type
        originalUri: 'https://example.com/file.pdf',
      }),
    });

    const response = await materialsPOST(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.details).toContain('Invalid file type');
  });

  it('should reject materials POST with excessive file size', async () => {
    // Mock auth to return valid auth
    mockAuth.mockResolvedValueOnce(mockAuthSuccess);

    const request = new Request('http://localhost:3000/api/materials', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        organizationId: mockAuthSuccess.orgId,
        trainerId: mockAuthSuccess.userId,
        title: 'Test Material',
        fileType: 'pdf',
        originalUri: 'https://example.com/file.pdf',
        fileSize: 2 * 1024 * 1024 * 1024, // 2GB - exceeds 1GB limit
      }),
    });

    const response = await materialsPOST(request as NextRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.details).toContain('File size cannot exceed 1GB');
  });
});

describe('API Security - Security Headers Tests', () => {
  it('should include security headers in materials GET response', async () => {
    // Mock auth to return valid auth
    mockAuth.mockResolvedValueOnce(mockAuthSuccess);

    const request = new Request('http://localhost:3000/api/materials', {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });

    const response = await materialsGET(request as NextRequest);

    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
    expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(response.headers.get('Cache-Control')).toBe('no-store, no-cache, must-revalidate');
    expect(response.headers.get('Pragma')).toBe('no-cache');
  });

  it('should include security headers in materials POST response', async () => {
    // Mock auth to return valid auth
    mockAuth.mockResolvedValueOnce(mockAuthSuccess);

    const request = new Request('http://localhost:3000/api/materials', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        organizationId: mockAuthSuccess.orgId,
        trainerId: mockAuthSuccess.userId,
        title: 'Test Material',
        fileType: 'pdf',
        originalUri: 'https://example.com/file.pdf',
      }),
    });

    const response = await materialsPOST(request as NextRequest);

    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
  });

  it('should include security headers in organizations GET response', async () => {
    // Mock auth to return valid auth
    mockAuth.mockResolvedValueOnce(mockAuthSuccess);

    const request = new Request('http://localhost:3000/api/organizations', {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });

    const response = await organizationsGET(request as NextRequest);

    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
  });
});

describe('API Security - Rate Limiting Tests', () => {
  it('should apply rate limiting to materials GET requests', async () => {
    const requests = [];
    
    // Make multiple requests rapidly
    for (let i = 0; i < 55; i++) { // Exceeds limit of 50 per minute
      mockAuth.mockResolvedValueOnce(mockAuthSuccess);
      
      const request = new Request('http://localhost:3000/api/materials', {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      });
      
      requests.push(materialsGET(request as NextRequest));
    }
    
    const responses = await Promise.all(requests);
    const lastResponse = responses[responses.length - 1];
    const data = await lastResponse.json();
    
    // Should eventually hit rate limit
    expect(lastResponse.status).toBe(429);
    expect(data.error).toContain('Rate limit exceeded');
    expect(lastResponse.headers.get('Retry-After')).toBeTruthy();
  });

  it('should apply stricter rate limiting to organizations POST requests', async () => {
    const requests = [];
    
    // Make multiple requests rapidly
    for (let i = 0; i < 5; i++) { // Exceeds limit of 2 per 5 minutes
      mockAuth.mockResolvedValueOnce(mockAuthSuccess);
      
      const request = new Request('http://localhost:3000/api/organizations', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          id: `org_test_${i}`,
          stripeCustomerId: `cus_test${i}`,
        }),
      });
      
      requests.push(organizationsPOST(request as NextRequest));
    }
    
    const responses = await Promise.all(requests);
    const lastResponse = responses[responses.length - 1];
    const data = await lastResponse.json();
    
    // Should hit rate limit
    expect(lastResponse.status).toBe(429);
    expect(data.error).toContain('Rate limit exceeded');
    expect(data.error).toContain('Organization creation is limited');
  });
});

afterAll(() => {
  // Reset mocks
  mockAuth?.mockRestore?.();
});