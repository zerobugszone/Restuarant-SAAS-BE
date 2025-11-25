import { superadmins } from '@/core/database/schemas/master/superadmin.schema';
import { masterDb } from '@/core/database/masterConnection';
import { eq } from 'drizzle-orm';

export const SuperAdminRepository = {
  async findByEmail(email: string) {
    return masterDb.select().from(superadmins).where(eq(superadmins.email, email)).limit(1);
  },
  async create(data: any) {
    return masterDb.insert(superadmins).values(data).returning();
  },
  async findById(id: string) {
    return masterDb.select().from(superadmins).where(eq(superadmins.id, id)).limit(1);
  },
};
