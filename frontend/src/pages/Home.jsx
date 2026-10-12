import React from 'react';
import { ScrollProgress } from '../components/ScrollProgress';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { ExperienceTimeline } from '../components/ExperienceTimeline';
import { Projects } from '../components/Projects';
import { Certificates } from '../components/Certificates';
import { MediaShowcase } from '../components/MediaShowcase';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export const Home = () => {
  return (
    <div className="min-h-screen bg-[#f4f9fd] dark:bg-[#08141e] text-[#0c2333] dark:text-[#f0f9ff] transition-colors">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <ExperienceTimeline />
        <Projects />
        <Certificates />
        <MediaShowcase />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};
