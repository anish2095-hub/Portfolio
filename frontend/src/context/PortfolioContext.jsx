import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  profileAPI,
  projectAPI,
  skillAPI,
  experienceAPI,
  certificateAPI,
  mediaAPI,
} from '../services/api';
import { sortCertificatesNewestFirst } from '../utils/certificateDateDetector';
import {
  initialProfile,
  initialProjects,
  initialSkills,
  initialExperiences,
  initialCertificates,
  initialMedia,
} from '../data/initialPortfolioData';

export const defaultProfile = initialProfile;

const PortfolioContext = createContext();

const CACHE_KEY = 'portfolio_data_cache_v2';

// Safe localStorage loader
const getCachedData = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    return null;
  }
};

export const PortfolioProvider = ({ children }) => {
  const cached = getCachedData();

  const [profile, setProfile] = useState(cached?.profile || initialProfile);
  const [projects, setProjects] = useState(
    Array.isArray(cached?.projects) && cached.projects.length > 0
      ? cached.projects
      : initialProjects
  );
  const [skills, setSkills] = useState(
    Array.isArray(cached?.skills) && cached.skills.length > 0
      ? cached.skills
      : initialSkills
  );
  const [experiences, setExperiences] = useState(
    Array.isArray(cached?.experiences) && cached.experiences.length > 0
      ? cached.experiences
      : initialExperiences
  );
  const [certificates, setCertificates] = useState(
    Array.isArray(cached?.certificates) && cached.certificates.length > 0
      ? sortCertificatesNewestFirst(cached.certificates)
      : sortCertificatesNewestFirst(initialCertificates)
  );
  const [media, setMedia] = useState(
    Array.isArray(cached?.media) && cached.media.length > 0
      ? cached.media
      : initialMedia
  );
  const [loading, setLoading] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [error, setError] = useState(null);

  // Helper to verify that response is valid JSON data and not an HTML SPA fallback
  const isValidJsonResponse = (res) => {
    if (!res || !res.data) return false;
    // If it's a string containing HTML, it's a SPA fallback rewrite (e.g. index.html)
    if (typeof res.data === 'string') {
      const trimmed = res.data.trim().toLowerCase();
      if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')) {
        return false;
      }
    }
    return true;
  };

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

      let hasLiveSuccess = false;
      let newProfile = profile;
      let newProjects = projects;
      let newSkills = skills;
      let newExperiences = experiences;
      let newCertificates = certificates;
      let newMedia = media;

      // Profile
      if (
        profileRes.status === 'fulfilled' &&
        isValidJsonResponse(profileRes.value) &&
        profileRes.value.data?.data
      ) {
        hasLiveSuccess = true;
        const remoteProfile = profileRes.value.data.data;
        const isPlaceholderName = !remoteProfile.name || remoteProfile.name === 'Alex Rivera';
        const isPlaceholderAvatar =
          !remoteProfile.avatar ||
          remoteProfile.avatar.includes('photo-1534528741775-53994a69daeb') ||
          remoteProfile.avatar.includes('unsplash.com');

        const finalExp = remoteProfile.experienceYears || initialProfile.experienceYears;
        const rawStats =
          remoteProfile.stats && remoteProfile.stats.length > 0
            ? remoteProfile.stats
            : initialProfile.stats;

        const syncedStats = rawStats.map((st) => {
          if (st.label && st.label.toLowerCase().includes('experience')) {
            return { ...st, value: finalExp };
          }
          return st;
        });

        newProfile = {
          ...initialProfile,
          ...remoteProfile,
          name: isPlaceholderName ? initialProfile.name : (remoteProfile.name || initialProfile.name),
          avatar: isPlaceholderAvatar ? initialProfile.avatar : (remoteProfile.avatar || initialProfile.avatar),
          location: remoteProfile.location || initialProfile.location,
          email: remoteProfile.email || initialProfile.email,
          phone: remoteProfile.phone || initialProfile.phone,
          degree: remoteProfile.degree || initialProfile.degree,
          experienceYears: finalExp,
          resumeUrl: remoteProfile.resumeUrl || initialProfile.resumeUrl,
          availability: remoteProfile.availability || initialProfile.availability,
          stats: syncedStats,
          techPillars:
            remoteProfile.techPillars && remoteProfile.techPillars.length > 0
              ? remoteProfile.techPillars
              : initialProfile.techPillars,
          telemetryText: remoteProfile.telemetryText || initialProfile.telemetryText,
          skillsHeaderBadge: remoteProfile.skillsHeaderBadge || initialProfile.skillsHeaderBadge,
          skillsHeaderTitle: remoteProfile.skillsHeaderTitle || initialProfile.skillsHeaderTitle,
          skillsHeaderDescription: remoteProfile.skillsHeaderDescription || initialProfile.skillsHeaderDescription,
          socialLinks: {
            ...initialProfile.socialLinks,
            ...(remoteProfile.socialLinks || {}),
          },
        };
        setProfile(newProfile);
      }

      // Projects
      if (
        projectsRes.status === 'fulfilled' &&
        isValidJsonResponse(projectsRes.value) &&
        Array.isArray(projectsRes.value.data?.data) &&
        projectsRes.value.data.data.length > 0
      ) {
        hasLiveSuccess = true;
        newProjects = projectsRes.value.data.data;
        setProjects(newProjects);
      }

      // Skills
      if (
        skillsRes.status === 'fulfilled' &&
        isValidJsonResponse(skillsRes.value) &&
        Array.isArray(skillsRes.value.data?.data) &&
        skillsRes.value.data.data.length > 0
      ) {
        hasLiveSuccess = true;
        newSkills = skillsRes.value.data.data;
        setSkills(newSkills);
      }

      // Experiences
      if (
        experienceRes.status === 'fulfilled' &&
        isValidJsonResponse(experienceRes.value) &&
        Array.isArray(experienceRes.value.data?.data) &&
        experienceRes.value.data.data.length > 0
      ) {
        hasLiveSuccess = true;
        newExperiences = experienceRes.value.data.data;
        setExperiences(newExperiences);
      }

      // Certificates
      if (
        certRes.status === 'fulfilled' &&
        isValidJsonResponse(certRes.value) &&
        Array.isArray(certRes.value.data?.data) &&
        certRes.value.data.data.length > 0
      ) {
        hasLiveSuccess = true;
        newCertificates = sortCertificatesNewestFirst(certRes.value.data.data);
        setCertificates(newCertificates);
      }

      // Media
      if (
        mediaRes.status === 'fulfilled' &&
        isValidJsonResponse(mediaRes.value) &&
        Array.isArray(mediaRes.value.data?.data) &&
        mediaRes.value.data.data.length > 0
      ) {
        hasLiveSuccess = true;
        newMedia = mediaRes.value.data.data;
        setMedia(newMedia);
      }

      setIsLiveConnected(hasLiveSuccess);

      // Cache the consolidated data for super fast offline/subsequent loads
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            profile: newProfile,
            projects: newProjects,
            skills: newSkills,
            experiences: newExperiences,
            certificates: newCertificates,
            media: newMedia,
            timestamp: Date.now(),
          })
        );
      } catch (cacheErr) {
        // storage quota exceeded or disabled
      }

      setError(null);
    } catch (err) {
      console.warn('[PortfolioContext] API fetch notice: using high-performance local data.', err.message);
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
        isLiveConnected,
        error,
        refreshData: fetchData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
