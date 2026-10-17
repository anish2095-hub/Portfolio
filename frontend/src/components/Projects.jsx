import React, { useState } from 'react';
import { ExternalLink, Github, Star, X, Layers, Sparkles } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Projects = () => {
  const { projects } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = [
    { id: 'all', name: 'All Works' },
    { id: 'fullstack', name: 'Full Stack' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'ai-cloud', name: 'AI & Cloud' },
  ];

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 relative bg-nebula-950 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
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

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              type="button"
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project._id || project.title}
              className="group flex flex-col rounded-2xl overflow-hidden bg-nebula-900/90 border border-white/10 hover:border-aurora-cyan/40 hover:bg-nebula-850/90 shadow-lg hover:-translate-y-2 transition-all duration-300"
            >
              {/* Cover Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-nebula-800">
                <img
                  src={
                    project.coverImage ||
                    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80'
                  }
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 font-mono text-[11px] font-bold flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Featured</span>
                  </div>
                )}

                {/* Category tag */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-aurora-cyan font-mono text-[11px] font-medium border border-white/10">
                  {project.category}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1">
                <h3
                  onClick={() => setSelectedProject(project)}
                  className="font-display text-xl font-bold text-white mb-2 group-hover:text-aurora-cyan transition-colors cursor-pointer"
                >
                  {project.title}
                </h3>

                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-4 flex-1">
                  {project.summary}
                </p>

                {/* Technologies */}
                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.slice(0, 4).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 rounded-md font-mono text-[11px] bg-nebula-800 text-slate-300 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md font-mono text-[11px] text-slate-400">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Links */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-aurora-cyan hover:bg-aurora-cyan/90 transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-nebula-800 hover:text-white border border-white/10 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Source</span>
                    </a>
                  )}

                  <button
                    onClick={() => setSelectedProject(project)}
                    type="button"
                    className="ml-auto text-xs text-slate-400 hover:text-aurora-cyan font-mono transition-colors"
                  >
                    Details ›
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-nebula-900 border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setSelectedProject(null)}
              type="button"
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-nebula-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedProject.coverImage}
              alt={selectedProject.title}
              className="w-full h-56 object-cover rounded-xl mb-6"
            />

            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-aurora-cyan/10 text-aurora-cyan border border-aurora-cyan/20">
                {selectedProject.category}
              </span>
              {selectedProject.featured && (
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-500 font-semibold">
                  Featured
                </span>
              )}
            </div>

            <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {selectedProject.title}
            </h3>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              {selectedProject.description || selectedProject.summary}
            </p>

            <div className="mb-6">
              <h4 className="font-mono text-xs uppercase text-slate-400 mb-2 font-semibold">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies?.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-nebula-850 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-aurora-cyan hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Live App</span>
                </a>
              )}
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-nebula-850 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>View Repository</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
