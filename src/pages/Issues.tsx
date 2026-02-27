import React, { useState } from 'react';
import { useIssues } from '@/contexts/IssueContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search,
  Calendar,
  MapPin,
  User,
  MessageSquare,
    AlertCircle
} from 'lucide-react';
import { Issue } from '@/types';

const Issues: React.FC = () => {
  const { issues, updateIssue } = useIssues();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    const canView = user?.role === 'management' || issue.visibility === 'public';

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority && canView;
  });

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'reported': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'low': return 'bg-slate-100 text-slate-700';
      case 'medium': return 'bg-blue-100 text-blue-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'emergency': return 'bg-red-100 text-red-700 animate-pulse';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (issueId: string, newStatus: string) => {
    updateIssue(issueId, { status: newStatus as Issue['status'] });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
          <p className="text-gray-600">View and manage hostel issues</p>
        </div>
        {user?.role === 'student' && (
           <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
             + Report New Issue
           </button>
        )}
      </div>

      {/* Filters Section */}
      <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative lg:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="reported">Reported</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 transition-all"
          >
            <option value="all">All Categories</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="cleanliness">Cleanliness</option>
            <option value="internet">Internet</option>
            <option value="furniture">Furniture</option>
            <option value="other">Other</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 transition-all"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredIssues.map((issue) => (
          <div key={issue._id} className="group rounded-xl bg-white p-5 shadow-sm border border-gray-100 hover:border-blue-200 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(issue.status)}`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getPriorityColor(issue.priority)}`}>
                    {issue.priority}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {issue.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2 md:line-clamp-none">
                  {issue.description}
                </p>
              </div>

              {/* Management Dropdown - Positioned at top right on desktop, bottom on mobile */}
              {user?.role === 'management' && (
                <div className="shrink-0">
                  <select
                    value={issue.status}
                    onChange={(e) => handleStatusUpdate(issue._id, e.target.value)}
                    className="w-full sm:w-auto rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold focus:border-blue-500 outline-none"
                  >
                    <option value="reported">Mark Reported</option>
                    <option value="assigned">Mark Assigned</option>
                    <option value="in_progress">Mark In Progress</option>
                    <option value="resolved">Mark Resolved</option>
                    <option value="closed">Mark Closed</option>
                  </select>
                </div>
              )}
            </div>

            {/* Metadata Footer */}
            <div className="mt-6 flex flex-wrap items-center gap-y-3 gap-x-6 border-t pt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-700">{issue.reportedBy?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{issue.location || 'No location'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span>0 comments</span>
              </div>
              {issue.visibility === 'private' && (
                <div className="flex items-center gap-1 text-amber-600 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Private</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredIssues.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 text-center shadow-sm border border-dashed border-gray-300">
          <div className="rounded-full bg-gray-50 p-4">
             <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No issues found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default Issues;