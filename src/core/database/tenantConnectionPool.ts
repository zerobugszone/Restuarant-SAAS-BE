import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { tenantDbDefaults } from '@/core/config/database.config';
import { TenantDatabaseConfig } from '@/core/types/tenant.types';
import { logger } from '@/core/utils/logger.util';
import {
  ensureMasterDatabaseExists,
  ensureTenantDatabaseExists,
} from '@/core/database/ensureDatabase';

type TenantPoolEntry = {
  pool: Pool;
  db: NodePgDatabase;
};

class TenantConnectionPool {
  private pools: Map<string, TenantPoolEntry> = new Map();

  async getConnection(tenantId: string, dbConfig?: TenantDatabaseConfig): Promise<NodePgDatabase> {
    const entry = await this.getOrCreateEntry(tenantId, dbConfig);
    return entry.db;
  }

  async getPool(tenantId: string, dbConfig?: TenantDatabaseConfig): Promise<Pool> {
    const entry = await this.getOrCreateEntry(tenantId, dbConfig);
    return entry.pool;
  }

  private async getOrCreateEntry(
    tenantId: string,
    dbConfig?: TenantDatabaseConfig
  ): Promise<TenantPoolEntry> {
    if (!this.pools.has(tenantId)) {
      const config: TenantDatabaseConfig = {
        host: dbConfig?.host ?? tenantDbDefaults.host,
        port: dbConfig?.port ?? tenantDbDefaults.port,
        database: dbConfig?.database ?? `tenant_${tenantId}`,
        user: dbConfig?.user ?? tenantDbDefaults.user,
        password: dbConfig?.password ?? tenantDbDefaults.password,
      };

      // TODO: Implement ensureTenantDatabaseExists if tenant DB creation is needed
      // await ensureMasterDatabaseExists();
      await ensureTenantDatabaseExists(tenantId, config.database);

      const pool = new Pool(config);
      pool.on('error', error => {
        logger.error(`Tenant pool error for ${tenantId}`, error);
        this.pools.delete(tenantId);
      });
      const db = drizzle(pool);
      this.pools.set(tenantId, { pool, db });
    }
    return this.pools.get(tenantId)!;
  }

  async dispose(tenantId: string) {
    const entry = this.pools.get(tenantId);
    if (entry) {
      await entry.pool.end();
      this.pools.delete(tenantId);
    }
  }

  async disposeAll() {
    await Promise.all(
      [...this.pools.entries()].map(([tenantId, { pool }]) =>
        pool.end().finally(() => this.pools.delete(tenantId))
      )
    );
  }
}

export const tenantConnectionPool = new TenantConnectionPool();
