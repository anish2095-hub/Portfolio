// Vercel Serverless Function entry point for full-stack API support
import {
  profileData,
  projectsData,
  skillsData,
  experienceData,
  certificatesData,
  mediaData,
} from '../backend/seeds/seedData.js';

export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse path from url
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname.replace(/^\/api/, '').replace(/\/$/, '') || '/';

  // Health route
  if (pathname === '/health' || pathname === '') {
    return res.status(200).json({
      status: 'ok',
      service: 'portfolio-vercel-serverless-api',
      timestamp: new Date().toISOString(),
    });
  }

  // Profile
  if (pathname === '/profile') {
    if (req.method === 'GET') {
      return res.status(200).json({ success: true, data: profileData });
    }
    return res.status(200).json({ success: true, data: profileData });
  }

  // Projects
  if (pathname === '/projects') {
    if (req.method === 'GET') {
      const category = url.searchParams.get('category');
      const filtered = category && category !== 'all'
        ? projectsData.filter((p) => p.category === category)
        : projectsData;
      return res.status(200).json({ success: true, count: filtered.length, data: filtered });
    }
  }

  // Skills
  if (pathname === '/skills') {
    if (req.method === 'GET') {
      const category = url.searchParams.get('category');
      const filtered = category && category !== 'all'
        ? skillsData.filter((s) => s.category === category)
        : skillsData;
      return res.status(200).json({ success: true, count: filtered.length, data: filtered });
    }
  }

  // Experience
  if (pathname === '/experience') {
    if (req.method === 'GET') {
      const type = url.searchParams.get('type');
      const filtered = type
        ? experienceData.filter((e) => e.type === type)
        : experienceData;
      return res.status(200).json({ success: true, count: filtered.length, data: filtered });
    }
  }

  // Certificates
  if (pathname === '/certificates') {
    if (req.method === 'GET') {
      return res.status(200).json({ success: true, count: certificatesData.length, data: certificatesData });
    }
  }

  // Media
  if (pathname === '/media') {
    if (req.method === 'GET') {
      return res.status(200).json({ success: true, count: mediaData.length, data: mediaData });
    }
  }

  // Messages
  if (pathname === '/messages') {
    if (req.method === 'POST') {
      return res.status(201).json({
        success: true,
        message: 'Message received successfully!',
        data: req.body || {},
      });
    }
    return res.status(200).json({ success: true, data: [] });
  }

  // Fallback for unknown api routes
  return res.status(200).json({
    success: true,
    message: `API endpoint ${pathname} handled`,
    timestamp: new Date().toISOString(),
  });
}
