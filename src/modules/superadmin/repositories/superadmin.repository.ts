import { superadmins } from '@/core/database/schemas/master/superadmin.schema';
import { masterDb } from '@/core/database/masterConnection';
import { eq } from 'drizzle-orm';
import { paginatedData } from '@/core/helper/pagination_helper';

export const SuperAdminRepository = {
  async findByEmail(email: string) {
    return await masterDb.select().from(superadmins).where(eq(superadmins.email, email)).limit(1);
  },
  async create(data: any) {
    return await masterDb.insert(superadmins).values(data).returning();
  },
  async findById(id: string) {
    return await masterDb.select().from(superadmins).where(eq(superadmins.id, id)).limit(1);
  },

  async findAll(
    matchData: Record<string, any>,
    sortData: Record<string, 'asc' | 'desc'>,
    page: number,
    perPage: number
  ) {
    return await paginatedData(masterDb, superadmins, matchData, sortData, page, perPage);
  },

  async updatePassword(adminId: string, hashedPassword: string) {
    return await masterDb
      .update(superadmins)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(superadmins.id, adminId));
  },

  async deleteById(adminId: string) {
    return await masterDb.delete(superadmins).where(eq(superadmins.id, adminId));
  },
};
