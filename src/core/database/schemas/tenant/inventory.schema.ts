import { pgTable, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const inventorySchema = pgTable('inventory', {
  id: varchar('id', { length: 36 }).primaryKey(),
  itemName: varchar('item_name', { length: 100 }).notNull(),
  quantity: integer('quantity').notNull(),
  unit: varchar('unit', { length: 20 }),
  lastUpdated: timestamp('last_updated', { mode: 'date' }).notNull().defaultNow(),
});
