'use client';

import Link from 'next/link';
import { LayoutDashboard, Package, User, Home, LogOut } from 'lucide-react';

type UserPageView = 'dashboard' | 'orders' | 'profile';

interface UserSidebarProps {
  currentView: UserPageView;
  setCurrentView: (view: UserPageView) => void; 
}

export default function UserSidebar({ currentView, setCurrentView }: UserSidebarProps) {
  const menuItems = [
    { view: 'dashboard' as UserPageView, icon: LayoutDashboard, label: 'Dashboard' },
    { view: 'orders' as UserPageView, icon: Package, label: 'Orders' },
    { view: 'profile' as UserPageView, icon: User, label: 'Profile' },
  ];

  return (
    <aside className="w-64 bg-gray-900 dark:bg-gray-900 text-white h-screen overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">PlainFuel</h1>
        <p className="text-gray-400 text-sm mt-1">My Account</p>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setCurrentView(item.view)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === item.view
                ? 'bg-green-600 text-white'
                : 'hover:bg-gray-800'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-800 mx-4 my-4"></div>

      {/* Back to Home */}
      <nav className="p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Home size={20} />
          <span>Back to Home</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 absolute bottom-0 w-64">
        <button 
          onClick={() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            window.location.href = '/';
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
