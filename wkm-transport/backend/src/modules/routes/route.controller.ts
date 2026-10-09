import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import prisma from '../../config/database';

export const createRoute = async (req: Request, res: Response) => {
  const route = await prisma.route.create({
    data: req.body,
  });
  res.status(httpStatus.CREATED).send(route);
};

export const getRoutes = async (req: Request, res: Response) => {
  const routes = await prisma.route.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { departureTime: 'asc' }
  });
  res.send(routes);
};

export const getRoute = async (req: Request, res: Response) => {
  const route = await prisma.route.findUnique({
    where: { id: req.params.routeId },
  });
  if (!route) {
    return res.status(httpStatus.NOT_FOUND).send({ message: 'Route not found' });
  }
  res.send(route);
};

export const updateRoute = async (req: Request, res: Response) => {
  const route = await prisma.route.update({
    where: { id: req.params.routeId },
    data: req.body,
  });
  res.send(route);
};

export const deleteRoute = async (req: Request, res: Response) => {
  await prisma.route.delete({
    where: { id: req.params.routeId },
  });
  res.status(httpStatus.NO_CONTENT).send();
};
