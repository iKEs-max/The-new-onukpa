import pkg from '@prisma/client';
const { Role } = pkg;

export type UserTokenPayload = {
  sub: string;
  type: string;
  role: typeof Role[keyof typeof Role];
}

export type AuthTokens = {
  access: {
    token: string;
    expires: Date;
  };
  refresh: {
    token: string;
    expires: Date;
  };
}
