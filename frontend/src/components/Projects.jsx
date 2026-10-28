import React, { useState } from 'react';
import { ExternalLink, Github, Star, X, Layers, Sparkles } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { initialProjects } from '../data/initialPortfolioData';
import { getSafeImageUrl, getProjectFallback } from '../utils/imageFallback';

export const Projects = () => {
  const { projects, loading } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const activeProjects =
    Array.isArray(projects) && projects.length > 0 ? projects : initialProjects;

  const categories = [
    { id: 'all', name: 'All Works' },
    { id: 'fullstack', name: 'Full Stack' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'ai-cloud', name: 'AI & Cloud' },
  ];

  const filteredProjects =
    activeCategory === 'all'
      ? activeProjects
      : activeProjects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 sm:py-24 relative bg-nebula-950 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-aurora-cyan font-semibold mb-2">
            // Featured Work
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Selected Projects
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-aurora-cyan to-aurora-violet rounded-full mt-3" />
          <p className="text-slate-400 max-w-xl text-sm sm:text-base mt-4">
            A curated collection of web applications, cloud architectures, and open-source software I've built.
          </p>
        </div>

        {/* Categories Pills (Horizontally scrollable on mobile, centered on desktop) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 justify-start sm:justify-center mb-10 -mx-4 sm:mx-0 px-4 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              type="button"
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-aurora-cyan to-aurora-violet text-white shadow-md shadow-aurora-cyan/20 scale-105'
                  : 'bg-nebula-900 text-slate-400 hover:text-white border border-white/10 hover:border-aurora-cyan/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full py-16 px-4 rounded-3xl bg-nebula-900/60 border border-white/10 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-aurora-cyan/10 text-aurora-cyan flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-1">
                More projects in this category coming soon!
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-4">
                I am actively developing new applications in this stack.
              </p>
              <button
                onClick={() => setActiveCategory('all')}
                className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-aurora-cyan border border-aurora-cyan/30 hover:bg-aurora-cyan/10 transition-colors cursor-pointer"
              >
                View All Works
              </button>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const fallbackCover = getProjectFallback(project.title, project.category);
              const safeCover = getSafeImageUrl(project.coverImage, fallbackCover);

              return (
                <div
                  key={project._id || project.title}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-nebula-900/90 border border-white/10 hover:border-aurora-cyan/40 hover:bg-nebula-850/90 shadow-lg hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Cover Image Container */}
                  <div
                    onClick={() => setSelectedProject(project)}
                    className="relative aspect-[16/10] overflow-hidden bg-nebula-800 cursor-pointer"
                  >
                    <img
                      src={safeCover}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackCover;
                      }}
                    />

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 font-mono text-[10px] sm:text-[11px] font-bold flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Featured</span>
                      </div>
                    )}

                    {/* Category tag */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-aurora-cyan font-mono text-[10px] sm:text-[11px] font-medium border border-white/10">
                      {project.category}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <h3
                      onClick={() => setSelectedProject(project)}
                      className="font-display text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-aurora-cyan transition-colors cursor-pointer"
                    >
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
                      {project.summary || project.description}
                    </p>

                    {/* Tech Pills */}
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {project.technologies.slice(0, 4).map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-white/5 border border-white/5 text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/5 text-slate-500">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bottom Actions */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-aurora-cyan hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <span>Details</span>
                        <span>&rarr;</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                            title="GitHub Repository"
                            aria-label="GitHub Repository"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-aurora-cyan/10 hover:bg-aurora-cyan text-aurora-cyan hover:text-slate-950 transition-colors"
                            title="Live Demo"
                            aria-label="Live Demo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Project Modal Preview (Mobile & Desktop Responsive) */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-nebula-900 border border-white/15 p-5 sm:p-8 shadow-2xl space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-nebula-800">
              <img
                src={getSafeImageUrl(
                  selectedProject.coverImage,
                  getProjectFallback(selectedProject.title, selectedProject.category)
                )}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getProjectFallback(
                    selectedProject.title,
                    selectedProject.category
                  );
                }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-aurora-cyan/15 text-aurora-cyan border border-aurora-cyan/30">
                  {selectedProject.category}
                </span>
                {selectedProject.featured && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Featured</span>
                  </span>
                )}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                {selectedProject.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                {selectedProject.description || selectedProject.summary}
              </p>

              {/* Technologies */}
              {selectedProject.technologies?.length > 0 && (
                <div className="space-y-2 mb-6">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-aurora-cyan"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-950 bg-aurora-cyan hover:bg-aurora-sky transition-colors shadow-lg"
                  >
                    <span>View Live Demo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Source</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
