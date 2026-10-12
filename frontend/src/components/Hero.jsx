import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, Send, ChevronDown } from 'lucide-react';
import { CodeWindow } from './CodeWindow';
import { usePortfolio } from '../context/PortfolioContext';

export const Hero = () => {
  const { profile } = usePortfolio();

  const roles = profile?.typingRoles?.length
    ? profile.typingRoles
    : [
        'Full Stack Developer',
        'MERN Stack Builder',
        'Cloud & API Engineer',
        'UI/UX Creative Developer',
      ];

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullRole = roles[roleIndex % roles.length];
    let typingSpeed = isDeleting ? 35 : 75;

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
    <section className="relative min-h-[92vh] pt-28 pb-16 flex items-center justify-center hero-radial-bg overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0284c7]/10 dark:bg-[#38bdf8]/15 border border-[#0284c7]/25 dark:border-[#38bdf8]/30 text-xs font-mono text-[#0284c7] dark:text-[#38bdf8] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#0284c7] dark:bg-[#38bdf8] animate-pulse" />
              <span>{profile?.availability || 'Available for web projects & freelance'}</span>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0c2333] dark:text-[#f0f9ff] leading-[1.12] mb-4">
              Hi, I'm <span className="text-[#0284c7] dark:text-[#38bdf8]">{profile?.name || 'Alex Rivera'}</span>.
            </h1>

            {/* Typing Role */}
            <div className="font-mono text-xl sm:text-2xl font-semibold text-[#436174] dark:text-[#93b4cb] mb-5 flex items-center min-h-[2.2rem]">
              <span className="text-[#06b6d4] dark:text-[#67e8f9] mr-2">›</span>
              <span className="text-[#0284c7] dark:text-[#38bdf8]">{displayText}</span>
              <span className="w-2.5 h-6 ml-1 bg-[#06b6d4] dark:bg-[#67e8f9] animate-pulse inline-block" />
            </div>

            {/* Tagline */}
            <p className="text-base sm:text-lg text-[#436174] dark:text-[#93b4cb] max-w-xl leading-relaxed mb-8">
              {profile?.tagline ||
                'Designing and building modern web applications, scalable architectures, and smooth interactive interfaces.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-sky-md hover:shadow-sky-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-[#0c2333] dark:text-[#f0f9ff] bg-white dark:bg-[#102638] hover:bg-[#e8f3fa] dark:hover:bg-[#153249] border border-[#0284c7]/20 dark:border-[#38bdf8]/20 hover:border-[#0284c7] dark:hover:border-[#38bdf8] hover:-translate-y-0.5 transition-all duration-200"
              >
                <Send className="w-4 h-4 text-[#06b6d4] dark:text-[#67e8f9]" />
                <span>Contact Me</span>
              </a>

              {profile?.resumeUrl && profile.resumeUrl !== '#' && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium text-sm text-[#436174] dark:text-[#93b4cb] hover:text-[#0284c7] dark:hover:text-[#38bdf8] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Resume</span>
                </a>
              )}
            </div>

            {/* Metrics */}
            {profile?.stats?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-[#0284c7]/15 dark:border-[#38bdf8]/15 w-full">
                {profile.stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="font-display text-2xl font-bold text-[#0c2333] dark:text-[#f0f9ff]">
                      {stat.value}
                    </span>
                    <span className="text-xs text-[#7895a7] dark:text-[#62839b] font-medium mt-0.5">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Code Window */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <CodeWindow profile={profile} />
          </div>
        </div>
      </div>

      {/* Scroll Down */}
      <a
        href="#about"
        className="hidden md:flex absolute bottom-5 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-xs text-[#7895a7] dark:text-[#62839b] hover:text-[#0284c7] dark:hover:text-[#38bdf8] transition-colors"
        aria-label="Scroll to About"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
      </a>
    </section>
  );
};
