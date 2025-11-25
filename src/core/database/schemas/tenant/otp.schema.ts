import { pgTable, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const otpSchema = pgTable('otp', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  code: varchar('code', { length: 10 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  used: boolean('used').notNull().default(false),
});
