import { Client } from 'pg';
import { masterDbConfig } from '@/core/config/database.config';
import { logger } from '@/core/utils/logger.util';

export async function ensureMasterDatabaseExists() {
  logger.info(
    `Connecting to PostgreSQL at ${masterDbConfig.host}:${masterDbConfig.port} as ${masterDbConfig.user}`
  );
  const client = new Client({
    host: masterDbConfig.host,
    port: masterDbConfig.port,
    user: masterDbConfig.user,
    password: masterDbConfig.password,
    database: 'postgres', // connect to default db to check/create
  });

  try {
    await client.connect();
    logger.info('Connected to PostgreSQL for master DB check.');
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [
      masterDbConfig.database,
    ]);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${masterDbConfig.database}"`);
      logger.info(`Database '${masterDbConfig.database}' created.`);
    } else {
      logger.info(`Database '${masterDbConfig.database}' already exists.`);
    }
  } catch (err) {
    logger.error('Error ensuring master database exists:', err);
    throw err;
  } finally {
    await client.end();
  }
}
