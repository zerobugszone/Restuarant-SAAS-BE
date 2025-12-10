import { varchar, integer, pgSchema } from 'drizzle-orm/pg-core';
import { PgSchema } from '../../pgSchema';

export const customerSchema = pgSchema<PgSchema>('customer');

export const customersSchema = customerSchema.table('customers', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  loyaltyPoints: integer('loyalty_points').notNull().default(0),
});
