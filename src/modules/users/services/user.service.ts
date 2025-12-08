import UserRepository from '../repositories/user.repository';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

class UserService {
  async registerUser(data: User) {
    return UserRepository.create(data);
  }

  async findByEmail(tenantId: string, email: string) {
    return UserRepository.findByEmail(tenantId, email);
  }
  async getUsers(tenantId: string) {
    return await UserRepository.getUsers(tenantId);
  }
}

export default new UserService();
