import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.get('/summary', protect, DashboardController.getSummary);

export default router;