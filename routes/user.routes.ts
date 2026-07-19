import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);
router.get('/me', UserController.getMyProfile);
router.patch('/me', UserController.updateMyProfile);
router.get('/me/stats', UserController.getMyStats);

export default router;