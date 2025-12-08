import UserRepository from '../repositories/user.repository';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

class UserService {
  async registerUser(data: User) {
    return UserRepository.create(data);
  }
}

export default new UserService();
