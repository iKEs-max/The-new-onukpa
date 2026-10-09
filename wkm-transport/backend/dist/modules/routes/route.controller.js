"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoute = exports.updateRoute = exports.getRoute = exports.getRoutes = exports.createRoute = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const database_1 = __importDefault(require("../../config/database"));
const createRoute = async (req, res) => {
    const route = await database_1.default.route.create({
        data: req.body,
    });
    res.status(http_status_codes_1.default.CREATED).send(route);
};
exports.createRoute = createRoute;
const getRoutes = async (req, res) => {
    const routes = await database_1.default.route.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { departureTime: 'asc' }
    });
    res.send(routes);
};
exports.getRoutes = getRoutes;
const getRoute = async (req, res) => {
    const route = await database_1.default.route.findUnique({
        where: { id: req.params.routeId },
    });
    if (!route) {
        return res.status(http_status_codes_1.default.NOT_FOUND).send({ message: 'Route not found' });
    }
    res.send(route);
};
exports.getRoute = getRoute;
const updateRoute = async (req, res) => {
    const route = await database_1.default.route.update({
        where: { id: req.params.routeId },
        data: req.body,
    });
    res.send(route);
};
exports.updateRoute = updateRoute;
const deleteRoute = async (req, res) => {
    await database_1.default.route.delete({
        where: { id: req.params.routeId },
    });
    res.status(http_status_codes_1.default.NO_CONTENT).send();
};
exports.deleteRoute = deleteRoute;
