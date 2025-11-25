import { OTP } from '../models/otp.model';
// Implement DB logic for OTP storage and retrieval
export const OTPRepository = {
  async create(data: OTP) {
    // ...DB insert logic
  },
  async findByUserId(userId: string) {
    // ...DB select logic
  },
  async markUsed(id: string) {
    // ...DB update logic
  },
};
