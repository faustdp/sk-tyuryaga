import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        // primary: 'rgb(var(--color-primary) / <alpha-value>)',
      },
      backgroundSize: {
        'half': '540px 915px',
      },
    },
  },

  plugins: [],
} as Config
