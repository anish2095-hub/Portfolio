import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Copy,
  MapPin,
  ExternalLink,
  Layers,
  Cpu,
  Database,
  Cloud,
  ArrowRight,
  ShieldCheck,
  Activity,
  Zap,
} from 'lucide-react';

export const HeroShowcase = ({ profile }) => {
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState('frontend');

  const email = profile?.email || 'anishsingh2095@gmail.com';
  const name = profile?.name || 'Anish Singh';
  const avatar =
    profile?.avatar &&
    !profile.avatar.includes('photo-1534528741775-53994a69daeb') &&
    !profile.avatar.includes('unsplash.com')
      ? profile.avatar
      : '/pfp.jpeg';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const defaultPillars = [
    {
      id: 'frontend',
      label: 'Frontend',
      icon: Layers,
      color: 'from-aurora-cyan to-blue-500',
      badge: 'border-aurora-cyan/30 text-aurora-cyan bg-aurora-cyan/10',
      tagline: 'Pixel-perfect, high-performance UI',
      tools: ['React 19', 'TailwindCSS', 'Framer Motion', 'Vite', 'Responsive Design'],
      metric: '60fps Fluid UI',
    },
    {
      id: 'backend',
      label: 'Backend',
      icon: Cpu,
      color: 'from-aurora-violet to-purple-600',
      badge: 'border-aurora-violet/30 text-aurora-violet bg-aurora-violet/10',
      tagline: 'Robust & secure API architecture',
      tools: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth', 'Middleware'],
      metric: '<40ms API Latency',
    },
    {
      id: 'database',
      label: 'Database',
      icon: Database,
      color: 'from-emerald-400 to-teal-600',
      badge: 'border-emerald-400/30 text-emerald-400 bg-emerald-400/10',
      tagline: 'Scalable data models & indexing',
      tools: ['MongoDB Atlas', 'Mongoose ORM', 'Schema Design', 'Data Validation'],
      metric: 'Zero Data Loss',
    },
    {
      id: 'cloud',
      label: 'Cloud & Deploy',
      icon: Cloud,
      color: 'from-aurora-rose to-pink-600',
      badge: 'border-aurora-rose/30 text-aurora-rose bg-aurora-rose/10',
      tagline: 'Continuous delivery & reliability',
      tools: ['Vercel', 'Render', 'Git & GitHub', 'ImgBB / Cloudinary API'],
      metric: '99.9% Uptime',
    },
  ];

  const stackCategories = defaultPillars.map((def) => {
    const custom = profile?.techPillars?.find((p) => p.id === def.id);
    if (!custom) return def;
    return {
      ...def,
      label: custom.label || def.label,
      tagline: custom.tagline || def.tagline,
      metric: custom.metric || def.metric,
      tools:
        Array.isArray(custom.tools) && custom.tools.length > 0
          ? custom.tools
          : def.tools,
    };
  });

  const currentStack = stackCategories.find((c) => c.id === activeCategory) || stackCategories[0];
  const CurrentIcon = currentStack.icon;

  return (
    <div className="w-full max-w-lg relative group">
      {/* Outer ambient multi-color glow */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-aurora-cyan/20 via-aurora-violet/20 to-aurora-rose/20 blur-xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

      {/* Main Glassmorphism Showcase Card */}
      <div className="relative rounded-3xl bg-nebula-900/95 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Card Header Strip */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-nebula-950/80 border-b border-white/10 text-xs">
          {/* macOS Style Traffic Dots */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-400/40" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-400/40" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-400/40" />
            <span className="ml-2 font-mono text-[11px] text-slate-400 hidden sm:inline">
              Developer Identity Hub
            </span>
          </div>

          {/* Quick Copy Email Button */}
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-[11px] font-mono"
            title="Click to copy email address"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-aurora-cyan" />
                <span>Copy Email</span>
              </>
            )}
          </button>
        </div>

        {/* Profile Card Highlight */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Top Profile Intro Block */}
          <div className="flex items-center gap-4">
            {/* Avatar with glowing ring */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-0.5 bg-gradient-to-tr from-aurora-cyan via-aurora-violet to-aurora-rose flex-shrink-0 shadow-lg shadow-aurora-cyan/15">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-nebula-950">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.src = '/pfp.jpeg';
                  }}
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-nebula-950 shadow-sm" />
            </div>

            {/* Name, Title & Status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display text-lg sm:text-xl font-bold text-white truncate">
                  {name}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-aurora-cyan/15 text-aurora-cyan border border-aurora-cyan/30">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium truncate">
                {profile?.title || 'Full Stack MERN Developer'}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3 h-3 text-aurora-rose" />
                  <span>{profile?.location || 'Gaya ji, Bihar'}</span>
                </span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Open to Work</span>
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Stack Explorer Tabs */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-aurora-cyan" />
                <span>Interactive Tech Pillars</span>
              </span>
              <span className="text-[10px] font-mono text-aurora-cyan">Click to inspect</span>
            </div>

            {/* 4 Interactive Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {stackCategories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                      isActive
                        ? 'bg-white/15 text-white border border-white/30 shadow-md transform -translate-y-0.5'
                        : 'bg-nebula-950/60 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Expanded Category Details Card */}
            <div className="p-4 rounded-2xl bg-nebula-950/80 border border-white/10 transition-all duration-300 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br ${currentStack.color} flex items-center justify-center text-white shadow-sm`}
                  >
                    <CurrentIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                      {currentStack.label} Focus
                    </h4>
                    <p className="text-[11px] text-slate-400">{currentStack.tagline}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${currentStack.badge}`}
                >
                  {currentStack.metric}
                </span>
              </div>

              {/* Tools chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentStack.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs font-mono"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Interactive Actions Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>{profile?.telemetryText || 'Full-Stack Ready • Diploma CSE'}</span>
            </div>

            <a
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-rose text-white text-xs font-medium shadow-md shadow-aurora-cyan/20 hover:opacity-95 transition-all transform hover:scale-[1.02]"
            >
              <span>Connect With Me</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
