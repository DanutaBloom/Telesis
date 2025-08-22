import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

import { cn } from '@/utils/Helpers';

const logoVariants = cva(
  'inline-flex items-center gap-x-2',
  {
    variants: {
      variant: {
        logomark: '',
        horizontal: '',
        stacked: 'flex-col gap-y-1',
      },
      size: {
        "sm": 'text-sm',
        "default": 'text-base',
        "lg": 'text-lg',
        "xl": 'text-xl',
        '2xl': 'text-2xl',
      },
      colorScheme: {
        default: '',
        monochrome: '',
        reverse: '',
      },
    },
    defaultVariants: {
      variant: 'horizontal',
      size: 'default',
      colorScheme: 'default',
    },
  }
);

type TelesisLogoProps = {
  "className"?: string;
  "showText"?: boolean;
  'aria-label'?: string;
  "onClick"?: () => void;
} & VariantProps<typeof logoVariants>

const TelesisLogomark = forwardRef<
  SVGSVGElement,
  {
    className?: string;
    colorScheme?: 'default' | 'monochrome' | 'reverse';
    size?: 'sm' | 'default' | 'lg' | 'xl' | '2xl';
  }
>(({ className, colorScheme = 'default', size = 'default' }, ref) => {
  // Size mappings for the SVG
  const sizeMap = {
    "sm": { width: 32, height: 12, viewBox: '0 0 48 18' },
    "default": { width: 48, height: 18, viewBox: '0 0 48 18' },
    "lg": { width: 64, height: 24, viewBox: '0 0 48 18' },
    "xl": { width: 80, height: 30, viewBox: '0 0 48 18' },
    '2xl': { width: 96, height: 36, viewBox: '0 0 48 18' },
  };

  const dimensions = sizeMap[size];

  // Color schemes
  const getColors = () => {
    switch (colorScheme) {
      case 'monochrome':
        return {
          ask: 'currentColor',
          askStroke: 'currentColor',
          think: 'currentColor',
          apply: 'currentColor',
        };
      case 'reverse':
        return {
          ask: 'transparent',
          askStroke: '#ffffff',
          think: '#ffffff',
          apply: '#ffffff',
        };
      default:
        return {
          ask: 'transparent',
          askStroke: 'hsl(171, 19%, 41%)', // --sage-quietude (WCAG AA compliant)
          think: 'hsl(171, 19%, 41%)', // --sage-quietude (WCAG AA compliant)
          apply: 'hsl(102, 58%, 38%)', // --sage-growth
        };
    }
  };

  const colors = getColors();

  return (
    <svg
      ref={ref}
      width={dimensions.width}
      height={dimensions.height}
      viewBox={dimensions.viewBox}
      aria-hidden="true"
      className={cn('shrink-0', className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Telesis Logo</title>
      <desc>Three olives representing the learning process: Ask, Think, Apply</desc>

      <g id="three-olives-logomark">
        {/* Olive 1: Ask - Outlined olive representing potential and inquiry */}
        <ellipse
          cx="8"
          cy="9"
          rx="6"
          ry="8"
          fill={colors.ask}
          stroke={colors.askStroke}
          strokeWidth="1.5"
          className="olive-ask"
        />

        {/* Olive 2: Think - Solid olive representing contemplation and processing */}
        <ellipse
          cx="24"
          cy="9"
          rx="6"
          ry="8"
          fill={colors.think}
          stroke="none"
          className="olive-think"
        />

        {/* Olive 3: Apply - Solid olive in growth color representing successful application */}
        <ellipse
          cx="40"
          cy="9"
          rx="6"
          ry="8"
          fill={colors.apply}
          stroke="none"
          className="olive-apply"
        />
      </g>
    </svg>
  );
});

TelesisLogomark.displayName = 'TelesisLogomark';

export const TelesisLogo = forwardRef<
  HTMLDivElement,
  TelesisLogoProps
>(({
  className,
  variant,
  size,
  colorScheme,
  showText = true,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const isLogomarkOnly = variant === 'logomark' || !showText;

  return (
    <div
      ref={ref}
      className={cn(logoVariants({ variant, size, colorScheme }), className)}
      role="img"
      aria-label={ariaLabel || 'Telesis - Ask, Think, Apply'}
      {...props}
    >
      <TelesisLogomark
        colorScheme={colorScheme ?? 'default'}
        size={size ?? 'default'}
        className={cn(
          'transition-colors duration-200',
          variant === 'stacked' && 'mb-1'
        )}
      />

      {!isLogomarkOnly && (
        <div
          className={cn(
            'select-none font-semibold tracking-tight',
            variant === 'stacked' && 'text-center',
            colorScheme === 'reverse' && 'text-white',
            colorScheme === 'monochrome' && 'text-current',
            colorScheme === 'default' && 'text-foreground'
          )}
        >
          Telesis
          {variant === 'stacked' && (
            <div className={cn(
              'text-xs font-normal opacity-75 mt-0.5',
              colorScheme === 'reverse' && 'text-white/80',
              colorScheme === 'monochrome' && 'text-current/80',
              colorScheme === 'default' && 'text-muted-foreground'
            )}
            >
              Ask. Think. Apply.
            </div>
          )}
        </div>
      )}
    </div>
  );
});

TelesisLogo.displayName = 'TelesisLogo';

export { TelesisLogomark };

// Keep legacy exports for backward compatibility
export { TelesisLogo as ThreeOlivesLogo, TelesisLogomark as ThreeOlivesLogomark };
