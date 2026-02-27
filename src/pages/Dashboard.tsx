import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIssues } from '@/contexts/IssueContext';
import { useAnnouncements } from '@/contexts/AnnouncementContext';
import { useLostFound } from '@/contexts/LostFoundContext';
import { FileText, Search, Clock, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { issues } = useIssues();
  const { announcements } = useAnnouncements();
  const { items } = useLostFound();

  const stats = {
    totalIssues: issues.length,
    pendingIssues: issues.filter(i => i.status === 'reported' || i.status === 'assigned').length,
    resolvedIssues: issues.filter(i => i.status === 'resolved').length,
    lostItemsCount: items.length,
  };

  const recentIssues = issues.slice(0, 5);
  const recentAnnouncements = announcements.filter(a => a.isActive).slice(0, 3);

  // Reusable card component for cleaner code
  const StatCard = ({ title, value, icon: Icon, colorClass, path }: any) => (
    <div 
      onClick={() => navigate(path)}
      className="group cursor-pointer rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md active:scale-[0.98]"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-lg p-3 transition-colors ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </header>

      {/* Responsive Stat Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Issues" 
          value={stats.totalIssues} 
          icon={FileText} 
          colorClass="bg-blue-50 text-blue-600 group-hover:bg-blue-100" 
          path="/issues"
        />
        <StatCard 
          title="Pending" 
          value={stats.pendingIssues} 
          icon={Clock} 
          colorClass="bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100" 
          path="/issues"
        />
        <StatCard 
          title="Resolved" 
          value={stats.resolvedIssues} 
          icon={CheckCircle} 
          colorClass="bg-green-50 text-green-600 group-hover:bg-green-100" 
          path="/issues"
        />
        <StatCard 
          title="Lost & Found" 
          value={stats.lostItemsCount} 
          icon={Search} 
          colorClass="bg-purple-50 text-purple-600 group-hover:bg-purple-100" 
          path="/lost-found"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Issues List */}
        <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Issues</h2>
            <button onClick={() => navigate('/issues')} className="text-sm text-blue-600 hover:underline">View all</button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 pr-4">
                  <p className="font-medium text-gray-900 truncate">{issue.title}</p>
                  <p className="text-xs text-gray-500">{issue.category}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  issue.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {issue.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Announcements Section */}
        <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Latest Announcements</h2>
            <button onClick={() => navigate('/announcements')} className="text-sm text-blue-600 hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {recentAnnouncements.map((ann) => (
              <div key={ann.id} className="rounded-lg bg-gray-50 p-3">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-900 text-sm">{ann.title}</p>
                  <span className="text-[10px] uppercase font-bold text-gray-400">{ann.type}</span>
                </div>
                <p className="mt-1 text-xs text-gray-600 line-clamp-2">{ann.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;