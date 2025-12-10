import { pgSchema, varchar, text, timestamp, boolean, integer, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { PgSchema } from '../../pgSchema';

/**
 * Unified Restaurant Schema
 */
export const restaurantSchema = pgSchema<PgSchema>('restaurant');

/**
 * Restaurants Table
 */
export const restaurants = restaurantSchema.table('restaurants', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  address: text('address'),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  logo: varchar('logo', { length: 500 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * Tables Table
 */
export const tables = restaurantSchema.table('tables', {
  id: varchar('id', { length: 36 }).primaryKey(),
  restaurantId: varchar('restaurant_id', { length: 36 })
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  number: varchar('number', { length: 10 }).notNull(),
  capacity: integer('capacity').notNull(),
  section: varchar('section', { length: 50 }),
  isOccupied: boolean('is_occupied').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * QR Codes Table
 * One QR per table, pointing to menu
 */
export const qrCodes = restaurantSchema.table('qr_codes', {
  id: varchar('id', { length: 36 }).primaryKey(),
  tableId: varchar('table_id', { length: 36 })
    .notNull()
    .references(() => tables.id, { onDelete: 'cascade' }),
  menuId: varchar('menu_id', { length: 36 })
    .notNull()
    .references(() => menus.id, { onDelete: 'cascade' }),
  code: varchar('code', { length: 255 }).notNull(), // QR string
  type: varchar('type', { length: 20 }).notNull(), // e.g., 'table'
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

/**
 * Menus Table
 */
export const menus = restaurantSchema.table('menus', {
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
 */
export const menuCategories = restaurantSchema.table('menu_categories', {
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
 */
export const menuItems = restaurantSchema.table('menu_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  categoryId: varchar('category_id', { length: 36 })
    .notNull()
    .references(() => menuCategories.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  image: varchar('image', { length: 500 }),
  preparationTime: integer('preparation_time'),
  calories: integer('calories'),
  isVegetarian: boolean('is_vegetarian').default(false),
  isVegan: boolean('is_vegan').default(false),
  isGlutenFree: boolean('is_gluten_free').default(false),
  spicyLevel: integer('spicy_level').default(0),
  isAvailable: boolean('is_available').notNull().default(true),
  isActive: boolean('is_active').notNull().default(true),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * Inventory Table
 */
export const inventory = restaurantSchema.table('inventory', {
  id: varchar('id', { length: 36 }).primaryKey(),
  itemName: varchar('item_name', { length: 100 }).notNull(),
  quantity: integer('quantity').notNull(),
  unit: varchar('unit', { length: 20 }),
  lastUpdated: timestamp('last_updated', { mode: 'date' }).notNull().defaultNow(),
});

/**
 * Menu Item - Inventory Table (Many-to-Many)
 */
export const menuItemInventory = restaurantSchema.table('menu_item_inventory', {
  id: varchar('id', { length: 36 }).primaryKey(),
  menuItemId: varchar('menu_item_id', { length: 36 })
    .notNull()
    .references(() => menuItems.id, { onDelete: 'cascade' }),
  inventoryId: varchar('inventory_id', { length: 36 })
    .notNull()
    .references(() => inventory.id, { onDelete: 'cascade' }),
  quantityUsed: numeric('quantity_used', { precision: 10, scale: 2 }).notNull(),
});

/**
 * Relations
 */
export const restaurantsRelations = relations(restaurants, ({ many }) => ({
  tables: many(tables),
  menus: many(menus),
}));

export const tablesRelations = relations(tables, ({ one, many }) => ({
  restaurant: one(restaurants, { fields: [tables.restaurantId], references: [restaurants.id] }),
  menus: many(menus),
  qrCodes: many(qrCodes),
}));

export const qrCodesRelations = relations(qrCodes, ({ one }) => ({
  table: one(tables, { fields: [qrCodes.tableId], references: [tables.id] }),
  menu: one(menus, { fields: [qrCodes.menuId], references: [menus.id] }),
}));

export const menusRelations = relations(menus, ({ one, many }) => ({
  restaurant: one(restaurants, { fields: [menus.restaurantId], references: [restaurants.id] }),
  table: one(tables, { fields: [menus.tableId], references: [tables.id] }),
  categories: many(menuCategories),
  qrCodes: many(qrCodes),
}));

export const menuCategoriesRelations = relations(menuCategories, ({ one, many }) => ({
  menu: one(menus, { fields: [menuCategories.menuId], references: [menus.id] }),
  menuItems: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  category: one(menuCategories, {
    fields: [menuItems.categoryId],
    references: [menuCategories.id],
  }),
  inventory: many(menuItemInventory),
}));

export const inventoryRelations = relations(inventory, ({ many }) => ({
  menuItems: many(menuItemInventory),
}));

export const menuItemInventoryRelations = relations(menuItemInventory, ({ one }) => ({
  menuItem: one(menuItems, { fields: [menuItemInventory.menuItemId], references: [menuItems.id] }),
  inventory: one(inventory, {
    fields: [menuItemInventory.inventoryId],
    references: [inventory.id],
  }),
}));

/**
 * TypeScript Types
 */
export type Restaurant = typeof restaurants.$inferSelect;
export type NewRestaurant = typeof restaurants.$inferInsert;

export type Table = typeof tables.$inferSelect;
export type NewTable = typeof tables.$inferInsert;

export type QRCode = typeof qrCodes.$inferSelect;
export type NewQRCode = typeof qrCodes.$inferInsert;

export type Menu = typeof menus.$inferSelect;
export type NewMenu = typeof menus.$inferInsert;

export type MenuCategory = typeof menuCategories.$inferSelect;
export type NewMenuCategory = typeof menuCategories.$inferInsert;

export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuItem = typeof menuItems.$inferInsert;

export type Inventory = typeof inventory.$inferSelect;
export type NewInventory = typeof inventory.$inferInsert;

export type MenuItemInventory = typeof menuItemInventory.$inferSelect;
export type NewMenuItemInventory = typeof menuItemInventory.$inferInsert;
