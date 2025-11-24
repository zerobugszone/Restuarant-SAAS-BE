export interface TenantModel {
  id: string;
  name: string;
  subdomain: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: string;
  createdAt: Date;
}
