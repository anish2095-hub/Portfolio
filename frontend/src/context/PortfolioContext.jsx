import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  profileAPI,
  projectAPI,
  skillAPI,
  experienceAPI,
  certificateAPI,
  mediaAPI,
} from '../services/api';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
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
        setProfile(profileRes.value.data.data);
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
