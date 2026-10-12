import React from 'react';
import { Briefcase, GraduationCap, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const ExperienceTimeline = () => {
  const { experiences } = usePortfolio();

  const workItems = experiences.filter((e) => e.type === 'work');
  const educationItems = experiences.filter((e) => e.type === 'education');

  const renderTimelineList = (items) => (
    <div className="relative pl-7 border-l-2 border-[#0284c7]/20 dark:border-[#38bdf8]/20 space-y-9">
      {items.map((item, idx) => (
        <div key={item._id || idx} className="relative group">
          {/* Sky blue timeline node with pulse hover */}
          <div className="absolute -left-[35px] top-1.5 w-3 h-3 rounded-full bg-[#0284c7] dark:bg-[#38bdf8] ring-4 ring-[#f4f9fd] dark:ring-[#08141e] shadow-sky-sm transition-transform group-hover:scale-125" />

          {/* Period tag */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono text-[#7895a7] dark:text-[#62839b] bg-[#e8f3fa] dark:bg-[#102638] border border-[#0284c7]/15 dark:border-[#38bdf8]/15 mb-2">
            <Calendar className="w-3 h-3 text-[#0284c7] dark:text-[#38bdf8]" />
            <span>{item.period}</span>
            {item.current && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] dark:bg-[#38bdf8] ml-1" />
            )}
          </div>

          {/* Title & Organization */}
          <h4 className="font-display text-lg font-bold text-[#0c2333] dark:text-[#f0f9ff] mb-0.5">
            {item.role}
          </h4>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#7895a7] dark:text-[#62839b] mb-2.5">
            <span className="font-semibold text-[#0284c7] dark:text-[#38bdf8] flex items-center gap-1">
              {item.organization}
              {item.organizationUrl && (
                <a
                  href={item.organizationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </span>
            {item.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {item.location}
              </span>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-xs sm:text-sm text-[#436174] dark:text-[#93b4cb] leading-relaxed mb-2.5">
              {item.description}
            </p>
          )}

          {/* Bullet achievements */}
          {item.highlights?.length > 0 && (
            <ul className="space-y-1 text-xs text-[#436174] dark:text-[#93b4cb]">
              {item.highlights.map((h, hIdx) => (
                <li key={hIdx} className="flex items-start gap-2">
                  <span className="text-[#06b6d4] dark:text-[#67e8f9] font-bold">•</span>
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
    <section id="experience" className="py-24 border-t border-[#0284c7]/10 dark:border-[#38bdf8]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[#0284c7] dark:text-[#38bdf8] font-semibold mb-1">
            // History
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0c2333] dark:text-[#f0f9ff]">
            Experience & Education
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 rounded-lg bg-[#0284c7]/10 dark:bg-[#38bdf8]/15 text-[#0284c7] dark:text-[#38bdf8]">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#0c2333] dark:text-[#f0f9ff]">
                Work Experience
              </h3>
            </div>
            {workItems.length > 0 ? (
              renderTimelineList(workItems)
            ) : (
              <p className="text-xs text-[#7895a7]">No records available.</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 rounded-lg bg-[#06b6d4]/15 text-[#06b6d4] dark:text-[#67e8f9]">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#0c2333] dark:text-[#f0f9ff]">
                Education
              </h3>
            </div>
            {educationItems.length > 0 ? (
              renderTimelineList(educationItems)
            ) : (
              <p className="text-xs text-[#7895a7]">No records available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
