import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';
import { masterDb } from '@/core/database/masterConnection';
import { tenants } from '@/core/database/schemas/master/auth.schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/core/utils/logger.util';

/**
 * Tenant Resolver Middleware
 *
 * Resolves tenant from:
 * 1. JWT payload (req.user?.tenantId)
 * 2. x-tenant-id header
 * 3. Subdomain
 *
 * Sets req.tenantId and req.tenant for downstream use
 */
export const tenantResolver = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    let tenantId: string | undefined;

    // Method 1: JWT payload (highest priority)
    tenantId = req.user?.tenantId;

    // Method 2: x-tenant-id header
    if (!tenantId) {
      tenantId = req.headers['x-tenant-id'] as string;
    }

    // Method 3: Subdomain
    if (!tenantId) {
      const host = req.headers.host || req.hostname;
      const hostParts = host.split('.');
      const subdomain =
        hostParts.length > 2 || (hostParts.length === 2 && hostParts[0] !== 'localhost')
          ? hostParts[0]
          : undefined;

      if (subdomain) {
        const [tenant] = await masterDb
          .select()
          .from(tenants)
          .where(eq(tenants.subdomain, subdomain))
          .limit(1);

        if (tenant) {
          tenantId = tenant.tenantId;
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
    }

    if (!tenantId) {
      return next(
        new HttpException(
          httpStatus.BAD_REQUEST,
          'Tenant identifier missing. Please provide a valid tenant via JWT, header, or subdomain.',
          errorCodes.TENANT_NOT_FOUND
        )
      );
    }

    if (!req.tenant) {
      const [tenant] = await masterDb
        .select()
        .from(tenants)
        .where(eq(tenants.tenantId, tenantId))
        .limit(1);

      if (!tenant) {
        return next(
          new HttpException(
            httpStatus.NOT_FOUND,
            `Tenant not found for ID: ${tenantId}`,
            errorCodes.TENANT_NOT_FOUND
          )
        );
      }

      req.tenant = {
        id: tenant.id,
        tenantId: tenant.tenantId,
        name: tenant.name,
        subdomain: tenant.subdomain,
        databaseUrl: tenant.databaseUrl,
        status: tenant.status,
        settings: tenant.settings ?? undefined,
      };
    }

    if (req.tenant.status !== 'active') {
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
