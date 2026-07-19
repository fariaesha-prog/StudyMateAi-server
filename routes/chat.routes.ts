import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/sessions', protect, ChatController.listSessions);
router.post('/sessions', protect, ChatController.createSession);
router.get('/sessions/:sessionId/messages', protect, ChatController.getMessages);
router.post('/sessions/:sessionId/messages', protect, ChatController.sendMessage);
router.patch('/sessions/:sessionId/document', protect, ChatController.attachDocument);

export default router;