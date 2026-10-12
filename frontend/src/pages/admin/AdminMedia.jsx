import React, { useState } from 'react';
import { Plus, Trash2, Play, ExternalLink, CheckCircle2, AlertCircle, X, Upload } from 'lucide-react';
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
        setNotification({ type: 'success', message: 'Thumbnail uploaded!' });
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
      setNotification({ type: 'success', message: 'Media item added!' });
      setModalOpen(false);
      setFormData(initialForm);
      await refreshData();
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create.',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold">Media & Videos</h1>
          <p className="text-xs text-zinc-500">Manage tutorial and walkthrough videos</p>
        </div>
        <button
          onClick={() => {
            setFormData(initialForm);
            setModalOpen(true);
          }}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium text-xs font-mono bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Video</span>
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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {media.map((item) => (
          <div
            key={item._id}
            className="rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col"
          >
            <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
              <img
                src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=600&q=80'}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 p-1 rounded bg-black/60 text-white">
                <Play className="w-3 h-3 fill-current" />
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h4 className="font-display font-bold text-sm text-zinc-900 dark:text-white line-clamp-1 mb-1">
                {item.title}
              </h4>
              <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
                {item.caption || 'No caption'}
              </p>

              <div className="mt-auto pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-blue-500"
                >
                  <span>Watch</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => handleDelete(item._id, item.title)}
                  type="button"
                  className="p-1 rounded text-rose-500 hover:bg-rose-500/10"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-6">
            <button
              onClick={() => setModalOpen(false)}
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-display text-lg font-bold mb-1">New Media Item</h2>
            <p className="text-xs text-zinc-500 mb-4">Video or tutorial link</p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-zinc-500 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-500 mb-1">Video Link *</label>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-500 mb-1">Thumbnail URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingThumb ? '...' : 'Upload'}</span>
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
                <label className="block font-mono text-zinc-500 mb-1">Caption</label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                />
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
                  {submitting ? 'Saving...' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
