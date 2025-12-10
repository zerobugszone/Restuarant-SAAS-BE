import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { users, userRoles } from '@/core/database/schemas/tenant/auth.schema';
import { User } from '../models/user.model';
import { eq } from 'drizzle-orm';

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
}

export default new UserRepository();
