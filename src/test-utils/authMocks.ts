/**
 * Clerk Authentication Mocking Utilities
 * 
 * Provides comprehensive mocking for Clerk authentication in tests,
 * including security scenarios and multi-tenant organization testing
 */

import { vi } from 'vitest';
import type { User, Organization } from '@clerk/nextjs/server';

// Test user data types
export interface TestUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role?: 'admin' | 'member' | 'trainer' | 'learner';
}

export interface TestOrganization {
  id: string;
  name: string;
  slug: string;
  role: 'admin' | 'basic_member';
}

// Default test users
export const TEST_USERS = {
  admin: {
    id: 'user_admin_123',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    emailAddress: 'admin@test.com',
    role: 'admin' as const,
  },
  trainer: {
    id: 'user_trainer_123',
    username: 'trainer',
    firstName: 'Trainer',
    lastName: 'User',
    emailAddress: 'trainer@test.com',
    role: 'trainer' as const,
  },
  learner: {
    id: 'user_learner_123',
    username: 'learner',
    firstName: 'Learner',
    lastName: 'User',
    emailAddress: 'learner@test.com',
    role: 'learner' as const,
  },
} as const;

// Default test organizations
export const TEST_ORGANIZATIONS = {
  primary: {
    id: 'org_primary_123',
    name: 'Primary Test Organization',
    slug: 'primary-test-org',
    role: 'admin' as const,
  },
  secondary: {
    id: 'org_secondary_123',
    name: 'Secondary Test Organization',
    slug: 'secondary-test-org',
    role: 'basic_member' as const,
  },
} as const;

/**
 * Create mock authentication state
 */
export function createMockAuth({
  isSignedIn = true,
  isLoaded = true,
  user = TEST_USERS.admin,
  organization = TEST_ORGANIZATIONS.primary,
}: {
  isSignedIn?: boolean;
  isLoaded?: boolean;
  user?: TestUser;
  organization?: TestOrganization;
} = {}) {
  return {
    isLoaded,
    isSignedIn,
    userId: isSignedIn ? user.id : null,
    sessionId: isSignedIn ? `session_${user.id}` : null,
    orgId: isSignedIn && organization ? organization.id : null,
    orgRole: isSignedIn && organization ? organization.role : null,
    orgSlug: isSignedIn && organization ? organization.slug : null,
    signOut: vi.fn(() => Promise.resolve()),
    getToken: vi.fn(() => Promise.resolve('mock_token_123')),
  };
}

/**
 * Create mock user object
 */
export function createMockUser(userData: TestUser) {
  return {
    id: userData.id,
    username: userData.username,
    firstName: userData.firstName,
    lastName: userData.lastName,
    emailAddresses: [{
      id: `email_${userData.id}`,
      emailAddress: userData.emailAddress,
      verification: { status: 'verified' },
    }],
    organizationMemberships: [
      {
        organization: TEST_ORGANIZATIONS.primary,
        role: userData.role || 'member',
      },
    ],
    publicMetadata: {
      role: userData.role || 'member',
    },
    privateMetadata: {},
    unsafeMetadata: {},
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  };
}

/**
 * Create mock organization object  
 */
export function createMockOrganization(orgData: TestOrganization) {
  return {
    id: orgData.id,
    name: orgData.name,
    slug: orgData.slug,
    imageUrl: '',
    hasImage: false,
    membersCount: 1,
    pendingInvitationsCount: 0,
    publicMetadata: {},
    privateMetadata: {},
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  };
}

/**
 * Mock Clerk hooks for authenticated state
 */
export function mockAuthenticatedState({
  user = TEST_USERS.admin,
  organization = TEST_ORGANIZATIONS.primary,
}: {
  user?: TestUser;
  organization?: TestOrganization;
} = {}) {
  const mockAuth = createMockAuth({ isSignedIn: true, user, organization });
  const mockUser = createMockUser(user);
  const mockOrg = createMockOrganization(organization);

  vi.mocked(require('@clerk/nextjs')).useAuth.mockReturnValue(mockAuth);
  vi.mocked(require('@clerk/nextjs')).useUser.mockReturnValue({
    isLoaded: true,
    isSignedIn: true,
    user: mockUser,
  });
  vi.mocked(require('@clerk/nextjs')).useOrganization.mockReturnValue({
    isLoaded: true,
    organization: mockOrg,
    membership: {
      role: organization.role,
      permissions: organization.role === 'admin' ? ['org:manage'] : [],
    },
  });

  return { mockAuth, mockUser, mockOrg };
}

/**
 * Mock Clerk hooks for unauthenticated state
 */
export function mockUnauthenticatedState() {
  const mockAuth = createMockAuth({ isSignedIn: false });

  vi.mocked(require('@clerk/nextjs')).useAuth.mockReturnValue(mockAuth);
  vi.mocked(require('@clerk/nextjs')).useUser.mockReturnValue({
    isLoaded: true,
    isSignedIn: false,
    user: null,
  });
  vi.mocked(require('@clerk/nextjs')).useOrganization.mockReturnValue({
    isLoaded: true,
    organization: null,
    membership: null,
  });

  return mockAuth;
}

/**
 * Mock loading state (useful for testing loading UI)
 */
export function mockLoadingState() {
  const mockAuth = createMockAuth({ isLoaded: false, isSignedIn: false });

  vi.mocked(require('@clerk/nextjs')).useAuth.mockReturnValue(mockAuth);
  vi.mocked(require('@clerk/nextjs')).useUser.mockReturnValue({
    isLoaded: false,
    isSignedIn: false,
    user: undefined,
  });
  vi.mocked(require('@clerk/nextjs')).useOrganization.mockReturnValue({
    isLoaded: false,
    organization: undefined,
    membership: undefined,
  });

  return mockAuth;
}

/**
 * Mock organization switching scenarios
 */
export function mockOrganizationSwitch(
  from: TestOrganization,
  to: TestOrganization,
  user: TestUser = TEST_USERS.admin,
) {
  const mockAuth = createMockAuth({ user, organization: to });
  const mockUser = createMockUser(user);
  const mockToOrg = createMockOrganization(to);

  // Mock the organization switch
  const setActive = vi.fn().mockResolvedValue(undefined);

  vi.mocked(require('@clerk/nextjs')).useAuth.mockReturnValue({
    ...mockAuth,
    setActive,
  });
  
  vi.mocked(require('@clerk/nextjs')).useOrganization.mockReturnValue({
    isLoaded: true,
    organization: mockToOrg,
    membership: {
      role: to.role,
      permissions: to.role === 'admin' ? ['org:manage'] : [],
    },
    setActive,
  });

  return { mockAuth, mockUser, mockToOrg, setActive };
}

/**
 * Mock security scenarios - unauthorized access attempts
 */
export function mockUnauthorizedAccess(
  user: TestUser = TEST_USERS.learner,
  organization: TestOrganization = TEST_ORGANIZATIONS.secondary,
) {
  const mockAuth = createMockAuth({ 
    user, 
    organization: { ...organization, role: 'basic_member' },
  });
  const mockUser = createMockUser(user);
  const mockOrg = createMockOrganization(organization);

  vi.mocked(require('@clerk/nextjs')).useAuth.mockReturnValue(mockAuth);
  vi.mocked(require('@clerk/nextjs')).useUser.mockReturnValue({
    isLoaded: true,
    isSignedIn: true,
    user: mockUser,
  });
  vi.mocked(require('@clerk/nextjs')).useOrganization.mockReturnValue({
    isLoaded: true,
    organization: mockOrg,
    membership: {
      role: 'basic_member',
      permissions: [], // No admin permissions
    },
  });

  return { mockAuth, mockUser, mockOrg };
}

/**
 * Mock token expiration scenarios for security testing
 */
export function mockTokenExpiration(user: TestUser = TEST_USERS.admin) {
  const mockAuth = createMockAuth({ user });
  
  // Mock expired token
  mockAuth.getToken = vi.fn().mockRejectedValue(new Error('Token expired'));

  vi.mocked(require('@clerk/nextjs')).useAuth.mockReturnValue(mockAuth);

  return mockAuth;
}

/**
 * Reset all Clerk mocks to default state
 */
export function resetClerkMocks() {
  vi.clearAllMocks();
  
  // Reset to default authenticated state
  mockAuthenticatedState();
}

/**
 * Test utility to simulate authentication flow
 */
export async function simulateSignIn(user: TestUser = TEST_USERS.admin) {
  // Start with unauthenticated state
  mockUnauthenticatedState();
  
  // Simulate sign in process
  const mockAuth = createMockAuth({ isSignedIn: true, user });
  const mockUser = createMockUser(user);

  vi.mocked(require('@clerk/nextjs')).useAuth.mockReturnValue(mockAuth);
  vi.mocked(require('@clerk/nextjs')).useUser.mockReturnValue({
    isLoaded: true,
    isSignedIn: true,
    user: mockUser,
  });

  return { mockAuth, mockUser };
}

/**
 * Test utility to simulate sign out flow
 */
export async function simulateSignOut() {
  const mockAuth = mockUnauthenticatedState();
  
  // Mock successful sign out
  mockAuth.signOut = vi.fn().mockResolvedValue(undefined);
  
  return mockAuth;
}