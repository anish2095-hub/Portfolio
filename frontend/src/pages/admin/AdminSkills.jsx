import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { skillAPI } from '../../services/api';

export const AdminSkills = () => {
  const { skills, refreshData } = usePortfolio();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    name: '',
    category: 'frontend',
    proficiency: 85,
    description: '',
    icon: 'Code',
  };

  const [formData, setFormData] = useState(initialForm);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingId(skill._id);
    setFormData({
      name: skill.name || '',
      category: skill.category || 'frontend',
      proficiency: skill.proficiency || 85,
      description: skill.description || '',
      icon: skill.icon || 'Code',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    try {
      if (editingId) {
        await skillAPI.update(editingId, formData);
        setNotification({ type: 'success', message: 'Skill updated!' });
      } else {
        await skillAPI.create(formData);
        setNotification({ type: 'success', message: 'Skill created!' });
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

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete skill "${name}"?`)) {
      try {
        await skillAPI.delete(id);
        setNotification({ type: 'success', message: 'Skill deleted!' });
        await refreshData();
      } catch (err) {
        console.error(err);
        setNotification({ type: 'error', message: 'Failed to delete skill.' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold">Skills</h1>
          <p className="text-xs text-zinc-500">Manage technical stack proficiencies</p>
        </div>
        <button
          onClick={openAddModal}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium text-xs font-mono bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Skill</span>
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
                <th className="px-5 py-3">Skill Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Proficiency</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {skills.map((s) => (
                <tr key={s._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="px-5 py-3 font-bold text-zinc-900 dark:text-white">
                    {s.name}
                  </td>
                  <td className="px-5 py-3 font-mono text-[11px] uppercase text-zinc-500">
                    {s.category}
                  </td>
                  <td className="px-5 py-3 w-40">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
                          style={{ width: `${s.proficiency}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-zinc-500 min-w-[2.5rem]">
                        {s.proficiency}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 max-w-xs text-zinc-500 truncate">
                    {s.description || '—'}
                  </td>
                  <td className="px-5 py-3 text-right space-x-1.5">
                    <button
                      onClick={() => openEditModal(s)}
                      type="button"
                      className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id, s.name)}
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
              {editingId ? 'Edit Skill' : 'New Skill'}
            </h2>
            <p className="text-xs text-zinc-500 mb-4">Set proficiency and details</p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-zinc-500 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. React.js"
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
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="devops">DevOps & Cloud</option>
                  <option value="tools">Tools</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-mono text-zinc-500">Proficiency</label>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300 font-bold">{formData.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-500 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Hooks, context, virtual dom..."
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
