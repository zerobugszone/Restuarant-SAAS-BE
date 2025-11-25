import { pgTable, varchar, numeric } from 'drizzle-orm/pg-core';

export const restaurantSettingsSchema = pgTable('restaurant_settings', {
  id: varchar('id', { length: 36 }).primaryKey(),
  theme: varchar('theme', { length: 50 }),
  currency: varchar('currency', { length: 10 }),
  tax: numeric('tax').notNull().default('0'),
  serviceCharge: numeric('service_charge').notNull().default('0'),
});
