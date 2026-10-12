import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(protect, createProject);

router.route('/:idOrSlug')
  .get(getProject);

router.route('/:id')
  .put(protect, updateProject)
  .delete(protect, deleteProject);

export default router;
