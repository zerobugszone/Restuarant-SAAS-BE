import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';
import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import {
  users,
  userRoles,
  roles,
  rolePermissions,
  permissions,
} from '@/core/database/schemas/tenant/auth.schema';
import { eq, and, inArray } from 'drizzle-orm';

/**
 * Authorize by roles - checks if user has one of the specified roles
 */
export const authorizeByRole =
  (requiredRoles: string[]) => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !requiredRoles.includes(req.user.role)) {
      return next(
        new HttpException(
          httpStatus.FORBIDDEN,
          'Access denied. Required role not found.',
          errorCodes.AUTHORIZATION_FAILED
        )
      );
    }
    next();
  };

/**
 * Authorize by permissions - checks if user has required resource:action permission
 */
export const authorizeByPermission =
  (resource: string, action: string) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(
          new HttpException(
            httpStatus.UNAUTHORIZED,
            'User not authenticated',
            errorCodes.AUTHENTICATION_FAILED
          )
        );
      }

      const tenantId = req.tenantId || req.user?.tenantId;
      if (!tenantId) {
        return next(
          new HttpException(
            httpStatus.UNAUTHORIZED,
            'Tenant ID not found',
            errorCodes.AUTHENTICATION_FAILED
          )
        );
      }

      const userId = req.user.id;

      const db = await tenantConnectionPool.getConnection(tenantId);

      // Get user's roles
      const userRoleRecords = await db
        .select({ roleId: userRoles.roleId })
        .from(userRoles)
        .where(eq(userRoles.userId, userId));

      if (userRoleRecords.length === 0) {
        return next(
          new HttpException(
            httpStatus.FORBIDDEN,
            'User has no assigned roles',
            errorCodes.AUTHORIZATION_FAILED
          )
        );
      }

      const roleIds = userRoleRecords.map(r => r.roleId);

      // Check if any of the user's roles has the required permission
      const permissionRecords = await db
        .select({ resource: permissions.resource, action: permissions.action })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(inArray(rolePermissions.roleId, roleIds));

      // Check if the required permission exists
      const hasPermission = permissionRecords.some(
        p => p.resource === resource && p.action === action
      );

      if (!hasPermission) {
        return next(
          new HttpException(
            httpStatus.FORBIDDEN,
            `Permission denied: ${resource}:${action}`,
            errorCodes.AUTHORIZATION_FAILED
          )
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };

/**
 * Legacy authorize function - backward compatible with existing code
 */
export const authorize =
  (roles: string[]) => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new HttpException(httpStatus.FORBIDDEN, 'Forbidden', errorCodes.AUTHORIZATION_FAILED)
      );
    }
    next();
  };
