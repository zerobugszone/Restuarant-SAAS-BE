export interface TenantDatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
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

