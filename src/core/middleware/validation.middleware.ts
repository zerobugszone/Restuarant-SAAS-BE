import { Request, Response, NextFunction } from 'express';
import { validateDto } from '@/core/utils/validator.util';

export const validationMiddleware = <T>(dto: new () => T) => async (req: Request, _res: Response, next: NextFunction) => {
  try {
    req.body = await validateDto(dto, req.body);
    next();
  } catch (error) {
    next(error);
  }
};
