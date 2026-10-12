import React from 'react';
import { ArrowUp, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer = () => {
  const { profile } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#0284c7]/10 dark:border-[#38bdf8]/10 bg-[#e8f3fa] dark:bg-[#0c1d2b] py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs sm:text-sm text-[#436174] dark:text-[#93b4cb] font-mono flex items-center gap-1.5">
          <span>© {new Date().getFullYear()} {profile?.name || 'Alex Rivera'}. Built with</span>
          <Heart className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#38bdf8] fill-current inline" />
          <span>& MERN stack.</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-xs font-mono text-[#7895a7] dark:text-[#62839b] hover:text-[#0284c7] dark:hover:text-[#38bdf8] transition-colors"
            title="Admin Login"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          <button
            onClick={scrollToTop}
            type="button"
            className="p-2 rounded-lg bg-white dark:bg-[#102638] border border-[#0284c7]/15 dark:border-[#38bdf8]/15 text-[#436174] dark:text-[#93b4cb] hover:text-[#0284c7] dark:hover:text-[#38bdf8] shadow-sky-sm hover:shadow-sky-md transition-all"
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
