// Optimized Sentry configuration with conditional loading
// This reduces bundle size by only loading Sentry when needed

let sentryModule: any = null;

// Only load Sentry in production or when explicitly enabled
const shouldLoadSentry = () => {
  return process.env.NODE_ENV === 'production' || 
         process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true';
};

// Lazy load Sentry modules
export const getSentryBrowser = async () => {
  if (!shouldLoadSentry()) {
    return null;
  }
  
  if (!sentryModule) {
    sentryModule = await import('@sentry/nextjs');
  }
  return sentryModule;
};

// Optimized error capture that only loads Sentry when needed
export const captureException = async (error: Error, context?: any) => {
  if (!shouldLoadSentry()) {
    // In development, just log to console
    console.error('Error (Sentry disabled):', error, context);
    return;
  }
  
  const sentry = await getSentryBrowser();
  if (sentry) {
    sentry.captureException(error, context);
  }
};

// Optimized message capture
export const captureMessage = async (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  if (!shouldLoadSentry()) {
    console.log(`[${level.toUpperCase()}] ${message}`);
    return;
  }
  
  const sentry = await getSentryBrowser();
  if (sentry) {
    sentry.captureMessage(message, level);
  }
};

// Optimized performance monitoring
export const startTransaction = async (name: string, op?: string) => {
  if (!shouldLoadSentry()) {
    return null;
  }
  
  const sentry = await getSentryBrowser();
  if (sentry) {
    return sentry.startTransaction({ name, op });
  }
  return null;
};

// Browser detection for client-side only features
export const isBrowser = typeof window !== 'undefined';

// Development-only mock functions
export const mockSentryFunctions = {
  captureException: (error: Error) => console.error('Mock Sentry:', error),
  captureMessage: (message: string) => console.log('Mock Sentry:', message),
  startTransaction: () => null,
};