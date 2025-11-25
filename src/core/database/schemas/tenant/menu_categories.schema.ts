import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const menuCategoriesSchema = pgTable('menu_categories', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: varchar('description', { length: 255 }),
});
