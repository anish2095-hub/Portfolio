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
  FileCode,
  Palette,
  Network,
  Container,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

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
  const { skills } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All' },
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
    <section id="skills" className="py-24 border-t border-[#0284c7]/10 dark:border-[#38bdf8]/10 bg-[#e8f3fa]/50 dark:bg-[#0c1d2b]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#0284c7] dark:text-[#38bdf8] font-semibold mb-1">
            // Tech Stack
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0c2333] dark:text-[#f0f9ff]">
            Skills & Technologies
          </h2>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              type="button"
              className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#0284c7] text-white shadow-sky-sm'
                  : 'bg-white dark:bg-[#102638] text-[#436174] dark:text-[#93b4cb] hover:text-[#0284c7] dark:hover:text-white border border-[#0284c7]/15 dark:border-[#38bdf8]/15 hover:border-[#0284c7]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => {
            const Icon = getSkillIcon(skill.icon || skill.name);
            return (
              <div
                key={skill._id || skill.name}
                className="p-5 rounded-2xl bg-white dark:bg-[#102638] border border-[#0284c7]/12 dark:border-[#38bdf8]/15 hover:border-[#0284c7] dark:hover:border-[#38bdf8] hover:-translate-y-1 transition-all duration-300 shadow-sky-sm hover:shadow-sky-md"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#0284c7]/10 dark:bg-[#38bdf8]/15 text-[#0284c7] dark:text-[#38bdf8]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-display font-bold text-base text-[#0c2333] dark:text-[#f0f9ff]">
                      {skill.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#7895a7] dark:text-[#62839b]">
                    {skill.proficiency}%
                  </span>
                </div>

                {skill.description && (
                  <p className="text-xs text-[#436174] dark:text-[#93b4cb] mb-3.5 line-clamp-1">
                    {skill.description}
                  </p>
                )}

                {/* Sky blue progress track */}
                <div className="w-full bg-[#e8f3fa] dark:bg-[#08141e] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0284c7] to-[#06b6d4] dark:from-[#38bdf8] dark:to-[#67e8f9] transition-all duration-500"
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
