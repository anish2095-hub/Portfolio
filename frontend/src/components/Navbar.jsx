import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, Search, ArrowRight } from 'lucide-react';
import { CommandPalette } from './CommandPalette';
import { AdminLoginModal } from './AdminLoginModal';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const { profile, isLiveConnected } = usePortfolio();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleAdminClick = (e) => {
    e?.preventDefault();
    setMobileMenuOpen(false);
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      setIsAdminModalOpen(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/${href}`;
      return;
    }
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nameInitials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('')
    : 'AS';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-nebula-950/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 font-display font-bold text-lg sm:text-xl tracking-tight text-white flex-shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-aurora-cyan via-aurora-violet to-aurora-rose p-[1.5px] transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full rounded-[10px] bg-nebula-900 flex items-center justify-center font-mono text-xs sm:text-sm font-semibold text-aurora-cyan">
              {nameInitials}
            </div>
          </div>
          <span className="flex items-center gap-1">
            <span>{profile?.name ? profile.name.split(' ')[0] : 'Anish'}</span>
            <span className="text-aurora-cyan font-mono text-xs sm:text-sm">.dev</span>
          </span>
        </Link>

        {/* Desktop Links (Large screens) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="relative py-1 hover:text-aurora-cyan transition-colors group text-left cursor-pointer"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-aurora-cyan to-aurora-violet transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Spotlight Button */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-nebula-900/90 hover:bg-nebula-850 border border-white/10 hover:border-aurora-cyan/40 text-slate-300 hover:text-white text-xs font-mono transition-all shadow-sm group cursor-pointer"
            title="Press Cmd+K or Ctrl+K to open spotlight search"
            aria-label="Spotlight Search"
          >
            <Search className="w-3.5 h-3.5 text-aurora-cyan group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden lg:inline-flex px-1.5 py-0.2 rounded bg-white/10 text-[10px] text-slate-400 group-hover:text-white">
              ⌘K
            </kbd>
          </button>

          {/* Admin Button (Visible on desktop/tablet) */}
          <button
            onClick={handleAdminClick}
            type="button"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-full border border-white/10 text-slate-400 hover:text-aurora-cyan hover:border-aurora-cyan transition-all cursor-pointer"
            title="Admin Management Panel"
          >
            <Shield className="w-3.5 h-3.5 text-aurora-cyan" />
            <span>Admin</span>
          </button>

          {/* Let's Connect CTA (Visible on tablet & desktop) */}
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-mono font-semibold text-white bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-rose rounded-full shadow-md shadow-aurora-cyan/20 hover:opacity-95 transition-all transform hover:-translate-y-0.5"
          >
            <span>Let's Connect</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="lg:hidden p-2 rounded-xl bg-nebula-900/80 border border-white/10 text-slate-300 hover:text-white hover:bg-nebula-800 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-aurora-cyan" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Command Palette Spotlight Modal */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenAdminLogin={() => setIsAdminModalOpen(true)}
      />

      {/* Admin Quick Authorization Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* Mobile Drawer (Clean, scrollable, with all actions) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-nebula-950/98 backdrop-blur-2xl border-b border-white/10 shadow-2xl px-6 py-6 max-h-[calc(100vh-80px)] overflow-y-auto animate-fadeIn">
          <nav className="flex flex-col gap-3 text-base font-medium text-slate-200">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-left py-2.5 px-3.5 rounded-xl hover:bg-white/5 hover:text-aurora-cyan transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span>{link.name}</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-aurora-cyan transition-all" />
              </button>
            ))}

            <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
              {/* Mobile Let's Connect Button */}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3 px-4 text-sm font-mono font-semibold text-white bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-rose rounded-xl shadow-lg shadow-aurora-cyan/20"
              >
                <span>Let's Connect</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCommandOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:text-white"
                >
                  <Search className="w-3.5 h-3.5 text-aurora-cyan" />
                  <span>Spotlight (⌘K)</span>
                </button>
                <button
                  onClick={handleAdminClick}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-aurora-cyan hover:bg-aurora-cyan/10"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
