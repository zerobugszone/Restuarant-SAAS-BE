import { Request, Response, NextFunction } from 'express';
import userServices from '../services/user.service';
import { sendResponse } from '@/core/utils/response.util';
import { getMatchAndSortData } from '@/core/helper/pagination_helper';
import { OTPService } from '../services/otp.service';

class UserController {
  public async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = {
        ...req.body,
        tenantId: req.tenantId!,
      };

      console.log(req.tenantId);

      const user = await userServices.registerUser(userData);
      sendResponse(
        res,
        { success: true, message: 'User registration successful', data: user },
        201
      );
    } catch (error: any) {
      next(error);
    }
  }
}

export default new UserController();
