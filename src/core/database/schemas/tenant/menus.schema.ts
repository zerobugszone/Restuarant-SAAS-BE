import { pgSchema, varchar, text, timestamp, boolean, integer, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { restaurants } from './restaurants.schema';
import { tables } from './restaurants.schema';

// Create a single schema for all menu-related tables
export const menuSchema = pgSchema('menu');

/**
 * Menus Table
 * Top-level menu for a restaurant/table
 */
export const menus = menuSchema.table('menus', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  restaurantId: varchar('restaurant_id', { length: 36 })
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  tableId: varchar('table_id', { length: 36 }).references(() => tables.id, {
    onDelete: 'set null',
  }),
  isActive: boolean('is_active').notNull().default(true),
  displayOrder: varchar('display_order', { length: 10 }).default('0'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * Menu Categories Table
 * Categories within a menu (Appetizers, Main Course, etc.)
 */
export const menuCategories = menuSchema.table('menu_categories', {
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

/**
 * Menu Items Table
 * Individual items within a category
 */
export const menuItems = menuSchema.table('menu_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  categoryId: varchar('category_id', { length: 36 })
    .notNull()
    .references(() => menuCategories.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  image: varchar('image', { length: 500 }),
  preparationTime: integer('preparation_time'), // in minutes
  calories: integer('calories'),
  isVegetarian: boolean('is_vegetarian').default(false),
  isVegan: boolean('is_vegan').default(false),
  isGlutenFree: boolean('is_gluten_free').default(false),
  spicyLevel: integer('spicy_level').default(0), // 0-5 scale
  isAvailable: boolean('is_available').notNull().default(true),
  isActive: boolean('is_active').notNull().default(true),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * Relations
 */
export const menusRelations = relations(menus, ({ one, many }) => ({
  restaurant: one(restaurants, { fields: [menus.restaurantId], references: [restaurants.id] }),
  table: one(tables, { fields: [menus.tableId], references: [tables.id] }),
  categories: many(menuCategories),
}));

export const menuCategoriesRelations = relations(menuCategories, ({ one, many }) => ({
  menu: one(menus, { fields: [menuCategories.menuId], references: [menus.id] }),
  menuItems: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one }) => ({
  category: one(menuCategories, {
    fields: [menuItems.categoryId],
    references: [menuCategories.id],
  }),
}));

/**
 * Types
 */
export type Menu = typeof menus.$inferSelect;
export type NewMenu = typeof menus.$inferInsert;

export type MenuCategory = typeof menuCategories.$inferSelect;
export type NewMenuCategory = typeof menuCategories.$inferInsert;

export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuItem = typeof menuItems.$inferInsert;
