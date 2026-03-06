'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Package, User, Home, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function UserSidebar() {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/orders', icon: Package, label: 'Orders' },
    { href: '/dashboard/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* ── Desktop Sidebar (md and above) ── */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 text-white h-full overflow-y-auto flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">PlainFuel</h1>
          <p className="text-gray-400 text-sm mt-1">My Account</p>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-gray-800'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-800 mx-4"></div>

        {/* Back to Home */}
        <nav className="p-4">
          <Link
            href="/?view=home"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Navigation (below md) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 flex items-center justify-around px-2 py-2 safe-area-pb">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors flex-1 ${
              isActive(item.href)
                ? 'text-green-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <item.icon size={22} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}

        {/* Home shortcut */}
        <Link
          href="/?view=home"
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-gray-400 hover:text-white transition-colors flex-1"
        >
          <Home size={22} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        {/* Logout shortcut */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 transition-colors flex-1"
        >
          <LogOut size={22} />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </nav>
    </>
  );
}