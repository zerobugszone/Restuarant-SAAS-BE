import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { envConfig } from '@/core/config/env.config';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';

export const authenticationMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next(new HttpException(httpStatus.UNAUTHORIZED, 'Missing authorization header', errorCodes.AUTHENTICATION_FAILED));
  }

  const [, token] = authorization.split(' ');

  try {
    const payload = jwt.verify(token, envConfig.jwtSecret) as { sub: string; role: string; tenantId: string };
    req.user = { id: payload.sub, role: payload.role, tenantId: payload.tenantId };
    req.tenantId = req.tenantId ?? payload.tenantId;
    next();
  } catch (error) {
    next(new HttpException(httpStatus.UNAUTHORIZED, 'Invalid token', errorCodes.AUTHENTICATION_FAILED, { error }));
  }
};
