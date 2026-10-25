import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, Send, Sparkles, ChevronDown } from 'lucide-react';
import { HeroShowcase } from './HeroShowcase';
import { usePortfolio } from '../context/PortfolioContext';

export const Hero = () => {
  const { profile } = usePortfolio();

  const roles = profile?.typingRoles?.length
    ? profile.typingRoles
    : [
        'Full Stack Developer',
        'MERN Stack Architect',
        'Creative UI/UX Designer',
        'Cloud & API Specialist',
      ];

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullRole = roles[roleIndex % roles.length];
    let typingSpeed = isDeleting ? 40 : 90;

    if (!isDeleting && displayText === currentFullRole) {
      const timeout = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting
          ? currentFullRole.substring(0, prev.length - 1)
          : currentFullRole.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, roles]);

  return (
    <section className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden bg-nebula-950">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-aurora-cyan/15 rounded-full blur-[120px] pointer-events-none aurora-orb" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-aurora-violet/15 rounded-full blur-[130px] pointer-events-none aurora-orb" />
      <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-aurora-rose/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Introductions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-nebula-900 border border-white/10 text-xs font-mono text-slate-300 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{profile?.availability || 'Available for New Projects & Full-time Roles'}</span>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-4">
              Hi, I'm{' '}
              <span className="gradient-text-aurora">
                {profile?.name || 'Anish Singh'}
              </span>
            </h1>

            {/* Animated Typing Role */}
            <div className="font-mono text-xl sm:text-2xl font-semibold text-slate-300 mb-6 flex items-center min-h-[2.5rem]">
              <span className="text-aurora-cyan mr-2">&gt;</span>
              <span className="text-white">{displayText}</span>
              <span className="w-2.5 h-6 ml-1 bg-aurora-cyan animate-pulse inline-block" />
            </div>

            {/* Tagline / Summary */}
            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed mb-8">
              {profile?.tagline ||
                'Designing and engineering high-impact digital products, scalable web architectures, and fluid interactive experiences.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-rose hover:opacity-95 shadow-lg shadow-aurora-cyan/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm text-white bg-nebula-900 hover:bg-nebula-850 border border-white/10 hover:border-aurora-cyan/40 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4 text-aurora-cyan" />
                <span>Contact Me</span>
              </a>

              {profile?.resumeUrl && profile.resumeUrl !== '#' && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-slate-300 hover:text-white border border-transparent hover:border-white/10 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Resume</span>
                </a>
              )}
            </div>

            {/* Quick Metrics */}
            {profile?.stats?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10 w-full">
                {profile.stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="font-display text-2xl font-bold text-white">
                      {stat.value}
                    </span>
                    <span className="text-xs text-slate-400 font-medium mt-0.5">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Interactive Developer Bento Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroShowcase profile={profile} />
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <a
        href="#about"
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 hover:text-aurora-cyan transition-colors"
        aria-label="Scroll down to About section"
      >
        <span className="font-mono text-[11px]">SCROLL</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  );
};
