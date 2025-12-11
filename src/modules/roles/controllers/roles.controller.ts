import { Request, Response, NextFunction } from 'express';
import { rolesService } from '../services/roles.service';
import { sendResponse } from '@/core/utils/response.util';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';

export class RolesController {
  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId } = req.params;
      const { name, description } = req.body;

      const role = await rolesService.createRole(tenantId, { name, description });

      sendResponse(
        res,
        {
          success: true,
          message: 'Role created successfully',
          data: role,
        },
        httpStatus.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId } = req.params;
      const page = Number(req.query.page) || 1;
      const perPage = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;

      const result = await rolesService.getRoles(tenantId, page, perPage, search);

      sendResponse(
        res,
        {
          success: true,
          message: 'Roles retrieved successfully',
          data: {
            pagination: {
              totalRecords: result.totalRecords,
              totalPages: result.totalPages,
              currentPage: result.currentPage,
              perPage: result.perPage,
              hasNext: result.hasNext,
              hasPrevious: result.hasPrevious,
            },
            records: result.records,
          },
        },
        httpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async getRoleById(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId, roleId } = req.params;

      const role = await rolesService.getRoleById(tenantId, roleId);

      sendResponse(
        res,
        {
          success: true,
          message: 'Role retrieved successfully',
          data: role,
        },
        httpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId, roleId } = req.params;
      const { name, description, isActive } = req.body;

      const role = await rolesService.updateRole(tenantId, roleId, {
        name,
        description,
        isActive,
      });

      sendResponse(
        res,
        {
          success: true,
          message: 'Role updated successfully',
          data: role,
        },
        httpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId, roleId } = req.params;

      const result = await rolesService.deleteRole(tenantId, roleId);

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

  async assignPermissionsToRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId, roleId } = req.params;
      const { permissionIds } = req.body;

      if (!Array.isArray(permissionIds)) {
        throw new HttpException(
          httpStatus.BAD_REQUEST,
          'permissionIds must be an array',
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
}

export const rolesController = new RolesController();
