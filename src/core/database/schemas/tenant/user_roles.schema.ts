import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const userRolesSchema = pgTable('user_roles', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  roleId: varchar('role_id', { length: 36 }).notNull(),
});
