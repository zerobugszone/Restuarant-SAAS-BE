import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/menu.service';
import { sendResponse } from '@/core/utils/response.util';

export class MenuController {
  constructor(private readonly service: MenuService = new MenuService()) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.service.listMenuItems(req.tenantId!);
      sendResponse(res, { success: true, data: items });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.createMenuItem(req.tenantId!, req.body);
      sendResponse(res, { success: true, data: item }, 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.updateMenuItem(req.tenantId!, req.params.id, req.body);
      sendResponse(res, { success: true, data: item });
    } catch (error) {
      next(error);
    }
  };
}
