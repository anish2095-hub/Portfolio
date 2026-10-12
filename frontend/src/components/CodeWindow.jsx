import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, Cpu } from 'lucide-react';

export const CodeWindow = ({ profile }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Developer.js', icon: FileCode },
    { id: 'stack', name: 'TechStack.json', icon: Cpu },
    { id: 'command', name: 'StartApp.sh', icon: Terminal },
  ];

  const profileCode = `const developer = {
  name: "${profile?.name || 'Ujjwal Mehta'}",
  role: "${profile?.title || 'Web Developer & Creator'}",
  experience: "${profile?.experienceYears || '3+ Years'}",
  location: "${profile?.location || 'India'}",
  status: "Available for Projects",
  skills: ["React", "Node.js", "Express", "MongoDB"],
  contact: "${profile?.email || 'contact@ujjwalmehta.in'}"
};

// Ready to build modern web experiences 🚀`;

  const stackCode = `{
  "frontend": ["React", "JavaScript", "Tailwind CSS", "Vite"],
  "backend": ["Node.js", "Express.js", "REST APIs"],
  "database": ["MongoDB", "Mongoose"],
  "hosting": {
    "frontend": "Vercel",
    "backend": "Render",
    "database": "MongoDB Atlas"
  }
}`;

  const commandCode = `#!/bin/bash
# Clone and launch developer portfolio
git clone https://github.com/developer/portfolio.git
cd portfolio && npm install
npm run dev`;

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
    <div className="w-full max-w-lg mx-auto rounded-xl overflow-hidden bg-[#0d2124] border border-white/10 shadow-2xl transition-transform duration-300 hover:-translate-y-1 text-left">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
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
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-white/50 hover:text-white/80'
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
          className="p-1 rounded text-white/50 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#27c93f]" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-5 font-mono text-[13px] text-[#e8eceb] overflow-x-auto leading-relaxed">
        <pre className="whitespace-pre">
          {getActiveCode().split('\n').map((line, idx) => (
            <div key={idx} className="table-row">
              <span className="table-cell pr-4 text-[#6e8385] select-none text-right font-mono text-xs">
                {idx + 1}
              </span>
              <span className="table-cell">
                {line.startsWith('const') || line.startsWith('let') || line.startsWith('import') ? (
                  <span className="text-[#f2c879]">{line}</span>
                ) : line.startsWith('//') || line.startsWith('#') ? (
                  <span className="text-[#6e8385] italic">{line}</span>
                ) : line.includes(':') ? (
                  <span>
                    <span className="text-[#9cdcfe]">{line.split(':')[0]}</span>:
                    <span className="text-[#e8a33d]">{line.slice(line.indexOf(':') + 1)}</span>
                  </span>
                ) : (
                  line
                )}
              </span>
            </div>
          ))}
        </pre>
      </div>

      <div className="flex items-center justify-between px-4 py-1.5 bg-black/20 border-t border-white/5 text-[11px] font-mono text-[#6e8385] select-none">
        <span>Node.js / MERN</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
};
