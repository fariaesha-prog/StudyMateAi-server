import { Router } from 'express';
import { AiController } from '../controllers/ai.controller';
import { protect } from '../middleware/auth.middleware';
import { uploadDocument } from '../middleware/uploadDocument.middleware';

const router = Router();

router.post('/upload', protect, uploadDocument.single('file'), AiController.upload);
router.get('/:id', protect, AiController.getById);

export default router;