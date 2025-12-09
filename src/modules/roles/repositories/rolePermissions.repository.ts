import { rolePermissions } from '@/core/database/schemas/tenant/auth.schema';
import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { eq, and } from 'drizzle-orm';

export const RolePermissionsRepository = {
  async assign(tenantId: string, roleId: string, permissionId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    const id = crypto.randomUUID();
    return db.insert(rolePermissions).values({ id, roleId, permissionId }).returning();
  },
  async getByRole(tenantId: string, roleId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.select().from(rolePermissions).where(eq(rolePermissions.roleId, roleId));
  },
  async remove(tenantId: string, roleId: string, permissionId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db
      .delete(rolePermissions)
      .where(
        and(eq(rolePermissions.roleId, roleId), eq(rolePermissions.permissionId, permissionId))
      )
      .returning();
  },
};
