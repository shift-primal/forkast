import { config } from 'dotenv';
import { defineConfig, type Config } from 'drizzle-kit';

config({ path: ['../.env'] });

export default defineConfig({
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    schemaFilter: ['public', 'neon_auth'],
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
} satisfies Config);
