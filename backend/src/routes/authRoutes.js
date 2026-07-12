import express from 'express';
import {
  registerUser,
  loginUser,
  googleAuthRedirect,
  googleAuthCallback,
} from '../controllers/authController.js';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../middleware/validationMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Apply rate limiter and input validation on registration and login
router.post('/register', authRateLimiter, validateRegisterInput, registerUser);
router.post('/login', authRateLimiter, validateLoginInput, loginUser);

// Google OAuth endpoints
router.get('/google', googleAuthRedirect);
router.get('/google/callback', googleAuthCallback);

export default router;
