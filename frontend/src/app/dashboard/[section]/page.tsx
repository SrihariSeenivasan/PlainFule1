'use client';

import { useParams } from 'next/navigation';
import UserDashboard from '@/components/UserPanel/UserDashboard';
import UserOrders from '@/components/UserPanel/UserOrders';
import UserProfile from '@/components/UserPanel/UserProfile';

export default function UserSectionPage() {
  const params = useParams();
  const section = params.section as string;

  const renderContent = () => {
    switch (section) {
      case 'dashboard':
        return <UserDashboard />;
      case 'orders':
        return <UserOrders />;
      case 'profile':
        return <UserProfile />;
      default:
        return <UserDashboard />;
    }
  };

  return renderContent();
}
