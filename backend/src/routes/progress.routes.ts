import { Router } from 'express';
import { updateProgress, getProgress } from '../controllers/progress.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateJWT as any, updateProgress);
router.get('/', authenticateJWT as any, getProgress);

export default router;
