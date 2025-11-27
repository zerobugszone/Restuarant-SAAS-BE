import { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const sendResponse = <T>(res: Response, payload: ApiResponse<T>, status = 200) => {
  res.status(status).json({
    success: payload.success,
    message: payload.message,
    status_code: status,
    data: payload.data,
  });
};
