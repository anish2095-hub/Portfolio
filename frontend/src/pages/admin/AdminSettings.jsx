import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, KeyRound, Cloud, Database } from 'lucide-react';
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
      setNotification({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setNotification({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    try {
      setLoading(true);
      const res = await authAPI.changePassword({ currentPassword, newPassword });
      if (res.data?.success) {
        setNotification({ type: 'success', message: 'Password updated successfully.' });
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
      <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">Settings</h1>
        <p className="text-xs text-zinc-500 mt-1">Security credentials and deployment configuration</p>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
              : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Change Password */}
      <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-zinc-900 dark:text-white">
              Change Admin Password
            </h3>
            <p className="text-xs text-zinc-500">Update your dashboard credentials</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md text-xs">
          <div>
            <label className="block font-mono text-zinc-500 mb-1.5">Current Password *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-mono text-zinc-500 mb-1.5">New Password (min 6 chars) *</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-mono text-zinc-500 mb-1.5">Confirm New Password *</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium font-mono text-xs text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Updating...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Image Storage Info */}
        <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 font-semibold font-mono text-zinc-700 dark:text-zinc-300">
            <Cloud className="w-4 h-4" />
            <span>Image Storage</span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            The backend supports <strong>ImgBB</strong> or <strong>Cloudinary</strong> for cloud image uploads:
          </p>
          <ul className="space-y-1.5 font-mono text-[11px] text-zinc-500">
            <li>
              • Option 1: Set{' '}
              <code className="text-blue-600 dark:text-blue-400">IMGBB_API_KEY</code>{' '}
              in <code className="text-zinc-400">backend/.env</code>
            </li>
            <li>
              • Option 2: Set{' '}
              <code className="text-blue-600 dark:text-blue-400">CLOUDINARY_*</code>{' '}
              in <code className="text-zinc-400">backend/.env</code>
            </li>
            <li>• Fallback: Base64 encoding works out of the box with no keys needed</li>
          </ul>
        </div>

        {/* Deployment Info */}
        <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 font-semibold font-mono text-zinc-700 dark:text-zinc-300">
            <Database className="w-4 h-4" />
            <span>Deployment</span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Deployment configs are included out-of-the-box:
          </p>
          <ul className="space-y-1.5 font-mono text-[11px] text-zinc-500">
            <li>
              • <strong>Render (Backend):</strong> Deploy via{' '}
              <code className="text-blue-600 dark:text-blue-400">backend/render.yaml</code>
            </li>
            <li>
              • <strong>Vercel (Frontend):</strong> Root directory{' '}
              <code className="text-blue-600 dark:text-blue-400">frontend</code>, routing via{' '}
              <code className="text-blue-600 dark:text-blue-400">vercel.json</code>
            </li>
            <li>
              • <strong>MongoDB:</strong> Set{' '}
              <code className="text-blue-600 dark:text-blue-400">MONGODB_URI</code>{' '}
              to your MongoDB Atlas cluster
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
