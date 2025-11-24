import { v4 as uuid } from 'uuid';
import { UserModel } from '../models/user.model';

const users: UserModel[] = [];

export class UserRepository {
  async findByEmail(email: string): Promise<UserModel | undefined> {
    return users.find(user => user.email === email);
  }

  async create(data: Pick<UserModel, 'email' | 'passwordHash' | 'role' | 'tenantId'>): Promise<UserModel> {
    const user: UserModel = {
      id: uuid(),
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role,
      tenantId: data.tenantId,
      isActive: true,
      createdAt: new Date()
    };

    users.push(user);
    return user;
  }
}

export const userRepository = new UserRepository();
