import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { messageAPI } from '../services/api';
import { usePortfolio } from '../context/PortfolioContext';

export const Contact = () => {
  const { profile } = usePortfolio();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sentLinks, setSentLinks] = useState({ gmail: '', mailto: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const emailTo = 'anishsingh2095@gmail.com';
    const cleanSubject = (formData.subject || `New Portfolio Message from ${formData.name}`).trim();
    const cleanBody = `Hi Anish,\n\n${formData.message}\n\n---\nSender Details:\nName: ${formData.name}\nEmail: ${formData.email}`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailTo)}&su=${encodeURIComponent(cleanSubject)}&body=${encodeURIComponent(cleanBody)}`;
    const mailtoUrl = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(cleanSubject)}&body=${encodeURIComponent(cleanBody)}`;

    setSentLinks({ gmail: gmailUrl, mailto: mailtoUrl });

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';

    try {
      let apiDelivered = false;

      // 1. If Web3Forms key is available, send silently via API
      if (accessKey) {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: accessKey,
            name: formData.name,
            email: formData.email,
            subject: cleanSubject,
            message: formData.message,
            from_name: `${formData.name} via Portfolio`,
            replyto: formData.email,
          }),
        });

        const data = await response.json().catch(() => ({}));
        if (data.success) {
          apiDelivered = true;
        } else {
          console.warn('Web3Forms response:', data);
        }
      }

      // 2. Also save to MERN backend API
      await messageAPI.send({
        name: formData.name,
        email: formData.email,
        subject: cleanSubject,
        message: formData.message,
      }).catch((err) => {
        console.warn('Backend message save notice:', err);
      });

      // 3. If no external API key, open Gmail or mail client automatically
      if (!apiDelivered) {
        const opened = window.open(gmailUrl, '_blank');
        if (!opened || opened.closed || typeof opened.closed === 'undefined') {
          window.location.href = mailtoUrl;
        }
      }

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Trigger confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#8b5cf6', '#f43f5e', '#38bdf8'],
      });
    } catch (err) {
      console.error('Contact submit error:', err);
      setError('Could not auto-open. Click below to send directly via Gmail.');
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = profile?.socialLinks || {};

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-nebula-950">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-aurora-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-aurora-cyan font-semibold mb-2">
            // Start A Conversation
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Get In Touch
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-aurora-cyan to-aurora-violet rounded-full mt-3" />
          <p className="text-slate-400 max-w-xl text-sm sm:text-base mt-4">
            Have a project in mind, looking for a new team member, or just want to connect? My inbox is always open!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <h3 className="font-display text-2xl font-bold text-white">
              Let's talk about your next project or role
            </h3>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              I'm actively looking for opportunities to contribute high performance software engineering, clean architectures, and modern user experiences.
            </p>

            <div className="space-y-4 pt-2">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-nebula-900 border border-white/10 hover:border-aurora-cyan/40 shadow-md transition-all group"
                >
                  <div className="p-3 rounded-xl bg-aurora-cyan/15 text-aurora-cyan group-hover:bg-aurora-cyan group-hover:text-nebula-950 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                      Email Address
                    </span>
                    <span className="text-sm font-semibold text-white group-hover:text-aurora-cyan transition-colors">
                      {profile.email}
                    </span>
                  </div>
                </a>
              )}

              {profile?.phone && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-nebula-900 border border-white/10 shadow-md">
                  <div className="p-3 rounded-xl bg-aurora-violet/15 text-aurora-violet">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                      Phone Number
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {profile.phone}
                    </span>
                  </div>
                </div>
              )}

              {profile?.location && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-nebula-900 border border-white/10 shadow-md">
                  <div className="p-3 rounded-xl bg-rose-500/15 text-rose-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                      Location
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {profile.location}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="pt-4">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-3">
                Connect Across The Web
              </span>
              <div className="flex items-center gap-3">
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-nebula-900 text-slate-300 hover:text-white hover:bg-nebula-800 border border-white/10 hover:border-aurora-cyan/40 transition-all transform hover:-translate-y-1 shadow-md"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-nebula-900 text-slate-300 hover:text-white hover:bg-[#0077b5] border border-white/10 hover:border-[#0077b5] transition-all transform hover:-translate-y-1 shadow-md"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-nebula-900 text-slate-300 hover:text-white hover:bg-nebula-800 border border-white/10 hover:border-white/30 transition-all transform hover:-translate-y-1 shadow-md"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-nebula-900 text-slate-300 hover:text-white hover:bg-rose-600 border border-white/10 hover:border-rose-500 transition-all transform hover:-translate-y-1 shadow-md"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-nebula-900 text-slate-300 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:to-rose-500 border border-white/10 hover:border-rose-400 transition-all transform hover:-translate-y-1 shadow-md"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-8 rounded-3xl bg-nebula-900/95 border border-white/10 shadow-2xl">
              {success ? (
                <div className="py-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="font-display text-2xl font-bold text-white">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-slate-300 max-w-md text-sm">
                    Thank you for reaching out! Your message has been prepared for{' '}
                    <strong className="text-aurora-cyan">anishsingh2095@gmail.com</strong>.
                  </p>

                  {sentLinks.gmail && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full max-w-sm justify-center">
                      <a
                        href={sentLinks.gmail}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 rounded-xl text-xs font-mono font-medium text-white bg-gradient-to-r from-aurora-cyan to-aurora-violet hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Open in Gmail</span>
                      </a>
                      <a
                        href={sentLinks.mailto}
                        className="px-5 py-2.5 rounded-xl text-xs font-mono font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-all"
                      >
                        <span>Default Mail App</span>
                      </a>
                    </div>
                  )}

                  <button
                    onClick={() => setSuccess(false)}
                    type="button"
                    className="mt-3 px-6 py-2 rounded-xl font-medium text-xs font-mono text-slate-400 hover:text-aurora-cyan transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input type="hidden" name="_captcha" value="false" />
                    <input
                      type="hidden"
                      name="_subject"
                      value={formData.subject || `New Portfolio Message from ${formData.name || 'Visitor'}`}
                    />
                    {error && (
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                        <a
                          href={`mailto:anishsingh2095@gmail.com?subject=${encodeURIComponent(formData.subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`Hi Anish,\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-white font-mono text-xs whitespace-nowrap transition-colors"
                        >
                          Send via Gmail &rarr;
                        </a>
                      </div>
                    )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-nebula-950 border border-white/10 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50 focus:border-aurora-cyan transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-2">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-nebula-950 border border-white/10 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50 focus:border-aurora-cyan transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Project Inquiry / Job Opportunity"
                      className="w-full px-4 py-3 rounded-xl bg-nebula-950 border border-white/10 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50 focus:border-aurora-cyan transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your idea, timeline, or requirements..."
                      className="w-full px-4 py-3 rounded-xl bg-nebula-950 border border-white/10 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50 focus:border-aurora-cyan transition-all resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-aurora-cyan via-aurora-violet to-aurora-rose hover:opacity-95 shadow-lg shadow-aurora-cyan/20 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
