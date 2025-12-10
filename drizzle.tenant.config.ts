import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/core/database/schemas/tenant/*.ts',
    out: './src/core/database/migrations/tenant',
    dialect: 'postgresql',
    casing: 'snake_case',
    dbCredentials: {
        host: process.env.MASTER_DB_HOST ?? 'localhost',
        port: Number(process.env.MASTER_DB_PORT ?? 5432),
        // This will be overridden when running migrations for specific tenants
        database: process.env.TENANT_DB_NAME ?? 'tenant_default',
        user: process.env.MASTER_DB_USER ?? 'postgres',
        password: process.env.MASTER_DB_PASSWORD ?? 'postgres',
        ssl: false,
    },
});
