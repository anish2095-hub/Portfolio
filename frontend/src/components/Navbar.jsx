import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Sparkles, Terminal, Search, Command } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { CommandPalette } from './CommandPalette';
import { usePortfolio } from '../context/PortfolioContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { profile } = usePortfolio();
  const location = useLocation();

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
    { name: 'Media', href: '#media' },
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
          ? 'bg-nebula-950/85 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 font-display font-bold text-xl tracking-tight text-white"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-aurora-cyan via-aurora-violet to-aurora-rose p-[1.5px] transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full rounded-[10px] bg-nebula-900 flex items-center justify-center font-mono text-sm font-semibold text-aurora-cyan">
              {nameInitials}
            </div>
          </div>
          <span className="flex items-center gap-1">
            <span>{profile?.name ? profile.name.split(' ')[0] : 'Anish'}</span>
            <span className="text-aurora-cyan font-mono text-sm">.dev</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="relative py-1 hover:text-aurora-cyan transition-colors group text-left"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-aurora-cyan to-aurora-violet transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Actions: Spotlight, Admin Badge & Let's Connect */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Spotlight Button */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-nebula-900/90 hover:bg-nebula-850 border border-white/10 hover:border-aurora-cyan/40 text-slate-300 hover:text-white text-xs font-mono transition-all shadow-sm group"
            title="Press Cmd+K or Ctrl+K to open spotlight search"
          >
            <Search className="w-3.5 h-3.5 text-aurora-cyan group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden md:inline-flex px-1.5 py-0.2 rounded bg-white/10 text-[10px] text-slate-400 group-hover:text-white">
              ⌘K
            </kbd>
          </button>

          <Link
            to="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-full border border-white/10 text-slate-400 hover:text-aurora-cyan hover:border-aurora-cyan transition-all"
            title="Admin Management Panel"
          >
            <Shield className="w-3.5 h-3.5 text-aurora-cyan" />
            <span>Admin</span>
          </Link>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-semibold text-white bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-rose rounded-full shadow-md shadow-aurora-cyan/20 hover:opacity-95 transition-all transform hover:-translate-y-0.5"
          >
            <span>Let's Connect</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-nebula-850 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Command Palette Spotlight Modal */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-white/95 dark:bg-nebula-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-xl px-6 py-6 transition-all duration-300">
          <nav className="flex flex-col gap-4 text-base font-medium text-slate-700 dark:text-slate-200">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-left py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-nebula-800 hover:text-aurora-cyan transition-colors"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCommandOpen(true);
                }}
                className="flex items-center gap-2 text-sm font-mono text-slate-300"
              >
                <Search className="w-4 h-4 text-aurora-cyan" />
                <span>Command Spotlight (⌘K)</span>
              </button>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-mono text-aurora-cyan"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
