'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, CreditCard,
  ShoppingBag, Users, Home, LogOut, MoreHorizontal, X,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function AdminSidebar() {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // All sidebar items (desktop)
  const allItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/orders',    icon: Package,         label: 'Orders'    },
    { href: '/admin/payments',  icon: CreditCard,      label: 'Payments'  },
    { href: '/admin/products',  icon: ShoppingBag,     label: 'Products'  },
    { href: '/admin/users',     icon: Users,           label: 'Users'     },
  ];

  // Bottom nav: 3 primary tabs always visible
  const primaryNav = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/orders',    icon: Package,         label: 'Orders'    },
    { href: '/admin/products',  icon: ShoppingBag,     label: 'Products'  },
  ];

  // "More" drawer items
  const moreItems = [
    { href: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { href: '/admin/users',    icon: Users,      label: 'Users'    },
  ];

  const isActive = (href: string) => pathname === href;


  return (
    <>
      {/* ── Desktop Sidebar (md+) ── */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 text-white h-full flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">PlainFuel</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {allItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-800 mx-4" />

        <nav className="p-4">
          <Link
            href="/?view=home"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </Link>
        </nav>

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

      {/* ── Mobile: backdrop ── */}
      {moreOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* ── Mobile: "More" slide-up drawer ── */}
      <div
        className={`md:hidden fixed bottom-16 left-0 right-0 z-50 bg-gray-900 rounded-t-2xl border-t border-gray-700 transition-transform duration-300 ${
          moreOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-white font-semibold text-sm">More</span>
          <button onClick={() => setMoreOpen(false)} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pb-6 space-y-1">
          {moreItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMoreOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}

          <div className="border-t border-gray-700 my-2" />

          <Link
            href="/?view=home"
            onClick={() => setMoreOpen(false)}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <Home size={20} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* ── Mobile: bottom tab bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 flex items-center justify-around px-1 py-2">
        {primaryNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMoreOpen(false)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors flex-1 ${
              isActive(item.href)
                ? 'text-green-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <item.icon size={21} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}

        <button
          onClick={() => setMoreOpen((v) => !v)}
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors flex-1 ${
            moreOpen ? 'text-green-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          <MoreHorizontal size={21} />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>
    </>
  );
}