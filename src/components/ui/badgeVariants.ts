import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground sage-border',
        // Modern Sage specific variants
        'sage-primary':
          'border-transparent bg-sage-quietude text-white hover:bg-sage-quietude/80',
        'sage-accent':
          'border-transparent bg-sage-growth text-white hover:bg-sage-growth/80',
        'sage-subtle':
          'border-sage-quietude/30 bg-sage-mist text-sage-stone hover:bg-sage-mist/80',
        'sage-gradient':
          'border-transparent sage-gradient-subtle text-sage-stone hover:opacity-80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
