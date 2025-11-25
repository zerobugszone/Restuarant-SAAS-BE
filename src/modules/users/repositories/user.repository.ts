import { usersSchema } from '@/core/database/schemas/tenant/users.schema';
import { tenantDb } from '@/core/database/tenantConnectionPool';
import { eq } from 'drizzle-orm';

export const UserRepository = {
  async findByEmail(email: string) {
    return tenantDb.select().from(usersSchema).where(eq(usersSchema.email, email)).limit(1);
  },
  async create(data: any) {
    return tenantDb.insert(usersSchema).values(data).returning();
  },
  async findById(id: string) {
    return tenantDb.select().from(usersSchema).where(eq(usersSchema.id, id)).limit(1);
  },
  async update(id: string, data: any) {
    return tenantDb.update(usersSchema).set(data).where(eq(usersSchema.id, id)).returning();
  },
  async delete(id: string) {
    return tenantDb.delete(usersSchema).where(eq(usersSchema.id, id)).returning();
  },
};
