import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { masterDbConfig } from '@/core/config/database.config';
import { logger } from '@/core/utils/logger.util';
import * as schema from '@/core/database/schemas/master';

export const masterPool = new Pool({
  host: masterDbConfig.host,
  port: masterDbConfig.port,
  database: masterDbConfig.database,
  user: masterDbConfig.user,
  password: masterDbConfig.password,
});

masterPool.on('error', error => {
  logger.error('Unexpected error on idle master client', error);
});

export const masterDb = drizzle(masterPool, { schema });
