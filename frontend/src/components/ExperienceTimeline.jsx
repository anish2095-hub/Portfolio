import React, { useState } from 'react';
import { Briefcase, GraduationCap, Calendar, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { initialExperiences } from '../data/initialPortfolioData';

export const ExperienceTimeline = () => {
  const { experiences, loading } = usePortfolio();
  const [mobileTab, setMobileTab] = useState('all'); // 'all', 'work', 'education'

  const activeRecords =
    Array.isArray(experiences) && experiences.length > 0
      ? experiences
      : initialExperiences;

  const workItems = activeRecords.filter((e) => e.type === 'work');
  const educationItems = activeRecords.filter((e) => e.type === 'education');

  const renderTimelineList = (items, typeName) => (
    <div className="relative pl-6 sm:pl-8 border-l-2 border-white/10 space-y-8 sm:space-y-10">
      {items.map((item, idx) => (
        <div key={item._id || idx} className="relative group">
          {/* Glowing node dot */}
          <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-nebula-950 border-2 border-aurora-cyan group-hover:scale-125 group-hover:border-aurora-violet transition-all duration-300 shadow-sm" />

          {/* Period tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-aurora-cyan bg-aurora-cyan/10 border border-aurora-cyan/20 mb-2">
            <Calendar className="w-3 h-3" />
            <span>{item.period}</span>
            {item.current && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
            )}
          </div>

          {/* Title & Organization */}
          <h4 className="font-display text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-aurora-cyan transition-colors">
            {item.role}
          </h4>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-400 mb-2.5">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              {item.organization}
              {item.organizationUrl && (
                <a
                  href={item.organizationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block hover:text-aurora-cyan transition-colors"
                >
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              )}
            </span>
            {item.location && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="w-3 h-3" />
                {item.location}
              </span>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
              {item.description}
            </p>
          )}

          {/* Bullet achievements / highlights */}
          {item.highlights?.length > 0 && (
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-400">
              {item.highlights.map((h, hIdx) => (
                <li key={hIdx} className="flex items-start gap-2">
                  <span className="text-aurora-cyan font-bold mt-0.5">›</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <section id="experience" className="py-20 sm:py-24 relative overflow-hidden bg-nebula-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-aurora-cyan font-semibold mb-2">
            // Track Record
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Experience & Education
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-aurora-cyan to-aurora-violet rounded-full mt-3" />
        </div>

        {/* Mobile Tab Filter (Visible on small screens) */}
        <div className="flex sm:hidden items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setMobileTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
              mobileTab === 'all'
                ? 'bg-gradient-to-r from-aurora-cyan to-aurora-violet text-white shadow-md'
                : 'bg-nebula-900 text-slate-400 border border-white/10'
            }`}
          >
            All Tracks
          </button>
          <button
            onClick={() => setMobileTab('work')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
              mobileTab === 'work'
                ? 'bg-aurora-cyan text-slate-950 font-bold shadow-md'
                : 'bg-nebula-900 text-slate-400 border border-white/10'
            }`}
          >
            Work ({workItems.length})
          </button>
          <button
            onClick={() => setMobileTab('education')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
              mobileTab === 'education'
                ? 'bg-aurora-violet text-white font-bold shadow-md'
                : 'bg-nebula-900 text-slate-400 border border-white/10'
            }`}
          >
            Education ({educationItems.length})
          </button>
        </div>

        {/* Two-column layout: Work on Left, Education on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12">
          {/* Work Column */}
          {(mobileTab === 'all' || mobileTab === 'work') && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-aurora-cyan/15 text-aurora-cyan">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                    Work Experience
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Engineering, Client Deployments & Leadership
                  </span>
                </div>
              </div>
              {workItems.length > 0 ? (
                renderTimelineList(workItems, 'work')
              ) : (
                <div className="p-6 rounded-2xl bg-nebula-900 border border-white/10 text-center">
                  <p className="text-slate-400 text-sm">Work records being synchronized...</p>
                </div>
              )}
            </div>
          )}

          {/* Education Column */}
          {(mobileTab === 'all' || mobileTab === 'education') && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-aurora-violet/15 text-aurora-violet">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                    Education & Training
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Academic Background & Specialized Studies
                  </span>
                </div>
              </div>
              {educationItems.length > 0 ? (
                renderTimelineList(educationItems, 'education')
              ) : (
                <div className="p-6 rounded-2xl bg-nebula-900 border border-white/10 text-center">
                  <p className="text-slate-400 text-sm">Education records being synchronized...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
