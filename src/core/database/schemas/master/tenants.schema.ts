import { pgTable, uuid, varchar, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const tenants = pgTable('tenants', {
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
