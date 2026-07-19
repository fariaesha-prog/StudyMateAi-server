import { Router } from 'express';
import { PlannerController } from '../controllers/planner.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/', protect, PlannerController.list);
router.post('/', protect, PlannerController.create);
router.get('/:id', protect, PlannerController.getById);
router.patch('/:id/days/:dayOffset', protect, PlannerController.toggleDay);
router.delete('/:id', protect, PlannerController.remove);

export default router;