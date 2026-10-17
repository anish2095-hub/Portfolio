import React, { useState } from 'react';
import { Lock, Save, CheckCircle2, AlertCircle, ShieldCheck, KeyRound, Database, Cloud } from 'lucide-react';
import { authAPI } from '../../services/api';

export const AdminSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setNotification(null);

    if (newPassword.length < 6) {
      setNotification({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setNotification({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    try {
      setLoading(true);
      const res = await authAPI.changePassword({ currentPassword, newPassword });
      if (res.data?.success) {
        setNotification({ type: 'success', message: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update password.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-6 border-b border-slate-200 dark:border-white/10">
        <h1 className="font-display text-2xl font-bold">Admin Account & Environment Settings</h1>
        <p className="text-xs text-slate-500">Security credentials, passwords, and cloud deployment guides</p>
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

      {/* Change Password Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-aurora-cyan/10 text-aurora-cyan">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Change Admin Password
            </h3>
            <p className="text-xs text-slate-500">Update your dashboard credentials</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md text-xs">
          <div>
            <label className="block font-mono text-slate-500 mb-1">Current Password *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm"
            />
          </div>

          <div>
            <label className="block font-mono text-slate-500 mb-1">New Password (Min 6 chars) *</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm"
            />
          </div>

          <div>
            <label className="block font-mono text-slate-500 mb-1">Confirm New Password *</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium font-mono text-xs text-white bg-aurora-cyan hover:opacity-90 shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Updating...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* Cloud & Image Storage Info Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Image Storage Info */}
        <div className="p-6 rounded-2xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-aurora-cyan font-bold font-mono">
            <Cloud className="w-4 h-4" />
            <span>Image Storage Configuration</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            The backend supports <strong>ImgBB API</strong> or <strong>Cloudinary</strong> for cloud image uploads:
          </p>
          <ul className="space-y-1.5 font-mono text-[11px] text-slate-500">
            <li>• Option 1: Set <code className="text-aurora-cyan">IMGBB_API_KEY</code> in <code className="text-slate-400">backend/.env</code></li>
            <li>• Option 2: Set <code className="text-aurora-cyan">CLOUDINARY_*</code> in <code className="text-slate-400">backend/.env</code></li>
            <li>• Built-in Fallback: Seamless Base64 data encoding so image uploads work immediately even before keys are provided!</li>
          </ul>
        </div>

        {/* Deployment Info */}
        <div className="p-6 rounded-2xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-aurora-violet font-bold font-mono">
            <Database className="w-4 h-4" />
            <span>Deployments (Vercel & Render)</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Deployment configurations are included out-of-the-box:
          </p>
          <ul className="space-y-1.5 font-mono text-[11px] text-slate-500">
            <li>• <strong>Render (Backend):</strong> Deploy from GitHub repository using <code className="text-aurora-violet">backend/render.yaml</code></li>
            <li>• <strong>Vercel (Frontend):</strong> Deploy with Root Directory <code className="text-aurora-violet">frontend</code> and routing via <code className="text-aurora-violet">vercel.json</code></li>
            <li>• <strong>MongoDB:</strong> Set <code className="text-aurora-violet">MONGODB_URI</code> to your free MongoDB Atlas cloud cluster</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
