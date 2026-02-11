import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

class AuthServices {
  static async generateAuthToken(user: any) {
    const payload = { id: user._id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload, '1d');
    const refreshToken = generateRefreshToken(payload, '7d');
    return {
      accessToken,
      refreshToken,
    };
  }
  static refreshAccessToken(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    const { id, email, role } = decoded as jwt.JwtPayload;
    const newAccessToken = generateAccessToken({ id, email, role }, '1d');
    return newAccessToken;
  }
}

export default AuthServices;
