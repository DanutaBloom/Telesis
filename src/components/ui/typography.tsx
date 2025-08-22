import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/Helpers';

import { typographyVariants } from './typographyVariants';

// Extract the variant props type to avoid conflicts
type TypographyVariantProps = VariantProps<typeof typographyVariants>;

// Create a safe type that excludes conflicting properties
export type TypographyProps = Omit<React.HTMLAttributes<HTMLElement>, 'color'> &
  TypographyVariantProps & {
    asChild?: boolean;
    as?: keyof JSX.IntrinsicElements;
  }

// Helper function to determine default HTML element based on variant
function getDefaultElement(variant: TypographyProps['variant']): keyof JSX.IntrinsicElements {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'h4':
      return 'h4';
    case 'h5':
      return 'h5';
    case 'h6':
      return 'h6';
    case 'lead':
    case 'large':
    case 'body':
    case 'body-sm':
    case 'body-lg':
      return 'p';
    case 'blockquote':
      return 'blockquote';
    case 'code':
      return 'code';
    case 'list':
      return 'ul';
    case 'list-ordered':
      return 'ol';
    case 'small':
    case 'muted':
    case 'text-button':
    case 'text-caption':
    case 'text-overline':
    case 'sage-caption':
      return 'span';
    case 'sage-display':
    case 'sage-hero':
    case 'sage-subtitle':
      return 'h1';
    default:
      return 'div';
  }
}

const Typography = React.forwardRef<
  HTMLElement,
  TypographyProps
>(({ className, variant, size, weight, align, color, asChild = false, as, ...props }, ref) => {
  const Comp = asChild ? Slot : (as || getDefaultElement(variant));

  // Ensure color is properly typed for the variants
  const typedColor = color as TypographyVariantProps['color'];

  // Generate className separately to avoid complex union types
  const variantClassName = typographyVariants({
    variant,
    size,
    weight,
    align,
    color: typedColor
  });

  // Combine className manually to avoid TypeScript complexity
  const finalClassName = cn(variantClassName, className);

  return React.createElement(
    Comp as React.ElementType,
    {
      className: finalClassName,
      ref,
      ...props,
    }
  );
});

Typography.displayName = 'Typography';

export { Typography, typographyVariants };
