import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';

export const orderItemsSchema = pgTable('order_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  menuItemId: varchar('menu_item_id', { length: 36 }).notNull(),
  quantity: integer('quantity').notNull(),
  notes: varchar('notes', { length: 255 }),
});
