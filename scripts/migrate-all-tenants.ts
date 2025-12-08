#!/usr/bin/env ts-node
/**
 * All Tenants Migration Script
 * 
 * This script migrates all tenant databases by fetching tenant information
 * from the master database and running migrations for each.
 * 
 * Usage:
 *   npm run migrate:all-tenants
 *   or
 *   ts-node scripts/migrate-all-tenants.ts
 * 
 * Options:
 *   --parallel    Run migrations in parallel (faster but less safe)
 *   --continue    Continue on error instead of stopping
 */

import 'dotenv/config';
import { migrationManager } from '../src/core/database/migrationManager';
import { logger } from '../src/core/utils/logger.util';
import { masterDb } from '../src/core/database/masterConnection';
import { tenants } from '../src/core/database/schemas/master/tenants.schema';

interface TenantInfo {
    tenantId: string;
    databaseName: string;
    databaseHost?: string;
    databasePort?: number;
    databaseUser?: string;
    databasePassword?: string;
}

async function getAllTenants(): Promise<TenantInfo[]> {
    try {
        logger.info('Fetching all tenants from master database...');
        const result = await masterDb.select().from(tenants);

        const tenantList: TenantInfo[] = result.map((tenant) => ({
            tenantId: tenant.tenantId,
            databaseName: tenant.databaseName,
            databaseHost: tenant.databaseHost || undefined,
            databasePort: tenant.databasePort || undefined,
            // Note: You might want to store database credentials differently
            // For now, we'll use the master DB credentials
        }));

        logger.info(`Found ${tenantList.length} tenant(s)`);
        return tenantList;
    } catch (error) {
        logger.error('Error fetching tenants from master database:', error);
        throw error;
    }
}

async function main() {
    const args = process.argv.slice(2);
    const parallel = args.includes('--parallel');
    const continueOnError = args.includes('--continue');

    try {
        logger.info('=== Starting All Tenants Migration ===\n');
        logger.info(`Mode: ${parallel ? 'Parallel' : 'Sequential'}`);
        logger.info(`Continue on error: ${continueOnError ? 'Yes' : 'No'}\n`);

        // Ensure master database is migrated first
        logger.info('Step 1: Ensuring master database is up to date...');
        const masterResult = await migrationManager.migrateMaster();

        if (!masterResult.success) {
            logger.error('Master database migration failed. Cannot proceed with tenant migrations.');
            logger.error(`Error: ${masterResult.error}`);
            process.exit(1);
        }

        logger.info('✓ Master database is up to date\n');

        // Get all tenants
        logger.info('Step 2: Fetching tenant list...');
        const tenantList = await getAllTenants();

        if (tenantList.length === 0) {
            logger.info('No tenants found. Nothing to migrate.');
            process.exit(0);
        }

        // Migrate all tenants
        logger.info(`\nStep 3: Migrating ${tenantList.length} tenant database(s)...\n`);

        let results;
        if (parallel) {
            // Parallel migration (faster but more resource-intensive)
            logger.warn('Running migrations in parallel mode...');
            const promises = tenantList.map((tenant) =>
                migrationManager.migrateTenant(
                    tenant.tenantId,
                    tenant.databaseName,
                    {
                        host: tenant.databaseHost,
                        port: tenant.databasePort,
                        user: tenant.databaseUser,
                        password: tenant.databasePassword,
                    }
                )
            );
            results = await Promise.all(promises);
        } else {
            // Sequential migration (safer, better logging)
            results = await migrationManager.migrateAllTenants(tenantList);
        }

        // Print summary
        const successful = results.filter((r) => r.success).length;
        const failed = results.filter((r) => !r.success).length;

        logger.info('\n=== Migration Summary ===');
        logger.info(`Total tenants: ${results.length}`);
        logger.info(`Successful: ${successful}`);
        logger.info(`Failed: ${failed}`);

        if (failed > 0) {
            logger.info('\nFailed migrations:');
            results
                .filter((r) => !r.success)
                .forEach((r) => {
                    logger.error(`  - ${r.database}: ${r.error}`);
                });
        }

        // Exit with appropriate code
        if (failed > 0 && !continueOnError) {
            logger.error('\n✗ Some tenant migrations failed!');
            process.exit(1);
        } else {
            logger.info('\n✓ All tenant migrations completed!');
            process.exit(0);
        }
    } catch (error) {
        logger.error('Fatal error during tenant migrations:', error);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

export default main;
