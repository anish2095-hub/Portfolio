import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, Cpu } from 'lucide-react';

export const CodeWindow = ({ profile }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Profile.ts', icon: FileCode },
    { id: 'stack', name: 'TechStack.json', icon: Cpu },
    { id: 'command', name: 'QuickRun.sh', icon: Terminal },
  ];

  const profileCode = `import { Engineer } from '@core/developer';

export const developer: Engineer = {
  name: "${profile?.name || 'Alex Rivera'}",
  role: "${profile?.title || 'Full Stack MERN Architect'}",
  experience: "${profile?.experienceYears || '4+ Years'}",
  location: "${profile?.location || 'San Francisco, CA'}",
  currentFocus: "Scalable Microservices & Interactive 3D Web",
  openForHire: true,
  sayHello: () => window.location.href = '#contact'
};`;

  const stackCode = `{
  "core_stack": ["MongoDB", "Express.js", "React.js", "Node.js"],
  "frontend": ["Tailwind CSS", "Vite", "TypeScript", "Redux"],
  "backend_cloud": ["REST APIs", "JWT Auth", "Docker", "Render"],
  "deployment": {
    "frontend_platform": "Vercel",
    "backend_platform": "Render",
    "database": "MongoDB Atlas"
  }
}`;

  const commandCode = `#!/bin/bash
# Clone and inspect portfolio codebase
git clone https://github.com/developer/portfolio.git
cd portfolio && npm run dev

echo "🚀 Ready to engineer high-impact solutions together!"`;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'stack':
        return stackCode;
      case 'command':
        return commandCode;
      default:
        return profileCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group w-full max-w-xl mx-auto rounded-2xl overflow-hidden bg-slate-900/90 dark:bg-nebula-900/95 border border-slate-700/60 dark:border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-aurora-cyan/40">
      {/* Window Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 dark:bg-nebula-850/80 border-b border-slate-700/60 dark:border-white/10 select-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors cursor-pointer" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors cursor-pointer" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors cursor-pointer" />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                  isActive
                    ? 'bg-slate-700/80 dark:bg-nebula-700/80 text-aurora-cyan font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          type="button"
          title="Copy code"
          className="p-1.5 rounded-md text-slate-400 hover:text-aurora-cyan hover:bg-slate-700/50 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-5 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
        <pre className="whitespace-pre">
          {getActiveCode().split('\n').map((line, idx) => (
            <div key={idx} className="table-row">
              <span className="table-cell pr-4 text-slate-600 select-none text-right font-mono text-xs">
                {idx + 1}
              </span>
              <span className="table-cell">
                {line.startsWith('import') || line.startsWith('export') || line.startsWith('const') || line.startsWith('return') ? (
                  <span className="text-aurora-rose font-semibold">{line}</span>
                ) : line.includes(':') && !line.startsWith('//') ? (
                  <span>
                    <span className="text-aurora-sky">{line.split(':')[0]}</span>:
                    <span className="text-emerald-400">{line.slice(line.indexOf(':') + 1)}</span>
                  </span>
                ) : line.startsWith('//') || line.startsWith('#') ? (
                  <span className="text-slate-500 italic">{line}</span>
                ) : (
                  line
                )}
              </span>
            </div>
          ))}
        </pre>
      </div>

      {/* Terminal Status Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/70 border-t border-slate-800 text-[11px] font-mono text-slate-500 select-none">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>TypeScript 5.4</span>
        </div>
        <span>UTF-8</span>
      </div>
    </div>
  );
};
