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
    // hmr: false,
    allowedHosts: ['shnyaga.faustdp.icu'],
    port: 5773,
    proxy: {
      '/api': {
        target: 'http://localhost:8828',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@tonconnect/sdk/src/utils/log.ts': '@tonconnect/sdk/dist/tonconnect-sdk.min.js',
      '@tonconnect/sdk/src/utils/timeout.ts': '@tonconnect/sdk/dist/tonconnect-sdk.min.js',
      '@tonconnect/sdk/src/ton-connect.ts': '@tonconnect/sdk/dist/tonconnect-sdk.min.js', // lib/esm/index.mjs
    },
  },
  optimizeDeps: {
    exclude: ['./admin', 'svelte-confetti'],
    include: ['@tonconnect/ui', '@tonconnect/sdk'],
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
