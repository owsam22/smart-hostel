import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Issue } from '@/types';
import { useAuth } from './AuthContext';

const API = 'https://smart-hostel-backend-rxm4.onrender.com/api';

interface IssueContextType {
  issues: Issue[];
  fetchIssues: () => Promise<void>;
  addIssue: (data: Partial<Issue>) => Promise<void>;
  updateIssue: (id: string, data: Partial<Issue>) => Promise<void>;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const useIssues = () => {
  const ctx = useContext(IssueContext);
  if (!ctx) throw new Error('useIssues must be used within IssueProvider');
  return ctx;
};

export const IssueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const { user } = useAuth();

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  /* FETCH ISSUES */
  const fetchIssues = async () => {
    try {
      const res = await axios.get(`${API}/issues`, {
        headers: authHeader(),
      });
      setIssues(res.data);
    } catch (err) {
      console.error('Failed to fetch issues', err);
    }
  };

  /* ADD ISSUE */
  const addIssue = async (data: Partial<Issue>) => {
    if (!user) return;

    try {
      await axios.post(
        `${API}/issues`,
        data,
        { headers: authHeader() }
      );

      await fetchIssues();
    } catch (err) {
      console.error('Failed to add issue', err);
    }
  };

  /* UPDATE ISSUE (ADMIN) */
  const updateIssue = async (id: string, data: Partial<Issue>) => {
    try {
      await axios.patch(
        `${API}/issues/${id}`,
        data,
        { headers: authHeader() }
      );

      await fetchIssues();
    } catch (err) {
      console.error('Failed to update issue', err);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <IssueContext.Provider
      value={{
        issues,
        fetchIssues,
        addIssue,
        updateIssue,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};
