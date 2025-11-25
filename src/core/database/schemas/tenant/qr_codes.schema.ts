import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

export const qrCodesSchema = pgTable('qr_codes', {
  id: varchar('id', { length: 36 }).primaryKey(),
  tableId: varchar('table_id', { length: 36 }),
  menuSectionId: varchar('menu_section_id', { length: 36 }),
  code: varchar('code', { length: 255 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'table' | 'menu'
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});
