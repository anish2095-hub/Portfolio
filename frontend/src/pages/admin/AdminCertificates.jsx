import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Award,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { certificateAPI, uploadAPI } from '../../services/api';
import {
  detectCertificateDate,
  sortCertificatesNewestFirst,
} from '../../utils/certificateDateDetector';

export const AdminCertificates = () => {
  const { certificates, refreshData } = usePortfolio();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [detectingDate, setDetectingDate] = useState(false);
  const [dateDetectionMsg, setDateDetectionMsg] = useState('');
  const [detectedDateInfo, setDetectedDateInfo] = useState(null);
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Strictly order certificates so the newest appears first and older in the last
  const sortedCertificates = useMemo(() => {
    return sortCertificatesNewestFirst(certificates);
  }, [certificates]);

  const initialForm = {
    title: '',
    issuer: '',
    issueDate: '',
    credentialUrl: '',
    credentialId: '',
    image: '',
    order: 0,
  };

  const [formData, setFormData] = useState(initialForm);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setDetectedDateInfo(null);
    setDateDetectionMsg('');
    setModalOpen(true);
  };

  const openEditModal = (cert) => {
    setEditingId(cert._id);
    setFormData({
      title: cert.title || '',
      issuer: cert.issuer || '',
      issueDate: cert.issueDate || '',
      credentialUrl: cert.credentialUrl || '',
      credentialId: cert.credentialId || '',
      image: cert.image || '',
      order: cert.order || 0,
    });
    setDetectedDateInfo(null);
    setDateDetectionMsg('');
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setDetectingDate(true);
      setDateDetectionMsg('Reading certificate date & year...');
      setDetectedDateInfo(null);

      // Run image upload and date recognition concurrently
      const uploadPromise = uploadAPI.uploadImage(file);
      const detectionPromise = detectCertificateDate(file, (status) => {
        setDateDetectionMsg(status);
      });

      const [uploadRes, detectionRes] = await Promise.allSettled([
        uploadPromise,
        detectionPromise,
      ]);

      // Set uploaded image URL
      if (uploadRes.status === 'fulfilled' && uploadRes.value.data?.success) {
        const imgUrl = uploadRes.value.data.url;
        setFormData((prev) => ({ ...prev, image: imgUrl }));
      }

      // Auto-populate detected date/year
      if (detectionRes.status === 'fulfilled' && detectionRes.value?.date) {
        const detected = detectionRes.value;
        setFormData((prev) => ({
          ...prev,
          issueDate: detected.date,
        }));
        setDetectedDateInfo(detected);
        setNotification({
          type: 'success',
          message: `Certificate uploaded! ${detected.message} and auto-sequenced (newest first).`,
        });
      } else {
        setNotification({
          type: 'success',
          message: 'Certificate uploaded successfully!',
        });
      }
    } catch (err) {
      console.error('[Certificate Upload Error]:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to upload and scan certificate.',
      });
    } finally {
      setUploadingImage(false);
      setDetectingDate(false);
      setDateDetectionMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    try {
      if (editingId) {
        await certificateAPI.update(editingId, formData);
        setNotification({
          type: 'success',
          message: 'Certificate updated! Sequence refreshed (newest first).',
        });
      } else {
        await certificateAPI.create(formData);
        setNotification({
          type: 'success',
          message: 'Certificate added! Automatically placed in sequence by date.',
        });
      }
      setModalOpen(false);
      await refreshData();
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Operation failed.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete certificate "${title}"?`)) {
      try {
        await certificateAPI.delete(id);
        setNotification({ type: 'success', message: 'Certificate deleted successfully!' });
        await refreshData();
      } catch (err) {
        console.error(err);
        setNotification({ type: 'error', message: 'Failed to delete certificate.' });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <span>Certificates & Credentials</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-aurora-cyan/15 text-aurora-cyan border border-aurora-cyan/30">
              Auto-Sequenced
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Upload certificates with automatic date reading • Newest credentials appear first
          </p>
        </div>
        <button
          onClick={openAddModal}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs font-mono bg-aurora-cyan text-white hover:opacity-90 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      {/* Sequence Guide Notification */}
      <div className="p-3.5 rounded-2xl bg-aurora-cyan/5 border border-aurora-cyan/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2.5">
          <ArrowUpDown className="w-4 h-4 text-aurora-cyan flex-shrink-0" />
          <span>
            <strong>Chronological Auto-Sequence:</strong> Certificates are automatically sequenced so that the{' '}
            <strong className="text-aurora-cyan">newest one appears first</strong> and older ones appear in the last.
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 whitespace-nowrap">
          {sortedCertificates.length} credentials total
        </span>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 shadow-sm ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-nebula-900 border-b border-slate-200 dark:border-white/5 font-mono uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Sequence</th>
                <th className="px-6 py-3.5">Image</th>
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5">Issuer</th>
                <th className="px-6 py-3.5">Issue Date / Year</th>
                <th className="px-6 py-3.5">Verification</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {sortedCertificates.map((cert, idx) => (
                <tr
                  key={cert._id || idx}
                  className="hover:bg-slate-50/50 dark:hover:bg-nebula-800/40 transition-colors"
                >
                  {/* Sequence Position */}
                  <td className="px-6 py-3.5">
                    {idx === 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-semibold">
                        <Sparkles className="w-3 h-3" />
                        <span>#1 • Newest</span>
                      </span>
                    ) : idx === sortedCertificates.length - 1 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 font-mono text-[10px]">
                        <span>#{idx + 1} • Oldest</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-400 font-mono text-[10px]">
                        #{idx + 1}
                      </span>
                    )}
                  </td>

                  {/* Thumbnail */}
                  <td className="px-6 py-3.5">
                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-nebula-800 flex-shrink-0 border border-slate-200 dark:border-white/10">
                      <img
                        src={
                          cert.image ||
                          'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=200&q=80'
                        }
                        alt={cert.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=200&q=80';
                        }}
                      />
                    </div>
                  </td>

                  {/* Title */}
                  <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white font-display text-sm">
                    {cert.title}
                  </td>

                  {/* Issuer */}
                  <td className="px-6 py-3.5 font-mono text-aurora-cyan uppercase font-semibold">
                    {cert.issuer}
                  </td>

                  {/* Date/Year */}
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 font-mono text-slate-700 dark:text-slate-300 font-medium bg-slate-100 dark:bg-nebula-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/5">
                      <Calendar className="w-3.5 h-3.5 text-aurora-cyan" />
                      <span>{cert.issueDate}</span>
                    </span>
                  </td>

                  {/* Verification */}
                  <td className="px-6 py-3.5">
                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-aurora-cyan hover:underline font-mono"
                      >
                        <span>Verify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 font-mono">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(cert)}
                      type="button"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:border-aurora-cyan text-slate-600 dark:text-slate-400 hover:text-aurora-cyan"
                      title="Edit Certificate"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cert._id, cert.title)}
                      type="button"
                      className="p-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-500"
                      title="Delete Certificate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-nebula-900 border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setModalOpen(false)}
              type="button"
              className="absolute top-6 right-6 p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-nebula-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-xl font-bold mb-1 flex items-center gap-2">
              <span>{editingId ? 'Edit Certificate' : 'Add Certificate'}</span>
              <span className="text-[10px] font-mono text-aurora-cyan bg-aurora-cyan/10 px-2 py-0.5 rounded-full">
                Auto-Date Detection
              </span>
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              When you upload a certificate image, its date/year is automatically read and placed in sequence.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-slate-500 mb-1">Certificate Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. AWS Certified Cloud Practitioner"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-aurora-cyan"
                />
              </div>

              {/* Upload & Image Selector */}
              <div>
                <label className="block font-mono text-slate-500 mb-1">
                  Certificate Image (Upload scans date automatically) *
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... or click Upload"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-xs font-mono"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-aurora-cyan text-white text-xs font-mono font-medium hover:opacity-90 shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage || detectingDate ? 'Reading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Date detection progress indicator */}
                {detectingDate && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-aurora-cyan/10 border border-aurora-cyan/20 text-aurora-cyan font-mono text-[11px] animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>{dateDetectionMsg || 'Analyzing certificate text & date...'}</span>
                  </div>
                )}

                {/* Detected info badge */}
                {detectedDateInfo && (
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{detectedDateInfo.message}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-slate-500 mb-1">Issuing Authority *</label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="e.g. Amazon Web Services, Meta"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-aurora-cyan"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-mono text-slate-500">Issue Date / Year *</label>
                    <span className="text-[10px] text-aurora-cyan font-mono">Auto-reads on upload</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.issueDate}
                      onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                      placeholder="e.g. 2024 or March 2024"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-aurora-cyan"
                    />
                  </div>

                  {/* Quick Year Shortcuts */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-400 font-mono">Quick set:</span>
                    {['2025', '2024', '2023', '2022'].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, issueDate: yr }))}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-nebula-800 hover:bg-aurora-cyan hover:text-white font-mono text-[10px] text-slate-600 dark:text-slate-400 transition-colors"
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-500 mb-1">Credential URL</label>
                <input
                  type="text"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://coursera.org/verify/... or https://aws.amazon.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-aurora-cyan"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
                <span className="text-[11px] text-slate-400 font-mono">
                  ✨ Sequenced automatically by date
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl font-medium font-mono text-white bg-aurora-cyan hover:opacity-90 shadow-md transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : editingId ? 'Update Certificate' : 'Create Certificate'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
