import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@/core/exceptions/httpException';
import { logger } from '@/core/utils/logger.util';
import { httpStatus } from '@/core/constants/httpStatus';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof HttpException) {
    logger.error(error.message, error.metadata);
    return res.status(error.status).json({ success: false, message: error.message, code: error.code, metadata: error.metadata });
  }

  logger.error('Unhandled error', error);
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
};
