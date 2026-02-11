import { logger } from '@/core/utils/logger.util';
import { migrationManager } from './migrationManager';
import { masterDbConfig } from '@/core/config/database.config';

/**
 * Ensure master database exists and run migrations
 * @deprecated Use migrationManager.migrateMaster() instead
 */
export async function ensureMasterDatabaseExists() {
  logger.info(
    `Connecting to PostgreSQL at ${masterDbConfig.host}:${masterDbConfig.port} as ${masterDbConfig.user}`
  );

  try {
    const result = await migrationManager.migrateMaster();

    if (!result.success) {
      throw new Error(`Master database migration failed: ${result.error}`);
    }

    logger.info(`Database '${masterDbConfig.database}' is ready.`);
  } catch (err) {
    logger.error('Error ensuring master database exists:', err);
    throw err;
  }
}

/**
 * Ensure tenant database exists and run migrations
 * @deprecated Use migrationManager.migrateTenant() instead
 */
export async function ensureTenantDatabaseExists(tenantId: string, dbName?: string) {
  const databaseName = dbName || `tenant_${tenantId}`;

  logger.info(`Ensuring tenant database '${databaseName}' exists`);

  try {
    const result = await migrationManager.migrateTenant(tenantId, dbName);

    if (!result.success) {
      throw new Error(`Tenant database migration failed: ${result.error}`);
    }

    logger.info(`Tenant database '${databaseName}' is ready.`);
  } catch (err) {
    logger.error(`Error ensuring tenant database '${databaseName}' exists:`, err);
    throw err;
  }
}

/**
 * Run migrations for tenant database
 * @deprecated Use migrationManager.runMigrations() instead
 */
export async function runTenantMigrations(databaseName: string) {
  logger.info(`Running migrations for tenant database '${databaseName}'`);

  try {
    const migrationsFolder = 'src/core/database/migrations/tenant';
    const result = await migrationManager.runMigrations(databaseName, migrationsFolder);

    if (!result.success) {
      throw new Error(`Migrations failed: ${result.error}`);
    }

    logger.info(`Migrations completed for tenant database '${databaseName}'`);
  } catch (err) {
    logger.error(`Error running migrations for tenant database '${databaseName}':`, err);
    throw err;
  }
}

export { migrationManager } from './migrationManager';
