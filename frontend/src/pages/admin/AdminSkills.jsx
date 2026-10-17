import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Cpu, CheckCircle2, AlertCircle, X } from 'lucide-react';
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
        setNotification({ type: 'success', message: 'Skill updated successfully!' });
      } else {
        await skillAPI.create(formData);
        setNotification({ type: 'success', message: 'New skill created successfully!' });
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
        setNotification({ type: 'success', message: 'Skill deleted successfully!' });
        await refreshData();
      } catch (err) {
        console.error(err);
        setNotification({ type: 'error', message: 'Failed to delete skill.' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl font-bold">Skills Manager</h1>
          <p className="text-xs text-slate-500">Add, edit, or adjust technical expertise & proficiencies</p>
        </div>
        <button
          onClick={openAddModal}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs font-mono bg-aurora-cyan text-white hover:opacity-90 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
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

      {/* Skills Table */}
      <div className="rounded-2xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-nebula-900 border-b border-slate-200 dark:border-white/5 font-mono uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Skill Name</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Proficiency</th>
                <th className="px-6 py-3.5">Description</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {skills.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50/50 dark:hover:bg-nebula-800/40 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-900 dark:text-white font-display text-sm">
                    {s.name}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-nebula-800 border border-slate-200 dark:border-white/10 uppercase">
                      {s.category}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 w-48">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 dark:bg-nebula-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-aurora-cyan h-full rounded-full"
                          style={{ width: `${s.proficiency}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-aurora-cyan font-bold min-w-[2.5rem]">
                        {s.proficiency}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 max-w-xs text-slate-500 truncate">
                    {s.description || '—'}
                  </td>
                  <td className="px-6 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(s)}
                      type="button"
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:border-aurora-cyan text-slate-600 dark:text-slate-400 hover:text-aurora-cyan"
                      title="Edit Skill"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id, s.name)}
                      type="button"
                      className="p-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-500"
                      title="Delete Skill"
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
              {editingId ? 'Edit Skill' : 'Add New Skill'}
            </h2>
            <p className="text-xs text-slate-500 mb-6">Specify technology details and proficiency rating</p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-slate-500 mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. React.js, Node.js, MongoDB"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-500 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm"
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
                  <label className="font-mono text-slate-500">Proficiency Rating</label>
                  <span className="font-mono text-aurora-cyan font-bold">{formData.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
                  className="w-full accent-aurora-cyan cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-500 mb-1">Icon Identifier</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="React, Database, Server, Cloud, Code..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-500 mb-1">Brief Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Hooks, Redux, Context, Performance..."
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
                  {submitting ? 'Saving...' : editingId ? 'Update Skill' : 'Create Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
