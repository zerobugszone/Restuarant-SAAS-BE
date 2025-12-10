import { Request, Response, NextFunction } from 'express';
import { rolesService } from '../services/roles.service';
import { sendResponse } from '@/core/utils/response.util';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';

export class RolePermissionsController {
  async assignPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId, roleId } = req.params;
      const { permissionIds } = req.body;

      if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
        throw new HttpException(
          httpStatus.BAD_REQUEST,
          'permissionIds must be a non-empty array',
          'VALIDATION_ERROR'
        );
      }

      const result = await rolesService.assignPermissionsToRole(tenantId, roleId, permissionIds);

      sendResponse(
        res,
        {
          success: true,
          message: result.message,
          data: null,
        },
        httpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async getRolePermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId, roleId } = req.params;

      const role = await rolesService.getRoleById(tenantId, roleId);

      if (!role) {
        throw new HttpException(httpStatus.NOT_FOUND, 'Role not found', errorCodes.NOT_FOUND);
      }

      sendResponse(
        res,
        {
          success: true,
          message: 'Role permissions retrieved successfully',
          data: {
            roleId,
            roleName: role.name,
            permissions: role.permissions,
            permissionCount: role.permissions.length,
          },
        },
        httpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  }
}

export const rolePermissionsController = new RolePermissionsController();
