import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer.service';
import { sendResponse } from '@/core/utils/response.util';

export class CustomerController {
  constructor(private readonly service: CustomerService = new CustomerService()) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customers = await this.service.list(req.tenantId!);
      sendResponse(res, { success: true, data: customers });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customer = await this.service.create(req.tenantId!, req.body);
      sendResponse(res, { success: true, data: customer }, 201);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customer = await this.service.findById(req.tenantId!, req.params.id);
      sendResponse(res, { success: true, data: customer });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customer = await this.service.update(req.tenantId!, req.params.id, req.body);
      sendResponse(res, { success: true, data: customer });
    } catch (error) {
      next(error);
    }
  };
}
