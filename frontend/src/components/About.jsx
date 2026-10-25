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
      value: profile?.location || 'Gaya ji, Bihar',
      badgeBg: 'bg-aurora-cyan/15 text-aurora-cyan border-aurora-cyan/30',
    },
    {
      icon: Briefcase,
      label: 'Experience',
      value: profile?.experienceYears || '2+ years',
      badgeBg: 'bg-aurora-violet/15 text-aurora-violet border-aurora-violet/30',
    },
    {
      icon: GraduationCap,
      label: 'Degree',
      value: profile?.degree || 'Diploma in Computer Science',
      badgeBg: 'bg-emerald-400/15 text-emerald-400 border-emerald-400/30',
    },
    {
      icon: Mail,
      label: 'Email',
      value: profile?.email || 'anishsingh2095@gmail.com',
      isLink: `mailto:${profile?.email || 'anishsingh2095@gmail.com'}`,
      badgeBg: 'bg-aurora-rose/15 text-aurora-rose border-aurora-rose/30',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: profile?.phone || '+91 9334398322',
      badgeBg: 'bg-aurora-sky/15 text-aurora-sky border-aurora-sky/30',
    },
    {
      icon: CheckCircle2,
      label: 'Status',
      value: profile?.availability || 'Open to Work',
      badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    },
  ];

  const socialLinks = profile?.socialLinks || {};

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-nebula-950">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-aurora-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-aurora-violet/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-aurora-cyan font-semibold mb-2">
            // Who I Am
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            About Me
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-aurora-cyan to-aurora-violet rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Avatar Column with glowing offset frame (Full color photo - no grayscale) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 group">
              {/* Offset glowing background card */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-aurora-cyan via-aurora-violet to-aurora-rose transform translate-x-3 translate-y-3 opacity-70 group-hover:translate-x-4 group-hover:translate-y-4 group-hover:opacity-100 transition-all duration-300 blur-sm" />

              {/* Outer border container */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-nebula-900 border border-white/15 shadow-2xl z-10">
                <img
                  src={
                    profile?.avatar && !profile.avatar.includes('photo-1534528741775-53994a69daeb')
                      ? profile.avatar
                      : '/pfp.jpeg'
                  }
                  alt={profile?.name || 'Anish Singh'}
                  className="w-full h-full object-cover object-center transition-all duration-500 transform group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/pfp.jpeg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nebula-950 via-nebula-950/25 to-transparent opacity-85" />
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <p className="font-display font-bold text-white text-lg">
                    {profile?.name || 'Anish Singh'}
                  </p>
                  <p className="font-mono text-xs text-aurora-cyan font-medium">
                    {profile?.title || 'Aspiring Software Developer'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio & Details Column */}
          <div className="lg:col-span-7 flex flex-col">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug">
              Passionate about creating clean code and memorable digital experiences.
            </h3>

            <p className="text-slate-300 leading-relaxed mb-6 text-base sm:text-lg">
              {profile?.bio ||
                "Hi, I'm Anish—an aspiring software developer and a CSE student who is passionate about technology, programming, and building meaningful digital experiences."}
            </p>

            {/* Info Grid - Sleek Dark Glass Cards with light colorful accent badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              {infoItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-nebula-900/90 border border-white/10 hover:border-aurora-cyan/40 hover:bg-nebula-850/90 backdrop-blur-sm transition-all duration-300 shadow-md group"
                  >
                    <div
                      className={`p-2.5 rounded-xl border flex-shrink-0 transition-transform group-hover:scale-105 ${item.badgeBg}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-0.5">
                        {item.label}
                      </span>
                      {item.isLink ? (
                        <a
                          href={item.isLink}
                          className="text-xs sm:text-sm font-semibold text-white group-hover:text-aurora-cyan transition-colors truncate"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-xs sm:text-sm font-semibold text-white truncate">
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Links & Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2.5">
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-nebula-900 text-slate-300 hover:text-white hover:bg-nebula-800 border border-white/10 hover:border-aurora-cyan/40 transition-all transform hover:-translate-y-1 shadow-md"
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
                    className="p-3 rounded-xl bg-nebula-900 text-slate-300 hover:text-white hover:bg-[#0077b5] border border-white/10 hover:border-[#0077b5] transition-all transform hover:-translate-y-1 shadow-md"
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
                    className="p-3 rounded-xl bg-nebula-900 text-slate-300 hover:text-white hover:bg-nebula-800 border border-white/10 hover:border-white/30 transition-all transform hover:-translate-y-1 shadow-md"
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
                    className="p-3 rounded-xl bg-nebula-900 text-slate-300 hover:text-white hover:bg-rose-600 border border-white/10 hover:border-rose-500 transition-all transform hover:-translate-y-1 shadow-md"
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
                    className="p-3 rounded-xl bg-nebula-900 text-slate-300 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:to-rose-500 border border-white/10 hover:border-rose-400 transition-all transform hover:-translate-y-1 shadow-md"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>

              <a
                href={
                  profile?.resumeUrl && profile.resumeUrl !== '#'
                    ? profile.resumeUrl
                    : '#contact'
                }
                target={
                  profile?.resumeUrl && profile.resumeUrl !== '#'
                    ? '_blank'
                    : '_self'
                }
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-nebula-900 hover:bg-nebula-850 text-white border border-aurora-cyan/40 hover:border-aurora-cyan text-xs sm:text-sm font-mono font-medium transition-all shadow-lg hover:shadow-aurora-cyan/20 transform hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4 text-aurora-cyan" />
                <span>Download CV</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
