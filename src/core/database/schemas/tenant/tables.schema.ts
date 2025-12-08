import { pgTable, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { restaurants } from './restaurants.schema';

/**
 * Tables Schema
 * Physical tables in a restaurant location
 */
export const tablesSchema = pgTable('tables', {
  id: varchar('id', { length: 36 }).primaryKey(),
  restaurantId: varchar('restaurant_id', { length: 36 })
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  number: varchar('number', { length: 10 }).notNull(),
  capacity: integer('capacity').notNull(),
  section: varchar('section', { length: 50 }),
  qrCode: varchar('qr_code', { length: 255 }),
  isOccupied: boolean('is_occupied').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const tablesRelations = relations(tablesSchema, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [tablesSchema.restaurantId],
    references: [restaurants.id],
  }),
  menus: many(menus),
}));

export type Table = typeof tablesSchema.$inferSelect;
export type NewTable = typeof tablesSchema.$inferInsert;

// Import for relations
import { menus } from './menus.schema';

