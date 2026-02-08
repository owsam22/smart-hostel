import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { LostFoundItem } from '@/types';
import API from './api';


// Frontend payload type for adding item
export interface LostFoundInput {
  title: string;
  description: string;
  type: 'lost' | 'found';
  category: string;
  location: string;
  date: string;
}

interface LostFoundContextType {
  items: LostFoundItem[];
  fetchItems: () => Promise<void>;
  addItem: (item: LostFoundInput) => Promise<void>;
  claimItem: (id: string) => Promise<void>;
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

  // Fetch all items
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API}/lost-found`, {
        headers: { Authorization: `Bearer ${token}` },
      });

const normalized: LostFoundItem[] = res.data.map((item: any) => ({
  ...item,
  id: item._id,
  reportedByUser: item.reportedBy
    ? { ...item.reportedBy, id: item.reportedBy._id }
    : undefined,
  claimedByUser: item.claimedBy
    ? { ...item.claimedBy, id: item.claimedBy._id }
    : undefined,
}));


      setItems(normalized);
    } catch (err) {
      console.error('Failed to fetch lost & found items', err);
    }
  };

  // Add new item
  const addItem = async (itemData: LostFoundInput) => {
    try {
      const res = await axios.post(`${API}/lost-found`, itemData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newItem: LostFoundItem = {
        ...res.data,
        id: res.data._id || res.data.id,
      };

      setItems(prev => [...prev, newItem]);
    } catch (err) {
      console.error('Failed to add lost/found item', err);
    }
  };

  // Claim item
  const claimItem = async (id: string) => {
    try {
      const res = await axios.put(
        `${API}/lost-found/${id}/claim`,
        {},
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
