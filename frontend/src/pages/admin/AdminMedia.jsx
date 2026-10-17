import React, { useState } from 'react';
import { Plus, Trash2, Video, Play, ExternalLink, CheckCircle2, AlertCircle, X, Upload } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { mediaAPI, uploadAPI } from '../../services/api';

export const AdminMedia = () => {
  const { media, refreshData } = usePortfolio();
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    title: '',
    type: 'youtube',
    url: '',
    thumbnailUrl: '',
    caption: '',
    order: 0,
  };

  const [formData, setFormData] = useState(initialForm);

  const handleThumbUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingThumb(true);
      const res = await uploadAPI.uploadImage(file);
      if (res.data?.success && res.data.url) {
        setFormData((prev) => ({ ...prev, thumbnailUrl: res.data.url }));
        setNotification({
          type: 'success',
          message: `Thumbnail uploaded via ${res.data.provider || 'cloud storage'}!`,
        });
      }
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to upload image.',
      });
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    try {
      await mediaAPI.create(formData);
      setNotification({ type: 'success', message: 'Media item added successfully!' });
      setModalOpen(false);
      setFormData(initialForm);
      await refreshData();
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create media item.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      try {
        await mediaAPI.delete(id);
        setNotification({ type: 'success', message: 'Media item deleted!' });
        await refreshData();
      } catch (err) {
        console.error(err);
        setNotification({ type: 'error', message: 'Failed to delete.' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl font-bold">Media & Videos Manager</h1>
          <p className="text-xs text-slate-500">Add YouTube tutorials, walkthrough videos, or creative media</p>
        </div>
        <button
          onClick={() => {
            setFormData(initialForm);
            setModalOpen(true);
          }}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs font-mono bg-aurora-cyan text-white hover:opacity-90 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media Item</span>
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

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {media.map((item) => (
          <div
            key={item._id}
            className="rounded-2xl overflow-hidden bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 shadow-sm flex flex-col"
          >
            <div className="relative aspect-video bg-slate-100 dark:bg-nebula-800">
              <img
                src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=600&q=80'}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white">
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                {item.caption || 'No caption'}
              </p>

              <div className="mt-auto pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-aurora-cyan hover:underline"
                >
                  <span>Watch</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => handleDelete(item._id, item.title)}
                  type="button"
                  className="p-1.5 rounded-lg border border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
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

            <h2 className="font-display text-xl font-bold mb-1">Add Media Item</h2>
            <p className="text-xs text-slate-500 mb-6">YouTube video, walkthrough, or tutorial</p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-slate-500 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Building MERN Full Stack App"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-500 mb-1">Video or Media Link *</label>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-500 mb-1">Thumbnail Image</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="https://... or upload"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-xs font-mono"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-aurora-cyan/10 text-aurora-cyan border border-aurora-cyan/30 text-xs font-mono font-medium hover:bg-aurora-cyan/20">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingThumb ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-500 mb-1">Caption / Summary</label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm"
                />
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
                  {submitting ? 'Saving...' : 'Add Media'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
