import express from 'express';
import { login, getMe, changePassword, updateCredentials } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-credentials', protect, updateCredentials);
router.put('/change-password', protect, changePassword);

export default router;
