import { otp } from '@/core/database/schemas/tenant/auth.schema';
import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { eq } from 'drizzle-orm';
import { OTP } from '../models/otp.model';

export const OTPRepository = {
  async create(tenantId: string, data: OTP) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.insert(otp).values(data).returning();
  },
  async findByUserId(tenantId: string, userId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.select().from(otp).where(eq(otp.userId, userId)).orderBy(otp.expiresAt).limit(1);
  },
  async findValid(tenantId: string, userId: string, code: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    // Use and() for multiple conditions
    const { and } = await import('drizzle-orm');
    return db
      .select()
      .from(otp)
      .where(and(eq(otp.userId, userId), eq(otp.code, code), eq(otp.used, false)))
      .orderBy(otp.expiresAt)
      .limit(1);
  },
  async markUsed(tenantId: string, id: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.update(otp).set({ used: true }).where(eq(otp.id, id)).returning();
  },
};
