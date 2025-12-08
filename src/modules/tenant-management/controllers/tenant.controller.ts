import { Request, Response, NextFunction } from 'express';
import teantService from '../services/tenant.service';
import { sendResponse } from '@/core/utils/response.util';

class TenantController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const tenant = await teantService.create(req.body);
      sendResponse(
        res,
        { success: true, message: 'Tenant created successfully', data: tenant },
        201
      );
    } catch (error: any) {
      next(error);
    }
  }

  async getAllTenants(req: Request, res: Response, next: NextFunction) {
    try {
      const tenants = await teantService.getAllTenants();
      sendResponse(res, { success: true, data: tenants }, 200);
    } catch (error: any) {
      next(error);
    }
  }
}

export default new TenantController();
