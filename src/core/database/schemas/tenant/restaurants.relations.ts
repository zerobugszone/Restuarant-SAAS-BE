import { relations } from 'drizzle-orm';
import { restaurants } from './restaurants.schema';
import { tablesSchema } from './tables.schema';
import { menus } from './menus.schema';

/**
 * Restaurant Relations
 * Defines relationships between restaurants and other entities
 */
export const restaurantsRelations = relations(restaurants, ({ many }) => ({
    tables: many(tablesSchema),
    menus: many(menus),
}));
