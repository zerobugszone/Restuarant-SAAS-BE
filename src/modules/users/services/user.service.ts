import UserRepository from '../repositories/user.repository';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { rolesService } from '@/modules/roles/services/roles.service';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';

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

  /**
   * Create a superadmin user for a tenant
   * Assigns the superadmin role (system role with isSystem=true)
   */
  async createSuperAdminUser(tenantId: string, email: string, password: string) {
    const existingAdmin = await this.findByEmail(tenantId, email);
    if (existingAdmin) {
      throw new HttpException(
        httpStatus.CONFLICT,
        'Superadmin user already exists',
        errorCodes.VALIDATION_ERROR
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Get superadmin role - uses isSystem flag to identify seeded system role
    const superadminRole = await rolesService.getRoleByName(tenantId, 'Superadmin');
    if (!superadminRole) {
      throw new HttpException(
        httpStatus.NOT_FOUND,
        'Superadmin role not found - ensure tenant has been properly seeded',
        errorCodes.NOT_FOUND
      );
    }

    // Verify it's a system role
    if (!superadminRole.isSystem) {
      throw new HttpException(
        httpStatus.CONFLICT,
        'Superadmin role must be a system role (isSystem=true)',
        errorCodes.VALIDATION_ERROR
      );
    }

    // Create user and assign role via repository
    const newUser = await UserRepository.createSuperAdminUser(
      tenantId,
      email,
      passwordHash,
      superadminRole.id
    );

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return {
      ...userWithoutPassword,
      roleName: superadminRole.name,
      roleId: superadminRole.id,
      isSystemRole: superadminRole.isSystem,
    };
  }
}

export default new UserService();
