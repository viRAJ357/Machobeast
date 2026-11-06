import express from 'express';
import passport from '../config/passport.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  getMeProfile,
  oAuthCallback
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ─── Local Auth ───────────────────────────────────────────────────────────────
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMeProfile);

// ─── Google OAuth ─────────────────────────────────────────────────────────────
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_failed' }),
  oAuthCallback
);

// ─── Facebook OAuth ───────────────────────────────────────────────────────────
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'], session: false })
);
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login?error=facebook_failed' }),
  oAuthCallback
);

export default router;
