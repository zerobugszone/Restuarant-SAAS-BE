import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';

export const tenantResolver = (req: Request, _res: Response, next: NextFunction) => {
  const tenantId = (req.headers['x-tenant-id'] as string) ?? req.user?.tenantId;

  if (!tenantId) {
    return next(new HttpException(httpStatus.BAD_REQUEST, 'Tenant identifier missing', errorCodes.TENANT_NOT_FOUND));
  }

  req.tenantId = tenantId;
  next();
};
