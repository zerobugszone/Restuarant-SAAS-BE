import { Request, Response, NextFunction } from 'express';
import { RestaurantService } from '../services/restaurant.service';
import { sendResponse } from '@/core/utils/response.util';

export class RestaurantController {
  constructor(private readonly service: RestaurantService = new RestaurantService()) {}

  getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await this.service.getSettings(req.tenantId!);
      sendResponse(res, { success: true, data: settings });
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await this.service.updateSettings(req.tenantId!, req.body);
      sendResponse(res, { success: true, data: settings });
    } catch (error) {
      next(error);
    }
  };
}
