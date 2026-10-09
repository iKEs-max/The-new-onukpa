import { Request, Response } from 'express';
import prisma from '../../config/database';

export const getDashboardStats = async (req: Request, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalUsers, totalBookings, totalRoutes, revenueRaw, todayBookings, todayRevenueRaw] = await Promise.all([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.booking.count(),
    prisma.route.count(),
    prisma.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true }
    }),
    prisma.booking.count({
      where: { createdAt: { gte: today } }
    }),
    prisma.payment.aggregate({
      where: { status: 'SUCCESS', createdAt: { gte: today } },
      _sum: { amount: true }
    })
  ]);

  const popularRoutesRaw = await prisma.booking.groupBy({
    by: ['routeId'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 3
  });

  const popularRoutes = await Promise.all(popularRoutesRaw.map(async (item) => {
    const route = await prisma.route.findUnique({ where: { id: item.routeId } });
    return { name: `${route?.departure} to ${route?.destination}`, count: item._count.id };
  }));

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { firstName: true, lastName: true } }, route: { select: { departure: true, destination: true } } }
  });

  res.send({
    stats: {
      totalUsers,
      totalBookings,
      totalRoutes,
      totalRevenue: revenueRaw._sum.amount || 0,
      todayBookings,
      todayRevenue: todayRevenueRaw._sum.amount || 0,
      popularRoutes
    },
    recentBookings
  });
};
