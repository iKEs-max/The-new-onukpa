"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = express_1.default.Router();
// All admin routes require authentication and 'manageSystem' pseudo-right or similar
router.use((0, auth_middleware_1.auth)('manageRoutes')); // Reusing manageRoutes as basic admin boundary for now
router.get('/stats', admin_controller_1.getDashboardStats);
exports.default = router;
