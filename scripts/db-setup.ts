#!/usr/bin/env ts-node
/**
 * Database Setup Script
 * 
 * This script sets up the entire database infrastructure:
 * 1. Creates and migrates the master database
 * 2. Creates and migrates all tenant databases
 * 
 * Usage:
 *   npm run db:setup
 *   or
 *   ts-node scripts/db-setup.ts
 * 
 * Options:
 *   --skip-master     Skip master database setup
 *   --skip-tenants    Skip tenant databases setup
 */

import 'dotenv/config';
import { migrationManager } from '../src/core/database/migrationManager';
import { logger } from '../src/core/utils/logger.util';
import { masterDb } from '../src/core/database/masterConnection';
import { tenants } from '../src/core/database/schemas/master/tenants.schema';

async function main() {
    const args = process.argv.slice(2);
    const skipMaster = args.includes('--skip-master');
    const skipTenants = args.includes('--skip-tenants');

    try {
        logger.info('=== Database Setup Script ===\n');

        // Step 1: Setup Master Database
        if (!skipMaster) {
            logger.info('Step 1: Setting up master database...');
            const masterResult = await migrationManager.migrateMaster();

            if (!masterResult.success) {
                logger.error('✗ Master database setup failed!');
                logger.error(`Error: ${masterResult.error}`);
                process.exit(1);
            }

            logger.info('✓ Master database setup completed\n');
        } else {
            logger.info('Step 1: Skipping master database setup (--skip-master)\n');
        }

        // Step 2: Setup Tenant Databases
        if (!skipTenants) {
            logger.info('Step 2: Setting up tenant databases...');

            // Get all tenants
            const tenantList = await masterDb.select().from(tenants);
            logger.info(`Found ${tenantList.length} tenant(s)`);

            if (tenantList.length > 0) {
                const results = await migrationManager.migrateAllTenants(
                    tenantList.map((tenant) => ({
                        tenantId: tenant.tenantId,
                        databaseName: tenant.databaseName,
                        databaseHost: tenant.databaseHost || undefined,
                        databasePort: tenant.databasePort || undefined,
                    }))
                );

                const successful = results.filter((r) => r.success).length;
                const failed = results.filter((r) => !r.success).length;

                if (failed > 0) {
                    logger.error(`✗ ${failed} tenant database(s) failed to setup`);
                    process.exit(1);
                }

                logger.info(`✓ All ${successful} tenant database(s) setup completed\n`);
            } else {
                logger.info('No tenants found. Skipping tenant database setup.\n');
            }
        } else {
            logger.info('Step 2: Skipping tenant databases setup (--skip-tenants)\n');
        }

        logger.info('=== Database Setup Completed Successfully ===');
        process.exit(0);
    } catch (error) {
        logger.error('Fatal error during database setup:', error);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

export default main;
