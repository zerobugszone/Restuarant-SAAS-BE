import bcrypt from 'bcrypt';
import { envConfig } from '@/core/config/env.config';

export const hashPassword = async (plain: string) => bcrypt.hash(plain, envConfig.bcryptRounds);

export const comparePassword = async (plain: string, hash: string) => bcrypt.compare(plain, hash);
