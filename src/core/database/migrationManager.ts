import { Client, Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as path from 'path';
import * as fs from 'fs';
import { logger } from '@/core/utils/logger.util';
import { masterDbConfig } from '@/core/config/database.config';

export interface DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

export interface MigrationResult {
    success: boolean;
    database: string;
    migrationsApplied: number;
    error?: string;
    duration?: number;
}

export class MigrationManager {
    private static instance: MigrationManager;

    private constructor() { }

    public static getInstance(): MigrationManager {
        if (!MigrationManager.instance) {
            MigrationManager.instance = new MigrationManager();
        }
        return MigrationManager.instance;
    }

    /**
     * Check if a database exists
     */
    async databaseExists(dbName: string, config?: Partial<DatabaseConfig>): Promise<boolean> {
        const client = new Client({
            host: config?.host ?? masterDbConfig.host,
            port: config?.port ?? masterDbConfig.port,
            user: config?.user ?? masterDbConfig.user,
            password: config?.password ?? masterDbConfig.password,
            database: 'postgres',
        });

        try {
            await client.connect();
            const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
            return res.rowCount !== null && res.rowCount > 0;
        } catch (err) {
            logger.error(`Error checking if database '${dbName}' exists:`, err);
            throw err;
        } finally {
            await client.end();
        }
    }

    /**
     * Create a database if it doesn't exist
     */
    async createDatabase(
        dbName: string,
        config?: Partial<DatabaseConfig>,
        sanitize: boolean = true
    ): Promise<void> {
        const sanitizedName = sanitize ? dbName.replace(/[^a-zA-Z0-9_-]/g, '_') : dbName;

        logger.info(`Creating database '${sanitizedName}'...`);

        const client = new Client({
            host: config?.host ?? masterDbConfig.host,
            port: config?.port ?? masterDbConfig.port,
            user: config?.user ?? masterDbConfig.user,
            password: config?.password ?? masterDbConfig.password,
            database: 'postgres',
        });

        try {
            await client.connect();

            // Check if database already exists
            const exists = await this.databaseExists(sanitizedName, config);
            if (exists) {
                logger.info(`Database '${sanitizedName}' already exists. Skipping creation.`);
                return;
            }

            // Create database
            await client.query(`CREATE DATABASE "${sanitizedName}"`);
            logger.info(`✓ Database '${sanitizedName}' created successfully.`);
        } catch (err) {
            logger.error(`Error creating database '${sanitizedName}':`, err);
            throw err;
        } finally {
            await client.end();
        }
    }

    /**
     * Drop a database (use with caution!)
     */
    async dropDatabase(
        dbName: string,
        config?: Partial<DatabaseConfig>,
        force: boolean = false
    ): Promise<void> {
        if (!force) {
            throw new Error(
                'Database drop operation requires force=true to prevent accidental deletion'
            );
        }

        logger.warn(`Dropping database '${dbName}'...`);

        const client = new Client({
            host: config?.host ?? masterDbConfig.host,
            port: config?.port ?? masterDbConfig.port,
            user: config?.user ?? masterDbConfig.user,
            password: config?.password ?? masterDbConfig.password,
            database: 'postgres',
        });

        try {
            await client.connect();

            // Terminate existing connections
            await client.query(`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = $1
        AND pid <> pg_backend_pid()
      `, [dbName]);

            // Drop database
            await client.query(`DROP DATABASE IF EXISTS "${dbName}"`);
            logger.info(`✓ Database '${dbName}' dropped successfully.`);
        } catch (err) {
            logger.error(`Error dropping database '${dbName}':`, err);
            throw err;
        } finally {
            await client.end();
        }
    }

    /**
     * Run migrations for a specific database
     */
    async runMigrations(
        dbName: string,
        migrationsFolder: string,
        config?: Partial<DatabaseConfig>
    ): Promise<MigrationResult> {
        const startTime = Date.now();
        logger.info(`Running migrations for database '${dbName}'...`);

        const pool = new Pool({
            host: config?.host ?? masterDbConfig.host,
            port: config?.port ?? masterDbConfig.port,
            user: config?.user ?? masterDbConfig.user,
            password: config?.password ?? masterDbConfig.password,
            database: dbName,
        });

        try {
            // Validate migrations folder exists
            const absoluteMigrationsPath = path.isAbsolute(migrationsFolder)
                ? migrationsFolder
                : path.join(process.cwd(), migrationsFolder);

            if (!fs.existsSync(absoluteMigrationsPath)) {
                logger.warn(`Migrations folder '${absoluteMigrationsPath}' does not exist.`);
                return {
                    success: false,
                    database: dbName,
                    migrationsApplied: 0,
                    error: 'Migrations folder not found',
                };
            }

            // Check if _journal.json exists
            const journalPath = path.join(absoluteMigrationsPath, 'meta', '_journal.json');
            if (!fs.existsSync(journalPath)) {
                logger.warn(`No migrations journal found in '${absoluteMigrationsPath}'.`);
                return {
                    success: true,
                    database: dbName,
                    migrationsApplied: 0,
                };
            }

            // Run migrations
            const db = drizzle(pool);
            await migrate(db, { migrationsFolder: absoluteMigrationsPath });

            const duration = Date.now() - startTime;
            logger.info(`✓ Migrations completed for '${dbName}' in ${duration}ms`);

            return {
                success: true,
                database: dbName,
                migrationsApplied: 0, // Drizzle doesn't return count
                duration,
            };
        } catch (err) {
            const duration = Date.now() - startTime;
            logger.error(`Error running migrations for '${dbName}':`, err);
            return {
                success: false,
                database: dbName,
                migrationsApplied: 0,
                error: err instanceof Error ? err.message : String(err),
                duration,
            };
        } finally {
            await pool.end();
        }
    }

    /**
     * Ensure database exists and run migrations
     */
    async ensureDatabaseAndMigrate(
        dbName: string,
        migrationsFolder: string,
        config?: Partial<DatabaseConfig>,
        sanitize: boolean = true
    ): Promise<MigrationResult> {
        try {
            // Create database if it doesn't exist
            await this.createDatabase(dbName, config, sanitize);

            // Run migrations
            const sanitizedName = sanitize ? dbName.replace(/[^a-zA-Z0-9_-]/g, '_') : dbName;
            return await this.runMigrations(sanitizedName, migrationsFolder, config);
        } catch (err) {
            logger.error(`Error ensuring database and running migrations for '${dbName}':`, err);
            return {
                success: false,
                database: dbName,
                migrationsApplied: 0,
                error: err instanceof Error ? err.message : String(err),
            };
        }
    }

    /**
     * Run migrations for master database
     */
    async migrateMaster(): Promise<MigrationResult> {
        logger.info('=== Starting Master Database Migration ===');

        const masterMigrationsPath = path.join(
            process.cwd(),
            'src/core/database/migrations/master'
        );

        return await this.ensureDatabaseAndMigrate(
            masterDbConfig.database,
            masterMigrationsPath,
            {
                host: masterDbConfig.host,
                port: masterDbConfig.port,
                user: masterDbConfig.user,
                password: masterDbConfig.password,
                database: masterDbConfig.database,
            },
            false
        );
    }

    /**
     * Run migrations for a single tenant database
     */
    async migrateTenant(
        tenantId: string,
        dbName?: string,
        config?: Partial<DatabaseConfig>
    ): Promise<MigrationResult> {
        const databaseName = dbName || `tenant_${tenantId}`;
        logger.info(`=== Starting Tenant Database Migration: ${databaseName} ===`);

        const tenantMigrationsPath = path.join(
            process.cwd(),
            'src/core/database/migrations/tenant'
        );

        return await this.ensureDatabaseAndMigrate(databaseName, tenantMigrationsPath, config);
    }

    /**
     * Run migrations for all tenants
     */
    async migrateAllTenants(
        tenants: Array<{
            tenantId: string;
            databaseName: string;
            databaseHost?: string;
            databasePort?: number;
            databaseUser?: string;
            databasePassword?: string;
        }>
    ): Promise<MigrationResult[]> {
        logger.info(`=== Starting Migration for ${tenants.length} Tenants ===`);

        const results: MigrationResult[] = [];

        for (const tenant of tenants) {
            try {
                const config: Partial<DatabaseConfig> = {
                    host: tenant.databaseHost ?? masterDbConfig.host,
                    port: tenant.databasePort ?? masterDbConfig.port,
                    user: tenant.databaseUser ?? masterDbConfig.user,
                    password: tenant.databasePassword ?? masterDbConfig.password,
                };

                const result = await this.migrateTenant(tenant.tenantId, tenant.databaseName, config);
                results.push(result);

                if (result.success) {
                    logger.info(`✓ Tenant '${tenant.databaseName}' migrated successfully`);
                } else {
                    logger.error(`✗ Tenant '${tenant.databaseName}' migration failed: ${result.error}`);
                }
            } catch (err) {
                logger.error(`Error migrating tenant '${tenant.databaseName}':`, err);
                results.push({
                    success: false,
                    database: tenant.databaseName,
                    migrationsApplied: 0,
                    error: err instanceof Error ? err.message : String(err),
                });
            }
        }

        // Summary
        const successful = results.filter((r) => r.success).length;
        const failed = results.filter((r) => !r.success).length;

        logger.info(`\n=== Migration Summary ===`);
        logger.info(`Total: ${results.length}`);
        logger.info(`Successful: ${successful}`);
        logger.info(`Failed: ${failed}`);

        return results;
    }
}

// Export singleton instance
export const migrationManager = MigrationManager.getInstance();
