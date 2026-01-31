import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  FileText, 
  PlusCircle, 
  Megaphone, 
  Search, 
  BarChart3, 
  LogOut
} from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Issues', href: '/issues', icon: FileText },
    { name: 'Report Issue', href: '/report-issue', icon: PlusCircle, role: 'student' },
    { name: 'Announcements', href: '/announcements', icon: Megaphone },
    { name: 'Lost & Found', href: '/lost-found', icon: Search },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, role: 'management' },
  ].filter(item => !item.role || item.role === user?.role);

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b">
          <h1 className="text-xl font-bold text-gray-800">Hostel Track</h1>
        </div>
        <nav className="mt-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'border-r-2 border-blue-500 bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-64 border-t p-4">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`}
              alt={user?.name}
              className="h-8 w-8 rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;