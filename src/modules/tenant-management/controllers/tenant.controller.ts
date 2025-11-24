import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../services/tenant.service';
import { sendResponse } from '@/core/utils/response.util';

export class TenantController {
  constructor(private readonly service: TenantService = new TenantService()) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant = await this.service.create(req.body);
      sendResponse(res, { success: true, data: tenant }, 201);
    } catch (error) {
      next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const tenants = await this.service.findAll();
      sendResponse(res, { success: true, data: tenants });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenant = await this.service.update(req.params.id, req.body);
      sendResponse(res, { success: true, data: tenant });
    } catch (error) {
      next(error);
    }
  };
}
