import { Env } from './Env';

/**
 * Check if Clerk Organizations feature is enabled
 * This allows graceful handling when Organizations is disabled in Clerk
 */
export const isOrganizationsEnabled = (): boolean => {
  return Env.NEXT_PUBLIC_CLERK_ORGANIZATIONS_ENABLED === 'true';
};

/**
 * Check if organization selection is required for the current user
 * Returns false if organizations are disabled
 */
export const isOrganizationSelectionRequired = (): boolean => {
  return isOrganizationsEnabled();
};