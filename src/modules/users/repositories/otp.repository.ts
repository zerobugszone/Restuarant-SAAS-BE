import { otpSchema } from '@/core/database/schemas/tenant/otp.schema';
import { tenantConnectionPool } from '@/core/database/tenantConnectionPool';
import { eq } from 'drizzle-orm';
import { OTP } from '../models/otp.model';

export const OTPRepository = {
  async create(tenantId: string, data: OTP) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.insert(otpSchema).values(data).returning();
  },
  async findByUserId(tenantId: string, userId: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db
      .select()
      .from(otpSchema)
      .where(eq(otpSchema.userId, userId))
      .orderBy(otpSchema.expiresAt)
      .limit(1);
  },
  async findValid(tenantId: string, userId: string, code: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    // Use and() for multiple conditions
    const { and } = await import('drizzle-orm');
    return db
      .select()
      .from(otpSchema)
      .where(and(eq(otpSchema.userId, userId), eq(otpSchema.code, code), eq(otpSchema.used, false)))
      .orderBy(otpSchema.expiresAt)
      .limit(1);
  },
  async markUsed(tenantId: string, id: string) {
    const db = await tenantConnectionPool.getConnection(tenantId);
    return db.update(otpSchema).set({ used: true }).where(eq(otpSchema.id, id)).returning();
  },
};
