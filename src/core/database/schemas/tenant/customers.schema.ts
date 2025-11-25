import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';

export const customersSchema = pgTable('customers', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  loyaltyPoints: integer('loyalty_points').notNull().default(0),
});
