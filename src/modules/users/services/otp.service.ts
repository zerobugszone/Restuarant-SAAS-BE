import { OTPRepository } from '../repositories/otp.repository';
import { OTP } from '../models/otp.model';

export const OTPService = {
  async generate(userId: string) {
    // Generate OTP code, save to DB
  },
  async verify(userId: string, code: string) {
    // Verify OTP code
  },
};
