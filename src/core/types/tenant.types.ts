export interface Tenant {
  id: string;
  tenantId: string;
  name: string;
  subdomain: string;
  databaseUrl: string;
  status: string;
  settings?: Record<string, unknown> | null;
}

export interface TenantDatabaseConfig {
  databaseUrl: string;
}
