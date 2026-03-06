'use client';

import { useState, useSyncExternalStore, useEffect } from 'react';
import LandingPage from '@/components/LandingPage/LandingPage';
import Products from '@/components/LandingPage/Products';
import PrivacyPolicy from '@/components/Policies/PrivacyPolicy';
import ReturnPolicy from '@/components/Policies/Return';
import ShippingPolicy from '@/components/Policies/ShippingPolicy';
import Terms from '@/components/Policies/Terms';
import UserDashboard from '@/components/UserPanel/UserDashboard';
import UserOrders from '@/components/UserPanel/UserOrders';
import UserProfile from '@/components/UserPanel/UserProfile';
import UserHeader from '@/components/UserPanel/UserHeader';
import UserSidebar from '@/components/UserPanel/UserSidebar';
import AdminDashboard from '@/components/AdminPanel/AdminDashboard';
import AdminUsers from '@/components/AdminPanel/AdminUsers';
import AdminOrders from '@/components/AdminPanel/AdminOrders';
import AdminProducts from '@/components/AdminPanel/AdminProducts';
import AdminPayments from '@/components/AdminPanel/AdminPayments';
import AdminHeader from '@/components/AdminPanel/AdminHeader';
import AdminSidebar from '@/components/AdminPanel/AdminSidebar';

type UserPageView = 'dashboard' | 'orders' | 'profile';
type AdminPageView = 'dashboard' | 'users' | 'orders' | 'products' | 'payments';
type GuestPageView = 'home' | 'products' | 'privacy' | 'return' | 'shipping' | 'terms';

const subscribe = () => () => {};
const getAuthSnapshot = () => {
  const authToken = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');
  if (authToken && role) return role;
  return null;
};
const getServerSnapshot = () => null;

export default function Home() {
  const role = useSyncExternalStore(subscribe, getAuthSnapshot, getServerSnapshot);
  const [currentUserView, setCurrentUserView] = useState<UserPageView>('dashboard');
  const [currentAdminView, setCurrentAdminView] = useState<AdminPageView>('dashboard');
  const [currentGuestView, setCurrentGuestView] = useState<GuestPageView>('home');

  // Handle browser back/forward buttons for guest navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.guestView) {
        setCurrentGuestView(event.state.guestView);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Admin Panel
  if (role === 'admin') {
    const renderAdminContent = () => {
      switch (currentAdminView) {
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

    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#1f2937' }}>
        <AdminSidebar currentView={currentAdminView} setCurrentView={setCurrentAdminView} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <AdminHeader />
          <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            {renderAdminContent()}
          </main>
        </div>
      </div>
    );
  }

  // User Panel
  if (role === 'user') {
    const renderUserContent = () => {
      switch (currentUserView) {
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

    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
        <UserSidebar currentView={currentUserView} setCurrentView={setCurrentUserView} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <UserHeader />
          <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            {renderUserContent()}
          </main>
        </div>
      </div>
    );
  }

  // Guest (Not Logged In) - Switch between pages with browser history
  const handleGuestNavigate = (view: string) => {
    const newView = view as GuestPageView;
    setCurrentGuestView(newView);
    // Push state to browser history so back button works
    window.history.pushState({ guestView: newView }, '', `?view=${newView}`);
    window.scrollTo(0, 0);
  };

  const renderGuestContent = () => {
    switch (currentGuestView) {
      case 'home':
        return <LandingPage onNavigate={handleGuestNavigate} />;
      case 'products':
        return <Products onNavigate={handleGuestNavigate} />;
      case 'privacy':
        return <PrivacyPolicy onNavigate={handleGuestNavigate} />;
      case 'return':
        return <ReturnPolicy onNavigate={handleGuestNavigate} />;
      case 'shipping':
        return <ShippingPolicy onNavigate={handleGuestNavigate} />;
      case 'terms':
        return <Terms onNavigate={handleGuestNavigate} />;
      default:
        return <LandingPage onNavigate={handleGuestNavigate} />;
    }
  };

  return renderGuestContent();
}