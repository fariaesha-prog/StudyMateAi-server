import { Router } from 'express';
import { QuizController } from '../controllers/quiz.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.post('/submit', protect, QuizController.submit);

export default router;