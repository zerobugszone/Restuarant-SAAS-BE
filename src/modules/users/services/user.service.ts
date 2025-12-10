import UserRepository from '../repositories/user.repository';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { rolesService } from '@/modules/roles/services/roles.service';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';
import { jwtService } from '@/modules/auth/services/jwt.service';

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
   * Login user with email and password
   */
  async loginUser(tenantId: string, email: string, password: string) {
    // Find user by email in tenant
    const user = await this.findByEmail(tenantId, email);
    if (!user) {
      throw new HttpException(
        httpStatus.UNAUTHORIZED,
        'Invalid email or password',
        errorCodes.AUTHENTICATION_FAILED
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new HttpException(
        httpStatus.UNAUTHORIZED,
        'Invalid email or password',
        errorCodes.AUTHENTICATION_FAILED
      );
    }

    // Check if user is active
    if (!user.isActive) {
      throw new HttpException(
        httpStatus.FORBIDDEN,
        'User account is inactive',
        errorCodes.AUTHORIZATION_FAILED
      );
    }

    // Generate JWT token
    const token = jwtService.sign({
      sub: user.id,
      role: user.role,
      tenantId: user.tenantId,
    });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
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

  /**
   * Login user without requiring tenantId
   * Searches across all tenants to find user by email
   */
  async loginUserByEmail(email: string, password: string) {
    // Find user across all tenants
    const userWithTenant = await UserRepository.findUserByEmailAcrossAllTenants(email);
    if (!userWithTenant) {
      throw new HttpException(
        httpStatus.UNAUTHORIZED,
        'Invalid email or password',
        errorCodes.AUTHENTICATION_FAILED
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userWithTenant.passwordHash);
    if (!isPasswordValid) {
      throw new HttpException(
        httpStatus.UNAUTHORIZED,
        'Invalid email or password',
        errorCodes.AUTHENTICATION_FAILED
      );
    }

    // Check if user is active
    if (!userWithTenant.isActive) {
      throw new HttpException(
        httpStatus.FORBIDDEN,
        'User account is inactive',
        errorCodes.AUTHORIZATION_FAILED
      );
    }

    // Generate JWT token
    const token = jwtService.sign({
      sub: userWithTenant.id,
      role: userWithTenant.role,
      tenantId: userWithTenant.tenantId,
    });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = userWithTenant;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Login user using subdomain and email/password
   * More efficient than searching all tenants
   */
  async loginUserBySubdomain(subdomain: string, email: string, password: string) {
    // Find user in specific tenant by subdomain
    const userWithTenant = await UserRepository.findUserByEmailAndSubdomain(email, subdomain);
    if (!userWithTenant) {
      throw new HttpException(
        httpStatus.UNAUTHORIZED,
        'Invalid email or password',
        errorCodes.AUTHENTICATION_FAILED
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userWithTenant.passwordHash);
    if (!isPasswordValid) {
      throw new HttpException(
        httpStatus.UNAUTHORIZED,
        'Invalid email or password',
        errorCodes.AUTHENTICATION_FAILED
      );
    }

    // Check if user is active
    if (!userWithTenant.isActive) {
      throw new HttpException(
        httpStatus.FORBIDDEN,
        'User account is inactive',
        errorCodes.AUTHORIZATION_FAILED
      );
    }

    // Generate JWT token
    const token = jwtService.sign({
      sub: userWithTenant.id,
      role: userWithTenant.role,
      tenantId: userWithTenant.tenantId,
    });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = userWithTenant;
    return {
      user: userWithoutPassword,
      token,
    };
  }
}

export default new UserService();
