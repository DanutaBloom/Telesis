/**
 * Typography Showcase Component
 *
 * Demonstrates the responsive Typography system with mobile-first design
 * Tests PRD specifications across mobile (≤640px), tablet (≥768px), and desktop viewports
 * Validates WCAG AA compliance and 8px grid alignment
 */

import * as React from 'react';

import { Typography } from './typography';

// Responsive indicator component to show current viewport
const ViewportIndicator = () => {
  const [viewportSize, setViewportSize] = React.useState<string>('');

  React.useEffect(() => {
    const updateViewportSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setViewportSize('Mobile (<640px)');
      } else if (width < 768) {
        setViewportSize('Small Tablet (640-767px)');
      } else if (width < 1024) {
        setViewportSize('Tablet (768-1023px)');
      } else {
        setViewportSize('Desktop (≥1024px)');
      }
    };

    updateViewportSize();
    window.addEventListener('resize', updateViewportSize);
    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);

  return (
    <div className="fixed right-4 top-4 z-50 rounded-md bg-sage-quietude/10 px-3 py-2 backdrop-blur-sm">
      <Typography variant="text-caption" weight="medium" color="sage-primary">
        {viewportSize || 'Loading...'}
      </Typography>
    </div>
  );
};

export function TypographyShowcase() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-8">
      <ViewportIndicator />
      {/* Responsive Typography Testing Header */}
      <section className="space-y-4 rounded-lg bg-gradient-to-r from-sage-mist/20 to-sage-quietude/10 p-6">
        <Typography variant="h1" align="center" color="sage-primary">
          Responsive Typography System
        </Typography>
        <Typography variant="lead" align="center" color="sage-stone">
          Mobile-first design following PRD specifications with WCAG AA compliance
        </Typography>
        <div className="grid gap-4 text-center md:grid-cols-3">
          <div className="rounded-md bg-background/50 p-4">
            <Typography variant="text-button" weight="semibold">Mobile (≤640px)</Typography>
            <Typography variant="text-caption" color="muted">h1=32px/40px, h2=28px/36px</Typography>
          </div>
          <div className="rounded-md bg-background/50 p-4">
            <Typography variant="text-button" weight="semibold">Tablet (≥768px)</Typography>
            <Typography variant="text-caption" color="muted">h1=48px/56px, h2=40px/48px</Typography>
          </div>
          <div className="rounded-md bg-background/50 p-4">
            <Typography variant="text-button" weight="semibold">Desktop (≥1024px)</Typography>
            <Typography variant="text-caption" color="muted">h1=60px/64px, h2=48px/56px</Typography>
          </div>
        </div>
      </section>

      {/* Display Typography */}
      <section className="space-y-4">
        <Typography variant="h2" color="sage-primary">Display Typography</Typography>
        <Typography variant="sage-display">Modern Sage Display</Typography>
        <Typography variant="sage-hero">Hero Heading with Quietude</Typography>
        <Typography variant="sage-subtitle">Elegant subtitle styling</Typography>
        <Typography variant="sage-caption">Caption text with stone color</Typography>
      </section>

      {/* Responsive Heading Hierarchy */}
      <section className="space-y-6">
        <Typography variant="h2" color="sage-primary">Responsive Heading Hierarchy</Typography>
        <Typography variant="body" color="muted" className="mb-4">
          Resize your browser to see mobile-first responsive scaling in action.
        </Typography>

        <div className="space-y-6">
          <div className="rounded-lg border border-sage-mist/30 p-4">
            <Typography variant="h1">H1: Responsive Heading</Typography>
            <div className="mt-2 grid gap-2 text-xs md:grid-cols-3">
              <Typography variant="text-caption" color="muted">📱 Mobile: 32px/40px</Typography>
              <Typography variant="text-caption" color="muted">📱 Tablet: 48px/56px</Typography>
              <Typography variant="text-caption" color="muted">💻 Desktop: 60px/64px</Typography>
            </div>
            <Typography variant="small" color="muted" className="mt-2">Main page titles and hero headings</Typography>
          </div>

          <div className="rounded-lg border border-sage-mist/30 p-4">
            <Typography variant="h2">H2: Responsive Heading</Typography>
            <div className="mt-2 grid gap-2 text-xs md:grid-cols-3">
              <Typography variant="text-caption" color="muted">📱 Mobile: 28px/36px</Typography>
              <Typography variant="text-caption" color="muted">📱 Tablet: 40px/48px</Typography>
              <Typography variant="text-caption" color="muted">💻 Desktop: 48px/56px</Typography>
            </div>
            <Typography variant="small" color="muted" className="mt-2">Major sections and category headers</Typography>
          </div>

          <div className="rounded-lg border border-sage-mist/30 p-4">
            <Typography variant="h3">H3: Responsive Heading</Typography>
            <div className="mt-2 grid gap-2 text-xs md:grid-cols-2">
              <Typography variant="text-caption" color="muted">📱 Mobile: 24px/32px</Typography>
              <Typography variant="text-caption" color="muted">📱 Tablet+: 32px/40px</Typography>
            </div>
            <Typography variant="small" color="muted" className="mt-2">Subsections and content blocks</Typography>
          </div>

          <div className="rounded-lg border border-sage-mist/30 p-4">
            <Typography variant="h4">H4: Responsive Heading</Typography>
            <div className="mt-2 grid gap-2 text-xs md:grid-cols-2">
              <Typography variant="text-caption" color="muted">📱 Mobile: 20px/28px</Typography>
              <Typography variant="text-caption" color="muted">📱 Tablet+: 24px/32px</Typography>
            </div>
            <Typography variant="small" color="muted" className="mt-2">Sub-subsections and card titles</Typography>
          </div>

          <div className="rounded-lg border border-sage-mist/30 p-4">
            <Typography variant="h5">H5: Responsive Heading</Typography>
            <div className="mt-2 grid gap-2 text-xs md:grid-cols-2">
              <Typography variant="text-caption" color="muted">📱 Mobile: 18px/24px</Typography>
              <Typography variant="text-caption" color="muted">📱 Tablet+: 20px/28px</Typography>
            </div>
            <Typography variant="small" color="muted" className="mt-2">Minor headings and list headers</Typography>
          </div>

          <div className="rounded-lg border border-sage-mist/30 p-4">
            <Typography variant="h6">H6: Responsive Heading</Typography>
            <div className="mt-2 grid gap-2 text-xs md:grid-cols-2">
              <Typography variant="text-caption" color="muted">📱 Mobile: 16px/24px</Typography>
              <Typography variant="text-caption" color="muted">📱 Tablet+: 18px/24px</Typography>
            </div>
            <Typography variant="small" color="muted" className="mt-2">Smallest headings and labels</Typography>
          </div>
        </div>
      </section>

      {/* Responsive Body Text */}
      <section className="space-y-6">
        <Typography variant="h2" color="sage-primary">Responsive Body Text</Typography>
        <Typography variant="body" color="muted" className="mb-4">
          All body text maintains minimum 14px on mobile for WCAG AA compliance.
        </Typography>

        <div className="space-y-4">
          <div className="rounded-lg bg-sage-mist/10 p-4">
            <Typography variant="lead">
              Lead text: This responsive lead text introduces key concepts with larger, more prominent styling.
              Perfect for article intros or important statements.
            </Typography>
            <div className="mt-2 grid gap-2 text-xs md:grid-cols-2">
              <Typography variant="text-caption" color="muted">📱 Mobile: 18px/28px</Typography>
              <Typography variant="text-caption" color="muted">📱 Tablet+: 20px/30px</Typography>
            </div>
          </div>

          <div className="rounded-lg bg-sage-mist/10 p-4">
            <Typography variant="body">
              Regular body text: This follows the 8px grid system and maintains proper
              line height and spacing for optimal readability across all devices. The responsive
              scaling ensures excellent readability on mobile while providing comfortable reading on larger screens.
            </Typography>
            <div className="mt-2 grid gap-2 text-xs md:grid-cols-2">
              <Typography variant="text-caption" color="muted">📱 Mobile: 14px/20px (minimum)</Typography>
              <Typography variant="text-caption" color="muted">📱 Tablet+: 16px/24px</Typography>
            </div>
          </div>

          <div className="rounded-lg bg-sage-mist/10 p-4">
            <Typography variant="body-lg">
              Large body text: Enhanced readability for accessibility and important content.
              Great for users who need larger text sizes.
            </Typography>
            <div className="mt-2 grid gap-2 text-xs md:grid-cols-2">
              <Typography variant="text-caption" color="muted">📱 Mobile: 16px/24px</Typography>
              <Typography variant="text-caption" color="muted">📱 Tablet+: 18px/28px</Typography>
            </div>
          </div>

          <div className="rounded-lg bg-sage-mist/10 p-4">
            <Typography variant="body-sm">
              Small body text for captions, footnotes, or secondary information.
              Still maintains 14px minimum for accessibility compliance.
            </Typography>
            <div className="mt-2">
              <Typography variant="text-caption" color="muted">📱 All devices: 14px/20px (WCAG minimum maintained)</Typography>
            </div>
          </div>
        </div>
      </section>

      {/* Special Elements */}
      <section className="space-y-4">
        <Typography variant="h2" color="sage-primary">Special Elements</Typography>
        <Typography variant="large">Large emphasized text</Typography>
        <Typography variant="small">Small inline text</Typography>
        <Typography variant="muted">Muted secondary text</Typography>

        {/* Responsive UI Element Variants */}
        <div className="space-y-4 rounded-lg border border-sage-mist/30 p-4">
          <Typography variant="h6">Responsive UI Elements (PRD Compliant)</Typography>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Typography variant="text-button">Button Text (Responsive)</Typography>
              <Typography variant="text-caption" color="muted">14px/20px, Medium (500)</Typography>
            </div>

            <div className="space-y-2">
              <Typography variant="text-caption">Caption Text (Responsive)</Typography>
              <div className="space-y-1">
                <Typography variant="text-caption" color="muted">📱 Mobile: 12px/16px</Typography>
                <Typography variant="text-caption" color="muted">📱 Tablet+: 14px/20px</Typography>
              </div>
            </div>

            <div className="space-y-2">
              <Typography variant="text-overline">Overline Text</Typography>
              <Typography variant="text-caption" color="muted">10px/16px, Medium, 0.1em</Typography>
            </div>
          </div>
        </div>

        <Typography variant="blockquote">
          "This is a blockquote demonstrating quotation styling with proper indentation
          and italic formatting following Modern Sage design principles."
        </Typography>

        <Typography variant="body">
          Here's some text with
{' '}
<Typography variant="code" asChild><code>inline code</code></Typography>
{' '}
styling
          that demonstrates monospace font integration.
        </Typography>
      </section>

      {/* Lists */}
      <section className="space-y-4">
        <Typography variant="h2" color="sage-primary">Lists</Typography>

        <Typography variant="body">Unordered list:</Typography>
        <Typography variant="list">
          <li>First item with proper spacing</li>
          <li>Second item following 8px grid</li>
          <li>Third item with consistent margins</li>
        </Typography>

        <Typography variant="body">Ordered list:</Typography>
        <Typography variant="list-ordered">
          <li>First numbered item</li>
          <li>Second numbered item</li>
          <li>Third numbered item</li>
        </Typography>
      </section>

      {/* Color Variants */}
      <section className="space-y-4">
        <Typography variant="h2" color="sage-primary">Color Variants</Typography>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Typography color="default">Default text color</Typography>
            <Typography color="muted">Muted text color</Typography>
            <Typography color="primary">Primary theme color</Typography>
            <Typography color="accent">Accent theme color</Typography>
          </div>
          <div className="space-y-2">
            <Typography color="sage-primary">Sage Quietude</Typography>
            <Typography color="sage-accent">Sage Growth</Typography>
            <Typography color="sage-stone">Sage Stone</Typography>
            <Typography color="sage-gradient">Sage Gradient Text</Typography>
          </div>
        </div>
      </section>

      {/* Size and Weight Combinations */}
      <section className="space-y-4">
        <Typography variant="h2" color="sage-primary">Size & Weight Options</Typography>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Typography size="xs">Extra small text</Typography>
            <Typography size="sm">Small text</Typography>
            <Typography size="base">Base text</Typography>
            <Typography size="lg">Large text</Typography>
            <Typography size="xl">Extra large text</Typography>
          </div>
          <div className="space-y-2">
            <Typography weight="light">Light weight</Typography>
            <Typography weight="normal">Normal weight</Typography>
            <Typography weight="medium">Medium weight</Typography>
            <Typography weight="semibold">Semibold weight</Typography>
            <Typography weight="bold">Bold weight</Typography>
          </div>
        </div>
      </section>

      {/* Alignment Options */}
      <section className="space-y-4">
        <Typography variant="h2" color="sage-primary">Text Alignment</Typography>
        <Typography align="left" variant="body">Left aligned text (default)</Typography>
        <Typography align="center" variant="body">Center aligned text</Typography>
        <Typography align="right" variant="body">Right aligned text</Typography>
        <Typography align="justify" variant="body" className="max-w-md">
          Justified text that demonstrates how text wraps and justifies to create
          even margins on both sides of the paragraph.
        </Typography>
      </section>

      {/* Grid System & Accessibility */}
      <section className="space-y-6">
        <Typography variant="h2" color="sage-primary">8px Grid System & Accessibility</Typography>

        {/* Grid Alignment Demo */}
        <div className="rounded-lg border border-sage-mist/30 p-6">
          <Typography variant="h3" className="mb-4">8px Grid Alignment</Typography>
          <div
            className="grid gap-2 bg-gradient-to-r from-sage-mist/20 to-sage-growth/10 p-4"
            style={{ backgroundImage: 'linear-gradient(0deg, rgba(85,124,118,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(85,124,118,0.1) 1px, transparent 1px)', backgroundSize: '8px 8px' }}
          >
            <Typography variant="h4">H4 Heading (aligns to 8px grid)</Typography>
            <Typography variant="body">Body text with proper line heights that respect the 8px baseline grid system.</Typography>
            <Typography variant="text-caption">Caption text maintaining grid alignment</Typography>
          </div>
        </div>

        {/* WCAG Compliance */}
        <div className="rounded-lg bg-sage-mist/10 p-6">
          <Typography variant="h3" className="mb-4">WCAG AA Compliance</Typography>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Typography variant="h5" color="sage-primary">✓ Minimum Text Sizes</Typography>
              <Typography variant="text-caption" color="muted">Mobile: 14px minimum maintained</Typography>
              <Typography variant="text-caption" color="muted">Desktop: 16px standard body text</Typography>
            </div>
            <div className="space-y-2">
              <Typography variant="h5" color="sage-primary">✓ Contrast Ratios</Typography>
              <Typography variant="text-caption" color="muted">All colors meet 4.5:1 minimum</Typography>
              <Typography variant="text-caption" color="muted">Brand colors verified for accessibility</Typography>
            </div>
            <div className="space-y-2">
              <Typography variant="h5" color="sage-primary">✓ Semantic Structure</Typography>
              <Typography variant="text-caption" color="muted">Proper heading hierarchy (h1→h6)</Typography>
              <Typography variant="text-caption" color="muted">Focus indicators for navigation</Typography>
            </div>
            <div className="space-y-2">
              <Typography variant="h5" color="sage-primary">✓ Responsive Design</Typography>
              <Typography variant="text-caption" color="muted">Mobile-first approach</Typography>
              <Typography variant="text-caption" color="muted">Scalable across all devices</Typography>
            </div>
          </div>
        </div>

        {/* Reading Experience */}
        <div className="rounded-lg border border-sage-growth/20 p-6">
          <Typography variant="h3" className="mb-4">Optimized Reading Experience</Typography>
          <Typography variant="body" className="prose-readable mb-4">
            This paragraph demonstrates the prose-readable utility class which limits line length
            to 65 characters for optimal readability. This follows typography best practices for
            comfortable reading across all devices and screen sizes.
          </Typography>
          <Typography variant="text-caption" color="muted">
            Max-width: 65ch • Line height: 1.6 • Responsive scaling
          </Typography>
        </div>
      </section>

      {/* Custom Element Examples */}
      <section className="space-y-4">
        <Typography variant="h2" color="sage-primary">Custom Elements</Typography>
        <Typography variant="body" as="div">
          Body styling applied to a div element
        </Typography>
        <Typography variant="h3" asChild>
          <button type="button" className="cursor-pointer border-0 bg-transparent p-0 transition-colors hover:text-sage-growth">
            Heading styling on a button element
          </button>
        </Typography>
      </section>
    </div>
  );
}

export default TypographyShowcase;
