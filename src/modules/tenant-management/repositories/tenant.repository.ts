import { TenantModel } from '../models/tenant.model';
import { tenants } from '@/core/database/schemas/master/tenants.schema';
import { eq } from 'drizzle-orm';
import { paginatedData } from '@/core/helper/pagination_helper';
import { masterDb } from '@/core/database/masterConnection';
import { randomUUID } from 'crypto';
import { ensureTenantDatabaseExists } from '@/core/database/ensureDatabase';

class TenantRepository {
  async create(payload: Partial<TenantModel>): Promise<TenantModel> {
    const tenantId = randomUUID();
    const newTenant = {
      name: payload.name || '',
      subdomain: payload.subdomain || '',
      databaseName: payload.databaseName || '',
      databaseHost: payload.databaseHost || '',
      databasePort: payload.databasePort || 5432,
      status: payload.status || 'active',
      tenantId: tenantId,
      settings: payload.settings || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const [createdTenant] = await masterDb.insert(tenants).values(newTenant).returning();
    await this.createDatabase(newTenant.databaseName, tenantId);
    return createdTenant as TenantModel;
  }

  private async createDatabase(databaseName: string, tenantId: string): Promise<void> {
    if (!databaseName) {
      throw new Error('Database name is required to create a database.');
    }
    const sanitizedName = databaseName.replace(/[^a-zA-Z0-9_]/g, '_');
    await ensureTenantDatabaseExists(tenantId, sanitizedName);
  }

  async getAllTenants(): Promise<TenantModel[]> {
    const result = await masterDb.select().from(tenants);
    return result as TenantModel[];
  }
}

export default new TenantRepository();
