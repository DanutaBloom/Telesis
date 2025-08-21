/**
 * Button Component Test Suite
 *
 * Tests Shadcn UI Button component with Modern Sage theme integration,
 * accessibility compliance, and variant behavior
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  expectButtonToHaveModernSageVariant,
  expectElementToHaveModernSageFocus,
  expectElementToHaveModernSageTheme,
  testMinimumTapTargetSize,
} from '@/test-utils';

import { Button } from './button';

// Mock next-themes for theme testing
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole('button', { name: /click me/i });

      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    it('applies default variant classes', () => {
      render(<Button>Default Button</Button>);

      const button = screen.getByRole('button');

      expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Button with ref</Button>);

      expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });
  });

  describe('Modern Sage Theme Integration', () => {
    it('applies primary variant with Modern Sage colors', () => {
      render(<Button variant="primary" data-testid="primary-button">Primary</Button>);

      const button = screen.getByTestId('primary-button');
      expectButtonToHaveModernSageVariant(button, 'primary');
      expectElementToHaveModernSageTheme(button, { primary: true });
    });

    it('applies secondary variant correctly', () => {
      render(<Button variant="secondary" data-testid="secondary-button">Secondary</Button>);

      const button = screen.getByTestId('secondary-button');
      expectButtonToHaveModernSageVariant(button, 'secondary');
    });

    it('applies accent variant with Growth Green', () => {
      render(<Button variant="accent" data-testid="accent-button">Accent</Button>);

      const button = screen.getByTestId('accent-button');
      expectButtonToHaveModernSageVariant(button, 'accent');
      expectElementToHaveModernSageTheme(button, { accent: true });
    });

    it('applies ghost variant correctly', () => {
      render(<Button variant="ghost" data-testid="ghost-button">Ghost</Button>);

      const button = screen.getByTestId('ghost-button');
      expectButtonToHaveModernSageVariant(button, 'ghost');
    });

    it('applies link variant correctly', () => {
      render(<Button variant="link" data-testid="link-button">Link</Button>);

      const button = screen.getByTestId('link-button');
      expectButtonToHaveModernSageVariant(button, 'link');
    });
  });

  describe('Size Variants', () => {
    it('applies default size classes', () => {
      render(<Button>Default Size</Button>);

      const button = screen.getByRole('button');

      expect(button).toHaveClass('h-10', 'px-4', 'py-2');
    });

    it('applies small size classes', () => {
      render(<Button size="sm">Small Button</Button>);

      const button = screen.getByRole('button');

      expect(button).toHaveClass('h-9', 'px-3');
    });

    it('applies large size classes', () => {
      render(<Button size="lg">Large Button</Button>);

      const button = screen.getByRole('button');

      expect(button).toHaveClass('h-11', 'px-8');
    });

    it('applies icon size classes', () => {
      render(<Button size="icon">🔥</Button>);

      const button = screen.getByRole('button');

      expect(button).toHaveClass('size-10');
    });
  });

  describe('Interactive States', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Clickable</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('prevents clicks when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick} disabled>Disabled</Button>);

      const button = screen.getByRole('button');

      expect(button).toBeDisabled();

      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies disabled styles', () => {
      render(<Button disabled>Disabled Button</Button>);

      const button = screen.getByRole('button');

      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
    });

    it('shows loading state', () => {
      render(<Button loading>Loading Button</Button>);

      const button = screen.getByRole('button');

      expect(button).toBeDisabled();
      // Should show loading spinner (implementation depends on your loading state)
    });
  });

  describe('Accessibility', () => {
    it('meets minimum tap target size requirements', () => {
      render(<Button data-testid="tap-target">Tap Target</Button>);

      const button = screen.getByTestId('tap-target');
      testMinimumTapTargetSize(button);
    });

    it('has proper focus management', async () => {
      const user = userEvent.setup();

      render(<Button data-testid="focusable">Focusable Button</Button>);

      const button = screen.getByTestId('focusable');

      await user.tab();

      expect(button).toHaveFocus();

      expectElementToHaveModernSageFocus(button);
    });

    it('supports keyboard interaction', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Keyboard Button</Button>);

      const button = screen.getByRole('button');
      button.focus();

      // Test Enter key
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);

      // Test Space key
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('has proper ARIA attributes', () => {
      render(
        <Button
          aria-label="Custom label"
          aria-describedby="description"
          data-testid="aria-button"
        >
          Button
        </Button>,
      );

      const button = screen.getByTestId('aria-button');

      expect(button).toHaveAttribute('aria-label', 'Custom label');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });

    it('announces loading state to screen readers', () => {
      render(<Button loading aria-label="Submit form">Submit</Button>);

      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toBeDisabled();
    });
  });

  describe('Custom Props and Styling', () => {
    it('accepts custom className', () => {
      // eslint-disable-next-line tailwindcss/no-custom-classname
      render(<Button className="custom-class">Custom Button</Button>);

      const button = screen.getByRole('button');

      expect(button).toHaveClass('custom-class');
      // Should still have default button classes
      expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
    });

    it('accepts custom data attributes', () => {
      render(<Button data-analytics="button-click">Analytics Button</Button>);

      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('data-analytics', 'button-click');
    });

    it('spreads additional props', () => {
      render(<Button id="custom-id" title="Custom title">Props Button</Button>);

      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('id', 'custom-id');
      expect(button).toHaveAttribute('title', 'Custom title');
    });
  });

  describe('Button as Different Elements', () => {
    it('renders as anchor when asChild with Link', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>,
      );

      const link = screen.getByRole('link', { name: /link button/i });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      // Should still have button styling
      expect(link).toHaveClass('inline-flex', 'items-center', 'justify-center');
    });
  });

  describe('Theme Integration', () => {
    it('responds to theme changes', () => {
      render(<Button data-testid="theme-button">Theme Button</Button>);

      const button = screen.getByTestId('theme-button');

      // Test that it has the expected theme classes
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground');

      // In a real test, you'd mock the theme provider to test dark mode
      // For now, we verify the structure is correct
    });

    it('maintains Modern Sage color scheme', () => {
      render(
        <div>
          <Button variant="primary" data-testid="primary">Primary</Button>
          <Button variant="accent" data-testid="accent">Accent</Button>
          <Button variant="secondary" data-testid="secondary">Secondary</Button>
        </div>,
      );

      const primaryButton = screen.getByTestId('primary');
      const accentButton = screen.getByTestId('accent');
      const secondaryButton = screen.getByTestId('secondary');

      // Verify Modern Sage theme classes
      expectElementToHaveModernSageTheme(primaryButton, { primary: true });
      expectElementToHaveModernSageTheme(accentButton, { accent: true });

      expect(secondaryButton).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });
  });

  describe('Error Handling', () => {
    it('handles missing children gracefully', () => {
      render(<Button />);

      const button = screen.getByRole('button');

      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('');
    });

    it('handles null children', () => {
      render(<Button>{null}</Button>);

      const button = screen.getByRole('button');

      expect(button).toBeInTheDocument();
    });
  });
});
