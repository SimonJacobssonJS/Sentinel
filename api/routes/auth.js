import express from 'express';
import {
  loginUser,
  registerUser,
  getMe,
  updateMe,
  deleteMe,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = express.Router();

// Auth
router.post('/register', registerUser);
router.post('/login', loginUser);

// User profile
router.get('/me', authenticateToken, getMe);
router.patch('/me', authenticateToken, updateMe);
router.delete('/me', authenticateToken, deleteMe);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;

