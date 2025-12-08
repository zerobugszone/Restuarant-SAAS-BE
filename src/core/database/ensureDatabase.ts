import { Client } from 'pg';
import { masterDbConfig } from '@/core/config/database.config';
import { logger } from '@/core/utils/logger.util';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as path from 'path';
import { Pool } from 'pg';

// Define tenantDbDefaults with appropriate values or import from your config
const tenantDbDefaults = {
  host: masterDbConfig.host,
  port: masterDbConfig.port,
  user: masterDbConfig.user,
  password: masterDbConfig.password,
};

export async function ensureMasterDatabaseExists() {
  logger.info(
    `Connecting to PostgreSQL at ${masterDbConfig.host}:${masterDbConfig.port} as ${masterDbConfig.user}`
  );
  const client = new Client({
    host: masterDbConfig.host,
    port: masterDbConfig.port,
    user: masterDbConfig.user,
    password: masterDbConfig.password,
    database: 'postgres', // connect to default db to check/create
  });

  try {
    await client.connect();
    logger.info('Connected to PostgreSQL for master DB check.');
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [
      masterDbConfig.database,
    ]);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${masterDbConfig.database}"`);
      logger.info(`Database '${masterDbConfig.database}' created.`);
    } else {
      logger.info(`Database '${masterDbConfig.database}' already exists.`);
    }
  } catch (err) {
    logger.error('Error ensuring master database exists:', err);
    throw err;
  } finally {
    await client.end();
  }
}

export async function ensureTenantDatabaseExists(tenantId: string, dbName?: string) {
  const databaseName = dbName || `tenant_${tenantId}`;

  logger.info(`Ensuring tenant database '${databaseName}' exists`);

  const client = new Client({
    host: masterDbConfig.host,
    port: masterDbConfig.port,
    user: masterDbConfig.user,
    password: masterDbConfig.password,
    database: 'postgres',
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [databaseName]);

    if (res.rowCount === 0) {
      const sanitizedName = databaseName.replace(/[^a-zA-Z0-9_-]/g, '_');
      await client.query(`CREATE DATABASE "${sanitizedName}"`);
      logger.info(`Tenant database '${databaseName}' created.`);
      await runTenantMigrations(databaseName);
    } else {
      logger.info(`Tenant database '${databaseName}' already exists.`);
      await runTenantMigrations(databaseName);
    }
  } catch (err) {
    logger.error(`Error ensuring tenant database '${databaseName}' exists:`, err);
    throw err;
  } finally {
    await client.end();
  }
}

export async function runTenantMigrations(databaseName: string) {
  logger.info(`Running migrations for tenant database '${databaseName}'`);

  const pool = new Pool({
    host: tenantDbDefaults.host,
    port: tenantDbDefaults.port,
    user: tenantDbDefaults.user,
    password: tenantDbDefaults.password,
    database: databaseName,
  });

  try {
    const db = drizzle(pool);
    const migrationsFolder = path.join(process.cwd(), 'src/core/database/migrations/tenant');

    // Check if migrations folder exists
    const fs = require('fs');
    if (!fs.existsSync(migrationsFolder)) {
      logger.warn(`Migrations folder '${migrationsFolder}' does not exist. Skipping migrations.`);
      return;
    }

    // Check if _journal.json exists
    const journalPath = path.join(migrationsFolder, 'meta', '_journal.json');
    if (!fs.existsSync(journalPath)) {
      logger.warn(`No migrations found in '${migrationsFolder}'. Skipping migrations.`);
      return;
    }

    await migrate(db, { migrationsFolder });
    logger.info(`Migrations completed for tenant database '${databaseName}'`);
  } catch (err) {
    logger.error(`Error running migrations for tenant database '${databaseName}':`, err);
    throw err;
  } finally {
    await pool.end();
  }
}
