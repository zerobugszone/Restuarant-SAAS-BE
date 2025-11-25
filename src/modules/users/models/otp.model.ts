export interface OTP {
  id: string;
  userId: string;
  code: string;
  expiresAt: Date;
  used: boolean;
}
