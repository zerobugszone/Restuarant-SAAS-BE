import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/menu.service';
import { sendResponse } from '@/core/utils/response.util';

export class CategoryController {
  constructor(private readonly service: MenuService = new MenuService()) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.service.listCategories(req.tenantId!);
      sendResponse(res, { success: true, data: categories });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.service.createCategory(req.tenantId!, req.body);
      sendResponse(res, { success: true, data: category }, 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this.service.updateCategory(req.tenantId!, req.params.id, req.body);
      sendResponse(res, { success: true, data: updated });
    } catch (error) {
      next(error);
    }
  };
}
