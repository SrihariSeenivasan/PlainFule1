'use client';

import { useAuth } from '@/lib/auth-context';

export default function AdminHeader() {
  const { user } = useAuth();
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'A'
    : 'A';

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Mobile: show brand since sidebar is hidden */}
        <div>
          <span className="md:hidden text-lg font-bold text-gray-900 dark:text-white">
            PlainFuel
          </span>
          <h2 className="hidden md:block text-xl font-semibold text-gray-900 dark:text-white">
            Admin Panel
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-lg">
            🔔
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}