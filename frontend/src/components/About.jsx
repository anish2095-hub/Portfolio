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
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const About = () => {
  const { profile } = usePortfolio();

  const infoItems = [
    {
      icon: MapPin,
      label: 'Location',
      value: profile?.location || 'San Francisco, CA (Open to Remote)',
    },
    {
      icon: Briefcase,
      label: 'Experience',
      value: profile?.experienceYears || '4+ Years',
    },
    {
      icon: GraduationCap,
      label: 'Role',
      value: profile?.title || 'Full Stack MERN Developer',
    },
    {
      icon: Mail,
      label: 'Email',
      value: profile?.email || 'alex.rivera.dev@gmail.com',
      isLink: `mailto:${profile?.email || 'alex.rivera.dev@gmail.com'}`,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: profile?.phone || '+1 (415) 890-4321',
    },
    {
      icon: CheckCircle2,
      label: 'Status',
      value: 'Available for Work',
    },
  ];

  const socialLinks = profile?.socialLinks || {};

  return (
    <section id="about" className="py-24 border-t border-[#0284c7]/10 dark:border-[#38bdf8]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[#0284c7] dark:text-[#38bdf8] font-semibold mb-1">
            // About Me
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0c2333] dark:text-[#f0f9ff]">
            Background & Bio
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Avatar Column with subtle sky cyan border accent */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="relative w-60 sm:w-64 aspect-[4/5]">
              {/* Sky blue offset frame accent */}
              <div className="absolute top-4 left-4 w-full h-full rounded-2xl border-2 border-[#0284c7] dark:border-[#38bdf8] -z-0 opacity-70" />
              
              <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden bg-white dark:bg-[#102638] border border-[#0284c7]/15 dark:border-[#38bdf8]/15 shadow-sky-md">
                <img
                  src={
                    profile?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={profile?.name || 'Developer Avatar'}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bio & Details Column */}
          <div className="lg:col-span-8 flex flex-col">
            <p className="text-[#436174] dark:text-[#93b4cb] leading-relaxed mb-8 text-base sm:text-lg">
              {profile?.bio ||
                'I am a full-stack software engineer focused on building clean, high-performance web applications. From architecting scalable microservices and robust RESTful APIs to crafting thoughtful, accessible user interfaces, I focus on clean code and great developer ergonomics.'}
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              {infoItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white dark:bg-[#102638] border border-[#0284c7]/10 dark:border-[#38bdf8]/10 shadow-sky-sm"
                  >
                    <div className="p-2 rounded-lg bg-[#0284c7]/10 dark:bg-[#38bdf8]/15 text-[#0284c7] dark:text-[#38bdf8]">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-mono uppercase text-[#7895a7] dark:text-[#62839b]">
                        {item.label}
                      </span>
                      {item.isLink ? (
                        <a
                          href={item.isLink}
                          className="text-xs font-semibold text-[#0c2333] dark:text-[#f0f9ff] hover:text-[#0284c7] dark:hover:text-[#38bdf8] transition-colors truncate"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-xs font-semibold text-[#0c2333] dark:text-[#f0f9ff] truncate">
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Links & Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#0284c7]/10 dark:border-[#38bdf8]/10">
              <div className="flex items-center gap-2">
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-white dark:bg-[#102638] text-[#436174] dark:text-[#93b4cb] hover:text-white hover:bg-[#0284c7] dark:hover:bg-[#38bdf8] border border-[#0284c7]/15 dark:border-[#38bdf8]/15 hover:-translate-y-0.5 transition-all shadow-sky-sm"
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
                    className="p-2.5 rounded-full bg-white dark:bg-[#102638] text-[#436174] dark:text-[#93b4cb] hover:text-white hover:bg-[#0284c7] dark:hover:bg-[#38bdf8] border border-[#0284c7]/15 dark:border-[#38bdf8]/15 hover:-translate-y-0.5 transition-all shadow-sky-sm"
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
                    className="p-2.5 rounded-full bg-white dark:bg-[#102638] text-[#436174] dark:text-[#93b4cb] hover:text-white hover:bg-[#0284c7] dark:hover:bg-[#38bdf8] border border-[#0284c7]/15 dark:border-[#38bdf8]/15 hover:-translate-y-0.5 transition-all shadow-sky-sm"
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
                    className="p-2.5 rounded-full bg-white dark:bg-[#102638] text-[#436174] dark:text-[#93b4cb] hover:text-white hover:bg-red-600 border border-[#0284c7]/15 dark:border-[#38bdf8]/15 hover:-translate-y-0.5 transition-all shadow-sky-sm"
                    title="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-white dark:bg-[#102638] text-[#436174] dark:text-[#93b4cb] hover:text-white hover:bg-pink-600 border border-[#0284c7]/15 dark:border-[#38bdf8]/15 hover:-translate-y-0.5 transition-all shadow-sky-sm"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#e8f3fa] dark:bg-[#102638] hover:bg-[#0284c7] hover:text-white dark:hover:bg-[#38bdf8] text-[#0c2333] dark:text-[#f0f9ff] border border-[#0284c7]/15 dark:border-[#38bdf8]/15 text-xs font-mono font-medium transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
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
