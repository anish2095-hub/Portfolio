import express from 'express';
import { upload } from '../config/upload.js';
import { uploadImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Upload image (protected route for admin)
router.post('/', protect, upload.single('image'), uploadImage);

export default router;
