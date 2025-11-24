import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';

export const validateDto = async <T>(cls: new () => T, payload: unknown) => {
  const instance = plainToInstance(cls, payload);
  const errors = await validate(instance as object, { whitelist: true, forbidNonWhitelisted: true });

  if (errors.length) {
    throw new HttpException(httpStatus.BAD_REQUEST, 'Validation failed', errorCodes.VALIDATION_ERROR, {
      errors: errors.map(error => error.constraints)
    });
  }

  return instance;
};
