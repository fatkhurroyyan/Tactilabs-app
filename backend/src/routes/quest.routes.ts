import { Router } from 'express';
import { getQuests, getQuestById, startOrUpdateProgress } from '../controllers/quest.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateJWT as any, getQuests as any);
router.get('/:id', authenticateJWT as any, getQuestById as any);
router.post('/:id/progress', authenticateJWT as any, startOrUpdateProgress as any);

export default router;
