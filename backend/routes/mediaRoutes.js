import express from 'express';
import { getMedia, createMedia, deleteMedia } from '../controllers/mediaController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getMedia)
  .post(protect, createMedia);

router.route('/:id')
  .delete(protect, deleteMedia);

export default router;
