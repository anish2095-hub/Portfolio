import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('portfolio_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('portfolio_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data?.success) {
            setUser(res.data.data);
            localStorage.setItem('portfolio_user', JSON.stringify(res.data.data));
          }
        } catch (error) {
          console.warn('Session expired or invalid token');
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data?.success) {
      const { token: newToken, ...userData } = res.data.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('portfolio_token', newToken);
      localStorage.setItem('portfolio_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: res.data?.message || 'Login failed' };
  };

  const updateSessionUser = (userData, newToken) => {
    if (newToken) {
      setToken(newToken);
      localStorage.setItem('portfolio_token', newToken);
    }
    if (userData) {
      setUser((prev) => {
        const merged = { ...prev, ...userData };
        localStorage.setItem('portfolio_user', JSON.stringify(merged));
        return merged;
      });
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('portfolio_token');
    localStorage.removeItem('portfolio_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        updateSessionUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
