// import adapter from '@sveltejs/adapter-auto'
import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: 'index.html', precompress: true }),
    alias: {
      '@server': './src/lib/server',
      '@components': './src/lib/components',
      '@state': './src/lib/state',
      '@images': './src/lib/images',
    },
  },
}

export default config
