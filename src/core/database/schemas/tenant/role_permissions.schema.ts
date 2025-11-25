import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const rolePermissionsSchema = pgTable('role_permissions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  roleId: varchar('role_id', { length: 36 }).notNull(),
  permissionId: varchar('permission_id', { length: 36 }).notNull(),
});
