import { SuperAdminRepository } from '../repositories/superadmin.repository';
import { SuperAdmin } from '../models/superadmin.model';
import bcrypt from 'bcryptjs';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';
import AuthServices from '@/core/constants/authServices';

export const SuperAdminService = {
  async register(data: Omit<SuperAdmin, 'id' | 'createdAt' | 'updatedAt'>) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await SuperAdminRepository.create({ ...data, password: hashedPassword });
    return result[0];
  },

  async login(email: string, password: string) {
    const [admin] = await SuperAdminRepository.findByEmail(email);
    if (!admin) {
      throw new HttpException(
        httpStatus.UNAUTHORIZED,
        'Invalid credentials',
        errorCodes.AUTHENTICATION_FAILED
      );
    }
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      throw new HttpException(
        httpStatus.UNAUTHORIZED,
        'Invalid credentials',
        errorCodes.AUTHENTICATION_FAILED
      );
    }
    const token = await AuthServices.generateAuthToken(admin);
    return { admin, ...token };
  },

  async getAll(
    matchData: Record<string, any>,
    sortData: Record<string, 'asc' | 'desc'>,
    page: number,
    perPage: number
  ) {
    return await SuperAdminRepository.findAll(matchData, sortData, page, perPage);
  },

  async getById(id: string) {
    const [admin] = await SuperAdminRepository.findById(id);
    if (!admin) {
      throw new HttpException(httpStatus.NOT_FOUND, 'Admin not found', errorCodes.NOT_FOUND);
    }
    return admin;
  },

  async refreshAccessToken(refreshToken: string) {
    return AuthServices.refreshAccessToken(refreshToken);
  },

  async changePassword(adminId: string, currentPassword: string, newPassword: string) {
    const [admin] = await SuperAdminRepository.findById(adminId);
    if (!admin) {
      throw new HttpException(httpStatus.NOT_FOUND, 'Admin not found', errorCodes.NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      throw new HttpException(
        httpStatus.BAD_REQUEST,
        'Current password is incorrect',
        errorCodes.AUTHENTICATION_FAILED
      );
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    return await SuperAdminRepository.updatePassword(adminId, hashedNewPassword);
  },

  async deleteAccount(adminId: string) {
    return await SuperAdminRepository.deleteById(adminId);
  },
};
