import { Router } from 'express';
import { register, login, logout, refresh, forgotPassword, resetPassword, getPublicInstitutions } from '../controllers/auth.controller';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Public institutions listing for student registration
router.get('/institutions', getPublicInstitutions);

export default router;


