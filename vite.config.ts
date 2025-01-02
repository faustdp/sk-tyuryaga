import svg from '@poppanator/sveltekit-svg'
import { sveltekit } from '@sveltejs/kit/vite'
// import { defineConfig } from 'vitest/config'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

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
  optimizeDeps: {
    exclude: ['./admin'],
  },
  // test: {
  //   include: ['src/**/*.{test,spec}.{js,ts}'],
  // },
  build: {
    // sourcemap: true,
    terserOptions: {
      compress: { drop_console: false },
    },
  },
})
