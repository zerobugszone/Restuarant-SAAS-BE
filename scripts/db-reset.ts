#!/usr/bin/env ts-node
/**
 * Database Reset Script
 * 
 * ⚠️  WARNING: This script will DROP all databases and recreate them!
 * Use with extreme caution, especially in production environments.
 * 
 * This script:
 * 1. Drops the master database
 * 2. Drops all tenant databases
 * 3. Recreates and migrates the master database
 * 4. Recreates and migrates all tenant databases
 * 
 * Usage:
 *   npm run db:reset -- --confirm
 *   or
 *   ts-node scripts/db-reset.ts --confirm
 * 
 * Options:
 *   --confirm         Required flag to confirm database reset
 *   --master-only     Only reset master database
 *   --tenants-only    Only reset tenant databases
 */

import 'dotenv/config';
import { migrationManager } from '../src/core/database/migrationManager';
import { logger } from '../src/core/utils/logger.util';
import { masterDb } from '../src/core/database/masterConnection';
import { tenants } from '../src/core/database/schemas/master/tenants.schema';
import { masterDbConfig } from '../src/core/config/database.config';
import * as readline from 'readline';

async function confirmAction(message: string): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(`${message} (yes/no): `, (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'yes');
        });
    });
}

async function main() {
    const args = process.argv.slice(2);
    const confirmed = args.includes('--confirm');
    const masterOnly = args.includes('--master-only');
    const tenantsOnly = args.includes('--tenants-only');

    if (!confirmed) {
        logger.error('⚠️  Database reset requires confirmation!');
        logger.info('\nThis operation will DROP and RECREATE all databases.');
        logger.info('To proceed, run: npm run db:reset -- --confirm\n');
        process.exit(1);
    }

    try {
        logger.warn('=== DATABASE RESET SCRIPT ===');
        logger.warn('⚠️  This will DELETE all data!\n');

        // Double confirmation
        const userConfirmed = await confirmAction(
            'Are you absolutely sure you want to reset all databases?'
        );

        if (!userConfirmed) {
            logger.info('Database reset cancelled.');
            process.exit(0);
        }

        // Get tenant list before dropping master
        let tenantList: any[] = [];
        if (!masterOnly) {
            try {
                logger.info('Fetching tenant list...');
                tenantList = await masterDb.select().from(tenants);
                logger.info(`Found ${tenantList.length} tenant(s)`);
            } catch (err) {
                logger.warn('Could not fetch tenant list (master DB might not exist yet)');
            }
        }

        // Reset Master Database
        if (!tenantsOnly) {
            logger.info('\n=== Resetting Master Database ===');

            try {
                await migrationManager.dropDatabase(masterDbConfig.database, undefined, true);
                logger.info('✓ Master database dropped');
            } catch (err) {
                logger.warn('Master database drop failed (might not exist):', err);
            }

            const masterResult = await migrationManager.migrateMaster();
            if (!masterResult.success) {
                logger.error('✗ Master database reset failed!');
                logger.error(`Error: ${masterResult.error}`);
                process.exit(1);
            }

            logger.info('✓ Master database reset completed');
        }

        // Reset Tenant Databases
        if (!masterOnly && tenantList.length > 0) {
            logger.info(`\n=== Resetting ${tenantList.length} Tenant Database(s) ===`);

            for (const tenant of tenantList) {
                try {
                    logger.info(`Resetting tenant: ${tenant.databaseName}`);

                    await migrationManager.dropDatabase(tenant.databaseName, undefined, true);

                    const result = await migrationManager.migrateTenant(
                        tenant.tenantId,
                        tenant.databaseName
                    );

                    if (result.success) {
                        logger.info(`✓ Tenant '${tenant.databaseName}' reset completed`);
                    } else {
                        logger.error(`✗ Tenant '${tenant.databaseName}' reset failed: ${result.error}`);
                    }
                } catch (err) {
                    logger.error(`Error resetting tenant '${tenant.databaseName}':`, err);
                }
            }
        }

        logger.info('\n=== Database Reset Completed ===');
        process.exit(0);
    } catch (error) {
        logger.error('Fatal error during database reset:', error);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

export default main;
