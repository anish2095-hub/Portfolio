import React from 'react';
import { Award, ExternalLink, CheckCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Certificates = () => {
  const { certificates } = usePortfolio();

  return (
    <section id="certificates" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-aurora-cyan font-semibold mb-2">
            // Validated Credentials
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Licenses & Certifications
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-aurora-cyan to-aurora-violet rounded-full mt-3" />
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id || cert.title}
              className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-nebula-850 border border-slate-200 dark:border-white/5 hover:border-aurora-cyan/40 shadow-sm hover:shadow-xl dark:shadow-none hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] bg-slate-100 dark:bg-nebula-800 overflow-hidden">
                <img
                  src={
                    cert.image ||
                    'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/70 backdrop-blur-md text-aurora-cyan border border-white/10">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <span className="font-mono text-xs text-aurora-cyan font-semibold uppercase tracking-wider mb-1">
                  {cert.issuer}
                </span>

                <h4 className="font-display font-bold text-slate-900 dark:text-white text-base mb-2 group-hover:text-aurora-cyan transition-colors">
                  {cert.title}
                </h4>

                <div className="mt-auto pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono">{cert.issueDate}</span>

                  {cert.credentialUrl ? (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-aurora-cyan hover:underline font-medium"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-500">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
