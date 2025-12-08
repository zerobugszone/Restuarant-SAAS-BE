import { TenantModel } from '../models/tenant.model';
import { tenants } from '@/core/database/schemas/master/tenants.schema';
import { eq } from 'drizzle-orm';
import { masterDb } from '@/core/database/masterConnection';
import { randomUUID } from 'crypto';
import { migrationManager } from '@/core/database/migrationManager';
import { logger } from '@/core/utils/logger.util';

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
   * This method:
   * 1. Creates tenant record in master database
   * 2. Creates tenant's dedicated database
   * 3. Runs migrations on the new tenant database
   * 
   * @param payload - Tenant creation data
   * @returns Created tenant
   */
  async create(payload: Partial<TenantModel>): Promise<TenantModel> {
    const tenantId = randomUUID();

    // Generate database name from subdomain if not provided
    const databaseName = payload.databaseName || `tenant_${payload.subdomain?.replace(/[^a-zA-Z0-9]/g, '_')}`;

    const newTenant = {
      name: payload.name || '',
      subdomain: payload.subdomain || '',
      databaseName: databaseName,
      databaseHost: payload.databaseHost || process.env.MASTER_DB_HOST || 'localhost',
      databasePort: payload.databasePort || Number(process.env.MASTER_DB_PORT) || 5432,
      status: payload.status || 'active',
      tenantId: tenantId,
      settings: payload.settings || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    logger.info(`Creating new tenant: ${newTenant.name} (${tenantId})`);
    logger.info(`Subdomain: ${newTenant.subdomain}, Database: ${newTenant.databaseName}`);

    try {
      // Step 1: Create tenant record in master database
      const [createdTenant] = await masterDb.insert(tenants).values(newTenant).returning();
      logger.info(`✓ Tenant record created in master database`);

      // Step 2: Create and migrate tenant database
      await this.createAndMigrateTenantDatabase(newTenant.databaseName, tenantId);

      logger.info(`✓ Tenant created successfully: ${newTenant.name}`);
      return createdTenant as TenantModel;
    } catch (error) {
      logger.error(`Failed to create tenant ${newTenant.name}:`, error);

      // Rollback: Try to delete tenant record if database creation failed
      try {
        await masterDb.delete(tenants).where(eq(tenants.tenantId, tenantId));
        logger.info(`Rolled back tenant record for ${newTenant.name}`);
      } catch (rollbackError) {
        logger.error(`Failed to rollback tenant record:`, rollbackError);
      }

      throw new Error(`Failed to create tenant: ${error}`);
    }
  }

  /**
   * Create tenant database and run migrations
   */
  private async createAndMigrateTenantDatabase(databaseName: string, tenantId: string): Promise<void> {
    if (!databaseName) {
      throw new Error('Database name is required to create a database.');
    }

    logger.info(`Creating and migrating tenant database: ${databaseName}`);

    try {
      // Use migration manager to create database and run migrations
      const result = await migrationManager.migrateTenant(tenantId, databaseName);

      if (!result.success) {
        throw new Error(`Migration failed: ${result.error}`);
      }

      logger.info(`✓ Tenant database created and migrated: ${databaseName}`);
      logger.info(`  Duration: ${result.duration}ms`);
    } catch (error) {
      logger.error(`Failed to create/migrate tenant database ${databaseName}:`, error);
      throw error;
    }
  }

  /**
   * Get all tenants
   */
  async getAllTenants(): Promise<TenantModel[]> {
    const result = await masterDb.select().from(tenants);
    return result as TenantModel[];
  }

  /**
   * Get tenant by ID
   */
  async getTenantById(id: string): Promise<TenantModel | undefined> {
    const [tenant] = await masterDb
      .select()
      .from(tenants)
      .where(eq(tenants.id, id))
      .limit(1);
    return tenant as TenantModel | undefined;
  }

  /**
   * Get tenant by tenantId
   */
  async getTenantByTenantId(tenantId: string): Promise<TenantModel | undefined> {
    const [tenant] = await masterDb
      .select()
      .from(tenants)
      .where(eq(tenants.tenantId, tenantId))
      .limit(1);
    return tenant as TenantModel | undefined;
  }

  /**
   * Get tenant by subdomain
   */
  async getTenantBySubdomain(subdomain: string): Promise<TenantModel | undefined> {
    const [tenant] = await masterDb
      .select()
      .from(tenants)
      .where(eq(tenants.subdomain, subdomain))
      .limit(1);
    return tenant as TenantModel | undefined;
  }

  /**
   * Update tenant
   */
  async update(id: string, payload: Partial<TenantModel>): Promise<TenantModel | undefined> {
    const [updated] = await masterDb
      .update(tenants)
      .set({ ...payload, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning();
    return updated as TenantModel | undefined;
  }

  /**
   * Delete tenant (soft delete by setting status to inactive)
   */
  async delete(id: string): Promise<void> {
    await masterDb
      .update(tenants)
      .set({ status: 'inactive', updatedAt: new Date() })
      .where(eq(tenants.id, id));
  }

  /**
   * Hard delete tenant (removes from database)
   * WARNING: This will not delete the tenant's database
   */
  async hardDelete(id: string): Promise<void> {
    await masterDb.delete(tenants).where(eq(tenants.id, id));
  }
}

export default new TenantRepository();

