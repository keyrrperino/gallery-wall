import variablesPlugin from '@mertasan/tailwindcss-variables';
import colorVariable from '@mertasan/tailwindcss-variables/colorVariable';
import containerQueryPlugin from '@tailwindcss/container-queries';
import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import animatePlugin from 'tailwindcss-animate';

export const lightVariables = {
  colors: {
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#4b66e5',
    background: '#000000',
    foreground: '#020817',
    primary: '#4b66e5',
    'primary-foreground': '#ffffff',
    secondary: '#f1f5f9',
    'secondary-foreground': '#0f172a',
    destructive: '#ef4444',
    'destructive-foreground': '#ffffff',
    success: '#39a561',
    'success-foreground': '#ffffff',
    muted: '#f8fafc',
    'muted-foreground': '#64748b',
    accent: '#f1f5f9',
    'accent-foreground': '#0f172a',
    popover: '#ffffff',
    'popover-foreground': '#020817',
    card: '#ffffff',
    'card-foreground': '#020817',
    sea: '#21409A',
    sky: '#0072BC',
    turquoise: '#009B90',
    lightturquoise: '#86C8E6',
    coral: '#E37889',
    sand: '#F4E3B8',
    blue: '#2B90D0',
  },
};

export const darkVariables = {
  colors: {
    border: '#2f3e57',
    input: '#1e293b',
    ring: '#637efe',
    background: '#000000',
    foreground: '#f8fafc',
    primary: '#637efe',
    'primary-foreground': '#111',
    secondary: '#1e293b',
    'secondary-foreground': '#f8fafc',
    destructive: '#ef4444',
    'destructive-foreground': '#ffffff',
    success: '#39a561',
    'success-foreground': '#f8fafc',
    muted: '#020817',
    'muted-foreground': '#94a3b8',
    accent: '#1e293b',
    'accent-foreground': '#f8fafc',
    popover: '#121924',
    'popover-foreground': '#f8fafc',
    card: '#121924',
    'card-foreground': '#f8fafc',
    sea: '#21409A',
    sky: '#0072BC',
    turquoise: '#009B90',
    lightturquoise: '#86C8E6',
    coral: '#E37889',
    sand: '#F4E3B8',
    blue: '#2B90D0',
  },
};

export default {
  content: [],
  darkMode: ['class'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      boxShadow: {
        sm: '0 2px 8px 0 rgb(0, 0, 0, 0.025), 0 0 1px rgba(0,0,0,0.1)',
        DEFAULT: '0 4px 16px 0 rgb(0, 0, 0, 0.05), 0 0 1px rgba(0,0,0,0.1)',
        md: '0 6px 24px 0 rgb(0, 0, 0, 0.075), 0 0 1px rgba(0,0,0,0.1)',
        lg: '0 8px 32px 0 rgb(0, 0, 0, 0.1), 0 0 1px rgba(0,0,0,0.1)',
        xl: '0 12px 48px 0 rgb(0, 0, 0, 0.125), 0 0 1px rgba(0,0,0,0.1)',
        '2xl': '0 16px 64px 0 rgb(0, 0, 0, 0.15), 0 0 1px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        lg: '0.75rem',
        md: 'calc(0.75rem - 2px)',
        sm: 'calc(0.75rem - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      font: {
        headline: '',
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
      colors: {
        sea: '#21409A',
        sky: '#0072BC',
        turquoise: '#009B90',
        lightturquoise: '#86C8E6',
        coral: '#E37889',
        sand: '#F4E3B8',
        blue: '#2B90D0',
        border: colorVariable('--colors-border'),
        input: colorVariable('--colors-input'),
        ring: colorVariable('--colors-ring'),
        background: colorVariable('--colors-background'),
        foreground: colorVariable('--colors-foreground'),
        primary: {
          DEFAULT: colorVariable('--colors-primary'),
          foreground: colorVariable('--colors-primary-foreground'),
        },
        secondary: {
          DEFAULT: colorVariable('--colors-secondary'),
          foreground: colorVariable('--colors-secondary-foreground'),
        },
        destructive: {
          DEFAULT: colorVariable('--colors-destructive'),
          foreground: colorVariable('--colors-destructive-foreground'),
        },
        success: {
          DEFAULT: colorVariable('--colors-success'),
          foreground: colorVariable('--colors-success-foreground'),
        },
        muted: {
          DEFAULT: colorVariable('--colors-muted'),
          foreground: colorVariable('--colors-muted-foreground'),
        },
        accent: {
          DEFAULT: colorVariable('--colors-accent'),
          foreground: colorVariable('--colors-accent-foreground'),
        },
        popover: {
          DEFAULT: colorVariable('--colors-popover'),
          foreground: colorVariable('--colors-popover-foreground'),
        },
        card: {
          DEFAULT: colorVariable('--colors-card'),
          foreground: colorVariable('--colors-card-foreground'),
        },
      },
    },
    variables: {
      DEFAULT: lightVariables,
    },
    darkVariables: {
      DEFAULT: darkVariables,
    },
  },
  plugins: [
    formsPlugin({
      strategy: 'base',
    }),
    typographyPlugin,
    animatePlugin,
    containerQueryPlugin,
    variablesPlugin({
      colorVariables: true,
    }),
  ],
} satisfies Config;
