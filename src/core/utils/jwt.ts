import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'defaultrefreshsecret';

export const generateAccessToken = (
  payload: object,
  expiresIn: jwt.SignOptions['expiresIn'] = '1h'
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const generateRefreshToken = (
  payload: object,
  expiresIn: jwt.SignOptions['expiresIn'] = '7d'
): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn });
};

export const verifyAccessToken = (accessToken: string): string | jwt.JwtPayload => {
  return jwt.verify(accessToken, JWT_SECRET);
};

export const verifyRefreshToken = (refreshToken: string): string | jwt.JwtPayload => {
  return jwt.verify(refreshToken, JWT_REFRESH_SECRET);
};
