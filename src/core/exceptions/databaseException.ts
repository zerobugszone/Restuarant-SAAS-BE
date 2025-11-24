import { BaseException } from './baseException';

export class DatabaseException extends BaseException {
  constructor(message: string, public readonly detail?: unknown) {
    super(message, { detail });
  }
}
