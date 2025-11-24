import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from '../services/subscription.service';
import { sendResponse } from '@/core/utils/response.util';

export class SubscriptionController {
  constructor(private readonly service: SubscriptionService = new SubscriptionService()) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscription = await this.service.create(req.body);
      sendResponse(res, { success: true, data: subscription }, 201);
    } catch (error) {
      next(error);
    }
  };

  listByTenant = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscriptions = await this.service.findByTenant(req.params.tenantId);
      sendResponse(res, { success: true, data: subscriptions });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscription = await this.service.update(req.params.id, req.body);
      sendResponse(res, { success: true, data: subscription });
    } catch (error) {
      next(error);
    }
  };
}
