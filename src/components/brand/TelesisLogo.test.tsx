import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { TelesisLogo, TelesisLogomark } from './TelesisLogo';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

describe('TelesisLogo', () => {
  describe('Component Rendering', () => {
    it('should render with default props', () => {
      render(<TelesisLogo />);

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toBeInTheDocument();
      expect(logoContainer).toHaveClass('inline-flex', 'items-center', 'gap-x-2');
    });

    it('should render text when showText is true (default)', () => {
      render(<TelesisLogo />);

      expect(screen.getByText('Telesis')).toBeInTheDocument();
    });

    it('should not render text when showText is false', () => {
      render(<TelesisLogo showText={false} />);

      expect(screen.queryByText('Telesis')).not.toBeInTheDocument();
    });

    it('should not render text when variant is logomark', () => {
      render(<TelesisLogo variant="logomark" />);

      expect(screen.queryByText('Telesis')).not.toBeInTheDocument();
    });
  });

  describe('Variant Prop', () => {
    it('should render horizontal variant (default)', () => {
      render(<TelesisLogo />);

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toHaveClass('inline-flex', 'items-center', 'gap-x-2');
      expect(logoContainer).not.toHaveClass('flex-col', 'gap-y-1');
    });

    it('should render stacked variant', () => {
      render(<TelesisLogo variant="stacked" />);

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toHaveClass('flex-col', 'gap-y-1');
      expect(screen.getByText('Ask. Think. Apply.')).toBeInTheDocument();
    });

    it('should render logomark variant', () => {
      render(<TelesisLogo variant="logomark" />);

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toBeInTheDocument();
      expect(screen.queryByText('Telesis')).not.toBeInTheDocument();
    });
  });

  describe('Size Prop', () => {
    const sizes = ['sm', 'default', 'lg', 'xl', '2xl'] as const;

    sizes.forEach((size) => {
      it(`should render ${size} size`, () => {
        render(<TelesisLogo size={size} />);

        const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');
        if (size === 'default') {
          expect(logoContainer).toHaveClass('text-base');
        } else {
          expect(logoContainer).toHaveClass(`text-${size}`);
        }
      });
    });
  });

  describe('Color Scheme Prop', () => {
    it('should render default color scheme', () => {
      render(<TelesisLogo colorScheme="default" />);

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toBeInTheDocument();

      const textElement = screen.getByText('Telesis');

      expect(textElement).toHaveClass('text-foreground');
    });

    it('should render monochrome color scheme', () => {
      render(<TelesisLogo colorScheme="monochrome" />);

      const textElement = screen.getByText('Telesis');

      expect(textElement).toHaveClass('text-current');
    });

    it('should render reverse color scheme', () => {
      render(<TelesisLogo colorScheme="reverse" />);

      const textElement = screen.getByText('Telesis');

      expect(textElement).toHaveClass('text-white');
    });

    it('should render stacked variant with correct tagline styling', () => {
      render(<TelesisLogo variant="stacked" colorScheme="reverse" />);

      const tagline = screen.getByText('Ask. Think. Apply.');

      expect(tagline).toHaveClass('text-white/80');
    });
  });

  describe('Accessibility Props', () => {
    it('should use custom aria-label when provided', () => {
      const customLabel = 'Custom Telesis Logo';
      render(<TelesisLogo aria-label={customLabel} />);

      const logoContainer = screen.getByLabelText(customLabel);

      expect(logoContainer).toBeInTheDocument();
    });

    it('should use default aria-label when not provided', () => {
      render(<TelesisLogo />);

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('should apply custom className', () => {
      const customClass = 'custom-logo-class';
      render(<TelesisLogo className={customClass} />);

      const logoContainer = screen.getByLabelText('Telesis - Ask, Think, Apply');

      expect(logoContainer).toHaveClass(customClass);
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<TelesisLogo ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should spread additional props to container', () => {
      render(<TelesisLogo data-testid="custom-logo" />);

      const logoContainer = screen.getByTestId('custom-logo');

      expect(logoContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility Compliance', () => {
    it('should have no accessibility violations - default', async () => {
      const { container } = render(<TelesisLogo />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - stacked variant', async () => {
      const { container } = render(<TelesisLogo variant="stacked" />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - logomark only', async () => {
      const { container } = render(<TelesisLogo variant="logomark" />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - reverse color scheme', async () => {
      const { container } = render(
        <div style={{ backgroundColor: 'black' }}>
          <TelesisLogo colorScheme="reverse" />
        </div>
      );
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });

  describe('Brand Guidelines Compliance', () => {
    it('should contain all three olives in logomark', () => {
      render(<TelesisLogo />);

      const logoContainer = screen.getByRole('img');

      expect(logoContainer).toBeInTheDocument();
      expect(logoContainer).toHaveAccessibleName('Telesis - Ask, Think, Apply');

      const svg = logoContainer.querySelector('svg');

      expect(svg).toBeInTheDocument();

      // Check that SVG has title and description for screen readers
      const title = svg.querySelector('title');
      const desc = svg.querySelector('desc');

      expect(title).toHaveTextContent('Telesis Logo');
      expect(desc).toHaveTextContent('Three olives representing the learning process: Ask, Think, Apply');
    });

    it('should display tagline in stacked variant', () => {
      render(<TelesisLogo variant="stacked" />);

      expect(screen.getByText('Ask. Think. Apply.')).toBeInTheDocument();
    });

    it('should maintain aspect ratio across sizes', () => {
      const { rerender } = render(<TelesisLogo size="sm" />);
      const logoContainerSm = screen.getByRole('img');
      const svgSm = logoContainerSm.querySelector('svg');

      expect(svgSm).toHaveAttribute('width', '32');
      expect(svgSm).toHaveAttribute('height', '12');

      rerender(<TelesisLogo size="xl" />);
      const logoContainerXl = screen.getByRole('img');
      const svgXl = logoContainerXl.querySelector('svg');

      expect(svgXl).toHaveAttribute('width', '80');
      expect(svgXl).toHaveAttribute('height', '30');
    });
  });
});

describe('TelesisLogomark', () => {
  describe('Component Rendering', () => {
    it('should render SVG with default props', () => {
      const { container } = render(<TelesisLogomark />);

      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '48');
      expect(svg).toHaveAttribute('height', '18');
      expect(svg).toHaveAttribute('viewBox', '0 0 48 18');
    });

    it('should render with accessible title and description', () => {
      const { container } = render(<TelesisLogomark />);

      const svg = container.querySelector('svg');

      // Check that SVG has title and description elements
      const title = svg.querySelector('title');
      const desc = svg.querySelector('desc');

      expect(title).toHaveTextContent('Telesis Logo');
      expect(desc).toHaveTextContent('Three olives representing the learning process: Ask, Think, Apply');
    });

    it('should be aria-hidden for decorative use', () => {
      const { container } = render(<TelesisLogomark />);

      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Size Configurations', () => {
    const sizeConfigs = [
      { size: 'sm', width: 32, height: 12 },
      { size: 'default', width: 48, height: 18 },
      { size: 'lg', width: 64, height: 24 },
      { size: 'xl', width: 80, height: 30 },
      { size: '2xl', width: 96, height: 36 },
    ] as const;

    sizeConfigs.forEach(({ size, width, height }) => {
      it(`should render ${size} size with correct dimensions`, () => {
        const { container } = render(<TelesisLogomark size={size} />);

        const svg = container.querySelector('svg');

        expect(svg).toHaveAttribute('width', width.toString());
        expect(svg).toHaveAttribute('height', height.toString());
        expect(svg).toHaveAttribute('viewBox', '0 0 48 18');
      });
    });
  });

  describe('Color Schemes', () => {
    it('should render default color scheme with sage colors', () => {
      const { container } = render(<TelesisLogomark colorScheme="default" />);

      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();

      // Check that the SVG contains the three olives with proper classes
      expect(svg.querySelector('.olive-ask')).toBeInTheDocument();
      expect(svg.querySelector('.olive-think')).toBeInTheDocument();
      expect(svg.querySelector('.olive-apply')).toBeInTheDocument();
    });

    it('should render monochrome color scheme', () => {
      const { container } = render(<TelesisLogomark colorScheme="monochrome" />);

      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('should render reverse color scheme for dark backgrounds', () => {
      const { container } = render(<TelesisLogomark colorScheme="reverse" />);

      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });
  });

  describe('SVG Structure', () => {
    it('should contain three olive elements', () => {
      const { container } = render(<TelesisLogomark />);

      const svg = container.querySelector('svg');
      const olives = svg.querySelectorAll('ellipse');

      expect(olives).toHaveLength(3);
    });

    it('should have correct olive positioning', () => {
      const { container } = render(<TelesisLogomark />);

      const svg = container.querySelector('svg');
      const askOlive = svg.querySelector('.olive-ask');
      const thinkOlive = svg.querySelector('.olive-think');
      const applyOlive = svg.querySelector('.olive-apply');

      expect(askOlive).toHaveAttribute('cx', '8');
      expect(thinkOlive).toHaveAttribute('cx', '24');
      expect(applyOlive).toHaveAttribute('cx', '40');
    });

    it('should apply custom className', () => {
      const customClass = 'custom-logomark';
      const { container } = render(<TelesisLogomark className={customClass} />);

      const svg = container.querySelector('svg');

      expect(svg).toHaveClass(customClass, 'shrink-0');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<TelesisLogomark ref={ref} />);

      expect(ref.current).toBeInstanceOf(SVGSVGElement);
    });
  });

  describe('Accessibility Compliance', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<TelesisLogomark />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should maintain accessibility across all sizes', async () => {
      const sizes = ['sm', 'default', 'lg', 'xl', '2xl'] as const;

      for (const size of sizes) {
        const { container, rerender } = render(<TelesisLogomark size={size} />);
        const results = await axe(container);

        expect(results).toHaveNoViolations();

        if (size !== '2xl') {
          rerender(<TelesisLogomark size={sizes[sizes.indexOf(size) + 1]} />);
        }
      }
    });

    it('should maintain accessibility across all color schemes', async () => {
      const colorSchemes = ['default', 'monochrome', 'reverse'] as const;

      for (const colorScheme of colorSchemes) {
        const { container, rerender } = render(<TelesisLogomark colorScheme={colorScheme} />);
        const results = await axe(container);

        expect(results).toHaveNoViolations();

        if (colorScheme !== 'reverse') {
          rerender(<TelesisLogomark colorScheme={colorSchemes[colorSchemes.indexOf(colorScheme) + 1]} />);
        }
      }
    });
  });
});
