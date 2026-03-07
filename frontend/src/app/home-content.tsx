'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import LandingPage from '@/components/LandingPage/LandingPage';
import ProductPage from '@/components/LandingPage/ProductPage';
import CancellationPolicy from '@/components/Policies/CancellationPolicy';
import PaymentPolicy from '@/components/Policies/PaymentPolicy';
import PrivacyPolicy from '@/components/Policies/PrivacyPolicy';
import ReturnPolicy from '@/components/Policies/Return';
import ShippingPolicy from '@/components/Policies/ShippingPolicy';
import Terms from '@/components/Policies/Terms';

type GuestPageView = 'home' | 'products' | 'cancellation' | 'payment' | 'privacy' | 'return' | 'shipping' | 'terms';

export default function HomeContent() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentGuestView, setCurrentGuestView] = useState<GuestPageView>('home');
  const hasRedirected = useRef(false);

  // Redirect authenticated users to their dashboards (but allow public pages like products, policies)
  useEffect(() => {
    const view = searchParams.get('view');
    const publicPages = ['home', 'products', 'cancellation', 'payment', 'privacy', 'return', 'shipping', 'terms'];
    
    if (isAuthenticated && user && !hasRedirected.current && !publicPages.includes(view || '')) {
      hasRedirected.current = true;
      if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router, searchParams]);

  // Handle browser history navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.guestView) {
        setCurrentGuestView(event.state.guestView);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Derive forceGuestView directly from URL - allow authenticated users to view public pages
  const view = searchParams.get('view');
  const publicPages = ['home', 'products', 'cancellation', 'payment', 'privacy', 'return', 'shipping', 'terms'];
  const forceGuestView = publicPages.includes(view || '') || isAuthenticated === false;

  // If forceGuestView is set, show guest view even if authenticated
  if (forceGuestView) {
    const handleGuestNavigate = (view: string) => {
      const newView = view as GuestPageView;
      setCurrentGuestView(newView);
      window.history.pushState({ guestView: newView }, '', `?view=${newView}`);
      window.scrollTo(0, 0);
    };

    const renderGuestContent = () => {
      switch (currentGuestView) {
        case 'home':
          return <LandingPage onNavigate={handleGuestNavigate} />;
        case 'products':
          return <ProductPage onNavigate={handleGuestNavigate} />;
        case 'cancellation':
          return <CancellationPolicy onNavigate={handleGuestNavigate} />;
        case 'payment':
          return <PaymentPolicy onNavigate={handleGuestNavigate} />;
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

  
  // Guest (Not Logged In) - Switch between pages with browser history
  const handleGuestNavigate = (view: string) => {
    const newView = view as GuestPageView;
    setCurrentGuestView(newView);
    window.history.pushState({ guestView: newView }, '', `?view=${newView}`);
    window.scrollTo(0, 0);
  };

  const renderGuestContent = () => {
    switch (currentGuestView) {
      case 'home':
        return <LandingPage onNavigate={handleGuestNavigate} />;
      case 'products':
        return <ProductPage onNavigate={handleGuestNavigate} />;
      case 'cancellation':
        return <CancellationPolicy onNavigate={handleGuestNavigate} />;
      case 'payment':
        return <PaymentPolicy onNavigate={handleGuestNavigate} />;
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