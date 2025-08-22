import { cva } from 'class-variance-authority';

export const tabsListVariants = cva(
  'sage-border inline-flex items-center justify-center rounded-md border bg-muted p-1 text-muted-foreground',
  {
    variants: {
      variant: {
        default: 'h-10',
        compact: 'h-8',
        large: 'h-12',
      },
      orientation: {
        horizontal: 'flex-row',
        vertical: 'h-auto flex-col',
      },
      style: {
        default: 'bg-muted',
        sage: 'border-sage-quietude/20 bg-sage-mist/50',
        accent: 'border-sage-growth/20 bg-sage-growth/10',
        subtle: 'border-sage-quietude/10 bg-background',
      },
    },
    defaultVariants: {
      variant: 'default',
      orientation: 'horizontal',
      style: 'default',
    },
  },
);

export const tabsTriggerVariants = cva(
  'sage-ring inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        sage: 'hover:bg-sage-mist/50 hover:text-sage-quietude data-[state=active]:bg-sage-quietude data-[state=active]:text-primary-foreground',
        accent: 'hover:bg-sage-growth/10 hover:text-sage-growth data-[state=active]:bg-sage-growth data-[state=active]:text-accent-foreground',
        subtle: 'hover:bg-sage-mist/30 hover:text-sage-stone data-[state=active]:bg-sage-mist data-[state=active]:text-sage-stone',
        ghost: 'rounded-none border-b-2 border-transparent hover:border-sage-quietude/50 data-[state=active]:border-b-2 data-[state=active]:border-sage-quietude data-[state=active]:text-sage-quietude',
      },
      size: {
        default: 'px-3 py-1.5 text-sm',
        sm: 'px-2 py-1 text-xs',
        lg: 'px-4 py-2 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export const tabsContentVariants = cva(
  'sage-ring mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      spacing: {
        default: 'mt-2',
        compact: 'mt-1',
        relaxed: 'mt-4',
      },
    },
    defaultVariants: {
      spacing: 'default',
    },
  },
);
