export interface TenantDatabaseConfig {
  databaseUrl: string;
}

export interface Tenant {
  id: string;
  tenantId: string;
  name: string;
  subdomain: string;
  databaseName: string;
  databaseHost: string;
  databasePort: number;
  status: string;
  settings?: Record<string, unknown>;
}
