/**
 * @deprecated This file is deprecated. Use migrate-all-tenants.ts instead.
 * 
 * This file is kept for backward compatibility.
 * Please use: npm run migrate:all-tenants
 */

import migrateAllTenants from './migrate-all-tenants';

console.warn('\n⚠️  WARNING: This script is deprecated!');
console.warn('Please use: npm run migrate:all-tenants\n');

// Run the new migration script
migrateAllTenants();

