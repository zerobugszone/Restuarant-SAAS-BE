/**
 * Tenant Database Schema Index
 *
 * This file exports all tenant database schemas and their relations.
 * Import this file when you need access to the complete tenant schema.
 */

// Core entities
export * from './restaurants.schema';

// Other entities
export * from './orders.schema';
export * from './customers.schema';

// User management
export * from './auth.schema';
