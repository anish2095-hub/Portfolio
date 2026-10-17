import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Award, Upload, CheckCircle2, AlertCircle, X, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { certificateAPI, uploadAPI } from '../../services/api';

export const AdminCertificates = () => {
  const { certificates, refreshData } = usePortfolio();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadAPI.uploadImage(file);
      if (res.data?.success && res.data.url) {
        setFormData((prev) => ({ ...prev, image: res.data.url }));
        setNotification({
          type: 'success',
          message: `Certificate image uploaded via ${res.data.provider || 'cloud storage'}!`,
        });
      }
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to upload image.',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    try {
      if (editingId) {
        await certificateAPI.update(editingId, formData);
        setNotification({ type: 'success', message: 'Certificate updated successfully!' });
      } else {
        await certificateAPI.create(formData);
        setNotification({ type: 'success', message: 'Certificate created successfully!' });
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl font-bold">Certificates & Credentials</h1>
          <p className="text-xs text-slate-500">Manage professional licenses and verified credentials</p>
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

      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
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
                <th className="px-6 py-3.5">Image</th>
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5">Issuer</th>
                <th className="px-6 py-3.5">Year</th>
                <th className="px-6 py-3.5">Verification</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {certificates.map((cert) => (
                <tr key={cert._id} className="hover:bg-slate-50/50 dark:hover:bg-nebula-800/40 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-nebula-800 flex-shrink-0">
                      <img
                        src={cert.image || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=200&q=80'}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white font-display text-sm">
                    {cert.title}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-aurora-cyan uppercase font-semibold">
                    {cert.issuer}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-500">
                    {cert.issueDate}
                  </td>
                  <td className="px-6 py-3.5">
                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-aurora-cyan hover:underline"
                      >
                        <span>Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 font-mono">—</span>
                    )}
                  </td>
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

      {/* Modal */}
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

            <h2 className="font-display text-xl font-bold mb-1">
              {editingId ? 'Edit Certificate' : 'Add Certificate'}
            </h2>
            <p className="text-xs text-slate-500 mb-6">License or credential verification details</p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-slate-500 mb-1">Certificate Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. AWS Certified Cloud Practitioner"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-slate-500 mb-1">Issuing Authority *</label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono text-slate-500 mb-1">Issue Date / Year *</label>
                  <input
                    type="text"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    placeholder="e.g. 2023"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-500 mb-1">Credential URL</label>
                <input
                  type="text"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-500 mb-1">Badge / Certificate Image</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... or upload"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-xs font-mono"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-aurora-cyan/10 text-aurora-cyan border border-aurora-cyan/30 text-xs font-mono font-medium hover:bg-aurora-cyan/20">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
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
                  className="px-6 py-2 rounded-xl font-medium font-mono text-white bg-aurora-cyan hover:opacity-90 shadow-md transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Certificate' : 'Create Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
