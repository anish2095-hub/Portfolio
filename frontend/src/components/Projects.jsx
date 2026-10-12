import React, { useState } from 'react';
import { ExternalLink, Github, Star, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Projects = () => {
  const { projects } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = [
    { id: 'all', name: 'All' },
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
    <section id="projects" className="py-24 border-t border-[#0284c7]/10 dark:border-[#38bdf8]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#0284c7] dark:text-[#38bdf8] font-semibold mb-1">
            // Selected Work
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0c2333] dark:text-[#f0f9ff]">
            Featured Projects
          </h2>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              type="button"
              className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#0284c7] text-white shadow-sky-sm'
                  : 'bg-white dark:bg-[#102638] text-[#436174] dark:text-[#93b4cb] hover:text-[#0284c7] dark:hover:text-white border border-[#0284c7]/15 dark:border-[#38bdf8]/15 hover:border-[#0284c7]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id || project.title}
              className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-[#102638] border border-[#0284c7]/12 dark:border-[#38bdf8]/15 hover:border-[#0284c7] dark:hover:border-[#38bdf8] shadow-sky-sm hover:shadow-sky-lg hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#e8f3fa] dark:bg-[#08141e]">
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
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0c2333]/85 backdrop-blur-xs text-[#f0f9ff] font-mono text-[10px] font-medium flex items-center gap-1.5 shadow-sm">
                    <Star className="w-3 h-3 fill-current text-[#38bdf8]" />
                    <span>Featured</span>
                  </div>
                )}

                {/* Category tag */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#08141e]/90 text-[#0c2333] dark:text-[#f0f9ff] font-mono text-[10px] font-medium">
                  {project.category}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1">
                <h3
                  onClick={() => setSelectedProject(project)}
                  className="font-display text-lg font-bold text-[#0c2333] dark:text-[#f0f9ff] mb-2 hover:text-[#0284c7] dark:hover:text-[#38bdf8] transition-colors cursor-pointer"
                >
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#436174] dark:text-[#93b4cb] line-clamp-2 leading-relaxed mb-4 flex-1">
                  {project.summary}
                </p>

                {/* Technologies */}
                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies.slice(0, 4).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-full font-mono text-[10px] bg-[#0284c7]/10 dark:bg-[#38bdf8]/15 text-[#0284c7] dark:text-[#38bdf8] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-1 rounded-full font-mono text-[10px] text-[#7895a7]">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Links */}
                <div className="flex items-center gap-2 pt-4 border-t border-[#0284c7]/10 dark:border-[#38bdf8]/10">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium text-white bg-[#0284c7] hover:bg-[#0369a1] dark:bg-[#38bdf8] dark:hover:bg-[#7dd3fc] dark:text-[#08141e] transition-colors"
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
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono text-[#0c2333] dark:text-[#f0f9ff] bg-[#e8f3fa] dark:bg-[#08141e] hover:bg-[#0284c7]/15 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}

                  <button
                    onClick={() => setSelectedProject(project)}
                    type="button"
                    className="ml-auto text-xs text-[#7895a7] dark:text-[#62839b] hover:text-[#0284c7] dark:hover:text-[#38bdf8] font-mono transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#f4f9fd] dark:bg-[#102638] border border-[#0284c7]/20 dark:border-[#38bdf8]/20 shadow-sky-lg p-6 sm:p-7">
            <button
              onClick={() => setSelectedProject(null)}
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#7895a7] hover:text-[#0c2333] dark:hover:text-white hover:bg-[#e8f3fa] dark:hover:bg-[#08141e] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedProject.coverImage}
              alt={selectedProject.title}
              className="w-full h-48 object-cover rounded-xl mb-4 border border-[#0284c7]/15 dark:border-[#38bdf8]/15"
            />

            <h3 className="font-display text-2xl font-bold text-[#0c2333] dark:text-[#f0f9ff] mb-2">
              {selectedProject.title}
            </h3>

            <p className="text-[#436174] dark:text-[#93b4cb] text-sm leading-relaxed mb-5">
              {selectedProject.description || selectedProject.summary}
            </p>

            <div className="mb-6">
              <h4 className="font-mono text-xs uppercase text-[#7895a7] dark:text-[#62839b] mb-2 font-semibold">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies?.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-[#0284c7]/10 dark:bg-[#38bdf8]/15 text-[#0284c7] dark:text-[#38bdf8] font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#0284c7]/15 dark:border-[#38bdf8]/15">
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg font-medium text-xs font-mono text-white bg-[#0284c7] hover:bg-[#0369a1] dark:bg-[#38bdf8] dark:text-[#08141e] shadow-sky-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Live Application</span>
                </a>
              )}
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium text-xs font-mono text-[#0c2333] dark:text-[#f0f9ff] bg-white dark:bg-[#08141e] border border-[#0284c7]/20 dark:border-[#38bdf8]/20 hover:border-[#0284c7]"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
