// Vercel Serverless Function entry point for full-stack API support
import {
  profileData,
  projectsData,
  skillsData,
  experienceData,
  certificatesData,
  mediaData,
} from '../backend/seeds/seedData.js';

let messagesStore = [
  {
    _id: 'msg_welcome_1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@techventures.io',
    subject: 'Full Stack Contract Role Opportunity',
    message: 'Hello Anish! Loved your portfolio projects and clean architecture. Would love to set up a quick 15-min call to discuss an opportunity.',
    read: false,
    replied: false,
    createdAt: new Date().toISOString(),
  },
];

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

  // Messages API
  if (pathname === '/messages' || pathname.startsWith('/messages')) {
    if (req.method === 'POST') {
      const body = req.body || {};
      const newMsg = {
        _id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: body.name || 'Anonymous',
        email: body.email || 'no-reply@example.com',
        subject: body.subject || 'Portfolio Inquiry',
        message: body.message || '',
        read: false,
        replied: false,
        createdAt: new Date().toISOString(),
      };
      messagesStore.unshift(newMsg);
      return res.status(201).json({
        success: true,
        message: 'Message received and saved to Admin Panel!',
        data: newMsg,
      });
    }

    if (req.method === 'GET') {
      const unreadCount = messagesStore.filter((m) => !m.read).length;
      return res.status(200).json({
        success: true,
        count: messagesStore.length,
        unreadCount,
        data: messagesStore,
      });
    }

    if (req.method === 'PUT' && pathname.includes('/read')) {
      const id = pathname.split('/')[2];
      const msg = messagesStore.find((m) => m._id === id);
      if (msg) {
        msg.read = req.body?.read !== undefined ? req.body.read : !msg.read;
        return res.status(200).json({ success: true, data: msg });
      }
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (req.method === 'DELETE') {
      const id = pathname.split('/')[2];
      messagesStore = messagesStore.filter((m) => m._id !== id);
      return res.status(200).json({ success: true, message: 'Message deleted successfully' });
    }
  }

  // Fallback for unknown api routes
  return res.status(200).json({
    success: true,
    message: `API endpoint ${pathname} handled`,
    timestamp: new Date().toISOString(),
  });
}
