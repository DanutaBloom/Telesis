/**
 * Test utilities for the Telesis application
 *
 * This module provides comprehensive testing utilities including:
 * - Component testing with React Testing Library
 * - CSS and Tailwind testing utilities
 * - Modern Sage theme testing and validation
 * - Authentication mocking with Clerk
 * - Security testing for API endpoints
 * - Accessibility testing for WCAG 2.1 AA compliance
 */

// Re-export testing library utilities for convenience
export * from '@testing-library/react';
export * from '@testing-library/user-event';

// CSS and Tailwind testing utilities
export * from './cssTestUtils';

// Modern Sage theme testing utilities
export * from './themeTestUtils';

// Authentication mocking utilities
export * from './authMocks';

// Security testing utilities
export * from './securityTestUtils';

// Accessibility testing utilities
export * from './accessibilityTestUtils';

// Common test setup utilities
export { vi } from 'vitest';
