import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, MapPin, Home, User, Building } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <div className="rounded-lg bg-white shadow">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
              alt={user.name}
              className="h-20 w-20 rounded-full"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        <div className="border-t">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Hostel Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Hostel</p>
                  <p className="font-medium text-gray-900">{user.hostel}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Home className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Block</p>
                  <p className="font-medium text-gray-900">{user.block}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Room</p>
                  <p className="font-medium text-gray-900">{user.room}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;