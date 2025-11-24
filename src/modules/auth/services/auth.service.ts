import { comparePassword, hashPassword } from '@/core/utils/encryption.util';
import { HttpException } from '@/core/exceptions/httpException';
import { httpStatus } from '@/core/constants/httpStatus';
import { errorCodes } from '@/core/constants/errorCodes';
import { userRepository, UserRepository } from '../repositories/user.repository';
import { jwtService, JwtService } from './jwt.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

export class AuthService {
  constructor(
    private readonly repository: UserRepository = userRepository,
    private readonly tokenService: JwtService = jwtService
  ) {}

  async register(payload: RegisterDto) {
    const existing = await this.repository.findByEmail(payload.email);
    if (existing) {
      throw new HttpException(httpStatus.CONFLICT, 'Email already registered', errorCodes.VALIDATION_ERROR);
    }

    const passwordHash = await hashPassword(payload.password);
    const user = await this.repository.create({
      email: payload.email,
      passwordHash,
      role: payload.role,
      tenantId: payload.tenantId
    });

    const token = this.tokenService.sign({ sub: user.id, role: user.role, tenantId: user.tenantId });
    return { user, token };
  }

  async login(payload: LoginDto) {
    const user = await this.repository.findByEmail(payload.email);
    if (!user) {
      throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid credentials', errorCodes.AUTHENTICATION_FAILED);
    }

    const isValid = await comparePassword(payload.password, user.passwordHash);
    if (!isValid) {
      throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid credentials', errorCodes.AUTHENTICATION_FAILED);
    }

    const token = this.tokenService.sign({ sub: user.id, role: user.role, tenantId: user.tenantId });
    return { user, token };
  }
}
