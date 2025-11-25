import { userRolesSchema } from '@/core/database/schemas/tenant/user_roles.schema';
import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { eq, and } from 'drizzle-orm';

export const UserRolesRepository = {
  async assign(tenantId: string, userId: string, roleId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    const id = crypto.randomUUID();
    return db.insert(userRolesSchema).values({ id, userId, roleId }).returning();
  },
  async getByUser(tenantId: string, userId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.select().from(userRolesSchema).where(eq(userRolesSchema.userId, userId));
  },
  async remove(tenantId: string, userId: string, roleId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db
      .delete(userRolesSchema)
      .where(and(eq(userRolesSchema.userId, userId), eq(userRolesSchema.roleId, roleId)))
      .returning();
  },
};
