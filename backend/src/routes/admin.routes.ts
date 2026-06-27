import { Router } from 'express';
import {
  getAdminOverview,
  getUsers,
  updateUserStatusOrRole,
  getInstitutions,
  createInstitution,
  createQuest,
  updateQuest,
  deleteQuest,
  getBadges,
  createBadge,
  updateBadge,
  deleteBadge,
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

// Quest CRUD routes
router.post('/quests', createQuest);
router.put('/quests/:id', updateQuest);
router.delete('/quests/:id', deleteQuest);

// Badge CRUD routes
router.get('/badges', getBadges);
router.post('/badges', createBadge);
router.put('/badges/:id', updateBadge);
router.delete('/badges/:id', deleteBadge);

export default router;


