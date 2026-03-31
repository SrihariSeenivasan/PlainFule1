'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import MainLayout from '@/components/MainLayout';
import ProductPage from '@/components/LandingPage/ProductPage';
import AboutPage from '@/components/LandingPage/AboutPage';
import ProductCart from '@/components/LandingPage/ProductPageSections/ProductCart';
import Checkout from '@/components/LandingPage/ProductPageSections/ProductCheckout';
import UserOrders from '@/components/UserPanel/UserOrders';
import UserProfile from '@/components/UserPanel/UserProfile';
import CancellationPolicy from '@/components/Policies/CancellationPolicy';
import PaymentPolicy from '@/components/Policies/PaymentPolicy';
import PrivacyPolicy from '@/components/Policies/PrivacyPolicy';
import ReturnPolicy from '@/components/Policies/Return';
import ShippingPolicy from '@/components/Policies/ShippingPolicy';
import Terms from '@/components/Policies/Terms';
import ResetPassword from '@/components/Login/ResetPassword';
import ContactPage from '@/components/LandingPage/ContactPage';

const PROTECTED = ['my-orders', 'my-profile'];

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && isAuthenticated === false) router.replace('/');
  }, [isAuthenticated, isLoading, router]);
  if (isLoading || !isAuthenticated) return null;
  return <>{children}</>;
}

export default function SectionPage() {
  const params = useParams();
  const section = params.section as string;

  switch (section) {
    case 'products':
      return <ProductPage />;
    case 'about':
      return <AboutPage />;
    case 'cart':
      return <ProductCart />;
    case 'checkout':
      return <Checkout />;
    case 'my-orders':
      return (
        <AuthGuard>
          <MainLayout background="#ffffff" showFAQ={false}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', paddingTop: 120 }}>
              <UserOrders />
            </div>
          </MainLayout>
        </AuthGuard>
      );
    case 'my-profile':
      return (
        <AuthGuard>
          <MainLayout background="#ffffff" showFAQ={false}>
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px', paddingTop: 120 }}>
              <UserProfile />
            </div>
          </MainLayout>
        </AuthGuard>
      );
    case 'cancellation': return <CancellationPolicy />;
    case 'payment':      return <PaymentPolicy />;
    case 'privacy':      return <PrivacyPolicy />;
    case 'return':       return <ReturnPolicy />;
    case 'shipping':     return <ShippingPolicy />;
    case 'terms':        return <Terms />;
    case 'reset-password': return <ResetPassword />;
    case 'contact':
      return (
        <MainLayout background="#ffffff">
          <ContactPage />
        </MainLayout>
      );
    default:
      return null;
  }
}

export { PROTECTED };
