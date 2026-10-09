import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import prisma from '../../config/database';
import { generateAuthTokens } from './auth.service';

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, phone } = req.body;

  if (await prisma.user.findUnique({ where: { email } })) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Email already taken' });
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
    },
  });

  const tokens = await generateAuthTokens(user);

  res.status(httpStatus.CREATED).send({ 
    user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName }, 
    tokens 
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Incorrect email or password' });
  }

  const tokens = await generateAuthTokens(user);

  res.send({ 
    user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName }, 
    tokens 
  });
};

export const getMe = async (req: Request, res: Response) => {
  res.send({ success: true, user: (req.user as any) });
};

export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: (req.user as any).id } });

  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: 'Incorrect current password' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 8);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  res.send({ success: true, message: 'Password updated successfully' });
};
