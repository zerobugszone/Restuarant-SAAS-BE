import { NextFunction, Request, Response } from 'express';
import { SuperAdminService } from '../services/superadmin.service';
import { sendResponse } from '@/core/utils/response.util';
import { getMatchAndSortData } from '@/core/helper/pagination_helper';

export const registerSuperAdmin = async (req: Request, res: Response) => {
  const admin = await SuperAdminService.register(req.body);
  res.status(201).json(admin);
};

export const loginSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const admin = await SuperAdminService.login(email, password);
    sendResponse(res, { success: true, message: 'User login sucessful', data: admin }, 200);
  } catch (error: any) {
    next(error);
  }
};

export const getAllSuperAdmins = async (req: Request, res: Response, next: NextFunction) => {
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
};
