import { pgTable, varchar, boolean, numeric } from 'drizzle-orm/pg-core';

export const menuItemsSchema = pgTable('menu_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: varchar('description', { length: 255 }),
  price: numeric('price').notNull(),
  categoryId: varchar('category_id', { length: 36 }),
  isAvailable: boolean('is_available').notNull().default(true),
  status: boolean('status').notNull().default(true), // true = active, false = inactive
});
