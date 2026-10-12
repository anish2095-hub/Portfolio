import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';

// Pages
import { Home } from './pages/Home';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProfile } from './pages/admin/AdminProfile';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminSkills } from './pages/admin/AdminSkills';
import { AdminExperience } from './pages/admin/AdminExperience';
import { AdminCertificates } from './pages/admin/AdminCertificates';
import { AdminMedia } from './pages/admin/AdminMedia';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Portfolio Route */}
              <Route path="/" element={<Home />} />

              {/* Admin Auth Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin CMS Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="experience" element={<AdminExperience />} />
                <Route path="certificates" element={<AdminCertificates />} />
                <Route path="media" element={<AdminMedia />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
