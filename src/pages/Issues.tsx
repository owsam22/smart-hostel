import React, { useState } from 'react';
import { useIssues } from '@/contexts/IssueContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search,
  Calendar,
  MapPin,
  User,
  MessageSquare,
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

    const matchesStatus =
      statusFilter === 'all' || issue.status === statusFilter;

    const matchesCategory =
      categoryFilter === 'all' || issue.category === categoryFilter;

    const matchesPriority =
      priorityFilter === 'all' || issue.priority === priorityFilter;

    const canView =
      user?.role === 'management' || issue.visibility === 'public';

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesPriority &&
      canView
    );
  });

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'reported':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (issueId: string, newStatus: string) => {
    updateIssue(issueId, { status: newStatus as Issue['status'] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
        <p className="text-gray-600">View and manage hostel issues</p>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="all">All Status</option>
            <option value="reported">Reported</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="all">All Categories</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="cleanliness">Cleanliness</option>
            <option value="internet">Internet</option>
            <option value="furniture">Furniture</option>
            <option value="other">Other</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredIssues.map((issue) => (
          <div key={issue._id} className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {issue.title}
                    </h3>
                    <p className="mt-1 text-gray-600">
                      {issue.description}
                    </p>
                  </div>

                  <div className="ml-4 flex items-center space-x-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(
                        issue.priority
                      )}`}
                    >
                      {issue.priority}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      {issue.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="mr-1 h-4 w-4" />
                    {issue.reportedBy?.name || 'Unknown'}
                  </div>

                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {issue.location || 'Location not specified'}
                  </div>

                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    0 comments
                  </div>

                  {issue.visibility === 'private' && (
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                      Private
                    </span>
                  )}
                </div>

                {user?.role === 'management' && (
                  <div className="mt-4 flex gap-2">
                    <select
                      value={issue.status}
                      onChange={(e) =>
                        handleStatusUpdate(issue._id, e.target.value)
                      }
                      className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
                    >
                      <option value="reported">Reported</option>
                      <option value="assigned">Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <p className="text-gray-500">
            No issues found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Issues;
