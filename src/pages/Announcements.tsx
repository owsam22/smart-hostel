import React, { useState } from 'react';
import { useAnnouncements } from '@/contexts/AnnouncementContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search,
  Megaphone,
  Calendar,
  MessageSquare,
  Plus,
  X
} from 'lucide-react';
import CreateAnnouncement from '@/components/CreateAnnouncement';

const Announcements: React.FC = () => {
  const { announcements = [] } = useAnnouncements(); // SAFETY
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const filteredAnnouncements = announcements.filter((announcement) => {
    if (!announcement) return false;

    const title = announcement.title ?? '';
    const content = announcement.content ?? '';

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === 'all' || announcement.type === typeFilter;

    const matchesTarget =
      !announcement.targetHostel ||
      announcement.targetHostel === user?.hostel ||
      user?.role === 'management';

    return matchesSearch && matchesType && matchesTarget && announcement.isActive;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'general': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'cleaning': return 'bg-green-100 text-green-800';
      case 'pest_control': return 'bg-purple-100 text-purple-800';
      case 'water': return 'bg-cyan-100 text-cyan-800';
      case 'electricity': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600">Stay updated with hostel news and notices</p>
        </div>

        {user?.role === 'management' && (
          <button
            onClick={() => setShowForm(prev => !prev)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Close Form' : 'New Announcement'}
          </button>
        )}
      </div>

      {showForm && <CreateAnnouncement />}

      <div className="rounded-lg bg-white p-4 shadow">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2"
              />
            </div>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            <option value="all">All Types</option>
            <option value="general">General</option>
            <option value="maintenance">Maintenance</option>
            <option value="cleaning">Cleaning</option>
            <option value="pest_control">Pest Control</option>
            <option value="water">Water</option>
            <option value="electricity">Electricity</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {announcement.title}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {announcement.content}
                    </p>
                  </div>

                  <span className={`ml-4 rounded-full px-3 py-1 text-xs font-medium ${getTypeColor(announcement.type)}`}>
                    {announcement.type?.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Megaphone className="mr-1 h-4 w-4" />
                    {announcement.createdByUser?.name ?? 'Management'}
                  </div>

                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {announcement.createdAt
                      ? new Date(announcement.createdAt).toLocaleDateString()
                      : '—'}
                  </div>

                  <div className="flex items-center">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    {announcement.comments?.length ?? 0} comments
                  </div>

                  {announcement.targetHostel && (
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                      Target: {announcement.targetHostel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements</h3>
          <p className="mt-1 text-sm text-gray-500">
            No announcements found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Announcements;
