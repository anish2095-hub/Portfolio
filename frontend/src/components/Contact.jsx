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
} from 'lucide-react';
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
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Save in backend DB asynchronously for Admin Panel (non-blocking)
      messageAPI.send(formData).catch((err) => {
        console.warn('Backend message save skipped:', err.message);
      });

      // Prepare FormData for FormSubmit.co
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('subject', formData.subject || 'Portfolio Contact Inquiry');
      payload.append('message', formData.message);
      payload.append('_subject', formData.subject || `New Portfolio Message from ${formData.name}`);
      payload.append('_template', 'table');
      payload.append('_captcha', 'false');

      const response = await fetch('https://formsubmit.co/ajax/anishsingh2095@gmail.com', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: payload,
      });

      const result = await response.json().catch(() => ({}));

      if (result.success === 'true' || result.success === true) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        // First-time FormSubmit activation required: submit standard HTML form in a new tab/window so FormSubmit sends the activation email
        const tempForm = document.createElement('form');
        tempForm.method = 'POST';
        tempForm.action = 'https://formsubmit.co/anishsingh2095@gmail.com';
        tempForm.target = '_blank';

        const fields = {
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'Portfolio Contact Inquiry',
          message: formData.message,
          _subject: formData.subject || `New Portfolio Message from ${formData.name}`,
          _template: 'table',
          _captcha: 'false',
        };

        Object.entries(fields).forEach(([key, val]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = val;
          tempForm.appendChild(input);
        });

        document.body.appendChild(tempForm);
        tempForm.submit();
        document.body.removeChild(tempForm);

        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = profile?.socialLinks || {};

  return (
    <section id="contact" className="py-24 border-t border-[#0284c7]/10 dark:border-[#38bdf8]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[#0284c7] dark:text-[#38bdf8] font-semibold mb-1">
            // Get In Touch
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0c2333] dark:text-[#f0f9ff]">
            Let's Work Together
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <p className="text-sm sm:text-base text-[#436174] dark:text-[#93b4cb] leading-relaxed">
              Have a web project, full-stack opportunity, or question in mind? Send a message and let's build something exceptional together.
            </p>

            <div className="space-y-3.5">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3.5 p-4 rounded-xl bg-white dark:bg-[#102638] border border-[#0284c7]/10 dark:border-[#38bdf8]/10 hover:border-[#0284c7] dark:hover:border-[#38bdf8] shadow-sky-sm hover:shadow-sky-md transition-all group"
                >
                  <div className="p-2.5 rounded-lg bg-[#0284c7]/10 dark:bg-[#38bdf8]/15 text-[#0284c7] dark:text-[#38bdf8]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase text-[#7895a7] dark:text-[#62839b]">
                      Email
                    </span>
                    <span className="text-sm font-semibold text-[#0c2333] dark:text-[#f0f9ff] group-hover:text-[#0284c7] dark:group-hover:text-[#38bdf8] transition-colors">
                      {profile.email}
                    </span>
                  </div>
                </a>
              )}

              {profile?.phone && (
                <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white dark:bg-[#102638] border border-[#0284c7]/10 dark:border-[#38bdf8]/10 shadow-sky-sm">
                  <div className="p-2.5 rounded-lg bg-[#0284c7]/10 dark:bg-[#38bdf8]/15 text-[#0284c7] dark:text-[#38bdf8]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase text-[#7895a7] dark:text-[#62839b]">
                      Phone
                    </span>
                    <span className="text-sm font-semibold text-[#0c2333] dark:text-[#f0f9ff]">
                      {profile.phone}
                    </span>
                  </div>
                </div>
              )}

              {profile?.location && (
                <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white dark:bg-[#102638] border border-[#0284c7]/10 dark:border-[#38bdf8]/10 shadow-sky-sm">
                  <div className="p-2.5 rounded-lg bg-[#0284c7]/10 dark:bg-[#38bdf8]/15 text-[#0284c7] dark:text-[#38bdf8]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase text-[#7895a7] dark:text-[#62839b]">
                      Location
                    </span>
                    <span className="text-sm font-semibold text-[#0c2333] dark:text-[#f0f9ff]">
                      {profile.location}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div>
              <span className="text-[11px] font-mono uppercase text-[#7895a7] dark:text-[#62839b] block mb-3 font-semibold">
                Connect Online
              </span>
              <div className="flex items-center gap-2.5">
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-full bg-white dark:bg-[#102638] text-[#436174] dark:text-[#93b4cb] hover:text-white hover:bg-[#0284c7] dark:hover:bg-[#38bdf8] border border-[#0284c7]/15 dark:border-[#38bdf8]/15 hover:-translate-y-0.5 transition-all shadow-sky-sm"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-full bg-white dark:bg-[#102638] text-[#436174] dark:text-[#93b4cb] hover:text-white hover:bg-[#0284c7] dark:hover:bg-[#38bdf8] border border-[#0284c7]/15 dark:border-[#38bdf8]/15 hover:-translate-y-0.5 transition-all shadow-sky-sm"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-full bg-white dark:bg-[#102638] text-[#436174] dark:text-[#93b4cb] hover:text-white hover:bg-[#0284c7] dark:hover:bg-[#38bdf8] border border-[#0284c7]/15 dark:border-[#38bdf8]/15 hover:-translate-y-0.5 transition-all shadow-sky-sm"
                    title="Twitter / X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-full bg-white dark:bg-[#102638] text-[#436174] dark:text-[#93b4cb] hover:text-white hover:bg-red-600 border border-[#0284c7]/15 dark:border-[#38bdf8]/15 hover:-translate-y-0.5 transition-all shadow-sky-sm"
                    title="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-full bg-white dark:bg-[#102638] text-[#436174] dark:text-[#93b4cb] hover:text-white hover:bg-pink-600 border border-[#0284c7]/15 dark:border-[#38bdf8]/15 hover:-translate-y-0.5 transition-all shadow-sky-sm"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-8 rounded-2xl bg-white dark:bg-[#102638] border border-[#0284c7]/12 dark:border-[#38bdf8]/15 shadow-sky-md">
              {success ? (
                <div className="py-10 flex flex-col items-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#0284c7]/10 dark:bg-[#38bdf8]/15 text-[#0284c7] dark:text-[#38bdf8] flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-display text-xl font-bold text-[#0c2333] dark:text-[#f0f9ff]">
                    Message Received!
                  </h4>
                  <p className="text-[#436174] dark:text-[#93b4cb] text-sm max-w-sm">
                    Thank you for reaching out. I'll get back to you shortly!
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    type="button"
                    className="mt-3 px-5 py-2 rounded-lg text-xs font-mono font-medium border border-[#0284c7]/20 dark:border-[#38bdf8]/20 hover:bg-[#e8f3fa] dark:hover:bg-[#08141e] transition-colors"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {error && (
                    <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[#7895a7] dark:text-[#62839b] mb-1.5 font-medium">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-lg bg-[#f4f9fd] dark:bg-[#08141e] border border-[#0284c7]/15 dark:border-[#38bdf8]/15 text-[#0c2333] dark:text-[#f0f9ff] placeholder-[#7895a7] text-xs sm:text-sm focus:outline-none focus:border-[#0284c7] dark:focus:border-[#38bdf8] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[#7895a7] dark:text-[#62839b] mb-1.5 font-medium">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-lg bg-[#f4f9fd] dark:bg-[#08141e] border border-[#0284c7]/15 dark:border-[#38bdf8]/15 text-[#0c2333] dark:text-[#f0f9ff] placeholder-[#7895a7] text-xs sm:text-sm focus:outline-none focus:border-[#0284c7] dark:focus:border-[#38bdf8] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[#7895a7] dark:text-[#62839b] mb-1.5 font-medium">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Project Inquiry / Opportunity"
                      className="w-full px-4 py-3 rounded-lg bg-[#f4f9fd] dark:bg-[#08141e] border border-[#0284c7]/15 dark:border-[#38bdf8]/15 text-[#0c2333] dark:text-[#f0f9ff] placeholder-[#7895a7] text-xs sm:text-sm focus:outline-none focus:border-[#0284c7] dark:focus:border-[#38bdf8] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[#7895a7] dark:text-[#62839b] mb-1.5 font-medium">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hi! I'd like to collaborate on..."
                      className="w-full px-4 py-3 rounded-lg bg-[#f4f9fd] dark:bg-[#08141e] border border-[#0284c7]/15 dark:border-[#38bdf8]/15 text-[#0c2333] dark:text-[#f0f9ff] placeholder-[#7895a7] text-xs sm:text-sm focus:outline-none focus:border-[#0284c7] dark:focus:border-[#38bdf8] transition-colors resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg font-semibold text-xs sm:text-sm font-mono text-white bg-[#0284c7] hover:bg-[#0369a1] dark:bg-[#38bdf8] dark:hover:bg-[#7dd3fc] dark:text-[#08141e] shadow-sky-sm hover:shadow-sky-md hover:-translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#e0f2fe] dark:text-[#08141e]" />
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
