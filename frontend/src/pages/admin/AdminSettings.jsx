import React, { useState, useEffect } from 'react';
import {
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  Database,
  Cloud,
  Mail,
  User,
  Eye,
  EyeOff,
} from 'lucide-react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminSettings = () => {
  const { user, updateSessionUser } = useAuth();

  const [name, setName] = useState(user?.name || 'Anish Singh');
  const [email, setEmail] = useState(user?.email || 'anishsingh2095@gmail.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.name) setName(user.name);
  }, [user]);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setNotification(null);

    if (!currentPassword) {
      setNotification({
        type: 'error',
        message: 'Current password is required to verify your authorization before updating credentials.',
      });
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setNotification({
          type: 'error',
          message: 'New password must be at least 6 characters long.',
        });
        return;
      }
      if (newPassword !== confirmPassword) {
        setNotification({
          type: 'error',
          message: 'New password and confirmation do not match.',
        });
        return;
      }
    }

    try {
      setLoading(true);
      const res = await authAPI.updateCredentials({
        name,
        email,
        currentPassword,
        newPassword: newPassword || undefined,
      });

      if (res.data?.success) {
        setNotification({
          type: 'success',
          message: res.data.message || 'Admin credentials updated successfully in MongoDB Atlas!',
        });
        if (updateSessionUser && res.data.data) {
          updateSessionUser(res.data.data, res.data.data.token);
        }
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update credentials. Please check your current password.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-6 border-b border-slate-200 dark:border-white/10">
        <h1 className="font-display text-2xl font-bold">Admin Account & Login Security</h1>
        <p className="text-xs text-slate-500">
          Customize your Admin Login Email and Password, and manage deployment settings
        </p>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-3 shadow-lg ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-medium leading-relaxed">{notification.message}</span>
        </div>
      )}

      {/* Main Customizable Credentials Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-aurora-cyan/20 to-aurora-violet/20 text-aurora-cyan border border-aurora-cyan/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>Admin Login Credentials</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Customizable
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update the Email and Password used to log in at <code className="text-aurora-cyan">/admin/login</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-600 dark:text-slate-300">Atlas DB Synced</span>
          </div>
        </div>

        <form onSubmit={handleCredentialsSubmit} className="space-y-6">
          {/* Identity Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Admin Display Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anish Singh"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50 focus:border-aurora-cyan transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Admin Login Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anishsingh2095@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-nebula-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50 focus:border-aurora-cyan transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                You will sign into the admin portal using this customized email address.
              </p>
            </div>
          </div>

          {/* Password Section */}
          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-nebula-900/70 border border-slate-200 dark:border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-aurora-cyan font-semibold">
              <KeyRound className="w-4 h-4" />
              <span>Password Security & Authorization</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Current Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Default initial: <code className="text-slate-300">admin123</code></p>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  New Password <span className="text-[10px] text-slate-400 font-sans">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-500 font-mono">
              🛡️ Changes are encrypted with bcrypt and stored in MongoDB Atlas
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium font-mono text-xs text-white bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-rose hover:opacity-90 shadow-lg shadow-aurora-cyan/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving to Atlas...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Login Credentials</span>
                </>
              )}
            </button>
          </div>
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
