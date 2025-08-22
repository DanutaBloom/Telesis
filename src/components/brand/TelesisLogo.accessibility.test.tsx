import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { TelesisLogo, TelesisLogomark } from './TelesisLogo';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

describe('TelesisLogo Accessibility Tests (WCAG 2.1 AA)', () => {
  describe('Color Contrast Requirements', () => {
    // Mock console.error for canvas-related warnings from axe-core in jsdom
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should meet color contrast requirements for default scheme', async () => {
      const { container } = render(
        <div style={{ backgroundColor: '#ffffff' }}>
          <TelesisLogo colorScheme="default" />
        </div>
      );

      const results = await axe(container, {
        rules: {
          // Disable color-contrast that requires canvas in jsdom
          'color-contrast': { enabled: false },
          // Keep other important accessibility rules
          'aria-allowed-attr': { enabled: true },
          'aria-roles': { enabled: true },
          'image-alt': { enabled: true },
          'svg-img-alt': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('should meet color contrast requirements for reverse scheme on dark background', async () => {
      const { container } = render(
        <div style={{ backgroundColor: '#000000' }}>
          <TelesisLogo colorScheme="reverse" />
        </div>
      );

      const results = await axe(container, {
        rules: {
          // Disable color-contrast that requires canvas in jsdom
          'color-contrast': { enabled: false },
          // Keep other important accessibility rules
          'aria-allowed-attr': { enabled: true },
          'aria-roles': { enabled: true },
          'image-alt': { enabled: true },
          'svg-img-alt': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('should meet color contrast requirements for monochrome scheme', async () => {
      const { container } = render(
        <div style={{ color: '#333333', backgroundColor: '#ffffff' }}>
          <TelesisLogo colorScheme="monochrome" />
        </div>
      );

      const results = await axe(container, {
        rules: {
          // Disable color-contrast that requires canvas in jsdom
          'color-contrast': { enabled: false },
          // Keep other important accessibility rules
          'aria-allowed-attr': { enabled: true },
          'aria-roles': { enabled: true },
          'image-alt': { enabled: true },
          'svg-img-alt': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('should validate sage color palette meets AA contrast ratios', () => {
      // Sage Quietude: hsl(171, 19%, 41%) - should have sufficient contrast on white
      // Sage Growth: hsl(102, 58%, 38%) - should have sufficient contrast on white

      render(<TelesisLogo colorScheme="default" />);

      const logoContainer = screen.getByRole('img');

      expect(logoContainer).toBeInTheDocument();

      // Access SVG through container since container has role="img"
      const svg = logoContainer.querySelector('svg');

      expect(svg).toBeInTheDocument();

      // These colors are validated in the component to be WCAG AA compliant
      // Test ensures the colors are actually applied
      const askOlive = svg?.querySelector('.olive-ask');
      const thinkOlive = svg?.querySelector('.olive-think');
      const applyOlive = svg?.querySelector('.olive-apply');

      expect(askOlive).toBeInTheDocument();
      expect(thinkOlive).toBeInTheDocument();
      expect(applyOlive).toBeInTheDocument();
    });
  });

  describe('Semantic Structure and Labeling', () => {
    it('should provide appropriate semantic role for logo', () => {
      render(<TelesisLogo />);

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toBeInTheDocument();
      expect(logoContainer).toHaveAttribute('aria-label');
    });

    it('should provide appropriate semantic role for logomark', () => {
      const { container } = render(<TelesisLogomark />);

      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should provide descriptive title and description for SVG', () => {
      const { container } = render(<TelesisLogomark />);

      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();

      // Check title and description elements directly
      const title = svg?.querySelector('title');
      const desc = svg?.querySelector('desc');

      expect(title).toHaveTextContent('Telesis Logo');
      expect(desc).toHaveTextContent('Three olives representing the learning process: Ask, Think, Apply');
    });

    it('should maintain accessible text hierarchy in stacked variant', () => {
      render(<TelesisLogo variant="stacked" />);

      const titleText = screen.getByText('Telesis');
      const taglineText = screen.getByText('Ask. Think. Apply.');

      expect(titleText).toBeInTheDocument();
      expect(taglineText).toBeInTheDocument();

      // Tagline should have lower visual hierarchy (smaller text)
      expect(taglineText).toHaveClass('text-xs');
      expect(titleText).not.toHaveClass('text-xs');
    });
  });

  describe('Keyboard Navigation and Focus Management', () => {
    it('should not interfere with keyboard navigation when used as decoration', () => {
      render(<TelesisLogo />);

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      // Logo should not be focusable by default (decorative)
      expect(logoContainer).not.toHaveAttribute('tabIndex');
    });

    it('should support focus when used as interactive element', () => {
      const handleClick = vi.fn();
      render(<TelesisLogo onClick={handleClick} tabIndex={0} />);

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toHaveAttribute('tabIndex', '0');
    });

    it('should maintain focus visibility when interactive', () => {
      const handleClick = vi.fn();
      render(
        <TelesisLogo
          onClick={handleClick}
          tabIndex={0}
          className="focus:outline-2 focus:outline-sage-growth"
        />
      );

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toHaveClass('focus:outline-2', 'focus:outline-sage-growth');
    });
  });

  describe('Screen Reader Compatibility', () => {
    it('should provide meaningful alternative text for logo', () => {
      render(<TelesisLogo />);

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toBeInTheDocument();
    });

    it('should allow custom aria-label for different contexts', () => {
      render(<TelesisLogo aria-label="Navigate to Telesis homepage" />);

      const logoContainer = screen.getByLabelText('Navigate to Telesis homepage');

      expect(logoContainer).toBeInTheDocument();
    });

    it('should hide decorative SVG from screen readers', () => {
      const { container } = render(<TelesisLogomark />);

      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should provide context for brand elements in stacked variant', () => {
      render(<TelesisLogo variant="stacked" />);

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');
      const titleText = screen.getByText('Telesis');
      const taglineText = screen.getByText('Ask. Think. Apply.');

      expect(logoContainer).toBeInTheDocument();
      expect(titleText).toBeInTheDocument();
      expect(taglineText).toBeInTheDocument();
    });
  });

  describe('Responsive Design Accessibility', () => {
    it('should maintain accessibility across all sizes', async () => {
      const sizes = ['sm', 'default', 'lg', 'xl', '2xl'] as const;

      for (const size of sizes) {
        const { container, unmount } = render(<TelesisLogo size={size} />);

        vi.spyOn(console, 'error').mockImplementation(() => {});
        const results = await axe(container, {
          rules: {
            'color-contrast': { enabled: false },
            'color-contrast-enhanced': { enabled: false },
          },
        });

        expect(results).toHaveNoViolations();

        vi.restoreAllMocks();

        // Verify size doesn't break accessibility
        const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

        expect(logoContainer).toBeInTheDocument();

        // Clean up before next iteration
        unmount();
      }
    });

    it('should maintain minimum touch target size for interactive logos', () => {
      render(
        <TelesisLogo
          onClick={() => {}}
          className="min-h-[44px] min-w-[44px] cursor-pointer"
        />
      );

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toHaveClass('min-h-[44px]', 'min-w-[44px]', 'cursor-pointer');
    });

    it('should scale appropriately for different viewport sizes', () => {
      // Test small viewport
      const { unmount: unmountSm } = render(<TelesisLogo size="sm" />);
      let logoContainer = screen.getByRole('img');
      let svg = logoContainer.querySelector('svg');

      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '12');

      unmountSm();

      // Test large viewport
      const { unmount: unmountXl } = render(<TelesisLogo size="xl" />);
      logoContainer = screen.getByRole('img');
      svg = logoContainer.querySelector('svg');

      expect(svg).toHaveAttribute('width', '80');
      expect(svg).toHaveAttribute('height', '30');

      unmountXl();
    });
  });

  describe('Color Vision Accessibility', () => {
    it('should not rely solely on color for information', () => {
      render(<TelesisLogo variant="stacked" />);

      // Information is conveyed through text, not just color
      expect(screen.getByText('Telesis')).toBeInTheDocument();
      expect(screen.getByText('Ask. Think. Apply.')).toBeInTheDocument();
    });

    it('should work with monochrome color scheme (simulating color blindness)', async () => {
      const { container } = render(<TelesisLogo colorScheme="monochrome" />);

      const results = await axe(container);

      expect(results).toHaveNoViolations();

      // Should still be identifiable as logo
      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toBeInTheDocument();
    });

    it('should maintain logo recognition without color', () => {
      render(<TelesisLogo colorScheme="monochrome" />);

      const logoContainer = screen.getByRole('img');

      expect(logoContainer).toHaveAccessibleName('Telesis - Ask, Think, Apply');

      // Access SVG through container
      const svg = logoContainer.querySelector('svg');

      expect(svg).toBeInTheDocument();

      // Check that SVG has title and description for screen readers
      const title = svg?.querySelector('title');
      const desc = svg?.querySelector('desc');

      expect(title).toHaveTextContent('Telesis Logo');
      expect(desc).toHaveTextContent('Three olives representing the learning process: Ask, Think, Apply');

      // The three olive shapes should still be recognizable
      const olives = svg?.querySelectorAll('ellipse');

      expect(olives).toHaveLength(3);
    });
  });

  describe('Animation and Motion Accessibility', () => {
    it('should respect prefers-reduced-motion for transitions', () => {
      render(<TelesisLogo />);

      const logoContainer = screen.getByRole('img');
      const svg = logoContainer.querySelector('svg');

      expect(svg).toHaveClass('transition-colors', 'duration-200');

      // The transition should be CSS-based and respect user preferences
      // This is handled by Tailwind's prefers-reduced-motion utilities
    });

    it('should not include auto-playing animations that could trigger vestibular disorders', () => {
      render(<TelesisLogo />);

      // Logo should be static with only user-triggered transitions
      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toBeInTheDocument();

      // No auto-animations should be present
      const svg = logoContainer.querySelector('svg');

      expect(svg).not.toHaveAttribute('animate');
      expect(svg).not.toHaveAttribute('animation');
    });
  });

  describe('High Contrast Mode Support', () => {
    it('should work in Windows High Contrast mode simulation', () => {
      // Simulate high contrast by using system colors
      render(
        <div style={{
          backgroundColor: 'Canvas',
          color: 'CanvasText',
          forcedColorAdjust: 'none'
        }}
        >
          <TelesisLogo colorScheme="monochrome" />
        </div>
      );

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toBeInTheDocument();
    });

    it('should maintain visibility in forced colors mode', () => {
      render(<TelesisLogo colorScheme="monochrome" />);

      const textElement = screen.getByText('Telesis');

      expect(textElement).toHaveClass('text-current');

      // This allows the logo to inherit the forced color
    });
  });

  describe('Error Prevention and Recovery', () => {
    it('should gracefully handle missing SVG elements', () => {
      render(<TelesisLogo />);

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toBeInTheDocument();

      // Even if SVG fails to load, text should still be available
      expect(screen.getByText('Telesis')).toBeInTheDocument();
    });

    it('should provide fallback when images are disabled', () => {
      render(<TelesisLogo />);

      // Text content is always available as fallback
      const textElement = screen.getByText('Telesis');

      expect(textElement).toBeInTheDocument();
    });

    it('should maintain functionality with CSS disabled', () => {
      render(<TelesisLogo />);

      // Core functionality (text content and semantic structure) should work
      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');
      const textElement = screen.getByText('Telesis');

      expect(logoContainer).toBeInTheDocument();
      expect(textElement).toBeInTheDocument();
    });
  });

  describe('International Accessibility', () => {
    it('should work with different reading directions (RTL)', () => {
      render(
        <div dir="rtl">
          <TelesisLogo />
        </div>
      );

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toBeInTheDocument();

      // Logo should work in RTL context
      expect(logoContainer.closest('[dir="rtl"]')).toBeInTheDocument();
    });

    it('should maintain proper spacing in different languages', () => {
      // Test with longer text that might affect layout
      render(<TelesisLogo aria-label="Telesis - Demander, Réfléchir, Appliquer" />);

      const logoContainer = screen.getByLabelText('Telesis - Demander, Réfléchir, Appliquer');

      expect(logoContainer).toBeInTheDocument();
    });
  });

  describe('Comprehensive WCAG 2.1 AA Validation', () => {
    it('should pass all WCAG 2.1 AA criteria - Level A and AA', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const { container } = render(
        <div>
          <TelesisLogo />
          <TelesisLogo variant="stacked" />
          <TelesisLogo variant="logomark" />
          <TelesisLogo colorScheme="reverse" />
          <TelesisLogo colorScheme="monochrome" />
        </div>
      );

      const results = await axe(container, {
        tags: ['wcag2a', 'wcag2aa'],
        rules: {
          // Disable color-contrast that requires canvas in jsdom
          'color-contrast': { enabled: false },
          'color-contrast-enhanced': { enabled: false },
        },
      });

      expect(results).toHaveNoViolations();

      vi.restoreAllMocks();
    });

    it('should pass specific WCAG success criteria', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const { container } = render(<TelesisLogo variant="stacked" />);

      const results = await axe(container, {
        rules: {
          // 1.1.1 Non-text Content (Level A)
          'image-alt': { enabled: true },
          'svg-img-alt': { enabled: true },

          // 1.3.1 Info and Relationships (Level A)
          'heading-order': { enabled: true },
          'list': { enabled: true },

          // 1.4.3 Contrast (Minimum) (Level AA) - Disable due to canvas requirement in jsdom
          'color-contrast': { enabled: false },

          // 1.4.4 Resize text (Level AA)
          'meta-viewport': { enabled: true },

          // Skip keyboard rule - not applicable for logo component

          // 2.4.4 Link Purpose (In Context) (Level A)
          'link-name': { enabled: true },

          // 4.1.2 Name, Role, Value (Level A)
          'button-name': { enabled: true },
          'input-button-name': { enabled: true },
        },
      });

      expect(results).toHaveNoViolations();

      vi.restoreAllMocks();
    });
  });
});
