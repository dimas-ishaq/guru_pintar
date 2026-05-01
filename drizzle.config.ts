import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './packages/types/src/schema.ts',
  out: './apps/api/drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost/guru_pintar',
  },
  verbose: true,
  strict: true,
});
