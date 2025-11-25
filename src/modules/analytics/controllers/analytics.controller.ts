import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { sendResponse } from '@/core/utils/response.util';

export class AnalyticsController {
  constructor(private readonly service: AnalyticsService = new AnalyticsService()) {}

  salesReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const report = await this.service.salesReport(req.tenantId!, req.query.period as string);
      sendResponse(res, { success: true, data: report });
    } catch (error) {
      next(error);
    }
  };

  popularItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.service.popularItems(req.tenantId!);
      sendResponse(res, { success: true, data: items });
    } catch (error) {
      next(error);
    }
  };

  staffPerformance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const report = await this.service.staffPerformance(req.tenantId!);
      sendResponse(res, { success: true, data: report });
    } catch (error) {
      next(error);
    }
  };

  customerInsights = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const insights = await this.service.customerInsights(req.tenantId!);
      sendResponse(res, { success: true, data: insights });
    } catch (error) {
      next(error);
    }
  };
}
