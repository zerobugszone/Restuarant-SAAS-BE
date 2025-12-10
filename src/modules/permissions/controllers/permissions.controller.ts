import { Request, Response, NextFunction } from 'express';
import { permissionsService } from '../services/permissions.service';
import { sendResponse } from '@/core/utils/response.util';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';

export class PermissionsController {
  async createPermission(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId } = req.params;
      const { name, description, resource, action } = req.body;

      if (!resource || !action) {
        throw new HttpException(
          httpStatus.BAD_REQUEST,
          'resource and action are required',
          'VALIDATION_ERROR'
        );
      }

      const permission = await permissionsService.createPermission(tenantId, {
        name,
        description,
        resource,
        action,
      });

      sendResponse(
        res,
        {
          success: true,
          message: 'Permission created successfully',
          data: permission,
        },
        httpStatus.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  async getPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId } = req.params;
      const page = Number(req.query.page) || 1;
      const perPage = Number(req.query.limit) || 10;
      const resource = req.query.resource as string | undefined;
      const search = req.query.search as string | undefined;

      const result = await permissionsService.getPermissions(
        tenantId,
        page,
        perPage,
        resource,
        search
      );

      sendResponse(
        res,
        {
          success: true,
          message: 'Permissions retrieved successfully',
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

  async getPermissionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId, permissionId } = req.params;

      const permission = await permissionsService.getPermissionById(tenantId, permissionId);

      sendResponse(
        res,
        {
          success: true,
          message: 'Permission retrieved successfully',
          data: permission,
        },
        httpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async updatePermission(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId, permissionId } = req.params;
      const { name, description, isActive } = req.body;

      const permission = await permissionsService.updatePermission(tenantId, permissionId, {
        name,
        description,
        isActive,
      });

      sendResponse(
        res,
        {
          success: true,
          message: 'Permission updated successfully',
          data: permission,
        },
        httpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  }

  async deletePermission(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId, permissionId } = req.params;

      const result = await permissionsService.deletePermission(tenantId, permissionId);

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

  async getPermissionsByResource(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId, resource } = req.params;

      const permissions = await permissionsService.getPermissionsByResource(tenantId, resource);

      sendResponse(
        res,
        {
          success: true,
          message: 'Permissions retrieved successfully',
          data: {
            resource,
            permissions,
          },
        },
        httpStatus.OK
      );
    } catch (error) {
      next(error);
    }
  }
}

export const permissionsController = new PermissionsController();
