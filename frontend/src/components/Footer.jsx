import React from 'react';
import { ArrowUp, Heart, Shield, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer = () => {
  const { profile } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-white/5 bg-white dark:bg-nebula-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>
            © {new Date().getFullYear()} {profile?.name || 'Alex Rivera'}. All rights reserved.
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1 font-mono">
            Crafted with MERN Stack <Code2 className="w-3.5 h-3.5 text-aurora-cyan" />
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-aurora-cyan transition-colors"
            title="Admin Login"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </Link>

          <button
            onClick={scrollToTop}
            type="button"
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-nebula-850 text-slate-600 dark:text-slate-400 hover:text-aurora-cyan dark:hover:text-aurora-cyan border border-slate-200 dark:border-white/5 transition-all hover:-translate-y-1"
            title="Back to Top"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
