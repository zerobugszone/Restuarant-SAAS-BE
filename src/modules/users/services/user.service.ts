import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcryptjs';

export const UserService = {
  async register(data: any) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    return UserRepository.create({ ...data, passwordHash });
  },
  async login(email: string, password: string) {
    const [user] = await UserRepository.findByEmail(email);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  },
  async update(id: string, data: any) {
    return UserRepository.update(id, data);
  },
  async delete(id: string) {
    return UserRepository.delete(id);
  },
};
