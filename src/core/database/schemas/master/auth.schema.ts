import { pgSchema, uuid, varchar, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Auth Schema
 */
export const authSchema = pgSchema('auth');

/**
 * Tenants Table
 */
export const tenants = authSchema.table('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  subdomain: varchar('subdomain', { length: 100 }).notNull().unique(),
  databaseUrl: varchar('database_url', { length: 500 }).notNull(),
  status: varchar('status', { length: 50 }).default('active').notNull(),
  tenantId: uuid('tenant_id').notNull(),
  settings: jsonb('settings').$type<Record<string, unknown> | null>().default(null),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Superadmins Table
 */
export const superadmins = authSchema.table('superadmins', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('owner'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Relations (if needed later)
 */
export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(superadmins), // example: superadmins can belong to tenants if needed
}));

export const superadminsRelations = relations(superadmins, ({ one }) => ({
  tenant: one(tenants, { fields: [superadmins.id], references: [tenants.id] }), // optional
}));

/**
 * TypeScript Types
 */
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;

export type Superadmin = typeof superadmins.$inferSelect;
export type NewSuperadmin = typeof superadmins.$inferInsert;
