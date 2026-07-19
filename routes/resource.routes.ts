import { Router } from 'express';
import { ResourceController } from '../controllers/resource.controller';
import { uploadResourceFile } from '../middleware/uploadFile.middleware';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/', ResourceController.list);
router.get('/:id', ResourceController.getById);
router.post('/', protect, uploadResourceFile.single('file'), ResourceController.create);
router.delete('/:id', protect, ResourceController.remove);

export default router;