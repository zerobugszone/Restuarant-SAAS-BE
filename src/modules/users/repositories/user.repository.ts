import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { users, userRoles } from '@/core/database/schemas/tenant/auth.schema';
import { User } from '../models/user.model';
import { eq } from 'drizzle-orm';
import { masterDb } from '@/core/database/masterConnection';
import { tenants } from '@/core/database/schemas/master/auth.schema';

class UserRepository {
  async create(data: User) {
    const tenantDb = await tenantConnectionPool.getConnection(data.tenantId);
    return await tenantDb.insert(users).values(data).returning();
  }

  async findByEmail(tenantId: string, email: string) {
    const tenantDb = await tenantConnectionPool.getConnection(tenantId);
    const result = await tenantDb.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || null;
  }

  async getUsers(tenantId: string) {
    const tenantDb = await tenantConnectionPool.getConnection(tenantId);
    return await tenantDb.select().from(users);
  }

  /**
   * Create a superadmin user and assign superadmin role
   */
  async createSuperAdminUser(
    tenantId: string,
    email: string,
    passwordHash: string,
    superadminRoleId: string
  ) {
    const tenantDb = await tenantConnectionPool.getConnection(tenantId);

    // Create user
    const [newUser] = await tenantDb
      .insert(users)
      .values({
        tenantId,
        email,
        passwordHash,
        role: 'Superadmin',
        isActive: true,
      })
      .returning();

    // Assign superadmin role to user
    await tenantDb.insert(userRoles).values({
      userId: newUser.id,
      roleId: superadminRoleId,
    });

    return newUser;
  }

  /**
   * Find a user by email across all tenants
   * Returns user with tenantId and email matched
   */
  async findUserByEmailAcrossAllTenants(email: string) {
    try {
      // Get all active tenants from master database
      const allTenants = await masterDb.select().from(tenants).where(eq(tenants.status, 'active'));

      // Search for user in each tenant's database
      for (const tenant of allTenants) {
        const tenantDb = await tenantConnectionPool.getConnection(tenant.id);
        const result = await tenantDb.select().from(users).where(eq(users.email, email)).limit(1);

        if (result.length > 0) {
          return {
            ...result[0],
            tenantId: tenant.id,
          };
        }
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a user by email in a specific tenant by subdomain
   */
  async findUserByEmailAndSubdomain(email: string, subdomain: string) {
    try {
      // Get tenant by subdomain from master database
      const [tenant] = await masterDb
        .select()
        .from(tenants)
        .where(eq(tenants.subdomain, subdomain))
        .limit(1);

      if (!tenant) {
        return null;
      }

      // Get user from tenant's database
      const tenantDb = await tenantConnectionPool.getConnection(tenant.id);
      const result = await tenantDb.select().from(users).where(eq(users.email, email)).limit(1);

      if (result.length > 0) {
        return {
          ...result[0],
          tenantId: tenant.id,
        };
      }

      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserRepository();
