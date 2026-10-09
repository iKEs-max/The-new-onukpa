import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { UserTokenPayload, AuthTokens } from './auth.types';

export const generateToken = (
  userId: string,
  role: string,
  expires: Date,
  type: string = 'access',
  secret: string = env.jwtSecret
): string => {
  const payload: UserTokenPayload = {
    sub: userId,
    type,
    role: role as any,
  };
  return jwt.sign(payload, secret, { expiresIn: Math.floor(expires.getTime() / 1000) - Math.floor(Date.now() / 1000) });
};

export const generateAuthTokens = async (user: { id: string, role: string }): Promise<AuthTokens> => {
  const accessTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  const refreshTokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const accessToken = generateToken(user.id, user.role, accessTokenExpires, 'access');
  const refreshToken = generateToken(user.id, user.role, refreshTokenExpires, 'refresh');

  // In a real app we would save the refresh token to DB or Redis here

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires,
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
  };
};
