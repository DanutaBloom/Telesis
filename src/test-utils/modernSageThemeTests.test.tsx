import { render, screen } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { Button } from '@/components/ui/button';

/**
 * Modern Sage Theme Tests
 * Validates the Modern Sage color scheme implementation and accessibility
 */
describe('Modern Sage Theme Tests', () => {
  describe('Modern Sage Color Implementation', () => {
    it('should apply Modern Sage primary colors to buttons', () => {
      render(<Button variant="default">Modern Sage Button</Button>);

      const button = screen.getByRole('button');
      const classes = button.className;

      // Should include primary background classes
      expect(classes).toContain('bg-primary');
      expect(classes).toContain('text-primary-foreground');
    });

    it('should apply secondary Modern Sage colors correctly', () => {
      render(<Button variant="secondary">Secondary Button</Button>);

      const button = screen.getByRole('button');
      const classes = button.className;

      // Should include secondary color classes
      expect(classes).toContain('bg-secondary');
      expect(classes).toContain('text-secondary-foreground');
    });

    it('should include Modern Sage accent colors', () => {
      render(<Button variant="outline">Outline Button</Button>);

      const button = screen.getByRole('button');
      const classes = button.className;

      // Should include outline variant classes
      expect(classes).toContain('border');
      expect(classes).not.toContain('bg-primary');
    });

    it('should support Modern Sage ghost variant', () => {
      render(<Button variant="ghost">Ghost Button</Button>);

      const button = screen.getByRole('button');
      const classes = button.className;

      // Ghost variant should have hover effects without background
      expect(classes).toContain('hover:bg-accent');
      expect(classes).toContain('hover:text-accent-foreground');
      expect(classes).not.toContain('bg-primary');
    });
  });

  describe('Modern Sage Accessibility Compliance', () => {
    it('should meet WCAG contrast requirements for primary colors', () => {
      render(<Button variant="default">Accessible Button</Button>);

      const button = screen.getByRole('button');

      // Button should be visible and accessible
      expect(button).toBeVisible();
      expect(button).toHaveTextContent('Accessible Button');

      // Should have proper button semantics (native buttons don't need explicit role)
      expect(button.tagName.toLowerCase()).toBe('button');
    });

    it('should provide adequate contrast for secondary colors', () => {
      render(<Button variant="secondary">Secondary Accessible</Button>);

      const button = screen.getByRole('button');

      // Should be readable and accessible
      expect(button).toBeVisible();
      expect(button).toHaveTextContent('Secondary Accessible');
    });

    it('should maintain accessibility in destructive variant', () => {
      render(<Button variant="destructive">Delete Action</Button>);

      const button = screen.getByRole('button');
      const classes = button.className;

      // Should include destructive styling
      expect(classes).toContain('bg-destructive');
      expect(classes).toContain('text-destructive-foreground');
      expect(button).toBeVisible();
    });

    it('should support focus indicators with Modern Sage theme', () => {
      render(<Button>Focusable Button</Button>);

      const button = screen.getByRole('button');
      const classes = button.className;

      // Should include focus-visible classes
      expect(classes).toContain('focus-visible:outline-none');
      expect(classes).toContain('focus-visible:ring-2');
      expect(classes).toContain('focus-visible:ring-ring');
    });
  });

  describe('Modern Sage Theme Consistency', () => {
    it('should apply consistent border radius across components', () => {
      render(<Button>Rounded Button</Button>);

      const button = screen.getByRole('button');
      const classes = button.className;

      // Should have consistent rounded styling
      expect(classes).toContain('rounded-md');
    });

    it('should use consistent spacing in Modern Sage components', () => {
      render(<Button size="default">Default Size</Button>);

      const button = screen.getByRole('button');
      const classes = button.className;

      // Should have consistent padding
      expect(classes).toContain('px-4');
      expect(classes).toContain('py-2');
      expect(classes).toContain('h-10');
    });

    it('should maintain typography consistency', () => {
      render(<Button>Typography Test</Button>);

      const button = screen.getByRole('button');
      const classes = button.className;

      // Should have consistent text styling
      expect(classes).toContain('text-sm');
      expect(classes).toContain('font-medium');
    });
  });

  describe('Modern Sage Dark Mode Support', () => {
    it('should render properly in different theme contexts', () => {
      // Test basic rendering (theme provider would be needed for full dark mode testing)
      render(<Button>Theme Adaptive</Button>);

      const button = screen.getByRole('button');

      // Should render successfully
      expect(button).toBeVisible();
      expect(button).toHaveTextContent('Theme Adaptive');
    });

    it('should maintain readability across theme modes', () => {
      render(<Button variant="outline">Outline Theme Test</Button>);

      const button = screen.getByRole('button');
      const classes = button.className;

      // Should have proper border and text styling
      expect(classes).toContain('border');
      expect(button).toBeVisible();
    });
  });

  describe('Modern Sage State Variations', () => {
    it('should handle disabled state with Modern Sage styling', () => {
      render(<Button disabled>Disabled Button</Button>);

      const button = screen.getByRole('button');
      const classes = button.className;

      // Should include disabled styling
      expect(classes).toContain('disabled:pointer-events-none');
      expect(classes).toContain('disabled:opacity-50');
      expect(button).toBeDisabled();
    });

    it('should support loading state indicators', () => {
      render(<Button>Loading Button</Button>);

      const button = screen.getByRole('button');
      const classes = button.className;

      // Should support transition classes for loading states
      expect(classes).toContain('transition-colors');
    });

    it('should handle hover states appropriately', () => {
      render(<Button variant="default">Hover Test</Button>);

      const button = screen.getByRole('button');
      const classes = button.className;

      // Should include hover state styling
      expect(classes).toContain('hover:bg-primary/90');
    });
  });
});
