import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Cpu,
  Award,
  Mail,
  Plus,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Cloud,
  Server,
  Sparkles,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { messageAPI } from '../../services/api';

export const AdminDashboard = () => {
  const { profile, projects, skills, certificates, refreshData } = usePortfolio();
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const res = await messageAPI.getAll();
      if (res.data?.success) {
        setMessages(res.data.data.slice(0, 5)); // show recent 5
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id, currentRead) => {
    try {
      await messageAPI.toggleRead(id, !currentRead);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await messageAPI.delete(id);
        fetchMessages();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: FolderGit2,
      path: '/admin/projects',
      color: 'text-aurora-cyan',
      bgColor: 'bg-aurora-cyan/10',
    },
    {
      label: 'Active Skills',
      value: skills.length,
      icon: Cpu,
      path: '/admin/skills',
      color: 'text-aurora-violet',
      bgColor: 'bg-aurora-violet/10',
    },
    {
      label: 'Certifications',
      value: certificates.length,
      icon: Award,
      path: '/admin/certificates',
      color: 'text-aurora-amber',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Unread Inquiries',
      value: unreadCount,
      icon: Mail,
      path: '/admin/messages',
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-aurora-cyan/10 via-aurora-violet/10 to-aurora-rose/10 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-aurora-cyan font-semibold">
            // CMS Overview
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mt-1 text-slate-900 dark:text-white">
            Welcome back, {profile?.name || 'Admin'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Manage your live portfolio projects, technical skills, biography, and incoming messages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs font-mono bg-aurora-cyan text-white hover:opacity-95 shadow-md shadow-aurora-cyan/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
          <Link
            to="/admin/profile"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs font-mono bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/10 hover:border-aurora-cyan transition-all"
          >
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Link
              key={idx}
              to={s.path}
              className="p-6 rounded-2xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 hover:border-aurora-cyan/40 shadow-sm transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                  {s.label}
                </span>
                <div className={`p-2.5 rounded-xl ${s.bgColor} ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
                  {s.value}
                </span>
                <span className="text-xs font-mono text-slate-400 group-hover:text-aurora-cyan flex items-center gap-0.5 transition-colors">
                  <span>Manage</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Deployment & Architecture Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-aurora-cyan/10 text-aurora-cyan">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base">Frontend: Vercel Ready</h3>
              <p className="text-xs text-slate-500">React + Vite SPA configured with vercel.json</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Deployment routing rules configured in <code className="font-mono text-aurora-cyan">vercel.json</code> with SPA client rewrite support. Connect to Vercel and set <code className="font-mono text-aurora-cyan">VITE_API_URL</code> to your Render URL.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-aurora-violet/10 text-aurora-violet">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base">Backend: Render Ready</h3>
              <p className="text-xs text-slate-500">Node/Express API configured with render.yaml & /health</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Ready for 1-click deploy with blueprint <code className="font-mono text-aurora-cyan">render.yaml</code>. Includes health checks on <code className="font-mono text-aurora-cyan">/health</code>, CORS origin handlers, and MongoDB Atlas support.
          </p>
        </div>
      </div>

      {/* Recent Contact Inquiries */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Recent Inquiries
            </h3>
            <p className="text-xs text-slate-500">Latest messages submitted via the public contact form</p>
          </div>
          <Link
            to="/admin/messages"
            className="text-xs font-mono text-aurora-cyan hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingMessages ? (
          <div className="py-8 text-center text-xs font-mono text-slate-400">Loading inquiries...</div>
        ) : messages.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 font-mono">
            No inquiries received yet. Submit a test message on the public portfolio!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  !msg.read ? 'bg-aurora-cyan/5 -mx-4 px-4 rounded-xl' : ''
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      {msg.name}
                    </span>
                    {!msg.read && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white">
                        NEW
                      </span>
                    )}
                    <span className="text-xs font-mono text-slate-400">({msg.email})</span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5 truncate">
                    {msg.subject}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-1">{msg.message}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleRead(msg._id, msg.read)}
                    type="button"
                    title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                    className={`p-2 rounded-lg text-xs font-mono border ${
                      msg.read
                        ? 'border-slate-200 dark:border-white/10 text-slate-400'
                        : 'border-aurora-cyan/40 bg-aurora-cyan/10 text-aurora-cyan font-bold'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    type="button"
                    title="Delete message"
                    className="p-2 rounded-lg text-xs border border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
