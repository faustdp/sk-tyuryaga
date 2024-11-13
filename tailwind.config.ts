import type { Config } from 'tailwindcss'

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
        clightgrey: 'rgb(var(--c-lightgrey) / <alpha-value>)',
        cgrey: 'rgb(var(--c-grey) / <alpha-value>)',
        cwallet: 'rgb(var(--c-wallet) / <alpha-value>)',
        cdarkblue: 'rgb(var(--c-darkblue) / <alpha-value>)',
        cborder: 'rgb(var(--c-border) / <alpha-value>)',
        ctabs: 'rgb(var(--c-tabs) / <alpha-value>)',
        ccard: 'rgb(var(--c-card) / <alpha-value>)',
        ccardboost: 'rgb(var(--c-cardboost) / <alpha-value>)',
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
      screens: {
        maxheight: { raw: '(max-height: var(--height-limit))' },
        smallscreen: { raw: '(max-width: 350px)' },
      },
      boxShadow: {
        wallet: '0px -4px 6px 0px rgb(var(--c-darkblue))',
      },
      content: {
        empty: '""',
      },
      zIndex: {
        one: '1',
      },
    },
  },

  plugins: [],
} as Config
