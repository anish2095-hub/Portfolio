import React from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Certificates = () => {
  const { certificates } = usePortfolio();

  return (
    <section id="certificates" className="py-24 border-t border-[#0284c7]/10 dark:border-[#38bdf8]/10 bg-[#e8f3fa]/40 dark:bg-[#0c1d2b]/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#0284c7] dark:text-[#38bdf8] font-semibold mb-1">
            // Credentials
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0c2333] dark:text-[#f0f9ff]">
            Licenses & Certifications
          </h2>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certificates.map((cert) => (
            <div
              key={cert._id || cert.title}
              className="flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-[#102638] border border-[#0284c7]/12 dark:border-[#38bdf8]/15 hover:border-[#0284c7] dark:hover:border-[#38bdf8] hover:-translate-y-1 transition-all duration-300 shadow-sky-sm hover:shadow-sky-md"
            >
              <div className="relative aspect-[4/3] bg-[#e8f3fa] dark:bg-[#08141e] overflow-hidden">
                <img
                  src={
                    cert.image ||
                    'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              <div className="p-4 flex flex-col flex-1">
                <span className="font-mono text-[10px] text-[#0284c7] dark:text-[#38bdf8] uppercase tracking-wider font-semibold mb-1">
                  {cert.issuer}
                </span>

                <h4 className="font-display font-bold text-[#0c2333] dark:text-[#f0f9ff] text-sm mb-2 line-clamp-2">
                  {cert.title}
                </h4>

                <div className="mt-auto pt-3 border-t border-[#0284c7]/10 dark:border-[#38bdf8]/10 flex items-center justify-between text-xs text-[#7895a7] dark:text-[#62839b]">
                  <span className="font-mono text-[11px]">{cert.issueDate}</span>

                  {cert.credentialUrl ? (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#0284c7] dark:text-[#38bdf8] hover:underline font-mono text-[11px] font-medium"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="flex items-center gap-1 text-[#0284c7] dark:text-[#38bdf8] font-mono text-[11px]">
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
