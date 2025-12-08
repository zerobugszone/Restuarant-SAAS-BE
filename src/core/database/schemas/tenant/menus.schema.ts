import { pgTable, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants.schema';
import { tablesSchema } from './tables.schema';
import { relations } from 'drizzle-orm';

/**
 * Menus Schema
 * Each restaurant can have multiple menus (e.g., Breakfast, Lunch, Dinner, Drinks)
 * Each table can also have a specific menu assigned
 */
export const menus = pgTable('menus', {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    restaurantId: varchar('restaurant_id', { length: 36 })
        .notNull()
        .references(() => restaurants.id, { onDelete: 'cascade' }),
    tableId: varchar('table_id', { length: 36 }).references(() => tablesSchema.id, {
        onDelete: 'set null',
    }),
    isActive: boolean('is_active').notNull().default(true),
    displayOrder: varchar('display_order', { length: 10 }).default('0'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const menusRelations = relations(menus, ({ one, many }) => ({
    restaurant: one(restaurants, {
        fields: [menus.restaurantId],
        references: [restaurants.id],
    }),
    table: one(tablesSchema, {
        fields: [menus.tableId],
        references: [tablesSchema.id],
    }),
    categories: many(menuCategoriesSchema),
}));

export type Menu = typeof menus.$inferSelect;
export type NewMenu = typeof menus.$inferInsert;

// Import for relations (will be defined in menu_categories.schema.ts)
import { menuCategoriesSchema } from './menu_categories.schema';
