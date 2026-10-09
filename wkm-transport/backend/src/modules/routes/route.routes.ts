import express from 'express';
import { validate } from '../../middleware/validation';
import * as routeValidation from './route.validation';
import * as routeController from './route.controller';
import { auth } from '../auth/auth.middleware';

const router = express.Router();

// Publicly available
router.get('/', routeController.getRoutes);
router.get('/:routeId', routeController.getRoute);

// Admin only (requires 'manageRoutes' permission)
router.post('/', auth('manageRoutes'), validate(routeValidation.createRoute), routeController.createRoute);
router.patch('/:routeId', auth('manageRoutes'), validate(routeValidation.updateRoute), routeController.updateRoute);
router.delete('/:routeId', auth('manageRoutes'), validate(routeValidation.deleteRoute), routeController.deleteRoute);

export default router;
