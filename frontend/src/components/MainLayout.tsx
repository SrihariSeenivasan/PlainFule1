'use client';

import Navbar from './Navbar';
import FinalCTA from './FinalCTA';

interface MainLayoutProps {
  children: React.ReactNode;
  background?: string;
}

export default function MainLayout({ children, background = '#f7f8f5' }: MainLayoutProps) {
  return (
    <main style={{ minHeight: '100vh', background }}>
      {/* This div clips horizontal overflow WITHOUT breaking sticky */}
      <div style={{ overflowX: 'clip' }}>
        <Navbar />
        {children}
        <FinalCTA />
      </div>
    </main>
  );
}
