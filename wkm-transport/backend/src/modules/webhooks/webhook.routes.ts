import express from 'express';
import { handleWebhook } from './webhook.controller';

const router = express.Router();

router.post('/', express.json(), handleWebhook); // In production use raw parser for signature verification

export default router;
