'use client';

import { useParams } from 'next/navigation';
import AdminDashboard from '@/components/AdminPanel/AdminDashboard';
import AdminUsers from '@/components/AdminPanel/AdminUsers';
import AdminOrders from '@/components/AdminPanel/AdminOrders';
import AdminProducts from '@/components/AdminPanel/AdminProducts';
import AdminPayments from '@/components/AdminPanel/AdminPayments';

export default function AdminSectionPage() {
  const params = useParams();
  const section = params.section as string;

  const renderContent = () => {
    switch (section) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <AdminUsers />;
      case 'orders':
        return <AdminOrders />;
      case 'products':
        return <AdminProducts />;
      case 'payments':
        return <AdminPayments />;
      default:
        return <AdminDashboard />;
    }
  };

  return renderContent();
}
