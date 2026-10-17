import React from 'react';
import { Play, Youtube, ExternalLink, Video } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const MediaShowcase = () => {
  const { media, profile } = usePortfolio();

  if (!media || media.length === 0) return null;

  return (
    <section id="media" className="py-24 relative bg-slate-50/50 dark:bg-nebula-900/40 border-y border-slate-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-aurora-cyan font-semibold mb-2">
            // Tutorials & Creator Content
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Media & Creative Showcase
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-aurora-cyan to-aurora-violet rounded-full mt-3" />
          <p className="text-slate-400 max-w-xl text-sm sm:text-base mt-4">
            Educational videos, architectural deep dives, and tech insights.
          </p>
        </div>

        {/* Channel Banner */}
        {profile?.socialLinks?.youtube && (
          <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-rose-500/10 via-aurora-violet/10 to-aurora-cyan/10 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/30">
                <Youtube className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-lg">
                  Watch Coding Tutorials & Walkthroughs
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Sharing web development architectures, MERN tricks, and UI workflows.
                </p>
              </div>
            </div>

            <a
              href={profile.socialLinks.youtube}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-colors flex-shrink-0"
            >
              <Youtube className="w-4 h-4" />
              <span>Visit YouTube Channel</span>
            </a>
          </div>
        )}

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {media.map((item) => (
            <a
              key={item._id || item.title}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col rounded-2xl overflow-hidden bg-nebula-900/90 border border-white/10 hover:border-aurora-cyan/40 hover:bg-nebula-850/90 shadow-lg hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Thumbnail Container with Play Overlay */}
              <div className="relative aspect-video bg-nebula-800 overflow-hidden">
                <img
                  src={
                    item.thumbnailUrl ||
                    'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white">
                  HD
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <h4 className="font-display font-bold text-white text-base mb-2 group-hover:text-aurora-cyan transition-colors line-clamp-2">
                  {item.title}
                </h4>

                {item.caption && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {item.caption}
                  </p>
                )}

                <div className="mt-auto flex items-center text-xs font-mono text-aurora-cyan font-medium gap-1">
                  <span>Watch Video</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
