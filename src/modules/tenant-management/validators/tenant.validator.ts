import { body } from 'express-validator';
import { forbidExtraFields } from '@/core/helper/validation_helper';
import emojiRegex from 'emoji-regex';
import { tenants } from '@/core/database/schemas/master/auth.schema';
import { masterDb } from '@/core/database/masterConnection';
import { eq } from 'drizzle-orm';

// ──────────────────────────────────────────
// EMOJI CHECKER
// ──────────────────────────────────────────
const noEmoji = (value: string) => {
  const regex = emojiRegex();
  if (regex.test(value)) {
    throw new Error('Field cannot contain emoji characters');
  }
  return true;
};

// ──────────────────────────────────────────
// CHECK IF SUBDOMAIN IS UNIQUE
// ──────────────────────────────────────────
const tenantSubdomainUniqueCheck = async (subdomain: string) => {
  const existingTenant = await masterDb
    .select()
    .from(tenants)
    .where(eq(tenants.subdomain, subdomain))
    .limit(1);

  if (existingTenant.length > 0) {
    throw new Error('Subdomain already in use');
  }
};

// ──────────────────────────────────────────
// CHECK IF DATABASE URL IS UNIQUE
// ──────────────────────────────────────────
// Required because your architecture is DB-per-tenant
const databaseUrlUniqueCheck = async (databaseUrl: string) => {
  const existingTenant = await masterDb
    .select()
    .from(tenants)
    .where(eq(tenants.databaseUrl, databaseUrl))
    .limit(1);

  if (existingTenant.length > 0) {
    throw new Error('Database URL already used by another tenant');
  }
};

// ──────────────────────────────────────────
// MAIN VALIDATION SCHEMA
// ──────────────────────────────────────────
export const createTenantSchema = [
  forbidExtraFields(['name', 'subdomain', 'email', 'plan', 'settings', 'databaseUrl']),

  // Tenant Name
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Tenant name is required')
    .bail()
    .isString()
    .withMessage('Tenant name must be a string')
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage('Tenant name must be between 3 and 50 characters')
    .bail()
    .custom(noEmoji),

  // Subdomain
  body('subdomain')
    .trim()
    .notEmpty()
    .withMessage('Subdomain is required')
    .bail()
    .matches(/^[a-zA-Z0-9-]+$/)
    .withMessage('Subdomain can only contain letters, numbers, and hyphens')
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage('Subdomain must be between 3 and 30 characters')
    .bail()
    .custom(noEmoji)
    .bail()
    .custom(tenantSubdomainUniqueCheck),

  // Plan
  body('plan')
    .trim()
    .notEmpty()
    .withMessage('Plan is required')
    .bail()
    .isString()
    .withMessage('Plan must be a string')
    .bail()
    .isIn(['free', 'basic', 'premium', 'enterprise'])
    .withMessage('Invalid plan type')
    .bail()
    .custom(noEmoji),

  // Optional databaseUrl (admin can override)
  body('databaseUrl')
    .optional()
    .isString()
    .withMessage('Database URL must be a string')
    .bail()
    .isURL({ protocols: ['postgres'], require_tld: false })
    .withMessage('Invalid Postgres URL format')
    .bail()
    .custom(noEmoji)
    .bail()
    .custom(databaseUrlUniqueCheck),

  // Optional settings object
  body('settings').optional().isObject().withMessage('Settings must be a valid object'),
];
