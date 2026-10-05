import { Router } from 'express';
import { chat } from '../controllers/ai.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.post('/chat', authenticateJWT as any, chat);

export default router;
