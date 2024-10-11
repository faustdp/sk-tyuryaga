import svg from '@poppanator/sveltekit-svg'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    sveltekit(),
    svg({
      includePaths: ['./src/lib/images/', './src/lib/icons/'],
    }),
  ],
  server: {
    port: 5773,
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
  build: {
    // sourcemap: true,
    terserOptions: {
      compress: { drop_console: false },
    },
  },
})
