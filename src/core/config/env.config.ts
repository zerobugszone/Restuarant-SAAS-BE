import dotenv from 'dotenv';

dotenv.config();

const number = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const envConfig = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: number(process.env.PORT, 3000),
  apiPrefix: process.env.API_PREFIX ?? '/api/v1',
  jwtSecret: String(process.env.JWT_SECRET ?? 'change-me'),
  jwtExpiresIn: String(process.env.JWT_EXPIRES_IN ?? '24h'),
  bcryptRounds: number(process.env.BCRYPT_ROUNDS, 12),
  rateLimitWindow: process.env.RATE_LIMIT_WINDOW ?? '15m',
  rateLimitMaxRequests: number(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
  masterDb: {
    host: process.env.MASTER_DB_HOST ?? 'localhost',
    port: number(process.env.MASTER_DB_PORT, 5432),
    name: process.env.MASTER_DB_NAME ?? 'restaurant_master',
    user: process.env.MASTER_DB_USER ?? 'postgres',
    password: process.env.MASTER_DB_PASSWORD ?? 'postgres',
  },
  tenantDbDefaults: {
    host: process.env.TENANT_DB_HOST ?? 'localhost',
    port: number(process.env.TENANT_DB_PORT, 5432),
    user: process.env.TENANT_DB_USER ?? 'postgres',
    password: process.env.TENANT_DB_PASSWORD ?? 'postgres',
  },
};
