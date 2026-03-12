'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import AdminHeader from '@/components/AdminPanel/AdminHeader';
import AdminSidebar from '@/components/AdminPanel/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to load from localStorage
    if (isLoading) return;

    // Redirect non-admin users
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Show nothing while loading auth
  if (isLoading || !isAuthenticated || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div
      className="flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900"
      style={{ height: '100dvh' }}
    >
      <AdminHeader />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <AdminSidebar />
        <main
          className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900"
          style={{
            padding: 'clamp(12px, 3vw, 24px)',
            paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 80px, 96px)',
          }}
        >
          <div className="max-w-screen-2xl mx-auto md:pb-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}