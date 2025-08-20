/**
 * Security Testing Utilities
 * 
 * Comprehensive utilities for testing API endpoint security,
 * authentication flows, authorization controls, and input validation
 */

import type { NextRequest } from 'next/server';

// Security test scenarios
export const SECURITY_TEST_SCENARIOS = {
  // Authentication bypass attempts
  unauthenticated: {
    headers: {},
    description: 'Request without authentication token',
  },
  expiredToken: {
    headers: {
      'Authorization': 'Bearer expired_token_12345',
    },
    description: 'Request with expired token',
  },
  malformedToken: {
    headers: {
      'Authorization': 'Bearer malformed.token.here',
    },
    description: 'Request with malformed token',
  },
  
  // Authorization bypass attempts
  wrongOrganization: {
    headers: {
      'Authorization': 'Bearer valid_token',
      'x-organization-id': 'unauthorized_org_id',
    },
    description: 'Request for different organization',
  },
  escalatedPrivileges: {
    headers: {
      'Authorization': 'Bearer basic_member_token',
      'x-requested-role': 'admin',
    },
    description: 'Attempt to escalate privileges',
  },
  
  // Input validation attacks
  sqlInjection: {
    payload: "'; DROP TABLE users; --",
    description: 'SQL injection attempt',
  },
  xssPayload: {
    payload: '<script>alert("XSS")</script>',
    description: 'XSS payload injection',
  },
  pathTraversal: {
    payload: '../../../etc/passwd',
    description: 'Path traversal attempt',
  },
  oversizedPayload: {
    payload: 'A'.repeat(1000000), // 1MB payload
    description: 'Oversized payload attack',
  },
} as const;

// Expected security responses
export const SECURITY_RESPONSES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
  TOO_LARGE: 413,
  RATE_LIMITED: 429,
} as const;

/**
 * Test API endpoint authentication requirements
 */
export async function testEndpointAuthentication(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  payload?: any
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Test unauthenticated request
  const unauthResponse = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  
  expect(unauthResponse.status).toBe(SECURITY_RESPONSES.UNAUTHORIZED);
  
  // Test with malformed token
  const malformedResponse = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer invalid.token.format',
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  
  expect(malformedResponse.status).toBe(SECURITY_RESPONSES.UNAUTHORIZED);
}

/**
 * Test API endpoint authorization controls
 */
export async function testEndpointAuthorization(
  endpoint: string,
  validToken: string,
  invalidOrgId: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  payload?: any
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Test with wrong organization
  const wrongOrgResponse = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validToken}`,
      'x-organization-id': invalidOrgId,
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  
  expect(wrongOrgResponse.status).toBe(SECURITY_RESPONSES.FORBIDDEN);
}

/**
 * Test input validation and sanitization
 */
export async function testInputValidation(
  endpoint: string,
  token: string,
  fieldName: string,
  testPayloads: string[] = [
    SECURITY_TEST_SCENARIOS.sqlInjection.payload,
    SECURITY_TEST_SCENARIOS.xssPayload.payload,
    SECURITY_TEST_SCENARIOS.pathTraversal.payload,
  ]
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  for (const payload of testPayloads) {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        [fieldName]: payload,
      }),
    });
    
    // Should reject malicious input
    expect(response.status).toBe(SECURITY_RESPONSES.BAD_REQUEST);
    
    const responseBody = await response.json();
    expect(responseBody.error).toContain('validation');
  }
}

/**
 * Test rate limiting protection
 */
export async function testRateLimiting(
  endpoint: string,
  token: string,
  maxRequests: number = 10,
  _timeWindow: number = 60000 // 1 minute
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const requests: Promise<Response>[] = [];
  
  // Send requests rapidly
  for (let i = 0; i < maxRequests + 5; i++) {
    requests.push(
      fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
    );
  }
  
  const responses = await Promise.all(requests);
  const rateLimitedResponses = responses.filter(
    response => response.status === SECURITY_RESPONSES.RATE_LIMITED
  );
  
  // Should have rate-limited some requests
  expect(rateLimitedResponses.length).toBeGreaterThan(0);
}

/**
 * Test CORS configuration
 */
export async function testCORSHeaders(endpoint: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Test preflight request
  const preflightResponse = await fetch(`${baseUrl}${endpoint}`, {
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://malicious-site.com',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'authorization,content-type',
    },
  });
  
  const corsOrigin = preflightResponse.headers.get('Access-Control-Allow-Origin');
  
  // Should not allow arbitrary origins
  expect(corsOrigin).not.toBe('*');
  expect(corsOrigin).not.toBe('https://malicious-site.com');
}

/**
 * Test file upload security
 */
export async function testFileUploadSecurity(
  endpoint: string,
  token: string,
  maliciousFiles: { name: string; content: string; mimeType: string }[] = [
    {
      name: 'malicious.php',
      content: '<?php system($_GET["cmd"]); ?>',
      mimeType: 'application/x-php',
    },
    {
      name: 'script.exe',
      content: 'MZ\x90\x00', // PE header
      mimeType: 'application/x-executable',
    },
    {
      name: 'large-file.txt',
      content: 'A'.repeat(100 * 1024 * 1024), // 100MB
      mimeType: 'text/plain',
    },
  ]
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  for (const file of maliciousFiles) {
    const formData = new FormData();
    const blob = new Blob([file.content], { type: file.mimeType });
    formData.append('file', blob, file.name);
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    // Should reject malicious files
    expect([SECURITY_RESPONSES.BAD_REQUEST, SECURITY_RESPONSES.TOO_LARGE]).toContain(response.status);
  }
}

/**
 * Test SQL injection protection
 */
export async function testSQLInjectionProtection(
  endpoint: string,
  token: string,
  queryFields: string[] = ['id', 'search', 'filter']
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const sqlInjectionPayloads = [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "'; INSERT INTO users (email) VALUES ('hacker@evil.com'); --",
    "' UNION SELECT password FROM users --",
    "admin'--",
    "admin'/*",
    "' OR 1=1#",
  ];
  
  for (const field of queryFields) {
    for (const payload of sqlInjectionPayloads) {
      const url = new URL(`${baseUrl}${endpoint}`);
      url.searchParams.set(field, payload);
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Should not return 200 with SQL injection
      expect(response.status).not.toBe(200);
      
      // Should return proper error
      expect(response.status).toBe(SECURITY_RESPONSES.BAD_REQUEST);
    }
  }
}

/**
 * Test XSS protection
 */
export async function testXSSProtection(
  endpoint: string,
  token: string,
  textFields: string[] = ['title', 'description', 'name']
): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src="x" onerror="alert(1)">',
    '<svg onload="alert(1)">',
    'javascript:alert(1)',
    '<iframe src="javascript:alert(1)"></iframe>',
    '<object data="javascript:alert(1)"></object>',
  ];
  
  for (const field of textFields) {
    for (const payload of xssPayloads) {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          [field]: payload,
        }),
      });
      
      if (response.ok) {
        const responseText = await response.text();
        
        // Payload should be escaped/sanitized
        expect(responseText).not.toContain('<script>');
        expect(responseText).not.toContain('javascript:');
        expect(responseText).not.toContain('onerror=');
        expect(responseText).not.toContain('onload=');
      } else {
        // Or request should be rejected
        expect(response.status).toBe(SECURITY_RESPONSES.BAD_REQUEST);
      }
    }
  }
}

/**
 * Test session security
 */
export function testSessionSecurity(
  mockSession: any,
  expectedProperties: string[] = ['userId', 'orgId', 'role', 'exp']
): void {
  // Session should have required properties
  expectedProperties.forEach(prop => {
    expect(mockSession).toHaveProperty(prop);
  });
  
  // Session should have expiration
  if (mockSession.exp) {
    const now = Math.floor(Date.now() / 1000);
    expect(mockSession.exp).toBeGreaterThan(now);
  }
  
  // Session should not contain sensitive data
  const sensitiveFields = ['password', 'secretKey', 'privateKey'];
  sensitiveFields.forEach(field => {
    expect(mockSession).not.toHaveProperty(field);
  });
}

/**
 * Test password validation
 */
export function testPasswordValidation(
  passwordValidator: (password: string) => boolean | { valid: boolean; errors: string[] }
): void {
  const weakPasswords = [
    '123',
    'password',
    'abc123',
    '11111111',
    'qwerty',
    'Password1', // Common pattern
  ];
  
  const strongPasswords = [
    'MyStr0ng!P@ssw0rd',
    'C0mpl3x&S3cur3!',
    'Un1qu3$P4ssw0rd#',
  ];
  
  // Weak passwords should be rejected
  weakPasswords.forEach(password => {
    const result = passwordValidator(password);
    const isValid = typeof result === 'boolean' ? result : result.valid;
    expect(isValid).toBe(false);
  });
  
  // Strong passwords should be accepted
  strongPasswords.forEach(password => {
    const result = passwordValidator(password);
    const isValid = typeof result === 'boolean' ? result : result.valid;
    expect(isValid).toBe(true);
  });
}

/**
 * Test data sanitization
 */
export function testDataSanitization(
  sanitizeFunction: (input: string) => string,
  testCases: Array<{ input: string; expectedOutput: string }>
): void {
  testCases.forEach(({ input, expectedOutput }) => {
    const result = sanitizeFunction(input);
    expect(result).toBe(expectedOutput);
  });
}

/**
 * Mock request for security testing
 */
export function createMockRequest(
  options: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: any;
    ip?: string;
  } = {}
): NextRequest {
  const {
    method = 'GET',
    url = 'http://localhost:3000/api/test',
    headers = {},
    body,
    ip = '127.0.0.1',
  } = options;
  
  const request = new Request(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  }) as NextRequest;
  
  // Add Next.js specific properties
  Object.defineProperty(request, 'ip', { value: ip, writable: true });
  Object.defineProperty(request, 'geo', { value: { city: 'Test City' }, writable: true });
  
  return request;
}

/**
 * Test API security headers
 */
export function testSecurityHeaders(response: Response): void {
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': expect.stringContaining('default-src'),
  };
  
  Object.entries(securityHeaders).forEach(([header, expectedValue]) => {
    expect(response.headers.get(header)).toEqual(expectedValue);
  });
}

/**
 * Comprehensive security test suite for API endpoints
 */
export async function runSecurityTestSuite(
  endpoint: string,
  options: {
    testAuth?: boolean;
    testAuthorization?: boolean;
    testInputValidation?: boolean;
    testRateLimit?: boolean;
    testCORS?: boolean;
    validToken?: string;
    invalidOrgId?: string;
  } = {}
): Promise<void> {
  const {
    testAuth = true,
    testAuthorization = true,
    testInputValidation: shouldTestInputValidation = true,
    testRateLimit = false, // Skip by default as it can be slow
    testCORS = true,
    validToken = 'test_token_123',
    invalidOrgId = 'invalid_org_123',
  } = options;
  
  if (testAuth) {
    await testEndpointAuthentication(endpoint);
  }
  
  if (testAuthorization) {
    await testEndpointAuthorization(endpoint, validToken, invalidOrgId);
  }
  
  if (shouldTestInputValidation) {
    await testInputValidation(endpoint, validToken, 'testField');
    await testSQLInjectionProtection(endpoint, validToken);
    await testXSSProtection(endpoint, validToken);
  }
  
  if (testRateLimit) {
    await testRateLimiting(endpoint, validToken);
  }
  
  if (testCORS) {
    await testCORSHeaders(endpoint);
  }
}