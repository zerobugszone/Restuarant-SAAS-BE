export interface TenantModel {
  name: string;
  subdomain: string;
  databaseName: string;
  databaseHost: string;
  databasePort: number;
  status: 'active' | 'suspended';
  settings?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}
