/**
 * Typography Component Test Suite - Responsive Typography System
 *
 * Tests the responsive Typography component with Modern Sage theme integration,
 * accessibility compliance, mobile-first design, and 8px grid system alignment.
 * Updated for PRD specifications with mobile (≤640px), tablet (≥768px), and desktop breakpoints.
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  expectElementToHaveModernSageTheme,
} from '@/test-utils';

import { Typography } from './typography';

// Mock next-themes for theme testing
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

describe('Responsive Typography Component', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Typography>Default text</Typography>);

      const element = screen.getByText('Default text');

      expect(element).toBeInTheDocument();
      expect(element.tagName).toBe('DIV'); // Default element when no variant
    });

    it('applies default body variant with responsive classes', () => {
      render(<Typography data-testid="default-text">Body text</Typography>);

      const element = screen.getByTestId('default-text');

      expect(element).toHaveClass('text-body-responsive', '[&:not(:first-child)]:mt-6');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Typography ref={ref}>Text with ref</Typography>);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Responsive Heading Variants', () => {
    it('renders h1 variant with correct element and responsive classes', () => {
      render(<Typography variant="h1">Main Heading</Typography>);

      const heading = screen.getByRole('heading', { level: 1 });

      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass(
        'text-h1', // Custom responsive class: 32px/40px mobile → 48px/56px tablet → 60px/64px desktop
        'scroll-m-20',
        'font-bold'
      );
    });

    it('renders h2 variant with responsive classes', () => {
      render(<Typography variant="h2">Section Heading</Typography>);

      const heading = screen.getByRole('heading', { level: 2 });

      expect(heading).toHaveClass(
        'text-h2', // Custom responsive class: 28px/36px mobile → 40px/48px tablet → 48px/56px desktop
        'scroll-m-20',
        'font-semibold',
        '[&:not(:first-child)]:mt-8'
      );
    });

    it('renders h3 through h6 variants correctly with responsive classes', () => {
      render(
        <div>
          <Typography variant="h3">H3 Heading</Typography>
          <Typography variant="h4">H4 Heading</Typography>
          <Typography variant="h5">H5 Heading</Typography>
          <Typography variant="h6">H6 Heading</Typography>
        </div>
      );

      const h3 = screen.getByRole('heading', { level: 3 });
      const h4 = screen.getByRole('heading', { level: 4 });
      const h5 = screen.getByRole('heading', { level: 5 });
      const h6 = screen.getByRole('heading', { level: 6 });

      // Test responsive classes
      expect(h3).toHaveClass('text-h3', 'scroll-m-20', 'font-semibold'); // 24px/32px → 32px/40px
      expect(h4).toHaveClass('text-h4', 'scroll-m-20', 'font-semibold'); // 20px/28px → 24px/32px
      expect(h5).toHaveClass('text-h5', 'scroll-m-20', 'font-medium'); // 18px/24px → 20px/28px
      expect(h6).toHaveClass('text-h6', 'scroll-m-20', 'font-medium'); // 16px/24px → 18px/24px
    });
  });

  describe('Responsive Body Text Variants', () => {
    it('renders body variant correctly with responsive classes', () => {
      render(<Typography variant="body">Regular body text</Typography>);

      const text = screen.getByText('Regular body text');

      expect(text.tagName).toBe('P');
      expect(text).toHaveClass(
        'text-body-responsive', // 14px/20px mobile (WCAG minimum) → 16px/24px tablet+
        '[&:not(:first-child)]:mt-6'
      );
    });

    it('renders body-sm variant with responsive small text', () => {
      render(<Typography variant="body-sm">Small body text</Typography>);

      const text = screen.getByText('Small body text');

      expect(text).toHaveClass(
        'text-body-sm-responsive', // 14px/20px minimum maintained across all screens
        '[&:not(:first-child)]:mt-4'
      );
    });

    it('renders body-lg variant with responsive large text', () => {
      render(<Typography variant="body-lg">Large body text</Typography>);

      const text = screen.getByText('Large body text');

      expect(text).toHaveClass(
        'text-body-lg-responsive', // 16px/24px mobile → 18px/28px tablet+
        '[&:not(:first-child)]:mt-6'
      );
    });

    it('renders lead variant for responsive introductory text', () => {
      render(<Typography variant="lead">Lead paragraph text</Typography>);

      const text = screen.getByText('Lead paragraph text');

      expect(text).toHaveClass(
        'text-lead-responsive', // 18px/28px mobile → 20px/30px tablet+
        'font-normal'
      );
    });
  });

  describe('Responsive UI Text Variants', () => {
    it('renders text-button variant correctly with responsive classes', () => {
      render(<Typography variant="text-button">Button Text</Typography>);

      const text = screen.getByText('Button Text');

      expect(text).toHaveClass(
        'text-button-responsive', // 14px/20px, weight 500
        'font-medium'
      );
    });

    it('renders text-caption variant correctly with responsive classes', () => {
      render(<Typography variant="text-caption">Caption Text</Typography>);

      const text = screen.getByText('Caption Text');

      expect(text).toHaveClass(
        'text-caption-responsive', // 12px/16px mobile → 14px/20px tablet+
        'font-normal'
      );
    });

    it('renders text-overline variant correctly', () => {
      render(<Typography variant="text-overline">OVERLINE TEXT</Typography>);

      const text = screen.getByText('OVERLINE TEXT');

      expect(text).toHaveClass(
        'text-[0.625rem]', // 10px
        'font-medium',
        'uppercase',
        'leading-4',
        'tracking-widest'
      );
    });
  });

  describe('Modern Sage Responsive Variants', () => {
    it('renders sage-hero variant with responsive h1 sizing', () => {
      render(<Typography variant="sage-hero">Hero Headline</Typography>);

      const text = screen.getByText('Hero Headline');

      expect(text).toHaveClass(
        'text-h1', // Uses responsive h1 sizing
        'font-bold',
        'tracking-tight'
      );
    });

    it('renders sage-display variant with extra large responsive sizing', () => {
      render(<Typography variant="sage-display">Display Text</Typography>);

      const text = screen.getByText('Display Text');

      expect(text).toHaveClass(
        'text-4xl',
        'font-bold',
        'tracking-tight',
        'md:text-5xl',
        'lg:text-6xl',
        'xl:text-7xl'
      );
    });

    it('renders sage-subtitle variant with responsive body-lg sizing', () => {
      render(<Typography variant="sage-subtitle">Subtitle Text</Typography>);

      const text = screen.getByText('Subtitle Text');

      expect(text).toHaveClass(
        'text-body-lg-responsive', // Uses responsive body-lg sizing
        'font-medium'
      );
    });

    it('renders sage-caption variant with responsive caption sizing', () => {
      render(<Typography variant="sage-caption">Caption Text</Typography>);

      const text = screen.getByText('Caption Text');

      expect(text).toHaveClass(
        'text-caption-responsive', // Uses responsive caption sizing
        'font-normal'
      );
    });
  });

  describe('Color Variants', () => {
    it('applies default color correctly', () => {
      render(<Typography color="default">Default color text</Typography>);

      const text = screen.getByText('Default color text');

      expect(text).toHaveClass('text-foreground');
    });

    it('applies Modern Sage primary color', () => {
      render(<Typography color="sage-primary">Sage primary text</Typography>);

      const text = screen.getByText('Sage primary text');

      expect(text).toHaveClass('text-sage-quietude');
    });

    it('applies Modern Sage accent color', () => {
      render(<Typography color="sage-accent">Sage accent text</Typography>);

      const text = screen.getByText('Sage accent text');

      expect(text).toHaveClass('text-sage-growth');
    });

    it('applies Modern Sage gradient text', () => {
      render(<Typography color="sage-gradient">Gradient text</Typography>);

      const text = screen.getByText('Gradient text');

      expect(text).toHaveClass('sage-text-gradient');
    });

    it('applies muted color for secondary text', () => {
      render(<Typography color="muted">Muted text</Typography>);

      const text = screen.getByText('Muted text');

      expect(text).toHaveClass('text-muted-foreground');
    });
  });

  describe('Weight Variants', () => {
    it('applies font weight correctly', () => {
      render(<Typography weight="bold">Bold text</Typography>);

      const text = screen.getByText('Bold text');

      expect(text).toHaveClass('font-bold');
    });

    it('applies medium weight for UI elements', () => {
      render(<Typography weight="medium">Medium weight text</Typography>);

      const text = screen.getByText('Medium weight text');

      expect(text).toHaveClass('font-medium');
    });
  });

  describe('Alignment Options', () => {
    it('applies text alignment correctly', () => {
      render(<Typography align="center">Centered text</Typography>);

      const text = screen.getByText('Centered text');

      expect(text).toHaveClass('text-center');
    });

    it('applies right alignment', () => {
      render(<Typography align="right">Right-aligned text</Typography>);

      const text = screen.getByText('Right-aligned text');

      expect(text).toHaveClass('text-right');
    });
  });

  describe('Special Elements', () => {
    it('renders blockquote variant correctly', () => {
      render(<Typography variant="blockquote">Quote text</Typography>);

      const quote = screen.getByText('Quote text');

      expect(quote.tagName).toBe('BLOCKQUOTE');
      expect(quote).toHaveClass(
        'mt-6',
        'border-l-2',
        'pl-6',
        'font-normal',
        'italic'
      );
    });

    it('renders code variant correctly', () => {
      render(<Typography variant="code">Code text</Typography>);

      const code = screen.getByText('Code text');

      expect(code.tagName).toBe('CODE');
      expect(code).toHaveClass(
        'relative',
        'rounded',
        'bg-muted',
        'font-mono',
        'text-sm',
        'font-semibold'
      );
    });

    it('renders list variant correctly', () => {
      render(
        <Typography variant="list">
          <li>First item</li>
          <li>Second item</li>
        </Typography>
      );

      const list = screen.getByRole('list');

      expect(list.tagName).toBe('UL');
      expect(list).toHaveClass('my-6', 'ml-6', 'list-disc');
    });
  });

  describe('Element Customization', () => {
    it('renders custom element using as prop', () => {
      render(<Typography as="span" variant="body">Span element</Typography>);

      const element = screen.getByText('Span element');

      expect(element.tagName).toBe('SPAN');
    });

    it('renders with asChild prop for composition', () => {
      render(
        <Typography variant="h2" asChild>
          <button type="button">Button with h2 styling</button>
        </Typography>
      );

      const button = screen.getByRole('button');

      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveClass('text-h2', 'scroll-m-20', 'font-semibold');
    });
  });

  describe('Accessibility Features', () => {
    it('maintains semantic HTML structure', () => {
      render(
        <div>
          <Typography variant="h1">Main Title</Typography>
          <Typography variant="h2">Section Title</Typography>
          <Typography variant="h3">Subsection</Typography>
          <Typography variant="body">Body content</Typography>
        </div>
      );

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });

    it('includes scroll margin for anchor links', () => {
      render(<Typography variant="h2">Section with scroll margin</Typography>);

      const heading = screen.getByRole('heading', { level: 2 });

      expect(heading).toHaveClass('scroll-m-20'); // 5rem scroll margin for fixed headers
    });
  });

  describe('Modern Sage Theme Integration', () => {
    it('integrates with theme system', () => {
      render(<Typography color="sage-primary">Themed text</Typography>);

      const text = screen.getByText('Themed text');

      expectElementToHaveModernSageTheme(text);
    });

    it('supports gradient text with brand colors', () => {
      render(<Typography color="sage-gradient">Gradient brand text</Typography>);

      const text = screen.getByText('Gradient brand text');

      expect(text).toHaveClass('sage-text-gradient');
    });
  });

  describe('Responsive Behavior Validation', () => {
    it('applies responsive size utilities correctly', () => {
      render(<Typography size="responsive-h1">Responsive sized text</Typography>);

      const text = screen.getByText('Responsive sized text');

      expect(text).toHaveClass('text-h1'); // Should use the responsive h1 class
    });

    it('combines responsive variants with other props', () => {
      render(
        <Typography
          variant="h2"
          color="sage-primary"
          align="center"
          weight="bold"
        >
          Combined responsive text
        </Typography>
      );

      const text = screen.getByText('Combined responsive text');

      expect(text).toHaveClass(
        'text-h2', // Responsive sizing
        'text-sage-quietude', // Brand color
        'text-center', // Alignment
        'font-bold' // Weight override
      );
    });
  });
});
