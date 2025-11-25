import { SuperAdminRepository } from '../repositories/superadmin.repository';
import { SuperAdmin } from '../models/superadmin.model';
import bcrypt from 'bcryptjs';

export const SuperAdminService = {
  async register(data: Omit<SuperAdmin, 'id' | 'createdAt' | 'updatedAt'>) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await SuperAdminRepository.create({ ...data, password: hashedPassword });
    return result[0];
  },
  async login(email: string, password: string) {
    const [admin] = await SuperAdminRepository.findByEmail(email);
    if (!admin) return null;
    const valid = await bcrypt.compare(password, admin.password);
    return valid ? admin : null;
  },
};
