export interface UserModel {
  id: string;
  tenantId: string;
  email: string;
  passwordHash: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}
