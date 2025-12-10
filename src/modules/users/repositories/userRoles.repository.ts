import { userRoles } from '@/core/database/schemas/tenant/auth.schema';
import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { eq, and } from 'drizzle-orm';

export const UserRolesRepository = {
  async assign(tenantId: string, userId: string, roleId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    const id = crypto.randomUUID();
    return db.insert(userRoles).values({ id, userId, roleId }).returning();
  },
  async getByUser(tenantId: string, userId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.select().from(userRoles).where(eq(userRoles.userId, userId));
  },
  async remove(tenantId: string, userId: string, roleId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db
      .delete(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)))
      .returning();
  },
};
