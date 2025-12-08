import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';
import { masterDb } from '@/core/database/masterConnection';
import { tenants } from '@/core/database/schemas/master/tenants.schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/core/utils/logger.util';

/**
 * Tenant Resolver Middleware
 * 
 * Resolves tenant from:
 * 1. Subdomain (e.g., tenant1.example.com)
 * 2. x-tenant-id header
 * 3. JWT payload (from authenticated user)
 * 
 * Sets req.tenantId and req.tenant for downstream use
 */
export const tenantResolver = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    let tenantId: string | undefined;
    let subdomain: string | undefined;

    // Method 1: Extract from subdomain
    const host = req.headers.host || req.hostname;
    const hostParts = host.split('.');

    // If host has subdomain (e.g., tenant1.localhost or tenant1.example.com)
    if (hostParts.length > 2 || (hostParts.length === 2 && hostParts[0] !== 'localhost')) {
      subdomain = hostParts[0];
      logger.debug(`Tenant subdomain detected: ${subdomain}`);
    }

    // Method 2: Check x-tenant-id header
    const headerTenantId = req.headers['x-tenant-id'] as string;

    // Method 3: Check JWT payload (if user is authenticated)
    const jwtTenantId = req.user?.tenantId;

    // Priority: header > JWT > subdomain
    tenantId = headerTenantId || jwtTenantId;

    // If we have subdomain but no tenantId, lookup by subdomain
    if (!tenantId && subdomain) {
      const [tenant] = await masterDb
        .select()
        .from(tenants)
        .where(eq(tenants.subdomain, subdomain))
        .limit(1);

      if (tenant) {
        tenantId = tenant.tenantId;
        req.tenant = {
          id: tenant.id,
          tenantId: tenant.tenantId,
          name: tenant.name,
          subdomain: tenant.subdomain,
          databaseName: tenant.databaseName,
          databaseHost: tenant.databaseHost,
          databasePort: tenant.databasePort,
          status: tenant.status,
        };
        logger.debug(`Tenant resolved from subdomain: ${tenant.name} (${tenantId})`);
      } else {
        return next(
          new HttpException(
            httpStatus.NOT_FOUND,
            `Tenant not found for subdomain: ${subdomain}`,
            errorCodes.TENANT_NOT_FOUND
          )
        );
      }
    }

    // If we have tenantId but no tenant object, fetch it
    if (tenantId && !req.tenant) {
      const [tenant] = await masterDb
        .select()
        .from(tenants)
        .where(eq(tenants.tenantId, tenantId))
        .limit(1);

      if (tenant) {
        req.tenant = {
          id: tenant.id,
          tenantId: tenant.tenantId,
          name: tenant.name,
          subdomain: tenant.subdomain,
          databaseName: tenant.databaseName,
          databaseHost: tenant.databaseHost,
          databasePort: tenant.databasePort,
          status: tenant.status,
        };
        logger.debug(`Tenant resolved from ID: ${tenant.name} (${tenantId})`);
      } else {
        return next(
          new HttpException(
            httpStatus.NOT_FOUND,
            `Tenant not found for ID: ${tenantId}`,
            errorCodes.TENANT_NOT_FOUND
          )
        );
      }
    }

    // Final validation
    if (!tenantId) {
      return next(
        new HttpException(
          httpStatus.BAD_REQUEST,
          'Tenant identifier missing. Please provide subdomain, x-tenant-id header, or authenticate.',
          errorCodes.TENANT_NOT_FOUND
        )
      );
    }

    // Check tenant status
    if (req.tenant && req.tenant.status !== 'active') {
      return next(
        new HttpException(
          httpStatus.FORBIDDEN,
          `Tenant is ${req.tenant.status}. Access denied.`,
          errorCodes.TENANT_INACTIVE
        )
      );
    }

    req.tenantId = tenantId;
    next();
  } catch (error) {
    logger.error('Error in tenant resolver:', error);
    next(
      new HttpException(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Error resolving tenant',
        errorCodes.INTERNAL_SERVER_ERROR,
        { error }
      )
    );
  }
};

