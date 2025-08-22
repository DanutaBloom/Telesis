import { cva } from 'class-variance-authority';

export const typographyVariants = cva('', {
  variants: {
    variant: {
      // Headings - Responsive with mobile-first approach following PRD specifications
      'h1': 'text-h1 scroll-m-20 font-bold', // Uses custom responsive .text-h1 class
      'h2': 'text-h2 scroll-m-20 font-semibold [&:not(:first-child)]:mt-8', // Uses custom responsive .text-h2 class
      'h3': 'text-h3 scroll-m-20 font-semibold [&:not(:first-child)]:mt-6', // Uses custom responsive .text-h3 class
      'h4': 'text-h4 scroll-m-20 font-semibold [&:not(:first-child)]:mt-6', // Uses custom responsive .text-h4 class
      'h5': 'text-h5 scroll-m-20 font-medium [&:not(:first-child)]:mt-4', // Uses custom responsive .text-h5 class
      'h6': 'text-h6 scroll-m-20 font-medium [&:not(:first-child)]:mt-4', // Uses custom responsive .text-h6 class

      // Responsive body text variants - maintain minimum 14px mobile
      'body': 'text-body-responsive [&:not(:first-child)]:mt-6', // 14px mobile, 16px tablet+
      'body-sm': 'text-body-sm-responsive [&:not(:first-child)]:mt-4', // 14px minimum maintained
      'body-lg': 'text-body-lg-responsive [&:not(:first-child)]:mt-6', // 16px mobile, 18px tablet+

      // Special text styles - responsive variants
      'lead': 'text-lead-responsive font-normal', // 18px mobile, 20px tablet+
      'large': 'text-lg font-semibold md:text-xl',
      'small': 'text-sm font-medium leading-none',
      'muted': 'text-sm font-normal text-muted-foreground',

      // UI Elements - responsive following PRD specifications
      'text-button': 'text-button-responsive font-medium', // 14px/20px, weight 500
      'text-caption': 'text-caption-responsive font-normal', // 12px mobile, 14px tablet+
      'text-overline': 'text-[0.625rem] font-medium uppercase leading-4 tracking-widest', // 10px/16px, weight 500, letter-spacing: 0.1em

      // Quotes and emphasis
      'blockquote': 'mt-6 border-l-2 pl-6 font-normal italic',
      'code': 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',

      // Lists
      'list': 'my-6 ml-6 list-disc [&>li]:mt-2',
      'list-ordered': 'my-6 ml-6 list-decimal [&>li]:mt-2',

      // Modern Sage specific variants - responsive
      'sage-display': 'text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl', // Extra large hero text
      'sage-hero': 'text-h1 font-bold tracking-tight', // Uses responsive h1 sizing
      'sage-subtitle': 'text-body-lg-responsive font-medium', // Uses responsive body-lg sizing
      'sage-caption': 'text-caption-responsive font-normal', // Uses responsive caption sizing
    },
    size: {
      'xs': 'text-xs',
      'sm': 'text-sm',
      'base': 'text-base',
      'lg': 'text-lg',
      'xl': 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
      '7xl': 'text-7xl',
      '8xl': 'text-8xl',
      '9xl': 'text-9xl',

      // Responsive size variants
      'responsive-h1': 'text-h1',
      'responsive-h2': 'text-h2',
      'responsive-h3': 'text-h3',
      'responsive-h4': 'text-h4',
      'responsive-h5': 'text-h5',
      'responsive-h6': 'text-h6',
      'responsive-body': 'text-body-responsive',
      'responsive-body-sm': 'text-body-sm-responsive',
      'responsive-body-lg': 'text-body-lg-responsive',
      'responsive-lead': 'text-lead-responsive',
      'responsive-caption': 'text-caption-responsive',
      'responsive-button': 'text-button-responsive',
    },
    weight: {
      thin: 'font-thin',
      extralight: 'font-extralight',
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
      black: 'font-black',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    color: {
      'default': 'text-foreground',
      'muted': 'text-muted-foreground',
      'primary': 'text-primary',
      'accent': 'text-accent-foreground',
      'destructive': 'text-destructive',
      'sage-primary': 'text-sage-quietude',
      'sage-accent': 'text-sage-growth',
      'sage-stone': 'text-sage-stone',
      'sage-gradient': 'sage-text-gradient',
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'default',
  },
});
