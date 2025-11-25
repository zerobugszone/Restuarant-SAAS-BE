import { pgTable, varchar, text } from 'drizzle-orm/pg-core';

export const rolesSchema = pgTable('roles', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  description: text('description'),
});
