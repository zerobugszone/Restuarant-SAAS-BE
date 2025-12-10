import { TenantModel } from '../models/tenant.model';
import { tenants } from '@/core/database/schemas/master/auth.schema';
import { eq } from 'drizzle-orm';
import { masterDb } from '@/core/database/masterConnection';
import { randomUUID } from 'crypto';
import { migrationManager } from '@/core/database/migrationManager';
import { logger } from '@/core/utils/logger.util';
import { paginatedData } from '@/core/helper/pagination_helper';

/**
 * Tenant Repository
 *
 * Handles tenant CRUD operations in the master database
 * and manages tenant database creation and migration.
 */
class TenantRepository {
  /**
   * Create a new tenant
   *
   * Stores databaseUrl directly.
   */
  async create(payload: Partial<TenantModel>): Promise<TenantModel> {
    const tenantId = randomUUID();

    // Generate DB name from subdomain
    const dbName = payload.subdomain?.replace(/[^a-zA-Z0-9]/g, '_') || `tenant_${tenantId}`;

    // Build database URL for this tenant
    const host = process.env.MASTER_DB_HOST || 'localhost';
    const port = process.env.MASTER_DB_PORT || '5432';
    const user = process.env.MASTER_DB_USER || 'postgres';
    const password = process.env.MASTER_DB_PASSWORD || 'postgres';

    const databaseUrl =
      payload.databaseUrl || `postgres://${user}:${password}@${host}:${port}/${dbName}`;

    const newTenant = {
      name: payload.name || '',
      subdomain: payload.subdomain || '',
      databaseUrl: databaseUrl,
      status: payload.status || 'active',
      tenantId: tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    logger.info(`Creating tenant: ${newTenant.name} (${tenantId})`);
    logger.info(`Subdomain: ${newTenant.subdomain}`);
    logger.info(`Database URL: ${newTenant.databaseUrl}`);

    try {
      // Step 1: Insert into master DB
      const [createdTenant] = await masterDb.insert(tenants).values(newTenant).returning();

      logger.info(`✓ Tenant record created in master db`);

      // Extract database name from URL
      const databaseName = dbName;

      // Step 2: Create tenant DB + migrations
      await this.createAndMigrateTenantDatabase(databaseName, tenantId);

      logger.info(`✓ Tenant created successfully`);
      return createdTenant as TenantModel;
    } catch (error) {
      logger.error(`Failed to create tenant:`, error);

      // Rollback tenant record on failure
      try {
        await masterDb.delete(tenants).where(eq(tenants.tenantId, tenantId));
      } catch (rollbackError) {
        logger.error(`Rollback failed:`, rollbackError);
      }

      throw new Error(`Failed to create tenant: ${error}`);
    }
  }

  /** Get all tenants */
  async getAllTenants(
    matchData: Record<string, any>,
    sortData: Record<string, 'asc' | 'desc'>,
    page: number,
    perPage: number
  ) {
    return await paginatedData(masterDb, tenants, matchData, sortData, page, perPage);
  }

  /** Get tenant by record ID */
  async getTenantById(id: string): Promise<TenantModel | undefined> {
    const [tenant] = await masterDb.select().from(tenants).where(eq(tenants.id, id)).limit(1);
    return tenant as TenantModel | undefined;
  }

  /** Get tenant by tenantId */
  async getTenantByTenantId(tenantId: string): Promise<TenantModel | undefined> {
    const [tenant] = await masterDb
      .select()
      .from(tenants)
      .where(eq(tenants.tenantId, tenantId))
      .limit(1);
    return tenant as TenantModel | undefined;
  }

  /** Get tenant by subdomain */
  async getTenantBySubdomain(subdomain: string): Promise<TenantModel | undefined> {
    const [tenant] = await masterDb
      .select()
      .from(tenants)
      .where(eq(tenants.subdomain, subdomain))
      .limit(1);
    return tenant as TenantModel | undefined;
  }

  /** Update tenant */
  async update(id: string, payload: Partial<TenantModel>): Promise<TenantModel | undefined> {
    const [updated] = await masterDb
      .update(tenants)
      .set({ ...payload, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning();
    return updated as TenantModel | undefined;
  }

  /** Soft delete tenant */
  async delete(id: string): Promise<void> {
    await masterDb
      .update(tenants)
      .set({ status: 'inactive', updatedAt: new Date() })
      .where(eq(tenants.id, id));
  }

  /** Hard delete tenant */
  async hardDelete(id: string): Promise<void> {
    await masterDb.delete(tenants).where(eq(tenants.id, id));
  }

  /**
   * Create tenant DB and run migrations
   */
  private async createAndMigrateTenantDatabase(
    databaseName: string,
    tenantId: string
  ): Promise<void> {
    if (!databaseName) {
      throw new Error('Database name is required.');
    }

    logger.info(`Creating & migrating tenant DB: ${databaseName}`);

    try {
      const result = await migrationManager.migrateTenant(tenantId, databaseName);

      if (!result.success) {
        throw new Error(`Migration failed: ${result.error}`);
      }

      logger.info(
        `✓ Tenant DB created & migrated: ${databaseName}. Duration: ${result.duration}ms`
      );
    } catch (error) {
      logger.error(`Tenant DB migration failed:`, error);
      throw error;
    }
  }
}

export default new TenantRepository();
