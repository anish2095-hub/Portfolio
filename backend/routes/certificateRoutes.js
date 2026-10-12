import express from 'express';
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from '../controllers/certificateController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getCertificates)
  .post(protect, createCertificate);

router.route('/:id')
  .put(protect, updateCertificate)
  .delete(protect, deleteCertificate);

export default router;
