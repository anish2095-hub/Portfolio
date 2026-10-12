import express from 'express';
import {
  sendMessage,
  getMessages,
  toggleMessageRead,
  deleteMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(sendMessage)
  .get(protect, getMessages);

router.route('/:id/read')
  .put(protect, toggleMessageRead);

router.route('/:id')
  .delete(protect, deleteMessage);

export default router;
