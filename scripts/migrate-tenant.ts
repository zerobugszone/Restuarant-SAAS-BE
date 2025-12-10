#!/usr/bin/env ts-node
/**
 * Single Tenant Migration Script
 * 
 * This script migrates a single tenant database.
 * 
 * Usage:
 *   npm run migrate:tenant -- <tenantId> [databaseName]
 *   or
 *   ts-node scripts/migrate-tenant.ts <tenantId> [databaseName]
 * 
 * Examples:
 *   npm run migrate:tenant -- abc-123
 *   npm run migrate:tenant -- abc-123 custom_tenant_db
 */

import 'dotenv/config';
import { migrationManager } from '../src/core/database/migrationManager';
import { logger } from '../src/core/utils/logger.util';

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        logger.error('Error: Tenant ID is required');
        logger.info('\nUsage:');
        logger.info('  npm run migrate:tenant -- <tenantId> [databaseName]');
        logger.info('\nExamples:');
        logger.info('  npm run migrate:tenant -- abc-123');
        logger.info('  npm run migrate:tenant -- abc-123 custom_tenant_db');
        process.exit(1);
    }

    const tenantId = args[0];
    const databaseName = args[1];

    try {
        logger.info(`Starting migration for tenant: ${tenantId}\n`);

        const result = await migrationManager.migrateTenant(tenantId, databaseName);

        if (result.success) {
            logger.info('\n✓ Tenant database migration completed successfully!');
            logger.info(`  Tenant ID: ${tenantId}`);
            logger.info(`  Database: ${result.database}`);
            logger.info(`  Duration: ${result.duration}ms`);
            process.exit(0);
        } else {
            logger.error('\n✗ Tenant database migration failed!');
            logger.error(`  Tenant ID: ${tenantId}`);
            logger.error(`  Database: ${result.database}`);
            logger.error(`  Error: ${result.error}`);
            process.exit(1);
        }
    } catch (error) {
        logger.error('Fatal error during tenant migration:', error);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

export default main;
