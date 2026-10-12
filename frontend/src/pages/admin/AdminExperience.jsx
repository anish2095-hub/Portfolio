import React, { useState } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, Briefcase, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { experienceAPI } from '../../services/api';

export const AdminExperience = () => {
  const { experiences, refreshData } = usePortfolio();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    type: 'work',
    role: '',
    organization: '',
    organizationUrl: '',
    location: '',
    period: '',
    current: false,
    description: '',
    highlights: '',
    order: 0,
  };

  const [formData, setFormData] = useState(initialForm);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setFormData({
      type: item.type || 'work',
      role: item.role || '',
      organization: item.organization || '',
      organizationUrl: item.organizationUrl || '',
      location: item.location || '',
      period: item.period || '',
      current: !!item.current,
      description: item.description || '',
      highlights: Array.isArray(item.highlights) ? item.highlights.join('\n') : '',
      order: item.order || 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    const payload = {
      ...formData,
      highlights: formData.highlights
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await experienceAPI.update(editingId, payload);
        setNotification({ type: 'success', message: 'Record updated!' });
      } else {
        await experienceAPI.create(payload);
        setNotification({ type: 'success', message: 'Record created!' });
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

  const handleDelete = async (id, role) => {
    if (window.confirm(`Delete "${role}"?`)) {
      try {
        await experienceAPI.delete(id);
        setNotification({ type: 'success', message: 'Record deleted!' });
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
          <h1 className="font-display text-xl sm:text-2xl font-bold">Experience & Education</h1>
          <p className="text-xs text-zinc-500">Manage timeline history</p>
        </div>
        <button
          onClick={openAddModal}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium text-xs font-mono bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Record</span>
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
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Role / Degree</th>
                <th className="px-5 py-3">Organization</th>
                <th className="px-5 py-3">Period</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {experiences.map((item) => (
                <tr key={item._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="px-5 py-3">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 uppercase text-zinc-600 dark:text-zinc-400">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-bold text-zinc-900 dark:text-white">
                    {item.role}
                  </td>
                  <td className="px-5 py-3 text-zinc-600 dark:text-zinc-300">
                    {item.organization}
                  </td>
                  <td className="px-5 py-3 font-mono text-zinc-500">
                    {item.period}
                  </td>
                  <td className="px-5 py-3 text-right space-x-1.5">
                    <button
                      onClick={() => openEditModal(item)}
                      type="button"
                      className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.role)}
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
              {editingId ? 'Edit Record' : 'New Timeline Record'}
            </h2>
            <p className="text-xs text-zinc-500 mb-4">Role or academic qualification</p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-zinc-500 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                  >
                    <option value="work">Work</option>
                    <option value="education">Education</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-zinc-500 mb-1">Period *</label>
                  <input
                    type="text"
                    required
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="2023 - Present"
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-zinc-500 mb-1">Role / Degree *</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-500 mb-1">Organization *</label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-500 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-500 mb-1">
                  Highlights (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs"
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
