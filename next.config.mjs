import { fileURLToPath } from 'node:url';

import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import createJiti from 'jiti';
import withNextIntl from 'next-intl/plugin';

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti('./src/libs/Env');

const withNextIntlConfig = withNextIntl('./src/libs/i18n.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true' && process.env.NODE_ENV === 'production',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@electric-sql/pglite'],
    optimizePackageImports: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-icons',
      '@radix-ui/react-label',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-tooltip',
      'lucide-react',
      '@tanstack/react-table',
      '@clerk/nextjs',
      '@clerk/themes',
      '@sentry/nextjs',
    ],
  },
  // Optimize production builds
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  // Configure module resolution for better tree shaking
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{member}}',
    },
  },
  // Webpack configuration for advanced optimization
  webpack: (config, { dev, isServer }) => {
    // Always exclude test files from build
    config.module.rules.push({
      test: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
      use: 'ignore-loader',
    });

    // Always exclude test-utils directory from build
    config.module.rules.push({
      test: /src\/test-utils\/.*\.(js|jsx|ts|tsx)$/,
      use: 'ignore-loader',
    });

    // Production-only optimizations to improve dev performance
    if (!dev && !isServer) {
      // Split chunks for better caching
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Framework chunk
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-sync-external-store)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // Clerk authentication chunk
            clerk: {
              name: 'clerk',
              test: /[\\/]node_modules[\\/]@clerk[\\/]/,
              chunks: 'all',
              priority: 35,
              reuseExistingChunk: true,
            },
            // UI components chunk
            ui: {
              name: 'ui',
              test: /[\\/]node_modules[\\/](@radix-ui|class-variance-authority|clsx|tailwind-merge)[\\/]/,
              chunks: 'all',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Sentry monitoring chunk
            monitoring: {
              name: 'monitoring',
              test: /[\\/]node_modules[\\/]@sentry[\\/]/,
              chunks: 'all',
              priority: 25,
              reuseExistingChunk: true,
            },
            // Stripe payments chunk
            stripe: {
              name: 'stripe',
              test: /[\\/]node_modules[\\/]stripe[\\/]/,
              chunks: 'all',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Common libraries chunk
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 15,
              minChunks: 1,
              minSize: 160000,
              reuseExistingChunk: true,
            },
            // Common components
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
          maxAsyncRequests: 30,
          maxInitialRequests: 25,
          minSize: 20000,
        },
        runtimeChunk: {
          name: 'runtime',
        },
        minimize: true,
      };

      // Replace large modules with smaller alternatives in production
      config.resolve.alias = {
        ...config.resolve.alias,
        '@sentry/node': false,
        '@sentry/tracing': false,
      };
    }

    return config;
  },
  // SECURITY: Comprehensive security headers for OWASP compliance
  async headers() {
    return [
          {
            // Apply security headers to all routes
            source: '/(.*)',
            headers: [
              {
                key: 'X-Frame-Options',
                value: 'DENY', // Prevents clickjacking attacks
              },
              {
                key: 'X-Content-Type-Options',
                value: 'nosniff', // Prevents MIME type sniffing
              },
              {
                key: 'X-XSS-Protection',
                value: '1; mode=block', // Legacy XSS protection
              },
              {
                key: 'Referrer-Policy',
                value: 'strict-origin-when-cross-origin', // Controls referrer information
              },
              {
                key: 'Permissions-Policy',
                value: [
                  'accelerometer=()',
                  'camera=()',
                  'geolocation=()',
                  'gyroscope=()',
                  'magnetometer=()',
                  'microphone=()',
                  'payment=()',
                  'usb=()',
                ].join(', '), // Disables potentially dangerous browser APIs
              },
              {
                key: 'Strict-Transport-Security',
                value: 'max-age=31536000; includeSubDomains; preload', // Forces HTTPS
              },
              {
                key: 'Content-Security-Policy',
                value: [
                  'default-src \'self\'',
                  'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://js.stripe.com https://*.clerk.accounts.dev https://*.clerk.dev https://challenges.cloudflare.com',
                  'style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com',
                  'font-src \'self\' https://fonts.gstatic.com',
                  'img-src \'self\' data: https: blob:',
                  'media-src \'self\' https: blob:',
                  'connect-src \'self\' https://api.stripe.com https://*.clerk.accounts.dev https://*.clerk.dev https://challenges.cloudflare.com wss://*.clerk.dev https://vitals.vercel-insights.com https://clerk-telemetry.com http://localhost:8969',
                  'frame-src \'self\' https://js.stripe.com https://*.stripe.com https://challenges.cloudflare.com',
                  'worker-src \'self\' blob:',
                  'child-src \'self\'',
                  'object-src \'none\'',
                  'base-uri \'self\'',
                  'form-action \'self\'',
                  'frame-ancestors \'none\'',
                  'upgrade-insecure-requests',
                ].join('; '), // Comprehensive CSP for XSS prevention
              },
            ],
          },
          {
            // Specific headers for API routes
            source: '/api/(.*)',
            headers: [
              {
                key: 'Cache-Control',
                value: 'no-store, no-cache, must-revalidate, max-age=0',
              },
              {
                key: 'Pragma',
                value: 'no-cache',
              },
              {
                key: 'X-Robots-Tag',
                value: 'noindex, nofollow, nosnippet, noarchive',
              },
            ],
          },
      ];
  },
};

// Export config with conditional Sentry wrapper
const finalConfig = bundleAnalyzer(withNextIntlConfig(nextConfig));

export default process.env.NODE_ENV === 'production' 
  ? withSentryConfig(finalConfig, {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options
      // FIXME: Add your Sentry organization and project names
      org: 'nextjs-boilerplate-org',
      project: 'nextjs-boilerplate',

      // Only print logs for uploading source maps in CI
      silent: !process.env.CI,

      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
      // This can increase your server load as well as your hosting bill.
      // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
      // side errors will fail.
      tunnelRoute: '/monitoring',

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,

      // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
      // See the following for more information:
      // https://docs.sentry.io/product/crons/
      // https://vercel.com/docs/cron-jobs
      automaticVercelMonitors: true,

      // Disable Sentry telemetry
      telemetry: false,
    })
  : finalConfig;
