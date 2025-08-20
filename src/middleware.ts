import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { isOrganizationSelectionRequired } from './libs/ClerkUtils';
import { AllLocales, AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/:locale/dashboard(.*)',
  '/onboarding(.*)',
  '/:locale/onboarding(.*)',
]);

const isApiRoute = createRouteMatcher([
  '/api(.*)',
  '/:locale/api(.*)',
]);

const isPublicApiRoute = (pathname: string) => {
  return pathname.includes('/api/health') || pathname.includes('/api/test');
};

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // Allow public API routes to bypass authentication
  if (isPublicApiRoute(request.nextUrl.pathname)) {
    return intlMiddleware(request);
  }

  if (
    request.nextUrl.pathname.includes('/sign-in')
    || request.nextUrl.pathname.includes('/sign-up')
    || isProtectedRoute(request)
    || isApiRoute(request)
  ) {
    return clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req) || isApiRoute(req)) {
        const locale
          = req.nextUrl.pathname.match(/(\/.*)\/dashboard/)?.at(1) ?? '';

        const signInUrl = new URL(`${locale}/sign-in`, req.url);

        await auth.protect({
          // `unauthenticatedUrl` is needed to avoid error: "Unable to find `next-intl` locale because the middleware didn't run on this request"
          unauthenticatedUrl: signInUrl.toString(),
        });
      }

      const authObj = await auth();

      // Only redirect to organization selection if organizations are enabled
      if (
        authObj.userId
        && !authObj.orgId
        && req.nextUrl.pathname.includes('/dashboard')
        && !req.nextUrl.pathname.endsWith('/organization-selection')
        && isOrganizationSelectionRequired()
      ) {
        // Extract locale from the current path
        const pathSegments = req.nextUrl.pathname.split('/');
        const locale = pathSegments[1] && pathSegments[1].length === 2 ? pathSegments[1] : '';
        
        const orgSelectionPath = locale 
          ? `/${locale}/onboarding/organization-selection`
          : '/onboarding/organization-selection';
          
        const orgSelection = new URL(orgSelectionPath, req.url);

        return NextResponse.redirect(orgSelection);
      }

      return intlMiddleware(req);
    })(request, event);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next|monitoring).*)',
    '/',
    '/(api|trpc)(.*)', // Include API routes for authentication
  ],
};
