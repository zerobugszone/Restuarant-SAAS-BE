import { pgTable, varchar, numeric, timestamp } from 'drizzle-orm/pg-core';

export const ordersSchema = pgTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  customerId: varchar('customer_id', { length: 36 }),
  tableId: varchar('table_id', { length: 36 }),
  status: varchar('status', { length: 30 }).notNull(),
  total: numeric('total').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});
