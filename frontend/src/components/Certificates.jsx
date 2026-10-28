import React, { useMemo } from 'react';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { sortCertificatesNewestFirst } from '../utils/certificateDateDetector';
import { initialCertificates } from '../data/initialPortfolioData';
import { getSafeImageUrl, getCertificateFallback } from '../utils/imageFallback';

export const Certificates = () => {
  const { certificates } = usePortfolio();

  const activeCerts =
    Array.isArray(certificates) && certificates.length > 0
      ? certificates
      : initialCertificates;

  // Ensure certificates are strictly sorted newest first -> oldest last
  const sortedCertificates = useMemo(() => {
    return sortCertificatesNewestFirst(activeCerts);
  }, [activeCerts]);

  return (
    <section id="certificates" className="py-20 sm:py-24 relative overflow-hidden bg-nebula-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-aurora-cyan font-semibold mb-2">
            // Validated Credentials
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Licenses & Certifications
          </h2>
          <p className="text-xs text-slate-400 mt-2 font-mono">
            Chronological archive • Newest credentials displayed first
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-aurora-cyan to-aurora-violet rounded-full mt-3" />
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {sortedCertificates.map((cert) => {
            const fallbackImg = getCertificateFallback(cert.title, cert.issuer);
            const safeImg = getSafeImageUrl(cert.image, fallbackImg);

            return (
              <div
                key={cert._id || cert.title}
                className="group flex flex-col rounded-2xl overflow-hidden bg-nebula-900/90 border border-white/10 hover:border-aurora-cyan/40 hover:bg-nebula-850/90 shadow-lg hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] bg-nebula-800 overflow-hidden">
                  <img
                    src={safeImg}
                    alt={cert.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImg;
                    }}
                  />
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/70 backdrop-blur-md text-aurora-cyan border border-white/10">
                    <Award className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <span className="font-mono text-xs text-aurora-cyan font-semibold uppercase tracking-wider mb-1">
                    {cert.issuer}
                  </span>

                  <h4 className="font-display font-bold text-white text-base mb-2 group-hover:text-aurora-cyan transition-colors">
                    {cert.title}
                  </h4>

                  <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono inline-flex items-center gap-1.5 text-slate-300 font-medium bg-white/5 px-2 py-0.5 rounded-md">
                      <Calendar className="w-3 h-3 text-aurora-cyan" />
                      <span>{cert.issueDate}</span>
                    </span>

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-aurora-cyan transition-colors"
                        title="Verify Credential"
                      >
                        <span className="font-mono text-[11px]">Verify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
