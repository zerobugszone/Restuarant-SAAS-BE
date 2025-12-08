import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { usersSchema } from '@/core/database/schemas/tenant/users.schema';
import { User } from '../models/user.model';
import { eq } from 'drizzle-orm';

class UserRepository {
  async create(data: User) {
    const tenantDb = await tenantConnectionPool.getConnection(data.tenantId);
    return await tenantDb.insert(usersSchema).values(data).returning();
  }
  async findByEmail(tenantId: string, email: string) {
    const tenantDb = await tenantConnectionPool.getConnection(tenantId);
    const result = await tenantDb
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.email, email))
      .limit(1);
    return result[0] || null;
  }

  async getUsers(tenantId: string) {
    const tenantDb = await tenantConnectionPool.getConnection(tenantId);
    return await tenantDb.select().from(usersSchema);
  }
}

export default new UserRepository();
