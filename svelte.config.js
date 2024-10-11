// import adapter from '@sveltejs/adapter-auto'
import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  compilerOptions: {
    runes: true,
  },
  kit: {
    adapter: adapter({ fallback: 'index.html', precompress: true }),
    alias: {
      '@server': './src/lib/server',
      '@components': './src/lib/components',
      '@state': './src/lib/state',
      '@images': './src/lib/images',
      '@icons': './src/lib/icons',
      '@utils': './src/lib/utils',
    },
  },
}

export default config
