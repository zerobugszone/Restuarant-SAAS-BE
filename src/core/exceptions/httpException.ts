import { BaseException } from './baseException';

export class HttpException extends BaseException {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
    metadata?: Record<string, unknown>
  ) {
    super(message, metadata);
  }
}
