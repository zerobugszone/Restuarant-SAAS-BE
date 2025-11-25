import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const globalSettingsSchema = pgTable('global_settings', {
  id: varchar('id', { length: 36 }).primaryKey(),
  setting: varchar('setting', { length: 100 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
});
