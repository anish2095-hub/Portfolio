import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Code2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { usePortfolio } from '../context/PortfolioContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { profile } = usePortfolio();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  const firstName = profile?.name ? profile.name.split(' ')[0] : 'Alex';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#f4f9fd]/90 dark:bg-[#08141e]/90 backdrop-blur-md border-b border-[#0284c7]/15 dark:border-[#38bdf8]/15 py-3.5 shadow-sky-sm'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2 font-display font-bold text-xl tracking-tight text-[#0c2333] dark:text-[#f0f9ff]"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0284c7] text-white flex items-center justify-center shadow-sky-sm transition-transform group-hover:scale-105">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="flex items-center">
            <span>{firstName}</span>
            <span className="text-[#0284c7] dark:text-[#38bdf8] ml-0.5 text-2xl leading-none">.</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#436174] dark:text-[#93b4cb]">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="relative py-1 hover:text-[#0284c7] dark:hover:text-[#38bdf8] transition-colors group"
            >
              <span>{link.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0284c7] dark:bg-[#38bdf8] transition-all duration-200 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            to="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium rounded-full border border-[#0284c7]/20 dark:border-[#38bdf8]/20 text-[#436174] dark:text-[#93b4cb] hover:border-[#0284c7] hover:text-[#0284c7] dark:hover:border-[#38bdf8] dark:hover:text-[#38bdf8] transition-colors"
            title="Admin Panel"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="lg:hidden p-2 rounded-lg text-[#0c2333] dark:text-[#f0f9ff] hover:bg-[#e8f3fa] dark:hover:bg-[#102638] transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-[#f4f9fd] dark:bg-[#102638] border-b border-[#0284c7]/15 dark:border-[#38bdf8]/15 px-6 py-6 shadow-xl">
          <nav className="flex flex-col gap-3 text-sm font-medium text-[#0c2333] dark:text-[#f0f9ff]">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#e8f3fa] dark:hover:bg-[#0c1d2b] transition-colors"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-3 border-t border-[#0284c7]/15 dark:border-[#38bdf8]/15">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-mono text-[#0284c7] dark:text-[#38bdf8] py-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Open Admin Portal</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
