import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { AppConfig } from '@/utils/AppConfig';

import { Logo } from './Logo';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

describe('Logo Template Component', () => {
  describe('Integration with AppConfig', () => {
    it('should render with AppConfig name and tagline in aria-label', () => {
      render(<Logo />);

      const expectedLabel = `${AppConfig.name} - ${AppConfig.tagline}`;
      const logoContainer = screen.getByLabelText(expectedLabel);

      expect(logoContainer).toBeInTheDocument();
    });

    it('should display AppConfig name as text', () => {
      render(<Logo />);

      expect(screen.getByText(AppConfig.name)).toBeInTheDocument();
    });

    it('should display AppConfig tagline in stacked variant', () => {
      render(<Logo variant="stacked" />);

      expect(screen.getByText(AppConfig.tagline)).toBeInTheDocument();
    });
  });

  describe('Prop Forwarding to ThreeOlivesLogo', () => {
    it('should forward variant prop correctly', () => {
      render(<Logo variant="stacked" />);

      const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

      expect(logoContainer).toHaveClass('flex-col', 'gap-y-1');
    });

    it('should forward size prop correctly', () => {
      render(<Logo size="xl" />);

      const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

      expect(logoContainer).toHaveClass('text-xl');
    });

    it('should forward colorScheme prop correctly', () => {
      render(<Logo colorScheme="reverse" />);

      const textElement = screen.getByText(AppConfig.name);

      expect(textElement).toHaveClass('text-white');
    });

    it('should forward className prop correctly', () => {
      const customClass = 'custom-template-logo';
      render(<Logo className={customClass} />);

      const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

      expect(logoContainer).toHaveClass(customClass);
    });
  });

  describe('isTextHidden Prop Logic', () => {
    it('should show text by default', () => {
      render(<Logo />);

      expect(screen.getByText(AppConfig.name)).toBeInTheDocument();
    });

    it('should hide text when isTextHidden is true', () => {
      render(<Logo isTextHidden />);

      expect(screen.queryByText(AppConfig.name)).not.toBeInTheDocument();
    });

    it('should override variant to logomark when isTextHidden is true', () => {
      render(<Logo isTextHidden variant="stacked" />);

      // Should not show text despite stacked variant
      expect(screen.queryByText(AppConfig.name)).not.toBeInTheDocument();
      expect(screen.queryByText(AppConfig.tagline)).not.toBeInTheDocument();
    });

    it('should set showText to false when isTextHidden is true', () => {
      render(<Logo isTextHidden />);

      const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

      expect(logoContainer).toBeInTheDocument();
      expect(screen.queryByText(AppConfig.name)).not.toBeInTheDocument();
    });
  });

  describe('Default Props Behavior', () => {
    it('should use horizontal variant by default', () => {
      render(<Logo />);

      const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

      expect(logoContainer).toHaveClass('inline-flex', 'items-center', 'gap-x-2');
      expect(logoContainer).not.toHaveClass('flex-col', 'gap-y-1');
    });

    it('should use default size by default', () => {
      render(<Logo />);

      const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

      expect(logoContainer).toHaveClass('text-base');
    });

    it('should use default color scheme by default', () => {
      render(<Logo />);

      const textElement = screen.getByText(AppConfig.name);

      expect(textElement).toHaveClass('text-foreground');
    });
  });

  describe('All Variant Combinations', () => {
    const variants = ['logomark', 'horizontal', 'stacked'] as const;
    const sizes = ['sm', 'default', 'lg', 'xl', '2xl'] as const;
    const colorSchemes = ['default', 'monochrome', 'reverse'] as const;

    variants.forEach((variant) => {
      it(`should render ${variant} variant correctly`, () => {
        render(<Logo variant={variant} />);

        const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

        expect(logoContainer).toBeInTheDocument();

        if (variant === 'logomark') {
          expect(screen.queryByText(AppConfig.name)).not.toBeInTheDocument();
        } else {
          expect(screen.getByText(AppConfig.name)).toBeInTheDocument();
        }

        if (variant === 'stacked') {
          expect(logoContainer).toHaveClass('flex-col', 'gap-y-1');
          expect(screen.getByText(AppConfig.tagline)).toBeInTheDocument();
        }
      });
    });

    sizes.forEach((size) => {
      it(`should render ${size} size correctly`, () => {
        render(<Logo size={size} />);

        const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);
        if (size === 'default') {
          expect(logoContainer).toHaveClass('text-base');
        } else {
          expect(logoContainer).toHaveClass(`text-${size}`);
        }
      });
    });

    colorSchemes.forEach((colorScheme) => {
      it(`should render ${colorScheme} color scheme correctly`, () => {
        render(<Logo colorScheme={colorScheme} />);

        const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

        expect(logoContainer).toBeInTheDocument();

        const textElement = screen.getByText(AppConfig.name);
        switch (colorScheme) {
          case 'default':
            expect(textElement).toHaveClass('text-foreground');

            break;
          case 'monochrome':
            expect(textElement).toHaveClass('text-current');

            break;
          case 'reverse':
            expect(textElement).toHaveClass('text-white');

            break;
        }
      });
    });
  });

  describe('Complex Prop Combinations', () => {
    it('should handle stacked + reverse color scheme correctly', () => {
      render(<Logo variant="stacked" colorScheme="reverse" />);

      const titleElement = screen.getByText(AppConfig.name);
      const taglineElement = screen.getByText(AppConfig.tagline);

      expect(titleElement).toHaveClass('text-white');
      expect(taglineElement).toHaveClass('text-white/80');
    });

    it('should handle logomark + large size correctly', () => {
      render(<Logo variant="logomark" size="xl" />);

      const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

      expect(logoContainer).toHaveClass('text-xl');
      expect(screen.queryByText(AppConfig.name)).not.toBeInTheDocument();

      // Access SVG through container since container has role="img"
      const svg = logoContainer.querySelector('svg');

      expect(svg).toHaveAttribute('width', '80');
      expect(svg).toHaveAttribute('height', '30');
    });

    it('should handle isTextHidden + stacked variant correctly', () => {
      render(<Logo isTextHidden variant="stacked" size="lg" />);

      const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

      expect(logoContainer).toHaveClass('text-lg');
      expect(screen.queryByText(AppConfig.name)).not.toBeInTheDocument();
      expect(screen.queryByText(AppConfig.tagline)).not.toBeInTheDocument();
    });
  });

  describe('Prop Spreading and Rest Props', () => {
    it('should spread additional props to underlying component', () => {
      render(<Logo data-testid="template-logo" />);

      const logoContainer = screen.getByTestId('template-logo');

      expect(logoContainer).toBeInTheDocument();
    });

    it('should handle data attributes', () => {
      render(<Logo data-analytics="header-logo" data-component="logo" />);

      const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

      expect(logoContainer).toHaveAttribute('data-analytics', 'header-logo');
      expect(logoContainer).toHaveAttribute('data-component', 'logo');
    });

    it('should handle event handlers', () => {
      const handleClick = vi.fn();
      render(<Logo onClick={handleClick} />);

      const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);
      logoContainer.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility Compliance', () => {
    it('should have no accessibility violations - default configuration', async () => {
      const { container } = render(<Logo />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - all variants', async () => {
      const variants = ['logomark', 'horizontal', 'stacked'] as const;

      for (const variant of variants) {
        const { container, rerender } = render(<Logo variant={variant} />);
        const results = await axe(container);

        expect(results).toHaveNoViolations();

        if (variant !== 'stacked') {
          rerender(<Logo variant={variants[variants.indexOf(variant) + 1]} />);
        }
      }
    });

    it('should have no accessibility violations - all color schemes', async () => {
      const colorSchemes = ['default', 'monochrome', 'reverse'] as const;

      for (const colorScheme of colorSchemes) {
        const containerStyle = colorScheme === 'reverse' ? { backgroundColor: 'black' } : {};
        const { container, rerender } = render(
          <div style={containerStyle}>
            <Logo colorScheme={colorScheme} />
          </div>
        );
        const results = await axe(container);

        expect(results).toHaveNoViolations();

        if (colorScheme !== 'reverse') {
          rerender(
            <div style={containerStyle}>
              <Logo colorScheme={colorSchemes[colorSchemes.indexOf(colorScheme) + 1]} />
            </div>
          );
        }
      }
    });

    it('should have no accessibility violations - text hidden', async () => {
      const { container } = render(<Logo isTextHidden />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });

  describe('Integration with Navigation Context', () => {
    it('should work as navigation logo', () => {
      render(
        <nav>
          <Logo />
        </nav>
      );

      const nav = screen.getByRole('navigation');
      const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

      expect(nav).toContainElement(logoContainer);
    });

    it('should work as footer logo', () => {
      render(
        <footer>
          <Logo colorScheme="monochrome" size="sm" />
        </footer>
      );

      const footer = screen.getByRole('contentinfo');
      const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

      expect(footer).toContainElement(logoContainer);
      expect(logoContainer).toHaveClass('text-sm');
    });

    it('should work as standalone brand element', () => {
      render(
        <header>
          <Logo variant="stacked" size="xl" />
        </header>
      );

      const header = screen.getByRole('banner');
      const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

      expect(header).toContainElement(logoContainer);
      expect(logoContainer).toHaveClass('text-xl', 'flex-col');
      expect(screen.getByText(AppConfig.tagline)).toBeInTheDocument();
    });
  });

  describe('Brand Consistency', () => {
    it('should maintain brand consistency across all usage patterns', () => {
      const { rerender } = render(<Logo />);

      // Check that logo container and SVG structure is consistent
      let logoContainer = screen.getByRole('img');

      expect(logoContainer).toHaveAccessibleName(`${AppConfig.name} - ${AppConfig.tagline}`);

      // Check SVG structure through container
      let svg = logoContainer.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');

      // Check that SVG has title and description elements
      expect(svg?.querySelector('title')).toHaveTextContent('Telesis Logo');
      expect(svg?.querySelector('desc')).toHaveTextContent('Three olives representing the learning process: Ask, Think, Apply');

      // Rerender with different props
      rerender(<Logo variant="stacked" size="lg" colorScheme="reverse" />);

      logoContainer = screen.getByRole('img');

      expect(logoContainer).toHaveAccessibleName(`${AppConfig.name} - ${AppConfig.tagline}`);

      svg = logoContainer.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');

      // Check that SVG structure remains consistent
      expect(svg?.querySelector('title')).toHaveTextContent('Telesis Logo');
      expect(svg?.querySelector('desc')).toHaveTextContent('Three olives representing the learning process: Ask, Think, Apply');

      // Should maintain consistent branding
      expect(screen.getByText(AppConfig.name)).toBeInTheDocument();
      expect(screen.getByText(AppConfig.tagline)).toBeInTheDocument();
    });

    it('should use AppConfig values consistently', () => {
      render(<Logo variant="stacked" />);

      expect(screen.getByText(AppConfig.name)).toBeInTheDocument();
      expect(screen.getByText(AppConfig.tagline)).toBeInTheDocument();

      const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

      expect(logoContainer).toBeInTheDocument();
    });
  });

  describe('Backwards Compatibility', () => {
    it('should maintain backward compatibility with ThreeOlivesLogo usage', () => {
      render(<Logo />);

      // Should render the same as direct ThreeOlivesLogo usage
      const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

      expect(logoContainer).toBeInTheDocument();
      expect(logoContainer).toHaveAttribute('role', 'img');
      expect(screen.getByText(AppConfig.name)).toBeInTheDocument();

      // Check SVG structure through container
      const svg = logoContainer.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg?.querySelector('title')).toHaveTextContent('Telesis Logo');
    });

    it('should handle legacy prop patterns', () => {
      // Test that common prop patterns still work
      render(<Logo variant="horizontal" size="default" colorScheme="default" />);

      const logoContainer = screen.getByLabelText(`${AppConfig.name} - ${AppConfig.tagline}`);

      expect(logoContainer).toHaveClass('inline-flex', 'items-center', 'gap-x-2', 'text-base');
      expect(screen.getByText(AppConfig.name)).toBeInTheDocument();
    });
  });
});
