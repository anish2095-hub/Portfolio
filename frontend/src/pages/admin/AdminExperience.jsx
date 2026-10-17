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
        setNotification({ type: 'success', message: 'Timeline item updated successfully!' });
      } else {
        await experienceAPI.create(payload);
        setNotification({ type: 'success', message: 'Timeline item created successfully!' });
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
    if (window.confirm(`Delete "${role}" from timeline?`)) {
      try {
        await experienceAPI.delete(id);
        setNotification({ type: 'success', message: 'Item deleted successfully!' });
        await refreshData();
      } catch (err) {
        console.error(err);
        setNotification({ type: 'error', message: 'Failed to delete item.' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl font-bold">Experience & Education Manager</h1>
          <p className="text-xs text-slate-500">Manage career history, education background, and milestones</p>
        </div>
        <button
          onClick={openAddModal}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs font-mono bg-aurora-cyan text-white hover:opacity-90 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Timeline Record</span>
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
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Role / Degree</th>
                <th className="px-6 py-3.5">Organization</th>
                <th className="px-6 py-3.5">Period</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {experiences.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-nebula-800/40 transition-colors">
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-full border ${
                        item.type === 'work'
                          ? 'bg-aurora-cyan/10 text-aurora-cyan border-aurora-cyan/20'
                          : 'bg-aurora-violet/10 text-aurora-violet border-aurora-violet/20'
                      }`}
                    >
                      {item.type === 'work' ? (
                        <Briefcase className="w-3 h-3" />
                      ) : (
                        <GraduationCap className="w-3 h-3" />
                      )}
                      <span className="uppercase">{item.type}</span>
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white font-display text-sm">
                    {item.role}
                  </td>
                  <td className="px-6 py-3.5 text-slate-700 dark:text-slate-300">
                    {item.organization}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-500">
                    {item.period}
                  </td>
                  <td className="px-6 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      type="button"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:border-aurora-cyan text-slate-600 dark:text-slate-400 hover:text-aurora-cyan"
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.role)}
                      type="button"
                      className="p-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-500"
                      title="Delete Item"
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
              {editingId ? 'Edit Record' : 'Add Timeline Record'}
            </h2>
            <p className="text-xs text-slate-500 mb-6">Career experience or academic qualification</p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-slate-500 mb-1">Record Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm"
                  >
                    <option value="work">Work Experience</option>
                    <option value="education">Education & Degree</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-slate-500 mb-1">Period *</label>
                  <input
                    type="text"
                    required
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="e.g. 2023 - Present"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-500 mb-1">Role / Degree Title *</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-slate-500 mb-1">Company / University *</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. HyperScale Labs"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono text-slate-500 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA / Remote"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-500 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-500 mb-1">
                  Key Achievements / Highlights (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Reduced query latencies by 42%&#10;Spearheaded React transition..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs"
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
                  {submitting ? 'Saving...' : editingId ? 'Update Record' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
