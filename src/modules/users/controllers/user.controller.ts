import { Request, Response, NextFunction } from 'express';
import userServices from '../services/user.service';
import { sendResponse } from '@/core/utils/response.util';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';

class UserController {
  public async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = {
        ...req.body,
        tenantId: req.tenantId!,
      };

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

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const tenantId = req.tenantId!;
      const subdomain = req.tenant?.subdomain;

      if (!email || !password) {
        throw new HttpException(
          httpStatus.BAD_REQUEST,
          'Email and password are required',
          errorCodes.VALIDATION_ERROR
        );
      }

      let result;

      // Use subdomain from tenant resolver for efficient login
      if (subdomain) {
        result = await userServices.loginUserBySubdomain(subdomain, email, password);
      } else {
        // Fallback: use tenantId from resolver
        result = await userServices.loginUser(tenantId, email, password);
      }

      sendResponse(res, { success: true, message: 'Login successful', data: result }, 200);
    } catch (error: any) {
      next(error);
    }
  }

  public async createSuperAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId, email, password } = req.body;

      if (!tenantId) {
        throw new HttpException(
          httpStatus.BAD_REQUEST,
          'Tenant ID is required',
          errorCodes.VALIDATION_ERROR
        );
      }

      if (!email || !password) {
        throw new HttpException(
          httpStatus.BAD_REQUEST,
          'Email and password are required',
          errorCodes.VALIDATION_ERROR
        );
      }

      const user = await userServices.createSuperAdminUser(tenantId, email, password);
      sendResponse(
        res,
        { success: true, message: 'Superadmin user created successfully', data: user },
        201
      );
    } catch (error: any) {
      next(error);
    }
  }

  public async findUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId!;
      console.log('ss', tenantId);
      const { email } = req.params;
      console.log('sdsadsad');
      console.log(email);

      const user = await userServices.findByEmail(tenantId, email);
      if (user) {
        sendResponse(res, { success: true, message: 'User found', data: user }, 200);
      } else {
        sendResponse(res, { success: false, message: 'User not found' }, 404);
      }
    } catch (error: any) {
      next(error);
    }
  }

  public async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.tenantId!;
      if (!tenantId) {
        throw new Error('Tenant ID is missing');
      }
      const users = await userServices.getUsers(tenantId);
      sendResponse(
        res,
        { success: true, message: 'Users retrieved successfully', data: users },
        200
      );
    } catch (error: any) {
      next(error);
    }
  }
}

export default new UserController();
