import React from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuth';

export function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 bg-navy-800 border-b border-navy-700 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white">Admin Panel</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-navy-700 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-navy-700">
          <div className="w-8 h-8 bg-accent-blue/20 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-accent-blue" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-accent-red hover:bg-navy-700 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
