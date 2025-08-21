import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        'default': 'sage-ring bg-primary text-primary-foreground hover:bg-primary/90',
        'primary': 'sage-ring bg-primary text-primary-foreground hover:bg-primary/90',
        'accent': 'sage-ring bg-accent text-accent-foreground hover:bg-accent/90',
        'destructive':
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        'outline':
          'sage-border border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        'secondary':
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        'ghost': 'hover:bg-accent hover:text-accent-foreground',
        'link': 'text-primary underline-offset-4 hover:underline',
        // Modern Sage specific variants
        'sage-primary': 'sage-ring bg-sage-quietude text-primary-foreground hover:bg-sage-quietude/90',
        'sage-accent': 'bg-sage-growth text-accent-foreground hover:bg-sage-growth/90 focus-visible:ring-sage-growth',
        'sage-gradient': 'sage-gradient-primary text-white hover:opacity-90 focus-visible:ring-sage-quietude',
        'sage-subtle': 'sage-border bg-sage-mist text-sage-stone hover:bg-sage-mist/80',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
