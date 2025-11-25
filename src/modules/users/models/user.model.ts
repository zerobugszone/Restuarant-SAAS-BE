export interface User {
  id: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
}
