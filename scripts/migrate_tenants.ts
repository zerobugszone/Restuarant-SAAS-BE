import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import tenantRepository from '../src/modules/tenant-management/repositories/tenant.repository'; // fetch tenants from master DB
async function migrateAllTenants() {
  const tenants = await tenantRepository.getAllTenants();
  for (const tenant of tenants) {
    const pool = new Pool({
      host: tenant.databaseHost,
      database: tenant.databaseName,
      user: tenant.name,
    });
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: './drizzle/migrations' });
    await pool.end();
    console.log(`:heavy_check_mark: Tenant  migration complete`);
  }
}
migrateAllTenants();
