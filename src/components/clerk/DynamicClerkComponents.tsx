'use client';

import dynamic from 'next/dynamic';

import { isOrganizationsEnabled } from '@/libs/ClerkUtils';

import { OrganizationErrorBoundary } from './OrganizationErrorBoundary';

// Loading component for authentication pages
const AuthLoading = () => (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="text-center">
      <div className="mb-4 inline-block size-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <p className="text-sm text-muted-foreground">Loading authentication...</p>
    </div>
  </div>
);

// Dynamically import Clerk components with loading states
export const DynamicSignIn = dynamic(
  () => import('@clerk/nextjs').then(mod => mod.SignIn),
  {
    loading: () => <AuthLoading />,
    ssr: false,
  },
);

export const DynamicSignUp = dynamic(
  () => import('@clerk/nextjs').then(mod => mod.SignUp),
  {
    loading: () => <AuthLoading />,
    ssr: false,
  },
);

export const DynamicUserButton = dynamic(
  () => import('@clerk/nextjs').then(mod => mod.UserButton),
  {
    loading: () => (
      <div className="size-8 animate-pulse rounded-full bg-muted" />
    ),
    ssr: false,
  },
);

// Wrapper for OrganizationSwitcher with error handling
const BaseOrganizationSwitcher = dynamic(
  () => import('@clerk/nextjs').then(mod => mod.OrganizationSwitcher),
  {
    loading: () => (
      <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
    ),
    ssr: false,
  },
);

export const DynamicOrganizationSwitcher = (props: any) => {
  if (!isOrganizationsEnabled()) {
    return null;
  }

  return (
    <OrganizationErrorBoundary fallback={null}>
      <BaseOrganizationSwitcher {...props} />
    </OrganizationErrorBoundary>
  );
};

export const DynamicUserProfile = dynamic(
  () => import('@clerk/nextjs').then(mod => mod.UserProfile),
  {
    loading: () => <AuthLoading />,
    ssr: false,
  },
);

// Wrapper component for organization profile with error handling
const BaseOrganizationProfile = dynamic(
  () => import('@clerk/nextjs').then(mod => mod.OrganizationProfile),
  {
    loading: () => <AuthLoading />,
    ssr: false,
  },
);

export const DynamicOrganizationProfile = (props: any) => {
  if (!isOrganizationsEnabled()) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-2 text-lg font-semibold">Organizations Not Available</h2>
        <p className="mb-4 text-muted-foreground">
          Organization features are currently disabled.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Back to Dashboard
        </a>
      </div>
    );
  }

  return (
    <OrganizationErrorBoundary>
      <BaseOrganizationProfile {...props} />
    </OrganizationErrorBoundary>
  );
};

// Wrapper component for organization list with error handling
const BaseOrganizationList = dynamic(
  () => import('@clerk/nextjs').then(mod => mod.OrganizationList),
  {
    loading: () => <AuthLoading />,
    ssr: false,
  },
);

export const DynamicOrganizationList = (props: any) => {
  if (!isOrganizationsEnabled()) {
    return (
      <div className="text-center">
        <h2 className="mb-2 text-lg font-semibold">Organizations Not Available</h2>
        <p className="mb-4 text-muted-foreground">
          Organization features are currently disabled. Continue with your personal account.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Continue to Dashboard
        </a>
      </div>
    );
  }

  return (
    <OrganizationErrorBoundary>
      <BaseOrganizationList {...props} />
    </OrganizationErrorBoundary>
  );
};
