import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useIssues } from '@/contexts/IssueContext';
import { useAnnouncements } from '@/contexts/AnnouncementContext';
import { useLostFound } from '@/contexts/LostFoundContext';
import { 
  FileText, 
  Search, 
  Clock, 
  CheckCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { issues } = useIssues();
  const { announcements } = useAnnouncements();
  const { items } = useLostFound();

  const stats = {
    totalIssues: issues.length,
    pendingIssues: issues.filter(i => i.status === 'reported' || i.status === 'assigned').length,
    resolvedIssues: issues.filter(i => i.status === 'resolved').length,
    totalAnnouncements: announcements.filter(a => a.isActive).length,
    lostItems: items.filter(i => i.type === 'lost').length,
    foundItems: items.filter(i => i.type === 'found').length,
  };

  const recentIssues = issues.slice(0, 5);
  const recentAnnouncements = announcements.filter(a => a.isActive).slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.name}! Here's what's happening in your hostel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Issues</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalIssues}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Issues</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingIssues}</p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolvedIssues}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lost & Found</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lostItems + stats.foundItems}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <Search className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Issues</h2>
          <div className="space-y-4">
            {recentIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between border-b pb-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{issue.title}</p>
                  <p className="text-sm text-gray-500">{issue.category} • {issue.priority}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                  issue.status === 'resolved' 
                    ? 'bg-green-100 text-green-800'
                    : issue.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {issue.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Latest Announcements</h2>
          <div className="space-y-4">
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="border-b pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{announcement.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{announcement.content}</p>
                  </div>
                  <span className="ml-3 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    {announcement.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;