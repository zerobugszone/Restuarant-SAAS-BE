import { rolePermissionsSchema } from '@/core/database/schemas/tenant/role_permissions.schema';
import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { eq, and } from 'drizzle-orm';

export const RolePermissionsRepository = {
  async assign(tenantId: string, roleId: string, permissionId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    const id = crypto.randomUUID();
    return db.insert(rolePermissionsSchema).values({ id, roleId, permissionId }).returning();
  },
  async getByRole(tenantId: string, roleId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.select().from(rolePermissionsSchema).where(eq(rolePermissionsSchema.roleId, roleId));
  },
  async remove(tenantId: string, roleId: string, permissionId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db
      .delete(rolePermissionsSchema)
      .where(
        and(
          eq(rolePermissionsSchema.roleId, roleId),
          eq(rolePermissionsSchema.permissionId, permissionId)
        )
      )
      .returning();
  },
};
