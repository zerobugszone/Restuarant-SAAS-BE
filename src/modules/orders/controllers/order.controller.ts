import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { sendResponse } from '@/core/utils/response.util';

export class OrderController {
  constructor(private readonly service: OrderService = new OrderService()) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.service.create(req.tenantId!, req.body);
      sendResponse(res, { success: true, data: order }, 201);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await this.service.findAll(req.tenantId!);
      sendResponse(res, { success: true, data: orders });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.service.findById(req.tenantId!, req.params.id);
      sendResponse(res, { success: true, data: order });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.service.update(req.tenantId!, req.params.id, req.body);
      sendResponse(res, { success: true, data: order });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.service.updateStatus(req.tenantId!, req.params.id, req.body.status);
      sendResponse(res, { success: true, data: order });
    } catch (error) {
      next(error);
    }
  };
}
