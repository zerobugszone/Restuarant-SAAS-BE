import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '@/core/utils/response.util';

export class AuthController {
  constructor(private readonly service: AuthService = new AuthService()) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = await this.service.register(req.body);
      sendResponse(res, { success: true, data: payload }, 201);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = await this.service.login(req.body);
      sendResponse(res, { success: true, data: payload });
    } catch (error) {
      next(error);
    }
  };
}
