import React from 'react';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  CheckCircle2,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Download,
  ExternalLink,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const About = () => {
  const { profile } = usePortfolio();

  const infoItems = [
    {
      icon: MapPin,
      label: 'Location',
      value: profile?.location || 'India (Open to Remote)',
    },
    {
      icon: Briefcase,
      label: 'Experience',
      value: profile?.experienceYears || '2+ Years',
    },
    {
      icon: GraduationCap,
      label: 'Degree',
      value: profile?.degree || 'Computer Science Engineering',
    },
    {
      icon: Mail,
      label: 'Email',
      value: profile?.email || 'anishsingh2095@gmail.com',
      isLink: `mailto:${profile?.email || 'anishsingh2095@gmail.com'}`,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: profile?.phone || '+91 98765 43210',
    },
    {
      icon: CheckCircle2,
      label: 'Status',
      value: 'Open to Work',
    },
  ];

  const socialLinks = profile?.socialLinks || {};

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-aurora-cyan font-semibold mb-2">
            // Who I Am
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            About Me
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-aurora-cyan to-aurora-violet rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Avatar Column with glowing offset frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 group">
              {/* Offset glowing background card */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-aurora-cyan via-aurora-violet to-aurora-rose transform translate-x-3 translate-y-3 opacity-60 group-hover:translate-x-4 group-hover:translate-y-4 group-hover:opacity-90 transition-all duration-300 blur-[2px]" />
              
              {/* Outer border container */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/60 dark:border-white/10 shadow-2xl z-10">
                <img
                  src={
                    profile?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={profile?.name || 'Developer Avatar'}
                  className="w-full h-full object-cover object-center filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nebula-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <p className="font-display font-bold text-white text-lg">
                    {profile?.name || 'Alex Rivera'}
                  </p>
                  <p className="font-mono text-xs text-aurora-cyan">
                    {profile?.title || 'Full Stack Engineer'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Details Column */}
          <div className="lg:col-span-7 flex flex-col">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Passionate about creating clean code and memorable digital experiences.
            </h3>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-base sm:text-lg">
              {profile?.bio ||
                'I am a full-stack software engineer with a deep passion for building polished digital experiences. From architecting scalable microservices and robust RESTful APIs to crafting pixel-perfect, accessible user interfaces, I blend technical rigor with artistic design intuition.'}
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              {infoItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-nebula-850/60 border border-slate-200 dark:border-white/5 hover:border-aurora-cyan/30 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-aurora-cyan/10 text-aurora-cyan flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-mono uppercase text-slate-400 dark:text-slate-400">
                        {item.label}
                      </span>
                      {item.isLink ? (
                        <a
                          href={item.isLink}
                          className="text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-aurora-cyan transition-colors truncate"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Links & Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-nebula-850 text-slate-600 dark:text-slate-400 hover:text-white hover:bg-slate-900 dark:hover:bg-aurora-cyan dark:hover:text-nebula-950 transition-all transform hover:-translate-y-1 shadow-sm"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-nebula-850 text-slate-600 dark:text-slate-400 hover:text-white hover:bg-[#0077b5] dark:hover:bg-[#0077b5] dark:hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-nebula-850 text-slate-600 dark:text-slate-400 hover:text-white hover:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
                    title="Twitter / X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-nebula-850 text-slate-600 dark:text-slate-400 hover:text-white hover:bg-[#ff0000] dark:hover:bg-[#ff0000] dark:hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
                    title="YouTube Channel"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-nebula-850 text-slate-600 dark:text-slate-400 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:to-rose-500 dark:hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>

              {profile?.resumeUrl && profile.resumeUrl !== '#' && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-aurora-cyan/10 hover:bg-aurora-cyan/20 text-aurora-cyan border border-aurora-cyan/30 text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CV</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
