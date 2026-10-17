import React from 'react';
import { ArrowUp, Shield, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer = () => {
  const { profile } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-nebula-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-slate-400">
          <span>
            © {new Date().getFullYear()} {profile?.name || 'Anish Singh'}. All rights reserved.
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="flex items-center gap-1 font-mono text-slate-300">
            Crafted with MERN Stack <Code2 className="w-3.5 h-3.5 text-aurora-cyan" />
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-aurora-cyan transition-colors"
            title="Admin Login"
          >
            <Shield className="w-3.5 h-3.5 text-aurora-cyan" />
            <span>Admin Portal</span>
          </Link>

          <button
            onClick={scrollToTop}
            type="button"
            className="p-2.5 rounded-xl bg-nebula-900 text-slate-300 hover:text-aurora-cyan border border-white/10 hover:border-aurora-cyan/40 transition-all hover:-translate-y-1 shadow-md"
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
