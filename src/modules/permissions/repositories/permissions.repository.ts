import { permissions } from '@/core/database/schemas/tenant/auth.schema';
import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { eq } from 'drizzle-orm';

export const PermissionsRepository = {
  async create(tenantId: string, data: any) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.insert(permissions).values(data).returning();
  },
  async getAll(tenantId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.select().from(permissions);
  },
  async update(tenantId: string, id: string, data: any) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.update(permissions).set(data).where(eq(permissions.id, id)).returning();
  },
  async delete(tenantId: string, id: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.delete(permissions).where(eq(permissions.id, id)).returning();
  },
};
