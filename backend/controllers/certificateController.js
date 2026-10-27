import mongoose from 'mongoose';
import { Certificate } from '../models/Certificate.js';
import { certificatesData } from '../seeds/seedData.js';

let memoryCertificates = certificatesData.map((c, idx) => ({ ...c, _id: `mem_cert_${idx + 1}` }));

// Helper: Parse certificate date/year into numeric timestamp for sorting (Newest first)
const parseCertificateDateToTimestamp = (dateStr) => {
  if (!dateStr) return 0;
  const str = String(dateStr).trim();

  const direct = new Date(str);
  if (!isNaN(direct.getTime()) && direct.getFullYear() >= 1990 && direct.getFullYear() <= 2100) {
    return direct.getTime();
  }

  const yearMatches = str.match(/\b(19\d\d|20\d\d)\b/g);
  if (yearMatches && yearMatches.length > 0) {
    const validYears = yearMatches.map((y) => parseInt(y, 10));
    const year = Math.max(...validYears);

    const monthAbbr = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const lower = str.toLowerCase();
    let monthIdx = 0;
    for (let i = 0; i < monthAbbr.length; i++) {
      if (lower.includes(monthAbbr[i])) {
        monthIdx = i;
        break;
      }
    }
    return new Date(year, monthIdx, 1).getTime();
  }
  return 0;
};

// Sort certificates: Newest first -> Oldest in the last
const sortCertificates = (list) => {
  return [...list].sort((a, b) => {
    const timeA = parseCertificateDateToTimestamp(a?.issueDate);
    const timeB = parseCertificateDateToTimestamp(b?.issueDate);
    if (timeA !== timeB) {
      return timeB - timeA;
    }
    const createdA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
    const createdB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
    return createdB - createdA;
  });
};

// @desc    Get all certificates (Sorted newest first)
// @route   GET /api/certificates
// @access  Public
export const getCertificates = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const certificates = await Certificate.find();
      const sorted = sortCertificates(certificates);
      return res.json({ success: true, count: sorted.length, data: sorted });
    }

    const sortedMemory = sortCertificates(memoryCertificates);
    res.json({ success: true, count: sortedMemory.length, data: sortedMemory, isFallback: true });
  } catch (error) {
    const sortedFallback = sortCertificates(memoryCertificates);
    res.json({ success: true, count: sortedFallback.length, data: sortedFallback });
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
