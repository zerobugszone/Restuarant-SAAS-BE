export interface CustomerModel {
  id: string;
  tenantId: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: Date;
}
