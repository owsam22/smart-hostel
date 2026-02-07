import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: { name: string; email: string; password: string; hostel: string; block: string; room: string }) => Promise<void>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API = 'https://smart-hostel-backend-rxm4.onrender.com/api';

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return setUser(null);

    try {
      const res = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (err) {
      console.error('Failed to refresh user', err);
      logout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      setUser(user);
    } catch (err: any) {
      console.error('Login failed', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; hostel: string; block: string; room: string }) => {
    setIsLoading(true);
    try {
      await axios.post(`${API}/auth/register`, data);
    } catch (err: any) {
      console.error('Register failed', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
