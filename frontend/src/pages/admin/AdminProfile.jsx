import React, { useState, useEffect } from 'react';
import { Save, Upload, CheckCircle2, AlertCircle, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { profileAPI, uploadAPI } from '../../services/api';

export const AdminProfile = () => {
  const { profile, refreshData } = usePortfolio();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    typingRoles: '',
    tagline: '',
    avatar: '',
    bio: '',
    location: '',
    email: '',
    phone: '',
    degree: '',
    experienceYears: '',
    availability: '',
    resumeUrl: '',
    github: '',
    linkedin: '',
    twitter: '',
    youtube: '',
    instagram: '',
  });

  const [statsList, setStatsList] = useState([
    { label: 'Completed Projects', value: '35+' },
    { label: 'Years Experience', value: '2+ years' },
    { label: 'GitHub Repositories', value: '80+' },
    { label: 'Happy Clients', value: '20+' },
  ]);

  const [techPillars, setTechPillars] = useState([
    {
      id: 'frontend',
      label: 'Frontend',
      tagline: 'Pixel-perfect, high-performance UI',
      metric: '60fps Fluid UI',
      tools: 'React 19, TailwindCSS, Framer Motion, Vite, Responsive Design',
    },
    {
      id: 'backend',
      label: 'Backend',
      tagline: 'Robust & secure API architecture',
      metric: '<40ms API Latency',
      tools: 'Node.js, Express.js, REST APIs, JWT Auth, Middleware',
    },
    {
      id: 'database',
      label: 'Database',
      tagline: 'Scalable data models & indexing',
      metric: 'Zero Data Loss',
      tools: 'MongoDB Atlas, Mongoose ORM, Schema Design, Data Validation',
    },
    {
      id: 'cloud',
      label: 'Cloud & Deploy',
      tagline: 'Continuous delivery & reliability',
      metric: '99.9% Uptime',
      tools: 'Vercel, Render, Git & GitHub, ImgBB / Cloudinary API',
    },
  ]);
  const [telemetryText, setTelemetryText] = useState('Full-Stack Ready • Diploma CSE');
  const [activePillarTab, setActivePillarTab] = useState('frontend');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (profile) {
      const cleanAvatar =
        profile.avatar && !profile.avatar.includes('photo-1534528741775-53994a69daeb')
          ? profile.avatar
          : '/pfp.jpeg';

      setFormData({
        name: profile.name || 'Anish Singh',
        title: profile.title || 'Full Stack MERN Developer & Aspiring Software Engineer',
        typingRoles: Array.isArray(profile.typingRoles)
          ? profile.typingRoles.join(', ')
          : '',
        tagline: profile.tagline || '',
        avatar: cleanAvatar,
        bio: profile.bio || '',
        location: profile.location || 'Gaya ji, Bihar',
        email: profile.email || 'anishsingh2095@gmail.com',
        phone: profile.phone || '+91 9334398322',
        degree: profile.degree || 'Diploma in Computer Science',
        experienceYears: profile.experienceYears || '2+ years',
        availability: profile.availability || 'Available for Full-time Roles & High-Impact Contracts',
        resumeUrl: profile.resumeUrl || '',
        github: profile.socialLinks?.github || '',
        linkedin: profile.socialLinks?.linkedin || '',
        twitter: profile.socialLinks?.twitter || '',
        youtube: profile.socialLinks?.youtube || '',
        instagram: profile.socialLinks?.instagram || '',
      });

      if (profile.stats && profile.stats.length > 0) {
        setStatsList(
          profile.stats.map((s) => ({
            label: s.label || '',
            value: s.value || '',
          }))
        );
      }

      if (profile.techPillars && profile.techPillars.length > 0) {
        setTechPillars((prev) =>
          prev.map((defPillar) => {
            const found = profile.techPillars.find((p) => p.id === defPillar.id);
            if (!found) return defPillar;
            return {
              id: defPillar.id,
              label: found.label || defPillar.label,
              tagline: found.tagline || defPillar.tagline,
              metric: found.metric || defPillar.metric,
              tools: Array.isArray(found.tools)
                ? found.tools.join(', ')
                : (found.tools || defPillar.tools),
            };
          })
        );
      }
      if (profile.telemetryText) {
        setTelemetryText(profile.telemetryText);
      }
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image Upload handler (ImgBB / Cloudinary / Fallback)
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadAPI.uploadImage(file);
      if (res.data?.success && res.data.url) {
        setFormData((prev) => ({ ...prev, avatar: res.data.url }));
        setNotification({
          type: 'success',
          message: `Avatar uploaded successfully via ${res.data.provider || 'cloud storage'}!`,
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

  const handleStatChange = (index, field, value) => {
    setStatsList((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleAddStat = () => {
    setStatsList((prev) => [...prev, { label: 'New Metric', value: '10+' }]);
  };

  const handleRemoveStat = (index) => {
    setStatsList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      const payload = {
        name: formData.name,
        title: formData.title,
        typingRoles: formData.typingRoles
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean),
        tagline: formData.tagline,
        avatar: formData.avatar,
        bio: formData.bio,
        location: formData.location,
        email: formData.email,
        phone: formData.phone,
        degree: formData.degree,
        experienceYears: formData.experienceYears,
        availability: formData.availability,
        resumeUrl: formData.resumeUrl,
        stats: statsList.filter((s) => s.label.trim() || s.value.trim()),
        telemetryText,
        techPillars: techPillars.map((p) => ({
          id: p.id,
          label: p.label,
          tagline: p.tagline,
          metric: p.metric,
          tools:
            typeof p.tools === 'string'
              ? p.tools
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
              : p.tools,
        })),
        socialLinks: {
          github: formData.github,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          youtube: formData.youtube,
          instagram: formData.instagram,
        },
      };

      const res = await profileAPI.updateProfile(payload);
      if (res.data?.success) {
        setNotification({ type: 'success', message: 'Profile details updated successfully!' });
        await refreshData();
      }
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="font-display text-2xl font-bold">Profile & Biography</h1>
          <p className="text-xs text-slate-500">Edit your public details, bio, links, and avatar image</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          type="button"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-xs font-mono bg-aurora-cyan text-white hover:opacity-90 shadow-md transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Section */}
        <div className="p-6 rounded-2xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 shadow-sm">
          <h3 className="font-display font-bold text-base mb-4">Profile Avatar Photo</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-nebula-800 border border-slate-200 dark:border-white/10 flex-shrink-0">
              <img
                src={
                  formData.avatar && !formData.avatar.includes('photo-1534528741775-53994a69daeb')
                    ? formData.avatar
                    : '/pfp.jpeg'
                }
                alt="Avatar Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/pfp.jpeg';
                }}
              />
            </div>
            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-xs font-mono"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-aurora-cyan/10 hover:bg-aurora-cyan/20 text-aurora-cyan border border-aurora-cyan/30 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? 'Uploading Image...' : 'Upload Avatar File (ImgBB / Cloudinary)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-slate-400">JPG, PNG, WEBP up to 10MB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="p-6 rounded-2xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base">Hero & Personal Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">Professional Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">
              Typewriter Cycling Roles (Separate with commas)
            </label>
            <input
              type="text"
              name="typingRoles"
              value={formData.typingRoles}
              onChange={handleChange}
              placeholder="Full Stack Developer, MERN Architect, UI/UX Designer, Open Source Contributor"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              These will type out automatically on the Hero section with cursor effect.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">Hero Tagline</label>
            <textarea
              name="tagline"
              rows={2}
              value={formData.tagline}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">Detailed About Bio</label>
            <textarea
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm"
            />
          </div>
        </div>

        {/* Fact Attributes */}
        <div className="p-6 rounded-2xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base">Key Attributes & Contact Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">Experience Years</label>
              <input
                type="text"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">Availability</label>
              <input
                type="text"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">Resume / CV Download URL</label>
            <input
              type="text"
              name="resumeUrl"
              value={formData.resumeUrl}
              onChange={handleChange}
              placeholder="https://drive.google.com/... or /resume.pdf"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs"
            />
          </div>
        </div>

        {/* Hero Quick Statistics / Metrics Manager */}
        <div className="p-6 rounded-2xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
            <div>
              <h3 className="font-display font-bold text-base flex items-center gap-2">
                <span className="text-aurora-cyan">📊</span>
                <span>Hero Metrics & Statistics Cards</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize both the numbers/values and labels displayed on the homepage below your bio.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddStat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-aurora-cyan/15 hover:bg-aurora-cyan/25 text-aurora-cyan border border-aurora-cyan/30 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Metric Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsList.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Card #{idx + 1}
                  </span>
                  {statsList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStat(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Remove this metric card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">
                    Value / Number
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    placeholder="e.g. 35+, 2+ years"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-nebula-950 border border-slate-200 dark:border-white/10 text-sm font-bold text-white font-display"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">
                    Label / Description
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    placeholder="e.g. Completed Projects"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-nebula-950 border border-slate-200 dark:border-white/10 text-xs text-slate-300 font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Tech Pillars Editor (Hero Showcase) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-base flex items-center gap-2">
                <span className="text-aurora-cyan">⚡</span>
                <span>Interactive Tech Pillars (Hero Showcase)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the 4 interactive categories, tags, performance badges, and tools displayed on the homepage Hero card.
              </p>
            </div>
          </div>

          {/* Tab selector for the 4 pillars */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-nebula-900 border border-slate-200 dark:border-white/10">
            {techPillars.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePillarTab(p.id)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                  activePillarTab === p.id
                    ? 'bg-gradient-to-r from-aurora-cyan to-aurora-violet text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {p.label || p.id}
              </button>
            ))}
          </div>

          {/* Active Pillar Fields */}
          {(() => {
            const current = techPillars.find((p) => p.id === activePillarTab) || techPillars[0];
            const updateCurrent = (field, val) => {
              setTechPillars((prev) =>
                prev.map((item) =>
                  item.id === current.id ? { ...item, [field]: val } : item
                )
              );
            };

            return (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">
                      Pillar Display Name / Tab Label
                    </label>
                    <input
                      type="text"
                      value={current.label}
                      onChange={(e) => updateCurrent('label', e.target.value)}
                      placeholder="e.g. Frontend"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-nebula-950 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">
                      Performance Metric Badge
                    </label>
                    <input
                      type="text"
                      value={current.metric}
                      onChange={(e) => updateCurrent('metric', e.target.value)}
                      placeholder="e.g. 60fps Fluid UI, <40ms Latency"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-nebula-950 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">
                    Tagline / Specialty Focus Description
                  </label>
                  <input
                    type="text"
                    value={current.tagline}
                    onChange={(e) => updateCurrent('tagline', e.target.value)}
                    placeholder="e.g. Pixel-perfect, high-performance UI"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-nebula-950 border border-slate-200 dark:border-white/10 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-1">
                    Technologies / Tools (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={current.tools}
                    onChange={(e) => updateCurrent('tools', e.target.value)}
                    placeholder="e.g. React 19, TailwindCSS, Framer Motion, Vite"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-nebula-950 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Each tool separated by commas will appear as an individual interactive chip on the homepage.
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Telemetry Status Strip */}
          <div className="pt-2 border-t border-slate-200 dark:border-white/10">
            <label className="block text-xs font-mono text-slate-500 mb-1">
              Footer Telemetry Status Strip (Bottom of card)
            </label>
            <input
              type="text"
              value={telemetryText}
              onChange={(e) => setTelemetryText(e.target.value)}
              placeholder="e.g. Full-Stack Ready • Diploma CSE"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="p-6 rounded-2xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base">Social Profiles</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">GitHub URL</label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">LinkedIn URL</label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">Twitter / X URL</label>
              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">YouTube Channel URL</label>
              <input
                type="text"
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/@yourchannel"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1 flex items-center justify-between">
                <span>Instagram Profile URL</span>
                <span className="text-[10px] text-aurora-rose">Active on public site</span>
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/yourhandle"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs focus:ring-2 focus:ring-aurora-rose/40"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
