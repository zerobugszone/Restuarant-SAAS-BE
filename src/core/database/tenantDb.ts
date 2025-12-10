import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { logger } from '@/core/utils/logger.util';

/**
 * Get tenant database connection
 * 
 * This helper function retrieves the database connection for a specific tenant.
 * It automatically fetches the tenant configuration from the master database.
 * 
 * @param tenantId - The tenant ID
 * @returns Drizzle database instance for the tenant
 * 
 * @example
 * ```typescript
 * const db = await getTenantDb(req.tenantId);
 * const users = await db.select().from(usersSchema);
 * ```
 */
export async function getTenantDb(tenantId: string): Promise<NodePgDatabase> {
    if (!tenantId) {
        throw new Error('Tenant ID is required');
    }

    try {
        const db = await tenantConnectionPool.getConnection(tenantId);
        return db;
    } catch (error) {
        logger.error(`Failed to get tenant database for ${tenantId}:`, error);
        throw new Error(`Failed to connect to tenant database: ${error}`);
    }
}

/**
 * Execute a function with tenant database context
 * 
 * @param tenantId - The tenant ID
 * @param callback - Function to execute with the database connection
 * @returns Result of the callback function
 * 
 * @example
 * ```typescript
 * const users = await withTenantDb(req.tenantId, async (db) => {
 *   return await db.select().from(usersSchema);
 * });
 * ```
 */
export async function withTenantDb<T>(
    tenantId: string,
    callback: (db: NodePgDatabase) => Promise<T>
): Promise<T> {
    const db = await getTenantDb(tenantId);
    return await callback(db);
}
