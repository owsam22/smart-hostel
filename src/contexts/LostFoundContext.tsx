import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { LostFoundItem } from '@/types';

const API = 'http://localhost:5000/api';

interface LostFoundContextType {
  items: LostFoundItem[];
  fetchItems: () => Promise<void>;
  addItem: (item: Omit<LostFoundItem, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => Promise<void>;
  claimItem: (id: string, claimedBy: string) => Promise<void>;
  getItems: (filters?: { type?: string; status?: string }) => LostFoundItem[];
}

const LostFoundContext = createContext<LostFoundContextType | undefined>(undefined);

export const useLostFound = () => {
  const context = useContext(LostFoundContext);
  if (!context) throw new Error('useLostFound must be used within a LostFoundProvider');
  return context;
};

export const LostFoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const token = localStorage.getItem('token');

  // Fetch items from backend and normalize _id -> id
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API}/lost-found`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const normalized: LostFoundItem[] = res.data.map((item: any) => ({
        ...item,
        id: item._id || item.id,
        reportedByUser: {
          ...item.reportedByUser,
          id: item.reportedByUser._id || item.reportedByUser.id,
        },
        claimedByUser: item.claimedByUser
          ? { ...item.claimedByUser, id: item.claimedByUser._id || item.claimedByUser.id }
          : undefined,
      }));

      setItems(normalized);
    } catch (err) {
      console.error('Failed to fetch lost & found items', err);
    }
  };

  // Add new lost/found item
  const addItem = async (itemData: Omit<LostFoundItem, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    try {
      const res = await axios.post(`${API}/lost-found`, itemData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // normalize returned item
      const newItem: LostFoundItem = {
        ...res.data,
        id: res.data._id || res.data.id,
      };

      setItems(prev => [...prev, newItem]);
    } catch (err) {
      console.error('Failed to add lost/found item', err);
    }
  };

  // Claim an item
  const claimItem = async (id: string, claimedBy: string) => {
    try {
      const res = await axios.put(
        `${API}/lost-found/${id}/claim`,
        { claimedBy },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedItem: LostFoundItem = {
        ...res.data,
        id: res.data._id || res.data.id,
      };

      setItems(prev => prev.map(item => (item.id === id ? updatedItem : item)));
    } catch (err) {
      console.error('Failed to claim lost/found item', err);
    }
  };

  // Filter items
  const getItems = (filters?: { type?: string; status?: string }) => {
    if (!filters) return items;
    return items.filter(item => {
      if (filters.type && item.type !== filters.type) return false;
      if (filters.status && item.status !== filters.status) return false;
      return true;
    });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <LostFoundContext.Provider value={{ items, fetchItems, addItem, claimItem, getItems }}>
      {children}
    </LostFoundContext.Provider>
  );
};
