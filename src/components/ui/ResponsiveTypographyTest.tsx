import React from 'react';

import { Typography } from './typography';

/**
 * ResponsiveTypographyTest - Component for testing responsive typography
 *
 * This component demonstrates and tests all responsive typography variants
 * across different screen sizes to ensure proper scaling and readability.
 */
export function ResponsiveTypographyTest() {
  return (
    <div className="spacing-responsive container mx-auto px-4 py-8">
      {/* Screen size indicator */}
      <div className="mb-8 rounded-lg border bg-card p-4">
        <Typography variant="h4" className="mb-2">
          Current Screen Size
        </Typography>
        <div className="flex gap-4 text-sm">
          <span className="block font-medium text-red-600 sm:hidden">
            📱 Mobile (&lt;640px)
          </span>
          <span className="hidden font-medium text-yellow-600 sm:block md:hidden">
            📱 Small (640px-768px)
          </span>
          <span className="hidden font-medium text-blue-600 md:block lg:hidden">
            💻 Tablet (768px-1024px)
          </span>
          <span className="hidden font-medium text-green-600 lg:block">
            🖥️ Desktop (1024px+)
          </span>
        </div>
      </div>

      {/* Responsive Headings Test */}
      <section className="mb-12">
        <Typography variant="h2" className="mb-6">
          Responsive Headings Test
        </Typography>
        <div className="space-y-4">
          <div>
            <Typography variant="h1" className="sage-text-gradient">
              H1: Modern Sage Typography System
            </Typography>
            <p className="text-caption-responsive mt-1 text-muted-foreground">
              Mobile: 32px/40px → Tablet: 48px/56px → Desktop: 60px/64px
            </p>
          </div>

          <div>
            <Typography variant="h2">
              H2: Responsive Design Excellence
            </Typography>
            <p className="text-caption-responsive mt-1 text-muted-foreground">
              Mobile: 28px/36px → Tablet: 40px/48px → Desktop: 48px/56px
            </p>
          </div>

          <div>
            <Typography variant="h3">
              H3: Seamless Scale Transitions
            </Typography>
            <p className="text-caption-responsive mt-1 text-muted-foreground">
              Mobile: 24px/32px → Tablet: 32px/40px
            </p>
          </div>

          <div>
            <Typography variant="h4">
              H4: Enhanced User Experience
            </Typography>
            <p className="text-caption-responsive mt-1 text-muted-foreground">
              Mobile: 20px/28px → Tablet: 24px/32px
            </p>
          </div>

          <div>
            <Typography variant="h5">
              H5: Accessible Typography
            </Typography>
            <p className="text-caption-responsive mt-1 text-muted-foreground">
              Mobile: 18px/24px → Tablet: 20px/28px
            </p>
          </div>

          <div>
            <Typography variant="h6">
              H6: Consistent Hierarchy
            </Typography>
            <p className="text-caption-responsive mt-1 text-muted-foreground">
              Mobile: 16px/24px → Tablet: 18px/24px
            </p>
          </div>
        </div>
      </section>

      {/* Responsive Body Text Test */}
      <section className="mb-12">
        <Typography variant="h2" className="mb-6">
          Responsive Body Text Test
        </Typography>
        <div className="space-y-6">
          <div>
            <Typography variant="lead">
              This is lead text that adapts responsively across devices. It maintains excellent readability
              while scaling appropriately from mobile to desktop viewports.
            </Typography>
            <p className="text-caption-responsive mt-1 text-muted-foreground">
              Lead: Mobile: 18px/28px → Tablet: 20px/30px
            </p>
          </div>

          <div>
            <Typography variant="body">
              This is standard body text with responsive scaling. The minimum size is maintained at 14px
              on mobile devices to ensure accessibility compliance (WCAG AA), then scales to 16px on tablet
              and larger screens for optimal reading comfort.
            </Typography>
            <p className="text-caption-responsive mt-1 text-muted-foreground">
              Body: Mobile: 14px/20px → Tablet: 16px/24px (minimum maintained)
            </p>
          </div>

          <div>
            <Typography variant="body-lg">
              This is large body text that provides enhanced readability for important content.
              It starts at 16px on mobile and scales to 18px on larger screens, maintaining
              the perfect balance between readability and visual hierarchy.
            </Typography>
            <p className="text-caption-responsive mt-1 text-muted-foreground">
              Body Large: Mobile: 16px/24px → Tablet: 18px/28px
            </p>
          </div>

          <div>
            <Typography variant="body-sm">
              This is small body text used for supplementary information. Even at its smallest,
              it maintains the 14px minimum size to ensure accessibility standards are met
              across all devices and screen sizes.
            </Typography>
            <p className="text-caption-responsive mt-1 text-muted-foreground">
              Body Small: 14px/20px (minimum maintained across all screens)
            </p>
          </div>
        </div>
      </section>

      {/* Modern Sage Variants Test */}
      <section className="mb-12">
        <Typography variant="h2" className="mb-6">
          Modern Sage Responsive Variants
        </Typography>
        <div className="space-y-6">
          <div className="text-center">
            <Typography variant="sage-display" className="sage-text-gradient">
              Sage Display
            </Typography>
            <p className="text-caption-responsive mt-1 text-muted-foreground">
              Extra Large Hero: 64px → 80px → 96px → 112px
            </p>
          </div>

          <div className="text-center">
            <Typography variant="sage-hero" className="sage-text-primary">
              Sage Hero Headline
            </Typography>
            <p className="text-caption-responsive mt-1 text-muted-foreground">
              Uses responsive H1 sizing for hero sections
            </p>
          </div>

          <div>
            <Typography variant="sage-subtitle" className="sage-text-accent">
              Sage subtitle text for enhanced visual hierarchy and brand consistency
            </Typography>
            <p className="text-caption-responsive mt-1 text-muted-foreground">
              Uses responsive body-large sizing with medium weight
            </p>
          </div>
        </div>
      </section>

      {/* UI Elements Test */}
      <section className="mb-12">
        <Typography variant="h2" className="mb-6">
          Responsive UI Elements
        </Typography>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <button className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">
              <span className="text-button-responsive">Button Text</span>
            </button>
            <button className="sage-text-primary rounded-lg border border-sage-quietude px-4 py-2">
              <span className="text-button-responsive">Sage Button</span>
            </button>
          </div>
          <p className="text-caption-responsive text-muted-foreground">
            Button Text: 14px/20px with medium weight (responsive maintained)
          </p>

          <div className="space-y-2">
            <Typography variant="text-caption" className="text-muted-foreground">
              Caption text that scales responsively for better readability
            </Typography>
            <Typography variant="text-overline" className="text-muted-foreground">
              Overline Text
            </Typography>
            <p className="text-caption-responsive text-muted-foreground">
              Caption: Mobile: 12px/16px → Tablet: 14px/20px
            </p>
          </div>
        </div>
      </section>

      {/* Spacing Test */}
      <section className="mb-12">
        <Typography variant="h2" className="mb-6">
          Responsive Spacing System
        </Typography>

        <div className="rounded-lg border bg-card p-6">
          <Typography variant="h3" className="mb-4">
            8px Grid System Demonstration
          </Typography>
          <div className="spacing-responsive-sm prose-readable">
            <Typography variant="h4">Small Spacing</Typography>
            <Typography variant="body">
              This section uses responsive small spacing that scales from 12px on mobile
              to 16px on tablet and larger screens.
            </Typography>
            <Typography variant="body-sm">
              Perfect for compact content areas and dense information layouts.
            </Typography>
          </div>

          <div className="spacing-responsive prose-readable mt-8">
            <Typography variant="h4">Standard Spacing</Typography>
            <Typography variant="body">
              This section uses standard responsive spacing that scales from 16px on mobile
              to 24px on tablet and larger screens.
            </Typography>
            <Typography variant="body">
              Ideal for most content sections and reading experiences.
            </Typography>
          </div>

          <div className="spacing-responsive-lg prose-readable mt-8">
            <Typography variant="h4">Large Spacing</Typography>
            <Typography variant="body">
              This section uses large responsive spacing that scales from 24px on mobile
              to 32px on tablet and larger screens.
            </Typography>
            <Typography variant="body">
              Best for separating major content sections and creating visual breathing room.
            </Typography>
          </div>
        </div>
      </section>

      {/* Accessibility Notice */}
      <section className="rounded-lg bg-sage-mist/10 p-6">
        <Typography variant="h3" className="sage-text-primary mb-4">
          Accessibility Features
        </Typography>
        <div className="space-y-3">
          <Typography variant="body" className="flex items-start gap-2">
            <span className="text-sage-growth">✓</span>
            <span>Minimum 14px font size maintained across all breakpoints for WCAG AA compliance</span>
          </Typography>
          <Typography variant="body" className="flex items-start gap-2">
            <span className="text-sage-growth">✓</span>
            <span>8px grid system ensures consistent spacing and alignment</span>
          </Typography>
          <Typography variant="body" className="flex items-start gap-2">
            <span className="text-sage-growth">✓</span>
            <span>Proper line-height ratios maintained for optimal readability</span>
          </Typography>
          <Typography variant="body" className="flex items-start gap-2">
            <span className="text-sage-growth">✓</span>
            <span>Focus indicators and semantic HTML structure preserved</span>
          </Typography>
          <Typography variant="body" className="flex items-start gap-2">
            <span className="text-sage-growth">✓</span>
            <span>Mobile-first responsive design ensures content is readable on all devices</span>
          </Typography>
        </div>
      </section>
    </div>
  );
}

export default ResponsiveTypographyTest;
