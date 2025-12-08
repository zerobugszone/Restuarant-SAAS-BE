import { pgTable, uuid, varchar, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const tenants = pgTable('tenants', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  subdomain: varchar('subdomain', { length: 100 }).notNull().unique(),
  databaseName: varchar('database_name', { length: 100 }).notNull().unique(),
  databaseHost: varchar('database_host', { length: 255 }).notNull(),
  databasePort: integer('database_port').default(5432).notNull(),
  status: varchar('status', { length: 50 }).default('active').notNull(),
  tenantId: uuid('tenant_id').notNull(),
  settings: jsonb('settings').$type<Record<string, unknown> | null>().default(null),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
