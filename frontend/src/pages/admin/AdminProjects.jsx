import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Star, Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { projectAPI, uploadAPI } from '../../services/api';

export const AdminProjects = () => {
  const { projects, refreshData } = usePortfolio();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    title: '',
    category: 'fullstack',
    summary: '',
    description: '',
    coverImage: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    order: 0,
  };

  const [formData, setFormData] = useState(initialForm);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title || '',
      category: project.category || 'fullstack',
      summary: project.summary || '',
      description: project.description || '',
      coverImage: project.coverImage || '',
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(', ')
        : '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: !!project.featured,
      order: project.order || 0,
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
        setFormData((prev) => ({ ...prev, coverImage: res.data.url }));
        setNotification({
          type: 'success',
          message: 'Cover image uploaded!',
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

    const payload = {
      ...formData,
      technologies: formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await projectAPI.update(editingId, payload);
        setNotification({ type: 'success', message: 'Project updated!' });
      } else {
        await projectAPI.create(payload);
        setNotification({ type: 'success', message: 'Project created!' });
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
    if (window.confirm(`Delete "${title}"?`)) {
      try {
        await projectAPI.delete(id);
        setNotification({ type: 'success', message: 'Project deleted!' });
        await refreshData();
      } catch (err) {
        console.error(err);
        setNotification({ type: 'error', message: 'Failed to delete project.' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold">Projects</h1>
          <p className="text-xs text-zinc-500">Manage showcase applications</p>
        </div>
        <button
          onClick={openAddModal}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium text-xs font-mono bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
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

      {/* Projects Table */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 font-mono uppercase text-zinc-500 text-[11px]">
              <tr>
                <th className="px-5 py-3">Cover</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Featured</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-zinc-400 font-mono">
                    No projects found. Click "New Project" to create one.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-12 h-9 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                        <img
                          src={p.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=200&q=80'}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-5 py-3 max-w-xs">
                      <p className="font-bold text-zinc-900 dark:text-white">
                        {p.title}
                      </p>
                      <p className="text-zinc-500 line-clamp-1">{p.summary}</p>
                    </td>
                    <td className="px-5 py-3 font-mono text-[11px] uppercase text-zinc-500">
                      {p.category}
                    </td>
                    <td className="px-5 py-3 font-mono text-[11px]">
                      {p.featured ? (
                        <span className="text-amber-500 font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Yes</span>
                        </span>
                      ) : (
                        <span className="text-zinc-400">No</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right space-x-1.5">
                      <button
                        onClick={() => openEditModal(p)}
                        type="button"
                        className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id, p.title)}
                        type="button"
                        className="p-1.5 rounded border border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-6">
            <button
              onClick={() => setModalOpen(false)}
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-display text-lg font-bold mb-1">
              {editingId ? 'Edit Project' : 'New Project'}
            </h2>
            <p className="text-xs text-zinc-500 mb-4">Fill in project details</p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="block font-mono text-zinc-500 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                  >
                    <option value="fullstack">Full Stack</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="mobile">Mobile</option>
                    <option value="ai-cloud">AI & Cloud</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-zinc-500 mb-1">Short Summary *</label>
                <input
                  type="text"
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="One sentence summary"
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-500 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-500 mb-1">Cover Image URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
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

              <div>
                <label className="block font-mono text-zinc-500 mb-1">
                  Technologies (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, Node.js, Express, MongoDB"
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-zinc-500 mb-1">Demo URL</label>
                  <input
                    type="text"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-mono text-zinc-500 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-zinc-900"
                  />
                  <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    Feature on homepage
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-zinc-500 hover:text-zinc-800"
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
