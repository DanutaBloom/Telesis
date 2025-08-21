'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

/**
 * Error boundary for organization-related components
 * Gracefully handles cases where Organizations feature is disabled
 */
export class OrganizationErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Organization component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Check if error is related to disabled organizations
      const isOrgError = this.state.error?.message?.includes('organization')
        || this.state.error?.message?.includes('Organization');

      if (isOrgError) {
        return (
          this.props.fallback || (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Organizations Not Available
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Organization features are currently disabled. You can continue using the app with your personal account.
                    </p>
                  </div>
                  <div className="mt-4">
                    <ContinueToDashboardButton />
                  </div>
                </div>
              </div>
            </div>
          )
        );
      }
    }

    return this.props.children;
  }
}

const ContinueToDashboardButton = () => {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/dashboard');
  };

  return (
    <Button
      type="button"
      size="sm"
      onClick={handleContinue}
      className="bg-yellow-600 text-white hover:bg-yellow-700"
    >
      Continue to Dashboard
    </Button>
  );
};
