import React from 'react';
import { Play, Youtube, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const MediaShowcase = () => {
  const { media, profile } = usePortfolio();

  if (!media || media.length === 0) return null;

  return (
    <section id="media" className="py-24 border-t border-[#0284c7]/10 dark:border-[#38bdf8]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#0284c7] dark:text-[#38bdf8] font-semibold mb-1">
            // Tutorials & Content
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0c2333] dark:text-[#f0f9ff]">
            Media & Videos
          </h2>
        </div>

        {/* Channel Banner with soft light sky gradient */}
        {profile?.socialLinks?.youtube && (
          <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-[#0284c7]/10 via-[#06b6d4]/10 to-[#38bdf8]/10 dark:from-[#38bdf8]/15 dark:to-[#67e8f9]/15 border border-[#0284c7]/15 dark:border-[#38bdf8]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sky-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Youtube className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#0c2333] dark:text-[#f0f9ff] text-base sm:text-lg">
                  YouTube Coding Tutorials & Walkthroughs
                </h3>
                <p className="text-xs sm:text-sm text-[#436174] dark:text-[#93b4cb]">
                  Full stack engineering tutorials, architectures, and technical deep-dives.
                </p>
              </div>
            </div>

            <a
              href={profile.socialLinks.youtube}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] dark:bg-[#38bdf8] dark:text-[#08141e] text-white text-xs font-mono font-medium shadow-sky-sm hover:shadow-sky-md transition-all flex-shrink-0"
            >
              <span>Visit Channel</span>
              <ExternalLink className="w-3.5 h-3.5" />
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
              className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-[#102638] border border-[#0284c7]/12 dark:border-[#38bdf8]/15 hover:border-[#0284c7] dark:hover:border-[#38bdf8] hover:-translate-y-1.5 transition-all duration-300 shadow-sky-sm hover:shadow-sky-md"
            >
              <div className="relative aspect-video bg-[#e8f3fa] dark:bg-[#08141e] overflow-hidden">
                <img
                  src={
                    item.thumbnailUrl ||
                    'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-[#08141e]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/95 text-[#0c2333] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5 text-[#0284c7]" />
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h4 className="font-display font-bold text-[#0c2333] dark:text-[#f0f9ff] text-sm mb-1.5 line-clamp-2">
                  {item.title}
                </h4>

                {item.caption && (
                  <p className="text-xs text-[#436174] dark:text-[#93b4cb] line-clamp-2 leading-relaxed mb-3">
                    {item.caption}
                  </p>
                )}

                <div className="mt-auto flex items-center text-xs font-mono text-[#0284c7] dark:text-[#38bdf8] font-medium gap-1">
                  <span>Watch Video</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
