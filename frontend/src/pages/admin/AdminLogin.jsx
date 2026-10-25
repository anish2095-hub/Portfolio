import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message || 'Invalid credentials. Please verify your email and password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#070e10] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top action bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-teal-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      {/* Login Card matching user reference */}
      <div className="w-full max-w-[360px] sm:max-w-[380px] p-7 rounded-[22px] bg-[#0c1619] border border-[#1b2a30] shadow-2xl relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-amber-400 font-bold text-lg select-none">&gt;_</span>
            <h1 className="text-xl font-bold text-white font-display tracking-tight">
              Admin Login
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to manage your portfolio content.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#070e10] border border-[#1b2a30] text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 transition-all"
            />
          </div>

          {/* Password input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#070e10] border border-[#1b2a30] text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 transition-all"
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-[#00a896] hover:bg-[#009688] active:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing In...</span>
              </span>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-[#1b2a30] text-[11px] text-slate-500 font-mono flex items-center justify-between">
          <span>Protected Area</span>
          <span className="text-teal-400/80">Authorized Admin Only</span>
        </div>
      </div>
    </div>
  );
};
