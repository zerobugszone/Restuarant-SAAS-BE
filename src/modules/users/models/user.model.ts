export interface User {
  tenantId: string;
  email: string;
  passwordHash: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}
