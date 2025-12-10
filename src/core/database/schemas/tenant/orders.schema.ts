import { pgSchema, varchar, numeric, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tables } from './restaurants.schema';
import { menuItems } from './menus.schema';
import { PgSchema } from '../../pgSchema';

export const orderSchema = pgSchema<PgSchema>('order');

/**
 * Orders Table
 */
export const orders = orderSchema.table('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  customerId: varchar('customer_id', { length: 36 }),
  tableId: varchar('table_id', { length: 36 }).references(() => tables.id, {
    onDelete: 'set null',
  }),
  status: varchar('status', { length: 30 }).notNull(),
  total: numeric('total').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

/**
 * Order Items Table
 */
export const orderItems = orderSchema.table('order_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 })
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  menuItemId: varchar('menu_item_id', { length: 36 })
    .notNull()
    .references(() => menuItems.id, { onDelete: 'set null' }),
  quantity: integer('quantity').notNull(),
  notes: varchar('notes', { length: 255 }),
});

/**
 * Transactions Table
 */
export const transactions = orderSchema.table('transactions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 })
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  amount: numeric('amount').notNull(),
  method: varchar('method', { length: 30 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

/**
 * Relations
 */
export const ordersRelations = relations(orders, ({ one, many }) => ({
  table: one(tables, { fields: [orders.tableId], references: [tables.id] }),
  items: many(orderItems),
  transactions: many(transactions),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  menuItem: one(menuItems, { fields: [orderItems.menuItemId], references: [menuItems.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  order: one(orders, { fields: [transactions.orderId], references: [orders.id] }),
}));

/**
 * Types
 */
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
