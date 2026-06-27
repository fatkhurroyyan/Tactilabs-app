import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateJWT as any, getProfile as any);
router.put('/', authenticateJWT as any, updateProfile as any);

export default router;
