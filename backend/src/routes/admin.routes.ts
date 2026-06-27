import { Router } from 'express';
import {
  getAdminOverview,
  getUsers,
  updateUserStatusOrRole,
  getInstitutions,
  createInstitution,
} from '../controllers/admin.controller';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT as any);
router.use(requireRole(['ADMIN']) as any);

router.get('/overview', getAdminOverview);
router.get('/users', getUsers);
router.put('/users/:id', updateUserStatusOrRole);
router.get('/institutions', getInstitutions);
router.post('/institutions', createInstitution);

export default router;
