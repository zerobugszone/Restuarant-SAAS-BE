import { usersSchema } from '@/core/database/schemas/tenant/users.schema';
import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { eq } from 'drizzle-orm';
export const UserRepository = {
  async findByEmail(tenantId: string, email: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.select().from(usersSchema).where(eq(usersSchema.email, email)).limit(1);
  },
  async create(tenantId: string, data: any) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.insert(usersSchema).values(data).returning();
  },
  async findById(tenantId: string, id: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.select().from(usersSchema).where(eq(usersSchema.id, id)).limit(1);
  },
  async update(tenantId: string, id: string, data: any) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.update(usersSchema).set(data).where(eq(usersSchema.id, id)).returning();
  },
  async delete(tenantId: string, id: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.delete(usersSchema).where(eq(usersSchema.id, id)).returning();
  },
};
