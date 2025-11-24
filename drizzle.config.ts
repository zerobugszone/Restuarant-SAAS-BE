import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/core/database/schemas/master/*.ts',
  out: './src/core/database/migrations/master',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    host: process.env.MASTER_DB_HOST ?? 'localhost',
    port: Number(process.env.MASTER_DB_PORT ?? 5432),
    database: process.env.MASTER_DB_NAME ?? 'restaurant_master',
    user: process.env.MASTER_DB_USER ?? 'postgres',
    password: process.env.MASTER_DB_PASSWORD ?? 'postgres',
    ssl: false,
  },
});
