import React from 'react';
import { useIssues } from '@/contexts/IssueContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  BarChart3
} from 'lucide-react';

const Analytics: React.FC = () => {
  const { issues } = useIssues();

  // Calculate analytics data
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  const pendingIssues = issues.filter(i => i.status === 'reported' || i.status === 'assigned' || i.status === 'in_progress').length;
  const averageResolutionTime = 48; // Mock data in hours

  // Category breakdown
  const categoryData = Object.entries(
    issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, count]) => ({ category, count }));

  // Priority breakdown
  const priorityData = Object.entries(
    issues.reduce((acc, issue) => {
      acc[issue.priority] = (acc[issue.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([priority, count]) => ({ priority, count }));

  // Hostel breakdown
  const hostelData = Object.entries(
    issues.reduce((acc, issue) => {
      acc[issue.hostel] = (acc[issue.hostel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([hostel, count]) => ({ hostel, count }));

  // Monthly trends (mock data)
  const monthlyTrends = [
    { month: 'Jan', reported: 45, resolved: 38 },
    { month: 'Feb', reported: 52, resolved: 45 },
    { month: 'Mar', reported: 48, resolved: 42 },
    { month: 'Apr', reported: 58, resolved: 50 },
    { month: 'May', reported: 62, resolved: 55 },
    { month: 'Jun', reported: 55, resolved: 48 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive insights into hostel issues and trends</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Issues</p>
              <p className="text-2xl font-bold text-gray-900">{totalIssues}</p>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Issues</p>
              <p className="text-2xl font-bold text-gray-900">{pendingIssues}</p>
              <p className="text-xs text-yellow-600">Needs attention</p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved Issues</p>
              <p className="text-2xl font-bold text-gray-900">{resolvedIssues}</p>
              <p className="text-xs text-green-600">+8% improvement</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Resolution Time</p>
              <p className="text-2xl font-bold text-gray-900">{averageResolutionTime}h</p>
              <p className="text-xs text-green-600">-4h faster</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Issues by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.priority}: ${entry.count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {priorityData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Hostel-wise Issue Density</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hostelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hostel" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="reported" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Key Insights</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h3 className="ml-2 font-medium text-gray-900">Most Reported</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Plumbing issues account for 35% of all reports
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h3 className="ml-2 font-medium text-gray-900">Resolution Rate</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              82% of issues resolved within 48 hours
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500" />
              <h3 className="ml-2 font-medium text-gray-900">Peak Time</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Most issues reported between 6-9 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;