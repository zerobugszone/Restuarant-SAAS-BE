import { rolesSchema } from '@/core/database/schemas/tenant/roles.schema';
import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { eq } from 'drizzle-orm';

export const RolesRepository = {
  async create(tenantId: string, data: any) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.insert(rolesSchema).values(data).returning();
  },
  async getAll(tenantId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.select().from(rolesSchema);
  },
  async update(tenantId: string, id: string, data: any) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.update(rolesSchema).set(data).where(eq(rolesSchema.id, id)).returning();
  },
  async delete(tenantId: string, id: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.delete(rolesSchema).where(eq(rolesSchema.id, id)).returning();
  },
};
