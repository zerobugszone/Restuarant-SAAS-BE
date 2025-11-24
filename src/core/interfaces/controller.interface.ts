import { Request, Response, NextFunction } from 'express';

export interface Controller {
  registerRoutes(): void;
}

export type ExpressHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;
