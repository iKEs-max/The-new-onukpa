import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';

const verifyCallback = (req: any, resolve: any, reject: any, requiredRights: string[]) => async (err: any, user: any, info: any) => {
  if (err || info || !user) {
    return reject(new Error('Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = user.role === 'ADMIN' ? ['manageUsers', 'manageRoutes', 'manageBookings'] : [];
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new Error('Forbidden'));
    }
  }

  resolve();
};

export const auth = (...requiredRights: string[]) => async (req: any, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => res.status(httpStatus.UNAUTHORIZED).json({ message: err.message }));
};
