import { Request, Response, NextFunction } from 'express';
import { QrService } from '../services/qr.service';
import { sendResponse } from '@/core/utils/response.util';

export class QrController {
  constructor(private readonly service: QrService = new QrService()) {}

  generateForTable = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const qr = await this.service.generateForTable(req.tenantId!, req.body.tableId);
      sendResponse(res, { success: true, data: qr }, 201);
    } catch (error) {
      next(error);
    }
  };

  generateForMenu = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const qr = await this.service.generateForMenu(req.tenantId!, req.body.menuSectionId);
      sendResponse(res, { success: true, data: qr }, 201);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const qr = await this.service.getById(req.tenantId!, req.params.id);
      sendResponse(res, { success: true, data: qr });
    } catch (error) {
      next(error);
    }
  };
}
