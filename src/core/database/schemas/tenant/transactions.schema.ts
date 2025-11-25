import { pgTable, varchar, numeric, timestamp } from 'drizzle-orm/pg-core';

export const transactionsSchema = pgTable('transactions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 }).notNull(),
  amount: numeric('amount').notNull(),
  method: varchar('method', { length: 30 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});
