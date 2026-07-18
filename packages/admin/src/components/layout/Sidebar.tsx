import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Monitor,
  Calendar,
  ShoppingCart,
  BarChart3,
  Star,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/devices', icon: Monitor, label: 'Devices' },
  { to: '/bookings', icon: Calendar, label: 'Bookings' },
  { to: '/pos', icon: ShoppingCart, label: 'POS' },
  { to: '/slots', icon: Clock, label: 'Time Slots' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/reviews', icon: Star, label: 'Reviews' },
  { to: '/users', icon: Users, label: 'Users' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        'h-screen bg-navy-800 border-r border-navy-700 flex flex-col transition-all duration-200 sticky top-0',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className="flex items-center gap-2 p-4 border-b border-navy-700">
        <Gamepad2 className="w-7 h-7 text-accent-blue flex-shrink-0" />
        {!collapsed && <span className="font-bold text-lg text-white">GameEdge</span>}
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30'
                  : 'text-gray-400 hover:text-white hover:bg-navy-700'
              )
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-navy-700 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </aside>
  );
}
