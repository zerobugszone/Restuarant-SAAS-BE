/**
 * Tenant Database Schema Index
 * 
 * This file exports all tenant database schemas and their relations.
 * Import this file when you need access to the complete tenant schema.
 */

// Core entities
export * from './restaurants.schema';
export * from './restaurants.relations';
export * from './tables.schema';
export * from './menus.schema';
export * from './menu_categories.schema';
export * from './menu_items.schema';

// Other entities
export * from './customers.schema';
export * from './orders.schema';
export * from './order_items.schema';
export * from './inventory.schema';
export * from './qr_codes.schema';
export * from './restaurant_settings.schema';
export * from './transactions.schema';
export * from './otp.schema';

// User management
export * from './users.schema';
export * from './roles.schema';
export * from './permissions.schema';
export * from './user_roles.schema';
export * from './role_permissions.schema';
