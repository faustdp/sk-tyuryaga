import * as esbuild from 'esbuild'

await esbuild
  .build({
    entryPoints: ['./server.ts'],
    outfile: './index.mjs',
    bundle: true,
    conditions: ['production'],
    platform: 'node',
    format: 'esm',
    target: 'node22',
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    // external: ['path', 'crypto', 'http', 'https', 'fs', 'os', 'url', 'stream', 'events', 'buffer'],
    // banner: {
    //   js: 'import { createRequire } from "module";const require = createRequire(import.meta.url);',
    // },
    // supported: { 'dynamic-import': false },
  })
  .catch(() => process.exit(1))
