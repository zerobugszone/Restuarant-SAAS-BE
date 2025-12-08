import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { tenantDbDefaults } from '@/core/config/database.config';
import { TenantDatabaseConfig } from '@/core/types/tenant.types';
import { logger } from '@/core/utils/logger.util';
import { masterDb } from '@/core/database/masterConnection';
import { tenants } from '@/core/database/schemas/master/tenants.schema';
import { eq } from 'drizzle-orm';

type TenantPoolEntry = {
  pool: Pool;
  db: NodePgDatabase;
  config: TenantDatabaseConfig;
};

/**
 * Tenant Connection Pool
 * 
 * Manages database connections for each tenant.
 * Automatically fetches tenant database configuration from master DB.
 */
class TenantConnectionPool {
  private pools: Map<string, TenantPoolEntry> = new Map();

  /**
   * Get database connection for a tenant
   * @param tenantId - The tenant ID
   * @param dbConfig - Optional database config (if not provided, fetches from master DB)
   */
  async getConnection(tenantId: string, dbConfig?: TenantDatabaseConfig): Promise<NodePgDatabase> {
    const entry = await this.getOrCreateEntry(tenantId, dbConfig);
    return entry.db;
  }

  /**
   * Get connection pool for a tenant
   * @param tenantId - The tenant ID
   * @param dbConfig - Optional database config (if not provided, fetches from master DB)
   */
  async getPool(tenantId: string, dbConfig?: TenantDatabaseConfig): Promise<Pool> {
    const entry = await this.getOrCreateEntry(tenantId, dbConfig);
    return entry.pool;
  }

  /**
   * Get or create a connection pool entry for a tenant
   */
  private async getOrCreateEntry(
    tenantId: string,
    dbConfig?: TenantDatabaseConfig
  ): Promise<TenantPoolEntry> {
    // Return existing pool if available
    if (this.pools.has(tenantId)) {
      return this.pools.get(tenantId)!;
    }

    let config: TenantDatabaseConfig;

    // If config not provided, fetch from master DB
    if (!dbConfig) {
      const [tenant] = await masterDb
        .select()
        .from(tenants)
        .where(eq(tenants.tenantId, tenantId))
        .limit(1);

      if (!tenant) {
        throw new Error(`Tenant not found: ${tenantId}`);
      }

      config = {
        host: tenant.databaseHost || tenantDbDefaults.host,
        port: tenant.databasePort || tenantDbDefaults.port,
        database: tenant.databaseName,
        user: tenantDbDefaults.user,
        password: tenantDbDefaults.password,
      };

      logger.info(`Creating connection pool for tenant: ${tenant.name} (${tenantId})`);
      logger.debug(`Database: ${config.database} at ${config.host}:${config.port}`);
    } else {
      config = dbConfig;
    }

    // Create new pool
    const pool = new Pool(config);

    // Handle pool errors
    pool.on('error', (error) => {
      logger.error(`Tenant pool error for ${tenantId}:`, error);
      this.pools.delete(tenantId);
    });

    // Test connection
    try {
      const client = await pool.connect();
      client.release();
      logger.info(`✓ Successfully connected to tenant database: ${config.database}`);
    } catch (error) {
      logger.error(`Failed to connect to tenant database ${config.database}:`, error);
      await pool.end();
      throw new Error(`Failed to connect to tenant database: ${error}`);
    }

    const db = drizzle(pool);
    const entry: TenantPoolEntry = { pool, db, config };

    this.pools.set(tenantId, entry);
    return entry;
  }

  /**
   * Dispose a specific tenant's connection pool
   */
  async dispose(tenantId: string): Promise<void> {
    const entry = this.pools.get(tenantId);
    if (entry) {
      logger.info(`Disposing connection pool for tenant: ${tenantId}`);
      await entry.pool.end();
      this.pools.delete(tenantId);
    }
  }

  /**
   * Dispose all tenant connection pools
   */
  async disposeAll(): Promise<void> {
    logger.info(`Disposing all tenant connection pools (${this.pools.size} pools)`);
    await Promise.all(
      [...this.pools.entries()].map(([tenantId, { pool }]) =>
        pool.end().finally(() => this.pools.delete(tenantId))
      )
    );
  }

  /**
   * Get list of active tenant connections
   */
  getActiveTenants(): string[] {
    return Array.from(this.pools.keys());
  }

  /**
   * Get connection count
   */
  getConnectionCount(): number {
    return this.pools.size;
  }
}

export const tenantConnectionPool = new TenantConnectionPool();

