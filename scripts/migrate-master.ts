#!/usr/bin/env ts-node
/**
 * Master Database Migration Script
 * 
 * This script ensures the master database exists and runs all pending migrations.
 * 
 * Usage:
 *   npm run migrate:master
 *   or
 *   ts-node scripts/migrate-master.ts
 */

import 'dotenv/config';
import { migrationManager } from '../src/core/database/migrationManager';
import { logger } from '../src/core/utils/logger.util';

async function main() {
    try {
        logger.info('Starting master database migration...\n');

        const result = await migrationManager.migrateMaster();

        if (result.success) {
            logger.info('\n✓ Master database migration completed successfully!');
            logger.info(`  Database: ${result.database}`);
            logger.info(`  Duration: ${result.duration}ms`);
            process.exit(0);
        } else {
            logger.error('\n✗ Master database migration failed!');
            logger.error(`  Error: ${result.error}`);
            process.exit(1);
        }
    } catch (error) {
        logger.error('Fatal error during master migration:', error);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

export default main;
