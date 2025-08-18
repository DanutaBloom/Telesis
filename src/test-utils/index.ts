/**
 * Test utilities for the Telesis application
 *
 * This module provides utilities for testing components, especially those using Tailwind CSS
 */

// Re-export testing library utilities for convenience
export * from '@testing-library/react';
export * from '@testing-library/user-event';

// CSS and Tailwind testing utilities
export * from './cssTestUtils';

// Common test setup utilities
export { vi } from 'vitest';
