import { Router } from 'express';
import { register, login, logout, refresh, forgotPassword, resetPassword, getPublicInstitutions } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Public institutions listing for student registration
router.get('/institutions', getPublicInstitutions);

export default router;


