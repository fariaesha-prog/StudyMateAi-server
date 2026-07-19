import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { uploadImage } from '../middleware/upload.middleware';

const router = Router();

router.post('/image', uploadImage.single('image'), UploadController.uploadImage);

export default router;