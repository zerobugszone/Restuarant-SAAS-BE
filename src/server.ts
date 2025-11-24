import { createServer } from 'http';
import { createApp } from './app';
import { envConfig } from '@/core/config/env.config';
import { logger } from '@/core/utils/logger.util';
import { ensureMasterDatabaseExists } from '@/core/database/ensureDatabase';

const bootstrap = async () => {
  await ensureMasterDatabaseExists();
  const app = createApp();
  const server = createServer(app);
  const { port } = envConfig;

  server.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });
};

bootstrap();
