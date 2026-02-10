import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { IssueProvider } from '@/contexts/IssueContext';
import { AnnouncementProvider } from '@/contexts/AnnouncementContext';
import { LostFoundProvider } from '@/contexts/LostFoundContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import Login from '@/pages/Home';
import Register from '@/pages/register';
import Dashboard from '@/pages/Dashboard';
import Issues from '@/pages/Issues';
import ReportIssue from '@/pages/ReportIssue';
import Announcements from '@/pages/Announcements';
import LostFound from '@/pages/LostFound';
import Analytics from '@/pages/Analytics';
import Profile from '@/pages/Profile';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <IssueProvider>
          <AnnouncementProvider>
            <LostFoundProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/issues"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Issues />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/report-issue"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <Layout>
                        <ReportIssue />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/announcements"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Announcements />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lost-found"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <LostFound />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['management']}>
                      <Layout>
                        <Analytics />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Profile />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </LostFoundProvider>
          </AnnouncementProvider>
        </IssueProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
