import React, { useState } from 'react';
import {
  Code,
  Layers,
  Database,
  Server,
  Cloud,
  Cpu,
  Zap,
  Layout,
  Terminal,
  GitBranch,
  CheckCircle2,
  FileCode,
  Palette,
  Network,
  Container,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

// Dynamic icon resolver
const getSkillIcon = (iconName) => {
  switch (iconName?.toLowerCase()) {
    case 'atom':
    case 'react':
      return Layers;
    case 'database':
    case 'mongo':
      return Database;
    case 'server':
    case 'node':
      return Server;
    case 'cloud':
    case 'aws':
    case 'render':
      return Cloud;
    case 'cpu':
    case 'express':
      return Cpu;
    case 'zap':
    case 'redis':
      return Zap;
    case 'layout':
    case 'html':
      return Layout;
    case 'terminal':
      return Terminal;
    case 'gitbranch':
    case 'git':
      return GitBranch;
    case 'filecode':
    case 'js':
    case 'javascript':
      return FileCode;
    case 'palette':
    case 'tailwind':
    case 'css':
      return Palette;
    case 'network':
    case 'api':
      return Network;
    case 'container':
    case 'docker':
      return Container;
    default:
      return Code;
  }
};

export const Skills = () => {
  const { skills, profile } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Skills' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'database', name: 'Database' },
    { id: 'devops', name: 'DevOps & Cloud' },
    { id: 'tools', name: 'Tools' },
  ];

  const filteredSkills =
    activeCategory === 'all'
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="py-24 relative bg-nebula-950 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-aurora-cyan font-semibold mb-2">
            {profile?.skillsHeaderBadge || '// My Tech Arsenal'}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {profile?.skillsHeaderTitle || 'Skills & Expertise'}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-aurora-cyan to-aurora-violet rounded-full mt-3" />
          <p className="text-slate-400 max-w-xl text-sm sm:text-base mt-4">
            {profile?.skillsHeaderDescription ||
              'A comprehensive overview of technologies, frameworks, and modern tools I leverage to build resilient applications.'}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              type="button"
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-aurora-cyan to-aurora-violet text-white shadow-md shadow-aurora-cyan/20 scale-105'
                  : 'bg-nebula-900 text-slate-400 hover:text-white border border-white/10 hover:border-aurora-cyan/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => {
            const Icon = getSkillIcon(skill.icon || skill.name);
            return (
              <div
                key={skill._id || skill.name}
                className="group relative p-6 rounded-2xl bg-nebula-900/90 border border-white/10 hover:border-aurora-cyan/40 hover:bg-nebula-850/90 hover:-translate-y-1.5 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-aurora-cyan/10 text-aurora-cyan group-hover:bg-aurora-cyan group-hover:text-nebula-950 transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-white text-base">
                        {skill.name}
                      </h4>
                      <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                        {skill.category}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-aurora-cyan">
                    {skill.proficiency}%
                  </span>
                </div>

                {skill.description && (
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>
                )}

                {/* Animated Proficiency Bar */}
                <div className="w-full bg-nebula-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-rose h-full rounded-full transition-all duration-1000 ease-out origin-left"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
