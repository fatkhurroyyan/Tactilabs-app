import { Router } from 'express';
import {
  getEducatorDashboard,
  getClasses,
  getClassById,
  assignQuest,
  createClass,
} from '../controllers/educator.controller';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT as any);
router.use(requireRole(['EDUCATOR']) as any);

router.get('/dashboard', getEducatorDashboard as any);
router.get('/classes', getClasses as any);
router.get('/classes/:id', getClassById as any);
router.post('/classes', createClass as any);
router.post('/assignments', assignQuest as any);

export default router;
