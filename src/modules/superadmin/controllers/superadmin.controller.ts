import { NextFunction, Request, Response } from 'express';
import { SuperAdminService } from '../services/superadmin.service';
import { sendResponse } from '@/core/utils/response.util';
import { getMatchAndSortData } from '@/core/helper/pagination_helper';
import { UserPayload } from '@/core/middleware/authentication.middleware';

class SuperAdminController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await SuperAdminService.register(req.body);
      sendResponse(
        res,
        { success: true, message: 'User registration successful', data: admin },
        201
      );
    } catch (error: any) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const admin = await SuperAdminService.login(email, password);
      sendResponse(res, { success: true, message: 'User login sucessful', data: admin }, 200);
    } catch (error: any) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      const { page = 1, perPage = 10 } = req.query;
      const admins = await SuperAdminService.getAll(
        matchData,
        sortData,
        Number(page),
        Number(perPage)
      );
      sendResponse(res, { success: true, data: admins }, 200);
    } catch (error: any) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await SuperAdminService.getById(req.params.id);
      sendResponse(res, { success: true, data: admin }, 200);
    } catch (error: any) {
      next(error);
    }
  }

  async refreshAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const newAccessToken = await SuperAdminService.refreshAccessToken(refreshToken);
      sendResponse(res, { success: true, data: { accessToken: newAccessToken } }, 200);
    } catch (error: any) {
      next(error);
    }
  }
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = (req.user as UserPayload)?.id;
      console.log(adminId);

      const { currentPassword, newPassword } = req.body;
      const result = await SuperAdminService.changePassword(adminId, currentPassword, newPassword);
      sendResponse(
        res,
        { success: true, message: 'Password changed successfully', data: result },
        200
      );
    } catch (error: any) {
      next(error);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = (req.user as UserPayload)?.id;
      await SuperAdminService.deleteAccount(adminId);
      sendResponse(res, { success: true, message: 'Account deleted successfully' }, 200);
    } catch (error: any) {
      next(error);
    }
  }
}

export default new SuperAdminController();
