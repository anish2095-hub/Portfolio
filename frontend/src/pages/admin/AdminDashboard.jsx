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
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { messageAPI } from '../../services/api';

export const AdminDashboard = () => {
  const { profile, projects, skills, certificates } = usePortfolio();
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const res = await messageAPI.getAll();
      if (res.data?.success) {
        setMessages(res.data.data.slice(0, 5));
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
      label: 'Projects',
      value: projects.length,
      icon: FolderGit2,
      path: '/admin/projects',
    },
    {
      label: 'Skills',
      value: skills.length,
      icon: Cpu,
      path: '/admin/skills',
    },
    {
      label: 'Certifications',
      value: certificates.length,
      icon: Award,
      path: '/admin/certificates',
    },
    {
      label: 'Unread Inquiries',
      value: unreadCount,
      icon: Mail,
      path: '/admin/messages',
      isAlert: unreadCount > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            // Overview
          </span>
          <h1 className="font-display text-xl sm:text-2xl font-bold mt-0.5 text-zinc-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-0.5">
            Manage projects, skills, biography, and incoming messages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-medium bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
          <Link
            to="/admin/profile"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Link
              key={idx}
              to={s.path}
              className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-zinc-500 uppercase">
                  {s.label}
                </span>
                <Icon className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`font-display text-2xl font-bold ${s.isAlert ? 'text-rose-500' : 'text-zinc-900 dark:text-white'}`}>
                  {s.value}
                </span>
                <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 flex items-center gap-0.5">
                  <span>View</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Deployment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
          <div className="flex items-center gap-2 mb-2 font-semibold text-zinc-900 dark:text-white">
            <Cloud className="w-4 h-4 text-zinc-500" />
            <span>Frontend: Vercel Ready</span>
          </div>
          <p className="text-zinc-500 leading-relaxed">
            Client-side SPA routes configured in <code className="font-mono text-zinc-800 dark:text-zinc-200">vercel.json</code>. Set environment variable <code className="font-mono text-zinc-800 dark:text-zinc-200">VITE_API_URL</code> on Vercel.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
          <div className="flex items-center gap-2 mb-2 font-semibold text-zinc-900 dark:text-white">
            <Server className="w-4 h-4 text-zinc-500" />
            <span>Backend: Render Ready</span>
          </div>
          <p className="text-zinc-500 leading-relaxed">
            API service configured in <code className="font-mono text-zinc-800 dark:text-zinc-200">render.yaml</code> with health probe on <code className="font-mono text-zinc-800 dark:text-zinc-200">/health</code> and MongoDB Atlas support.
          </p>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white">
            Recent Inquiries
          </h3>
          <Link
            to="/admin/messages"
            className="text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loadingMessages ? (
          <div className="py-6 text-center text-xs font-mono text-zinc-400">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-500 font-mono">
            No inquiries received yet.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {msg.name}
                    </span>
                    {!msg.read && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-rose-600 text-white font-semibold">
                        NEW
                      </span>
                    )}
                    <span className="text-zinc-400 font-mono text-[11px]">&lt;{msg.email}&gt;</span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 font-medium truncate">{msg.subject}</p>
                  <p className="text-zinc-500 line-clamp-1">{msg.message}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleRead(msg._id, msg.read)}
                    type="button"
                    title={msg.read ? 'Mark Unread' : 'Mark Read'}
                    className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    type="button"
                    title="Delete"
                    className="p-1.5 rounded border border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
