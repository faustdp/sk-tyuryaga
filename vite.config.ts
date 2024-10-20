import svg from '@poppanator/sveltekit-svg'
import { sveltekit } from '@sveltejs/kit/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    sveltekit(),
    svg({
      includePaths: ['./src/lib/images/', './src/lib/icons/'],
    }),
    nodePolyfills(),
  ],
  server: {
    port: 5773,
    proxy: {
      '/api': {
        target: 'http://localhost:8828',
        changeOrigin: true,
      },
    },
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
