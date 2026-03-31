import { createContext, useContext, useState, useEffect } from 'react';
import api, { API_URL } from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      delete api.defaults.headers.common['Authorization'];
      setLoading(false);
      setUser(null);
      return;
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api.get('/auth/me')
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data?.error || 'Login failed' };
      }

      const { token, user } = data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true, user };
    } catch {
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
