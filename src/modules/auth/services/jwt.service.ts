import jwt from 'jsonwebtoken';
import { envConfig } from '@/core/config/env.config';

interface JwtPayload {
  sub: string;
  role: string;
  tenantId: string;
}

export class JwtService {
  sign(payload: JwtPayload) {
    return jwt.sign(payload, envConfig.jwtSecret, { expiresIn: envConfig.jwtExpiresIn });
  }
}

export const jwtService = new JwtService();
