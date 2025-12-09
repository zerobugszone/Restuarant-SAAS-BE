import { roles } from '@/core/database/schemas/tenant/auth.schema';
import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { eq } from 'drizzle-orm';

export const RolesRepository = {
  async create(tenantId: string, data: any) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.insert(roles).values(data).returning();
  },
  async getAll(tenantId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.select().from(roles);
  },
  async update(tenantId: string, id: string, data: any) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.update(roles).set(data).where(eq(roles.id, id)).returning();
  },
  async delete(tenantId: string, id: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.delete(roles).where(eq(roles.id, id)).returning();
  },
};
