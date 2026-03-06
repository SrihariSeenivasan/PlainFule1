'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import UserHeader from '@/components/UserPanel/UserHeader';
import UserSidebar from '@/components/UserPanel/UserSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Redirect non-authenticated or admin users
    if (isAuthenticated && user?.role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role === 'ADMIN') {
    return null;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <UserHeader />
      <div className="flex flex-1 overflow-hidden">
        <UserSidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
