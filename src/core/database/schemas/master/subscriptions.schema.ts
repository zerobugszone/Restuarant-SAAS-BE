import { pgSchema, uuid, varchar, integer, boolean, timestamp, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from './auth.schema';

/**
 * Subscription Schema
 */
export const subscriptionSchema = pgSchema('subscription');

/**
 * Subscriptions Table
 */
export const subscriptions = subscriptionSchema.table('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  tenantId: uuid('tenant_id')
    .references(() => tenants.id, { onDelete: 'cascade' })
    .notNull(),
  planType: varchar('plan_type', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).default('active').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  billingCycle: varchar('billing_cycle', { length: 50 }),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Plan Features Table
 */
export const planFeatures = subscriptionSchema.table('plan_features', {
  id: uuid('id').defaultRandom().primaryKey(),
  subscriptionId: uuid('subscription_id')
    .references(() => subscriptions.id, { onDelete: 'cascade' })
    .notNull(),
  featureName: varchar('feature_name', { length: 100 }).notNull(),
  featureLimit: integer('feature_limit'), // optional numeric limit
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Relations
 */
export const subscriptionsRelations = relations(subscriptions, ({ many }) => ({
  features: many(planFeatures),
}));

export const planFeaturesRelations = relations(planFeatures, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [planFeatures.subscriptionId],
    references: [subscriptions.id],
  }),
}));

/**
 * TypeScript Types
 */
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type PlanFeature = typeof planFeatures.$inferSelect;
export type NewPlanFeature = typeof planFeatures.$inferInsert;
