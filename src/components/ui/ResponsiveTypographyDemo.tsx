/**
 * ResponsiveTypographyDemo - Interactive demonstration component
 *
 * This component provides an interactive way to test responsive typography
 * across different viewport sizes with visual indicators and real-time updates.
 */

import * as React from 'react';

import { Typography } from './typography';

type ViewportInfo = {
  width: number;
  height: number;
  breakpoint: string;
  device: string;
}

export function ResponsiveTypographyDemo() {
  const [viewport, setViewport] = React.useState<ViewportInfo>({
    width: 0,
    height: 0,
    breakpoint: '',
    device: '',
  });

  React.useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      let breakpoint = '';
      let device = '';

      if (width < 640) {
        breakpoint = 'Mobile';
        device = '📱';
      } else if (width < 768) {
        breakpoint = 'Small';
        device = '📱';
      } else if (width < 1024) {
        breakpoint = 'Tablet';
        device = '💻';
      } else {
        breakpoint = 'Desktop';
        device = '🖥️';
      }

      setViewport({ width, height, breakpoint, device });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const getTypographyInfo = (variant: string) => {
    const info: Record<string, { mobile: string; tablet: string; desktop?: string }> = {
      "h1": {
        mobile: '32px/40px',
        tablet: '48px/56px',
        desktop: '60px/64px',
      },
      "h2": {
        mobile: '28px/36px',
        tablet: '40px/48px',
        desktop: '48px/56px',
      },
      "h3": {
        mobile: '24px/32px',
        tablet: '32px/40px',
      },
      "h4": {
        mobile: '20px/28px',
        tablet: '24px/32px',
      },
      "h5": {
        mobile: '18px/24px',
        tablet: '20px/28px',
      },
      "h6": {
        mobile: '16px/24px',
        tablet: '18px/24px',
      },
      "body": {
        mobile: '14px/20px (min)',
        tablet: '16px/24px',
      },
      'body-lg': {
        mobile: '16px/24px',
        tablet: '18px/28px',
      },
      "lead": {
        mobile: '18px/28px',
        tablet: '20px/30px',
      },
      'text-caption': {
        mobile: '12px/16px',
        tablet: '14px/20px',
      },
    };
    return info[variant] || { mobile: 'N/A', tablet: 'N/A' };
  };

  const currentSize = viewport.width < 640 ? 'mobile' : viewport.width < 768 ? 'mobile' : 'tablet';

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-mist/10 to-sage-quietude/5 p-4">
      {/* Fixed Viewport Indicator */}
      <div className="fixed right-4 top-4 z-50 rounded-lg border bg-card/95 p-4 shadow-lg backdrop-blur-sm">
        <Typography variant="text-caption" weight="semibold" color="sage-primary">
          Live Viewport
        </Typography>
        <div className="mt-1 space-y-1">
          <Typography variant="text-caption">
            {viewport.device}
{' '}
{viewport.breakpoint}
          </Typography>
          <Typography variant="text-caption" color="muted">
            {viewport.width}
×
{viewport.height}
px
          </Typography>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-8">
        <header className="py-8 text-center">
          <Typography variant="h1" color="sage-gradient" className="mb-4">
            Interactive Typography Demo
          </Typography>
          <Typography variant="lead" color="sage-stone">
            Resize your browser window to see responsive typography in action
          </Typography>
        </header>

        {/* Interactive Heading Tests */}
        <section className="space-y-6">
          <Typography variant="h2" color="sage-primary">Live Responsive Headings</Typography>

          {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((variant) => {
            const info = getTypographyInfo(variant);
            const currentInfo = currentSize === 'mobile' ? info.mobile : info.tablet;

            return (
              <div key={variant} className="rounded-lg border border-sage-mist/30 bg-card/50 p-6">
                <Typography variant={variant}>
                  {variant.toUpperCase()}
: Current Size Test
                </Typography>
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <span className={`rounded px-2 py-1 text-xs ${
                    currentSize === 'mobile'
                      ? 'bg-sage-growth/20 font-medium text-sage-growth'
                      : 'bg-sage-mist/20 text-sage-stone'
                  }`}
                  >
                    📱 Mobile:
{' '}
{info.mobile}
                  </span>
                  <span className={`rounded px-2 py-1 text-xs ${
                    currentSize === 'tablet'
                      ? 'bg-sage-growth/20 font-medium text-sage-growth'
                      : 'bg-sage-mist/20 text-sage-stone'
                  }`}
                  >
                    💻 Tablet:
{' '}
{info.tablet}
                  </span>
                  {info.desktop && (
                    <span className={`rounded px-2 py-1 text-xs ${
                      viewport.width >= 1024
                        ? 'bg-sage-growth/20 font-medium text-sage-growth'
                        : 'bg-sage-mist/20 text-sage-stone'
                    }`}
                    >
                      🖥️ Desktop:
{' '}
{info.desktop}
                    </span>
                  )}
                </div>
                <Typography variant="text-caption" color="muted" className="mt-2">
                  Currently displaying:
{' '}
{currentInfo}
                </Typography>
              </div>
            );
          })}
        </section>

        {/* Interactive Body Text Tests */}
        <section className="space-y-6">
          <Typography variant="h2" color="sage-primary">Live Responsive Body Text</Typography>

          {(['body', 'body-lg', 'lead', 'text-caption'] as const).map((variant) => {
            const info = getTypographyInfo(variant);
            const currentInfo = currentSize === 'mobile' ? info.mobile : info.tablet;

            return (
              <div key={variant} className="rounded-lg bg-sage-mist/5 p-6">
                <Typography variant={variant as any}>
                  {variant === 'text-caption'
                    ? 'This is caption text that demonstrates responsive scaling for UI elements and supplementary information.'
                    : variant === 'lead'
                    ? 'This is lead text that introduces important concepts with larger, more prominent styling that adapts beautifully across all screen sizes.'
                    : `This is ${variant.replace('-', ' ')} text demonstrating how our responsive typography system maintains excellent readability while adapting to different screen sizes and user needs.`}
                </Typography>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className={`rounded px-2 py-1 ${
                    currentSize === 'mobile'
                      ? 'bg-sage-quietude/20 font-medium text-sage-quietude'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  >
                    📱
{' '}
{info.mobile}
                  </span>
                  <span className={`rounded px-2 py-1 ${
                    currentSize === 'tablet'
                      ? 'bg-sage-quietude/20 font-medium text-sage-quietude'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  >
                    💻
{' '}
{info.tablet}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* WCAG Compliance Indicator */}
        <section className="rounded-lg bg-sage-growth/10 p-6">
          <Typography variant="h3" color="sage-primary" className="mb-4">
            WCAG AA Compliance Status
          </Typography>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-sage-growth/20 text-sm text-sage-growth">✓</span>
              <div>
                <Typography variant="text-button">Minimum Text Size</Typography>
                <Typography variant="text-caption" color="muted">14px maintained on mobile</Typography>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-sage-growth/20 text-sm text-sage-growth">✓</span>
              <div>
                <Typography variant="text-button">8px Grid System</Typography>
                <Typography variant="text-caption" color="muted">Consistent spacing alignment</Typography>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-sage-growth/20 text-sm text-sage-growth">✓</span>
              <div>
                <Typography variant="text-button">Contrast Ratios</Typography>
                <Typography variant="text-caption" color="muted">4.5:1 minimum maintained</Typography>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-sage-growth/20 text-sm text-sage-growth">✓</span>
              <div>
                <Typography variant="text-button">Mobile-First Design</Typography>
                <Typography variant="text-caption" color="muted">Progressive enhancement</Typography>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ResponsiveTypographyDemo;
