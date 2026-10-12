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
          message: 'Avatar uploaded successfully!',
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
        setNotification({ type: 'success', message: 'Profile updated successfully!' });
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold">Profile & Bio</h1>
          <p className="text-xs text-zinc-500">Edit public details and avatar</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-xs font-mono bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
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

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Avatar */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h3 className="font-display font-bold text-sm mb-3">Avatar Photo</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex-shrink-0">
              <img
                src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 w-full space-y-2">
              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs"
              />
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Image (ImgBB / Cloudinary)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <h3 className="font-display font-bold text-sm">Personal Info</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-zinc-500 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              />
            </div>

            <div>
              <label className="block font-mono text-zinc-500 mb-1">Professional Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-zinc-500 mb-1">
              Typewriter Roles (Separate with commas)
            </label>
            <input
              type="text"
              name="typingRoles"
              value={formData.typingRoles}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block font-mono text-zinc-500 mb-1">Hero Tagline</label>
            <textarea
              name="tagline"
              rows={2}
              value={formData.tagline}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <div>
            <label className="block font-mono text-zinc-500 mb-1">Detailed About Bio</label>
            <textarea
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
            />
          </div>
        </div>

        {/* Fact Attributes */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <h3 className="font-display font-bold text-sm">Attributes & Links</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-mono text-zinc-500 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              />
            </div>

            <div>
              <label className="block font-mono text-zinc-500 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              />
            </div>

            <div>
              <label className="block font-mono text-zinc-500 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-mono text-zinc-500 mb-1">Degree</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              />
            </div>

            <div>
              <label className="block font-mono text-zinc-500 mb-1">Experience Years</label>
              <input
                type="text"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              />
            </div>

            <div>
              <label className="block font-mono text-zinc-500 mb-1">Availability</label>
              <input
                type="text"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-zinc-500 mb-1">Resume Download URL</label>
            <input
              type="text"
              name="resumeUrl"
              value={formData.resumeUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <h3 className="font-display font-bold text-sm">Social Handles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-zinc-500 mb-1">GitHub</label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block font-mono text-zinc-500 mb-1">LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block font-mono text-zinc-500 mb-1">Twitter / X</label>
              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block font-mono text-zinc-500 mb-1">YouTube</label>
              <input
                type="text"
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
