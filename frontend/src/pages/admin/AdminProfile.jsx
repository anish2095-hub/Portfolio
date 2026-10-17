import React, { useState, useEffect } from 'react';
import { Save, Upload, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
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

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        title: profile.title || '',
        typingRoles: Array.isArray(profile.typingRoles)
          ? profile.typingRoles.join(', ')
          : '',
        tagline: profile.tagline || '',
        avatar: profile.avatar || '',
        bio: profile.bio || '',
        location: profile.location || '',
        email: profile.email || '',
        phone: profile.phone || '',
        degree: profile.degree || '',
        experienceYears: profile.experienceYears || '',
        availability: profile.availability || '',
        resumeUrl: profile.resumeUrl || '',
        github: profile.socialLinks?.github || '',
        linkedin: profile.socialLinks?.linkedin || '',
        twitter: profile.socialLinks?.twitter || '',
        youtube: profile.socialLinks?.youtube || '',
        instagram: profile.socialLinks?.instagram || '',
      });
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
                src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
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
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
