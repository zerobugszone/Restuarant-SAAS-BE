export interface TenantModel {
  name: string;
  subdomain: string;
  databaseUrl: string;
  status: 'active' | 'suspended';
  settings?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}
