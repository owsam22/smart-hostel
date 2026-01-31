import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Announcement } from '@/types';

const API = 'http://localhost:5000/api';

interface AnnouncementContextType {
  announcements: Announcement[];
  fetchAnnouncements: () => Promise<void>;
  addAnnouncement: (data: Partial<Announcement>) => Promise<void>;
  getAnnouncements: (filters?: { type?: string; targetHostel?: string }) => Announcement[];
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export const useAnnouncements = () => {
  const ctx = useContext(AnnouncementContext);
  if (!ctx) throw new Error('useAnnouncements must be used within AnnouncementProvider');
  return ctx;
};

export const AnnouncementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const token = localStorage.getItem('token');

  const fetchAnnouncements = async () => {
    const res = await axios.get(`${API}/announcements`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAnnouncements(res.data);
  };

  const addAnnouncement = async (data: Partial<Announcement>) => {
    await axios.post(`${API}/announcements`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await fetchAnnouncements();
  };

  const getAnnouncements = (filters?: { type?: string; targetHostel?: string }) => {
    return announcements.filter(a => {
      if (!a.isActive) return false;
      if (filters?.type && a.type !== filters.type) return false;
      if (filters?.targetHostel && a.targetHostel !== filters.targetHostel) return false;
      return true;
    });
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <AnnouncementContext.Provider
      value={{ announcements, fetchAnnouncements, addAnnouncement, getAnnouncements }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};
