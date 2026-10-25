import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Cpu,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Layers,
  Save,
  Sliders,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { skillAPI, profileAPI } from '../../services/api';

export const AdminSkills = () => {
  const { skills, profile, refreshData } = usePortfolio();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingHeader, setSavingHeader] = useState(false);

  // Section Header States (Editable from Admin)
  const [headerBadge, setHeaderBadge] = useState('// My Tech Arsenal');
  const [headerTitle, setHeaderTitle] = useState('Skills & Expertise');
  const [headerDesc, setHeaderDesc] = useState(
    'A comprehensive overview of technologies, frameworks, and modern tools I leverage to build resilient applications.'
  );

  // Filtering & Search
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const initialForm = {
    name: '',
    category: 'frontend',
    proficiency: 85,
    description: '',
    icon: 'Code',
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (profile) {
      if (profile.skillsHeaderBadge) setHeaderBadge(profile.skillsHeaderBadge);
      if (profile.skillsHeaderTitle) setHeaderTitle(profile.skillsHeaderTitle);
      if (profile.skillsHeaderDescription) setHeaderDesc(profile.skillsHeaderDescription);
    }
  }, [profile]);

  const categories = [
    { id: 'all', name: 'All Skills' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'database', name: 'Database' },
    { id: 'devops', name: 'DevOps & Cloud' },
    { id: 'tools', name: 'Tools' },
  ];

  const handleSaveHeader = async (e) => {
    e.preventDefault();
    setSavingHeader(true);
    setNotification(null);
    try {
      await profileAPI.updateProfile({
        skillsHeaderBadge: headerBadge,
        skillsHeaderTitle: headerTitle,
        skillsHeaderDescription: headerDesc,
      });
      setNotification({
        type: 'success',
        message: 'Skills section header & description updated successfully!',
      });
      await refreshData();
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update section header.',
      });
    } finally {
      setSavingHeader(false);
    }
  };

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

  const filteredSkills = (skills || []).filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl font-bold">Skills & Tech Arsenal Manager</h1>
          <p className="text-xs text-slate-500">
            Edit section headings, description, categories, and technical proficiencies
          </p>
        </div>
        <button
          onClick={openAddModal}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs font-mono bg-gradient-to-r from-aurora-cyan to-aurora-violet text-white hover:opacity-95 shadow-md shadow-aurora-cyan/20 transition-all"
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

      {/* 1. SECTION HEADER & DESCRIPTION SETTINGS */}
      <form
        onSubmit={handleSaveHeader}
        className="p-6 rounded-2xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 shadow-sm space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-aurora-cyan/15 text-aurora-cyan">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base">Section Headings & Description</h3>
              <p className="text-xs text-slate-500">
                Change the title, badge, and tagline that appears above the skills grid
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingHeader}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs font-mono bg-aurora-cyan text-white hover:opacity-90 shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingHeader ? 'Saving...' : 'Save Section Header'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">
              Section Super-Title Badge
            </label>
            <input
              type="text"
              value={headerBadge}
              onChange={(e) => setHeaderBadge(e.target.value)}
              placeholder="// My Tech Arsenal"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">
              Section Main Heading
            </label>
            <input
              type="text"
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
              placeholder="Skills & Expertise"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-500 mb-1">
            Section Subtitle / Description Text
          </label>
          <textarea
            rows={2}
            value={headerDesc}
            onChange={(e) => setHeaderDesc(e.target.value)}
            placeholder="A comprehensive overview of technologies, frameworks, and modern tools I leverage to build resilient applications."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm leading-relaxed"
          />
        </div>
      </form>

      {/* 2. SKILLS LIST & FILTERS */}
      <div className="rounded-2xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm space-y-4 p-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-nebula-900 border border-slate-200 dark:border-white/10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-aurora-cyan to-aurora-violet text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-xs text-white placeholder-slate-500"
            />
          </div>
        </div>

        {/* Skills Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-nebula-900 border-b border-slate-200 dark:border-white/10 font-mono uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Skill Name</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Proficiency</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-xs">
                    No skills found matching your filter or search query.
                  </td>
                </tr>
              ) : (
                filteredSkills.map((s) => (
                  <tr
                    key={s._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-nebula-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white font-display text-sm">
                      {s.name}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 uppercase text-aurora-cyan">
                        {s.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 w-44">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 dark:bg-nebula-900 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-aurora-cyan to-aurora-violet h-full rounded-full"
                            style={{ width: `${s.proficiency}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-aurora-cyan font-bold min-w-[2.5rem]">
                          {s.proficiency}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs text-slate-400 truncate">
                      {s.description || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(s)}
                        type="button"
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:border-aurora-cyan text-slate-400 hover:text-aurora-cyan transition-colors"
                        title="Edit Skill"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id, s.name)}
                        type="button"
                        className="p-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-500 transition-colors"
                        title="Delete Skill"
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

      {/* Add / Edit Skill Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-nebula-900 border border-white/15 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setModalOpen(false)}
              type="button"
              className="absolute top-6 right-6 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-xl font-bold mb-1 text-white">
              {editingId ? 'Edit Skill Details' : 'Add New Skill'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Specify technology name, category, and proficiency level
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-slate-400 mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. React.js, Node.js, MongoDB, Git"
                  className="w-full px-4 py-2.5 rounded-xl bg-nebula-950 border border-white/10 text-sm text-white"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-400 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-nebula-950 border border-white/10 text-sm text-white"
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
                  <label className="font-mono text-slate-400">Proficiency Rating</label>
                  <span className="font-mono text-aurora-cyan font-bold">
                    {formData.proficiency}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) =>
                    setFormData({ ...formData, proficiency: Number(e.target.value) })
                  }
                  className="w-full accent-aurora-cyan cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-400 mb-1">Icon Identifier</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Atom, React, Server, Node, Database, Git, Code..."
                  className="w-full px-4 py-2.5 rounded-xl bg-nebula-950 border border-white/10 text-sm font-mono text-xs text-white"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-400 mb-1">
                  Skill Description / Subtext
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Hooks, Suspense, State Management, High-performance APIs..."
                  className="w-full px-4 py-2.5 rounded-xl bg-nebula-950 border border-white/10 text-sm text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl font-medium font-mono text-white bg-gradient-to-r from-aurora-cyan to-aurora-violet hover:opacity-95 shadow-md shadow-aurora-cyan/20 transition-all disabled:opacity-50"
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
