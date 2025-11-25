import { permissionsSchema } from '@/core/database/schemas/tenant/permissions.schema';
import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { eq } from 'drizzle-orm';

export const PermissionsRepository = {
  async create(tenantId: string, data: any) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.insert(permissionsSchema).values(data).returning();
  },
  async getAll(tenantId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.select().from(permissionsSchema);
  },
  async update(tenantId: string, id: string, data: any) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.update(permissionsSchema).set(data).where(eq(permissionsSchema.id, id)).returning();
  },
  async delete(tenantId: string, id: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.delete(permissionsSchema).where(eq(permissionsSchema.id, id)).returning();
  },
};
