import { pgTable, varchar, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { menus } from './menus.schema';

/**
 * Menu Categories Schema
 * Categories within a menu (e.g., Appetizers, Main Course, Desserts)
 */
export const menuCategoriesSchema = pgTable('menu_categories', {
  id: varchar('id', { length: 36 }).primaryKey(),
  menuId: varchar('menu_id', { length: 36 })
    .notNull()
    .references(() => menus.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  displayOrder: integer('display_order').default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const menuCategoriesRelations = relations(menuCategoriesSchema, ({ one, many }) => ({
  menu: one(menus, {
    fields: [menuCategoriesSchema.menuId],
    references: [menus.id],
  }),
  menuItems: many(menuItemsSchema),
}));

export type MenuCategory = typeof menuCategoriesSchema.$inferSelect;
export type NewMenuCategory = typeof menuCategoriesSchema.$inferInsert;

// Import for relations
import { menuItemsSchema } from './menu_items.schema';

