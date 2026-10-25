import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  User,
  FolderGit2,
  Cpu,
  Award,
  Video,
  Mail,
  Lock,
  Copy,
  Download,
  Github,
  Linkedin,
  ArrowRight,
  Sparkles,
  Command,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const CommandPalette = ({ isOpen, onClose }) => {
  const { profile } = usePortfolio();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const email = profile?.email || 'anishsingh2095@gmail.com';
  const resumeUrl = profile?.resumeUrl && profile.resumeUrl !== '#' ? profile.resumeUrl : '#contact';
  const github = profile?.socialLinks?.github || 'https://github.com/anish2095-hub';
  const linkedin = profile?.socialLinks?.linkedin || 'https://www.linkedin.com/in/anish-kumar-03b105333/';

  const actions = [
    {
      category: 'Navigation',
      items: [
        {
          id: 'nav-home',
          title: 'Jump to Home',
          subtitle: 'Hero & Introduction',
          icon: Sparkles,
          action: () => {
            window.location.hash = '#home';
            onClose();
          },
        },
        {
          id: 'nav-about',
          title: 'About Anish',
          subtitle: 'Background, Bio & Education',
          icon: User,
          action: () => {
            window.location.hash = '#about';
            onClose();
          },
        },
        {
          id: 'nav-projects',
          title: 'Featured Projects',
          subtitle: 'Full-stack MERN & Web Apps',
          icon: FolderGit2,
          action: () => {
            window.location.hash = '#projects';
            onClose();
          },
        },
        {
          id: 'nav-skills',
          title: 'Technical Skills Matrix',
          subtitle: 'Languages, Frameworks & Tools',
          icon: Cpu,
          action: () => {
            window.location.hash = '#skills';
            onClose();
          },
        },
        {
          id: 'nav-certificates',
          title: 'Certificates & Credentials',
          subtitle: 'Verified Diplomas & Courses',
          icon: Award,
          action: () => {
            window.location.hash = '#certificates';
            onClose();
          },
        },
        {
          id: 'nav-media',
          title: 'Media Showcase',
          subtitle: 'Tech Tutorials & Demos',
          icon: Video,
          action: () => {
            window.location.hash = '#media';
            onClose();
          },
        },
        {
          id: 'nav-contact',
          title: 'Contact & Hire Me',
          subtitle: 'Send direct message or email',
          icon: Mail,
          action: () => {
            window.location.hash = '#contact';
            onClose();
          },
        },
        {
          id: 'nav-admin',
          title: 'Open Admin CMS',
          subtitle: 'Manage portfolio content',
          icon: Lock,
          action: () => {
            window.location.href = '/admin';
            onClose();
          },
        },
      ],
    },
    {
      category: 'Quick Actions',
      items: [
        {
          id: 'act-copy-email',
          title: 'Copy Email Address',
          subtitle: email,
          icon: Copy,
          badge: copied ? 'Copied!' : 'Click to copy',
          action: () => {
            navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
              onClose();
            }, 1000);
          },
        },
        {
          id: 'act-resume',
          title: 'Download Resume / CV',
          subtitle: 'View curriculum vitae',
          icon: Download,
          action: () => {
            if (resumeUrl.startsWith('#')) {
              window.location.hash = resumeUrl;
            } else {
              window.open(resumeUrl, '_blank');
            }
            onClose();
          },
        },
        {
          id: 'act-github',
          title: 'Visit GitHub Profile',
          subtitle: github,
          icon: Github,
          action: () => {
            window.open(github, '_blank');
            onClose();
          },
        },
        {
          id: 'act-linkedin',
          title: 'Visit LinkedIn Profile',
          subtitle: linkedin,
          icon: Linkedin,
          action: () => {
            window.open(linkedin, '_blank');
            onClose();
          },
        },
      ],
    },
  ];

  // Filter items based on query
  const filteredGroups = actions
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0);

  const flatItems = filteredGroups.flatMap((group) => group.items);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (flatItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatItems.length) % (flatItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatItems[selectedIndex]) {
          flatItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-nebula-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl bg-nebula-900 border border-white/15 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-aurora-cyan" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, sections, or actions (e.g. projects, resume, email)..."
            className="flex-1 bg-transparent border-none text-white placeholder-slate-500 text-sm focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Items List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {filteredGroups.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No results found for "<span className="text-white font-medium">{query}</span>"
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.category} className="space-y-1">
                <p className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  {group.category}
                </p>
                {group.items.map((item) => {
                  const globalIdx = flatItems.findIndex((fi) => fi.id === item.id);
                  const isSelected = globalIdx === selectedIndex;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-aurora-cyan/20 to-aurora-violet/20 border border-aurora-cyan/30 text-white shadow-sm'
                          : 'hover:bg-white/5 text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? 'bg-aurora-cyan text-nebula-950 font-bold'
                              : 'bg-white/5 text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium text-white">{item.title}</p>
                          <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>
                        </div>
                      </div>

                      {item.badge ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {item.badge}
                        </span>
                      ) : (
                        <ArrowRight
                          className={`w-4 h-4 ${
                            isSelected ? 'text-aurora-cyan' : 'text-slate-500'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2.5 bg-nebula-950/90 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">Esc</kbd> Close</span>
          </div>
          <span className="text-aurora-cyan flex items-center gap-1">
            <Command className="w-3 h-3" />
            <span>Spotlight</span>
          </span>
        </div>
      </div>
    </div>
  );
};
