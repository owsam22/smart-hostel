import React, { useState } from 'react';
import { useLostFound } from '@/contexts/LostFoundContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Package, 
  MapPin, 
  Calendar, 
  Tag, 
  Plus, 
  X
} from 'lucide-react';

const LostFound: React.FC = () => {
  const { items, claimItem, addItem } = useLostFound();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesSearch =
      (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleClaimItem = async (itemId: string) => {
    try {
      await claimItem(itemId);
    } catch (err) {
      console.error('Failed to claim item', err);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await addItem({ title, description, type, category, location, date });
      setTitle(''); setDescription(''); setType('lost'); setCategory('');
      setLocation(''); setDate(''); setShowForm(false);
    } catch (err) {
      console.error('Failed to report item', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'claimed': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lost & Found</h1>
          <p className="text-gray-600">Report and claim lost or found items</p>
        </div>

        {user && (
          <button
            onClick={() => setShowForm(prev => !prev)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Close Form' : 'Report Item'}
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-lg bg-white p-6 shadow mb-6">
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                value={type}
                onChange={e => setType(e.target.value as 'lost' | 'found')}
                className="rounded-lg border px-3 py-2"
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
              <input
                placeholder="Category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="rounded-lg border px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="rounded-lg border px-3 py-2"
              />
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="rounded-lg border px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Report Item'}
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="lost">Lost Items</option>
            <option value="found">Found Items</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="claimed">Claimed</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map(item => {
const reportedByName = item.reportedByUser?.name ?? 'Unknown';
const claimedByName = item.claimedByUser?.name;

          const itemId = item.id;

          return (
            <div key={itemId} className="rounded-lg bg-white shadow">
              <div className="h-48 w-full bg-gray-200 rounded-t-lg flex items-center justify-center text-gray-400">
                {item.type.toUpperCase()}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {item.type === 'lost' ? 'Lost' : 'Found'}
                      </span>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="mt-2 font-medium text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs text-gray-500">
                  <div className="flex items-center"><Tag className="mr-1 h-3 w-3" /> {item.category || '-'}</div>
                  <div className="flex items-center"><MapPin className="mr-1 h-3 w-3" /> {item.location || '-'}</div>
                  <div className="flex items-center"><Calendar className="mr-1 h-3 w-3" /> {item.date ? new Date(item.date).toLocaleDateString() : '-'}</div>
                  <div className="flex items-center"> <Package className="mr-1 h-3 w-3" /> Reported by {reportedByName}</div>
                </div>

                {item.status === 'pending' && item.type === 'found' && user?.role === 'student' && (
                  <button
                    onClick={() => handleClaimItem(itemId)}
                    className="mt-3 w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Claim This Item
                  </button>
                )}

{item.status === 'claimed' && claimedByName && (
  <div className="mt-3 rounded-lg bg-blue-50 p-2">
    <p className="text-xs text-blue-800">
      Claimed by {claimedByName} on{' '}
      {item.claimedAt ? new Date(item.claimedAt).toLocaleDateString() : '-'}
    </p>
  </div>
)}

              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">No lost or found items matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default LostFound;
