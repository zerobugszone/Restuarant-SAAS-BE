import { pgSchema, pgTable, varchar } from 'drizzle-orm/pg-core';
import { PgSchema } from '../../pgSchema';

export const settingsSchema = pgSchema<PgSchema>('setting');

export const globalSettingsSchema = settingsSchema.table('global_settings', {
  id: varchar('id', { length: 36 }).primaryKey(),
  setting: varchar('setting', { length: 100 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
});
