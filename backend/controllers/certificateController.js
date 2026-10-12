import mongoose from 'mongoose';
import { Certificate } from '../models/Certificate.js';
import { certificatesData } from '../seeds/seedData.js';

let memoryCertificates = certificatesData.map((c, idx) => ({ ...c, _id: `mem_cert_${idx + 1}` }));

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
export const getCertificates = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const certificates = await Certificate.find().sort({ order: 1, createdAt: -1 });
      return res.json({ success: true, count: certificates.length, data: certificates });
    }

    res.json({ success: true, count: memoryCertificates.length, data: memoryCertificates, isFallback: true });
  } catch (error) {
    res.json({ success: true, count: memoryCertificates.length, data: memoryCertificates });
  }
};

// @desc    Create new certificate
// @route   POST /api/certificates
// @access  Private
export const createCertificate = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const certificate = await Certificate.create(req.body);
      return res.status(201).json({ success: true, data: certificate, message: 'Certificate created successfully' });
    }

    const newCert = { ...req.body, _id: `mem_cert_${Date.now()}` };
    memoryCertificates.push(newCert);
    res.status(201).json({ success: true, data: newCert, message: 'Certificate created in session' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private
export const updateCertificate = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const certificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });
      return res.json({ success: true, data: certificate, message: 'Certificate updated successfully' });
    }

    const idx = memoryCertificates.findIndex((c) => c._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Certificate not found' });
    memoryCertificates[idx] = { ...memoryCertificates[idx], ...req.body };
    res.json({ success: true, data: memoryCertificates[idx], message: 'Certificate updated in session' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private
export const deleteCertificate = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const certificate = await Certificate.findByIdAndDelete(req.params.id);
      if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });
      return res.json({ success: true, message: 'Certificate deleted successfully' });
    }

    memoryCertificates = memoryCertificates.filter((c) => c._id !== req.params.id);
    res.json({ success: true, message: 'Certificate deleted from session' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
