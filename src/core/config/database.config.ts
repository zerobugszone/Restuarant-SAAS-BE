import { envConfig } from './env.config';

export const masterDbConfig = {
  host: envConfig.masterDb.host,
  port: envConfig.masterDb.port,
  database: envConfig.masterDb.name,
  user: envConfig.masterDb.user,
  password: envConfig.masterDb.password
};

export const tenantDbDefaults = {
  host: envConfig.tenantDbDefaults.host,
  port: envConfig.tenantDbDefaults.port,
  user: envConfig.tenantDbDefaults.user,
  password: envConfig.tenantDbDefaults.password
};
