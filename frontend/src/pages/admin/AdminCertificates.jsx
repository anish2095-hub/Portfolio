import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, CheckCircle2, AlertCircle, X, ExternalLink } from 'lucide-react';
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
        setNotification({ type: 'success', message: 'Badge image uploaded!' });
      }
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to upload.',
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
        setNotification({ type: 'success', message: 'Certificate updated!' });
      } else {
        await certificateAPI.create(formData);
        setNotification({ type: 'success', message: 'Certificate created!' });
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
        setNotification({ type: 'success', message: 'Certificate deleted!' });
        await refreshData();
      } catch (err) {
        console.error(err);
        setNotification({ type: 'error', message: 'Failed to delete.' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold">Certificates</h1>
          <p className="text-xs text-zinc-500">Manage credentials and licenses</p>
        </div>
        <button
          onClick={openAddModal}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium text-xs font-mono bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Certificate</span>
        </button>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
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
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 font-mono uppercase text-zinc-500 text-[11px]">
              <tr>
                <th className="px-5 py-3">Badge</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Issuer</th>
                <th className="px-5 py-3">Year</th>
                <th className="px-5 py-3">Link</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {certificates.map((cert) => (
                <tr key={cert._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="w-10 h-8 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                      <img
                        src={cert.image || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=200&q=80'}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3 font-bold text-zinc-900 dark:text-white">
                    {cert.title}
                  </td>
                  <td className="px-5 py-3 font-mono text-[11px] text-zinc-500 uppercase">
                    {cert.issuer}
                  </td>
                  <td className="px-5 py-3 font-mono text-zinc-500">
                    {cert.issueDate}
                  </td>
                  <td className="px-5 py-3">
                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-blue-500"
                      >
                        <span>Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-zinc-400 font-mono">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right space-x-1.5">
                    <button
                      onClick={() => openEditModal(cert)}
                      type="button"
                      className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cert._id, cert.title)}
                      type="button"
                      className="p-1.5 rounded border border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                      title="Delete"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-6">
            <button
              onClick={() => setModalOpen(false)}
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-display text-lg font-bold mb-1">
              {editingId ? 'Edit Certificate' : 'New Certificate'}
            </h2>
            <p className="text-xs text-zinc-500 mb-4">Credentials & license details</p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-zinc-500 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="AWS Certified Cloud Practitioner"
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-zinc-500 mb-1">Issuer *</label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="Amazon Web Services"
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                  />
                </div>

                <div>
                  <label className="block font-mono text-zinc-500 mb-1">Year *</label>
                  <input
                    type="text"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    placeholder="2023"
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-zinc-500 mb-1">Credential URL</label>
                <input
                  type="text"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-500 mb-1">Image URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-zinc-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg font-medium font-mono text-xs text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
