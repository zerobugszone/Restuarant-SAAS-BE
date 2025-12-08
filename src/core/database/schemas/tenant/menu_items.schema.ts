import { pgTable, varchar, boolean, numeric, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { menuCategoriesSchema } from './menu_categories.schema';

/**
 * Menu Items Schema
 * Individual items within a category
 */
export const menuItemsSchema = pgTable('menu_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  categoryId: varchar('category_id', { length: 36 })
    .notNull()
    .references(() => menuCategoriesSchema.id, { onDelete: 'cascade' }),
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

// Relations
export const menuItemsRelations = relations(menuItemsSchema, ({ one }) => ({
  category: one(menuCategoriesSchema, {
    fields: [menuItemsSchema.categoryId],
    references: [menuCategoriesSchema.id],
  }),
}));

export type MenuItem = typeof menuItemsSchema.$inferSelect;
export type NewMenuItem = typeof menuItemsSchema.$inferInsert;

