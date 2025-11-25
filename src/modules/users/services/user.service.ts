import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcryptjs';

export const UserService = {
  register: async (tenantId: string, data: any) => {
    const passwordHash = await bcrypt.hash(data.password, 10);
    return UserRepository.create(tenantId, { ...data, passwordHash });
  },
  login: async (tenantId: string, email: string, password: string) => {
    const [user] = await UserRepository.findByEmail(tenantId, email);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  },
  update: async (tenantId: string, id: string, data: any) => {
    return UserRepository.update(tenantId, id, data);
  },
  delete: async (tenantId: string, id: string) => {
    return UserRepository.delete(tenantId, id);
  },
};
