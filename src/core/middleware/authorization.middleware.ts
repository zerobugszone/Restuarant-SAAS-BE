import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';

export const authorize = (roles: string[]) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new HttpException(httpStatus.FORBIDDEN, 'Forbidden', errorCodes.AUTHORIZATION_FAILED));
  }

  next();
};
