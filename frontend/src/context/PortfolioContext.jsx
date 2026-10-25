import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  profileAPI,
  projectAPI,
  skillAPI,
  experienceAPI,
  certificateAPI,
  mediaAPI,
} from '../services/api';

export const defaultProfile = {
  name: 'Anish Singh',
  title: 'Full Stack MERN Developer & Aspiring Software Engineer',
  typingRoles: [
    'Full Stack MERN Developer',
    'React & Node.js Specialist',
    'CSE Diploma Student',
    'UI/UX & Creative Technologist',
    'Open Source Builder',
  ],
  tagline: 'Designing and engineering high-impact digital products, scalable web architectures, and fluid interactive experiences.',
  avatar: '/pfp.jpeg',
  bio: "Hi, I'm Anish—an aspiring software developer and a CSE student who is passionate about technology, programming, and building meaningful digital experiences.",
  location: 'Gaya ji, Bihar',
  email: 'anishsingh2095@gmail.com',
  phone: '+91 9334398322',
  degree: 'Diploma in Computer Science',
  experienceYears: '2+ years',
  availability: 'Available for Full-time Roles & High-Impact Contracts',
  resumeUrl: '#contact',
  socialLinks: {
    github: 'https://github.com/anish2095-hub',
    linkedin: 'https://www.linkedin.com/in/anish-kumar-03b105333/',
    twitter: 'https://x.com',
    youtube: 'https://youtube.com',
    instagram: 'https://instagram.com',
  },
  stats: [
    { label: 'Completed Projects', value: '35+' },
    { label: 'Years Experience', value: '2+' },
    { label: 'GitHub Repositories', value: '80+' },
    { label: 'Happy Clients', value: '20+' },
  ],
};

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [profile, setProfile] = useState(defaultProfile);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        profileRes,
        projectsRes,
        skillsRes,
        experienceRes,
        certRes,
        mediaRes,
      ] = await Promise.allSettled([
        profileAPI.getProfile(),
        projectAPI.getAll(),
        skillAPI.getAll(),
        experienceAPI.getAll(),
        certificateAPI.getAll(),
        mediaAPI.getAll(),
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value.data?.data) {
        const remoteProfile = profileRes.value.data.data;
        // Sanitize: ensure Alex Rivera or placeholder image doesn't overwrite Anish
        const isPlaceholderName = remoteProfile.name === 'Alex Rivera';
        const isPlaceholderAvatar =
          !remoteProfile.avatar ||
          remoteProfile.avatar.includes('photo-1534528741775-53994a69daeb');

        setProfile({
          ...defaultProfile,
          ...remoteProfile,
          name: isPlaceholderName ? defaultProfile.name : (remoteProfile.name || defaultProfile.name),
          avatar: isPlaceholderAvatar ? defaultProfile.avatar : (remoteProfile.avatar || defaultProfile.avatar),
          location: remoteProfile.location || defaultProfile.location,
          email: remoteProfile.email || defaultProfile.email,
          phone: remoteProfile.phone || defaultProfile.phone,
          degree: remoteProfile.degree || defaultProfile.degree,
          experienceYears: remoteProfile.experienceYears || defaultProfile.experienceYears,
          availability: remoteProfile.availability || defaultProfile.availability,
          socialLinks: {
            ...defaultProfile.socialLinks,
            ...(remoteProfile.socialLinks || {}),
          },
        });
      }
      if (projectsRes.status === 'fulfilled' && projectsRes.value.data?.data) {
        setProjects(projectsRes.value.data.data);
      }
      if (skillsRes.status === 'fulfilled' && skillsRes.value.data?.data) {
        setSkills(skillsRes.value.data.data);
      }
      if (experienceRes.status === 'fulfilled' && experienceRes.value.data?.data) {
        setExperiences(experienceRes.value.data.data);
      }
      if (certRes.status === 'fulfilled' && certRes.value.data?.data) {
        setCertificates(certRes.value.data.data);
      }
      if (mediaRes.status === 'fulfilled' && mediaRes.value.data?.data) {
        setMedia(mediaRes.value.data.data);
      }

      setError(null);
    } catch (err) {
      console.error('Error loading portfolio data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        projects,
        skills,
        experiences,
        certificates,
        media,
        loading,
        error,
        refreshData: fetchData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
