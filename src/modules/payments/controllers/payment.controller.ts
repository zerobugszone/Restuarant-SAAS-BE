import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { sendResponse } from '@/core/utils/response.util';

export class PaymentController {
  constructor(private readonly service: PaymentService = new PaymentService()) {}

  process = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await this.service.process(req.tenantId!, req.body);
      sendResponse(res, { success: true, data: payment }, 201);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await this.service.getById(req.tenantId!, req.params.id);
      sendResponse(res, { success: true, data: payment });
    } catch (error) {
      next(error);
    }
  };

  listByOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payments = await this.service.listByOrder(req.tenantId!, req.params.orderId);
      sendResponse(res, { success: true, data: payments });
    } catch (error) {
      next(error);
    }
  };
}
