/* eslint-disable ts/no-require-imports */
import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        mono: ['SF Mono', 'ui-monospace', 'Consolas', 'Monaco', 'monospace'],
      },
      fontSize: {
        // Typography scale following 8px grid system and PRD specifications
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }], // 12px/16px
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }], // 14px/20px
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }], // 16px/24px
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }], // 18px/28px
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }], // 20px/28px
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }], // 24px/32px - H4
        '3xl': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }], // 32px/40px - H3
        '4xl': ['2.5rem', { lineHeight: '3rem', letterSpacing: '-0.025em' }], // 40px/48px - H2
        '5xl': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.025em' }], // 48px/56px - H1
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.025em' }], // 60px
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.025em' }], // 72px
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.025em' }], // 96px
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.025em' }], // 128px

        // Responsive typography sizes - mobile-first approach
        'h1-mobile': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }], // 32px/40px mobile
        'h1-tablet': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.025em' }], // 48px/56px tablet
        'h1-desktop': ['3.75rem', { lineHeight: '4rem', letterSpacing: '-0.025em' }], // 60px/64px desktop

        'h2-mobile': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }], // 28px/36px mobile
        'h2-tablet': ['2.5rem', { lineHeight: '3rem', letterSpacing: '-0.025em' }], // 40px/48px tablet
        'h2-desktop': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.025em' }], // 48px/56px desktop

        'h3-mobile': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }], // 24px/32px mobile
        'h3-tablet': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }], // 32px/40px tablet

        'h4-mobile': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }], // 20px/28px mobile
        'h4-tablet': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }], // 24px/32px tablet

        'h5-mobile': ['1.125rem', { lineHeight: '1.5rem', letterSpacing: '-0.025em' }], // 18px/24px mobile
        'h5-tablet': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }], // 20px/28px tablet

        'h6-mobile': ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.025em' }], // 16px/24px mobile
        'h6-tablet': ['1.125rem', { lineHeight: '1.5rem', letterSpacing: '-0.025em' }], // 18px/24px tablet

        // Responsive body text
        'body-mobile': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0' }], // 14px/20px mobile minimum
        'body-tablet': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }], // 16px/24px tablet+

        'body-lg-mobile': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }], // 16px/24px mobile
        'body-lg-tablet': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0' }], // 18px/28px tablet+

        'lead-mobile': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0' }], // 18px/28px mobile
        'lead-tablet': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '0' }], // 20px/30px tablet+

        'caption-mobile': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }], // 12px/16px mobile
        'caption-tablet': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }], // 14px/20px tablet+
      },
      lineHeight: {
        // 8px grid system line heights
        3: '0.75rem', // 12px
        4: '1rem', // 16px
        5: '1.25rem', // 20px
        6: '1.5rem', // 24px
        7: '1.75rem', // 28px
        8: '2rem', // 32px
        9: '2.25rem', // 36px
        10: '2.5rem', // 40px
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Modern Sage brand colors for additional utilities
        sage: {
          "quietude": 'hsl(var(--sage-quietude))',
          "growth": 'hsl(var(--sage-growth))',
          "mist": 'hsl(var(--sage-mist))',
          "stone": 'hsl(var(--sage-stone))',
          'stone-accessible': 'hsl(var(--sage-stone-accessible))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
