import { Request, Response, NextFunction } from 'express';
import teantService from '../services/tenant.service';
import { sendResponse } from '@/core/utils/response.util';
import { getMatchAndSortData } from '@/core/helper/pagination_helper';

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
      const { matchData, sortData } = await getMatchAndSortData(req);
      const { page = 1, perPage = 10 } = req.query;
      const tenants = await teantService.getAllTenants(
        matchData,
        sortData,
        Number(page),
        Number(perPage)
      );
      sendResponse(
        res,
        { success: true, message: 'Tenant fetched successfully', data: tenants },
        200
      );
    } catch (error: any) {
      next(error);
    }
  }
}

export default new TenantController();
