import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { usersSchema } from '@/core/database/schemas/tenant/users.schema';
import { User } from '../models/user.model';
import { eq } from 'drizzle-orm';

class UserRepository {
  async create(data: User) {
    const tenantDb = await tenantConnectionPool.getConnection(data.tenantId);
    return await tenantDb.insert(usersSchema).values(data).returning();
  }
}

export default new UserRepository();
