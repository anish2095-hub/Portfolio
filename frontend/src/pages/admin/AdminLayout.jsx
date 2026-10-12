import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  GraduationCap,
  Award,
  Video,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/ThemeToggle';
import { messageAPI } from '../../services/api';

export const AdminLayout = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await messageAPI.getAll();
        if (res.data?.success) {
          setUnreadCount(res.data.unreadCount || 0);
        }
      } catch (err) {
        // silent
      }
    };
    if (isAuthenticated) {
      fetchUnread();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-500 font-mono text-xs">
        Loading Admin Session...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Profile & Bio', path: '/admin/profile', icon: User },
    { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Skills', path: '/admin/skills', icon: Cpu },
    { name: 'Experience', path: '/admin/experience', icon: GraduationCap },
    { name: 'Certificates', path: '/admin/certificates', icon: Award },
    { name: 'Media / Videos', path: '/admin/media', icon: Video },
    {
      name: 'Messages',
      path: '/admin/messages',
      icon: Mail,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex transition-colors text-zinc-900 dark:text-zinc-100">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 fixed inset-y-0 left-0 z-30">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-sm">Portfolio CMS</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-600 text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Site</span>
          </Link>

          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-60 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              type="button"
              className="lg:hidden p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs text-zinc-400 hidden sm:inline">
              Admin: <strong className="text-zinc-700 dark:text-zinc-300 font-normal">{user?.email || 'admin@portfolio.com'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Public</span>
            </Link>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <aside className="relative flex-1 max-w-xs w-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-5 z-10">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <span className="font-display font-bold text-sm">Portfolio CMS</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  type="button"
                  className="p-1 rounded-md text-zinc-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex-1 py-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.exact}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-xs ${
                        isActive
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`
                    }
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
              <button
                onClick={handleLogout}
                type="button"
                className="mt-auto flex items-center gap-2 text-rose-500 text-xs py-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </aside>
          </div>
        )}

        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
