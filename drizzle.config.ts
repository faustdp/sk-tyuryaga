import { defineConfig } from 'drizzle-kit'

import { dbUrl } from './server/config'

export default defineConfig({
  dialect: 'postgresql',
  schema: './drizzle/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: dbUrl,
  },
})
