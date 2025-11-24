import { Tenant } from './tenant.types';

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      tenant?: Tenant;
      user?: {
        id: string;
        role: string;
        tenantId: string;
      };
    }
  }
}

export {};
