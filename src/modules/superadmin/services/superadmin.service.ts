import { SuperAdminRepository } from '../repositories/superadmin.repository';
import { SuperAdmin } from '../models/superadmin.model';
import bcrypt from 'bcryptjs';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';

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
    return valid ? admin : null;
  },

  async getAll(
    matchData: Record<string, any>,
    sortData: Record<string, 'asc' | 'desc'>,
    page: number,
    perPage: number
    
  ) {
    return await SuperAdminRepository.findAll(matchData, sortData, page, perPage);
  },
};
