export interface CustomerModel {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: Date;
  tenantId: string;
}
