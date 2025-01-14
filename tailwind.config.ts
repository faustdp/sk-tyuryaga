import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  content: ['./src/**/*.{html,js,svelte,ts,svg}'],

  theme: {
    extend: {
      colors: {
        textwhite: 'rgb(var(--c-text-white) / <alpha-value>)',
        textgrey: 'rgb(var(--c-text-grey) / <alpha-value>)',
        textlight: 'rgb(var(--c-text-light) / <alpha-value>)',
        cblue: 'rgb(var(--c-blue) / <alpha-value>)',
        cgreen: 'rgb(var(--c-green) / <alpha-value>)',
        cbrown: 'rgb(var(--c-brown) / <alpha-value>)',
        cyellow: 'rgb(var(--c-yellow) / <alpha-value>)',
        cmediumyellow: 'rgb(var(--c-medium-yellow) / <alpha-value>)',
        clightgrey: 'rgb(var(--c-lightgrey) / <alpha-value>)',
        cgrey: 'rgb(var(--c-grey) / <alpha-value>)',
        cwallet: 'rgb(var(--c-wallet) / <alpha-value>)',
        cdarkblue: 'rgb(var(--c-darkblue) / <alpha-value>)',
        cborder: 'rgb(var(--c-border) / <alpha-value>)',
        ctabs: 'rgb(var(--c-tabs) / <alpha-value>)',
        ccard: 'rgb(var(--c-card) / <alpha-value>)',
        ccardboost: 'rgb(var(--c-cardboost) / <alpha-value>)',
        clightblue: 'rgb(var(--c-lightblue) / <alpha-value>)',
        clightgreen: 'rgb(var(--c-lightgreen) / <alpha-value>)',
        cinputred: 'rgb(var(--input-red) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      width: {
        limit: 'var(--width-limit)',
      },
      maxWidth: {
        limit: 'var(--width-limit)',
      },
      backgroundSize: {
        half: 'var(--width-limit) var(--height-limit)',
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      screens: {
        maxheight: { raw: '(max-height: var(--height-limit))' },
        maxheightSm: { raw: '(max-height: 755px)' },
        smallscreen: { raw: '(max-width: 350px)' },
      },
      boxShadow: {
        wallet: '0px -4px 6px 0px rgb(var(--c-darkblue))',
        menu: '1px -3px 4px 0px rgb(var(--c-darkblue))',
      },
      content: {
        empty: '""',
      },
      zIndex: {
        one: '1',
      },
      fontFamily: {
        sans: [...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--bits-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--bits-accordion-content-height)' },
          to: { height: '0' },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
      },
    },
  },

  plugins: [tailwindcssAnimate],
} as Config
