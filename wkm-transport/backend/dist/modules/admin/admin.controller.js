"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const database_1 = __importDefault(require("../../config/database"));
const getDashboardStats = async (req, res) => {
    const [totalUsers, totalBookings, totalRoutes, revenueRaw] = await Promise.all([
        database_1.default.user.count({ where: { role: 'USER' } }),
        database_1.default.booking.count(),
        database_1.default.route.count(),
        database_1.default.payment.aggregate({
            where: { status: 'SUCCESS' },
            _sum: { amount: true }
        })
    ]);
    const recentBookings = await database_1.default.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true } }, route: { select: { departure: true, destination: true } } }
    });
    res.send({
        stats: {
            totalUsers,
            totalBookings,
            totalRoutes,
            totalRevenue: revenueRaw._sum.amount || 0
        },
        recentBookings
    });
};
exports.getDashboardStats = getDashboardStats;
