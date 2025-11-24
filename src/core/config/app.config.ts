import { envConfig } from './env.config';

export const appConfig = {
  nodeEnv: envConfig.nodeEnv,
  isProduction: envConfig.nodeEnv === 'production',
  apiPrefix: envConfig.apiPrefix,
  rateLimit: {
    windowMs: envConfig.rateLimitWindow,
    max: envConfig.rateLimitMaxRequests
  }
};
