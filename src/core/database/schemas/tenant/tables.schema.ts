import { pgTable, varchar, integer, boolean } from 'drizzle-orm/pg-core';

export const tablesSchema = pgTable('tables', {
  id: varchar('id', { length: 36 }).primaryKey(),
  number: varchar('number', { length: 10 }).notNull(),
  capacity: integer('capacity').notNull(),
  section: varchar('section', { length: 50 }),
  qrCode: varchar('qr_code', { length: 255 }),
  isOccupied: boolean('is_occupied').notNull().default(false),
});
