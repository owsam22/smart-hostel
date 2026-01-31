import React, { useState } from 'react';
import { useLostFound } from '@/contexts/LostFoundContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Package, 
  MapPin, 
  Calendar, 
  Tag, 
  Plus
} from 'lucide-react';

const LostFound: React.FC = () => {
  const { items, claimItem } = useLostFound();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleClaimItem = (itemId: string) => {
    if (user) {
      claimItem(itemId, user.id);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lost & Found</h1>
          <p className="text-gray-600">Report and claim lost or found items</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Report Item
        </button>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="lost">Lost Items</option>
            <option value="found">Found Items</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="claimed">Claimed</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div key={item.id} className="rounded-lg bg-white shadow">
            <div className="aspect-h-16 aspect-w-16">
              <img
                src={item.media[0] || `https://picsum.photos/seed/${item.id}/400/300.jpg`}
                alt={item.title}
                className="h-48 w-full rounded-t-lg object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
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
                <div className="flex items-center">
                  <Tag className="mr-1 h-3 w-3" />
                  {item.category}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-1 h-3 w-3" />
                  {item.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(item.date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Package className="mr-1 h-3 w-3" />
                  Reported by {item.reportedByUser.name}
                </div>
              </div>

              {item.status === 'pending' && item.type === 'found' && user?.role === 'student' && (
                <button
                  onClick={() => handleClaimItem(item.id)}
                  className="mt-3 w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Claim This Item
                </button>
              )}

              {item.status === 'claimed' && item.claimedByUser && (
                <div className="mt-3 rounded-lg bg-blue-50 p-2">
                  <p className="text-xs text-blue-800">
                    Claimed by {item.claimedByUser.name} on {new Date(item.claimedAt!).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No lost or found items matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default LostFound;