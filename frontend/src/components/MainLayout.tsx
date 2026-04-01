'use client';

import Navbar from './Navbar';
import FinalCTA from './FinalCTA';

interface MainLayoutProps {
  children: React.ReactNode;
  background?: string;
  showFAQ?: boolean;
}

export default function MainLayout({ children, background = '#ffffff', showFAQ = true }: MainLayoutProps) {
  return (
    <main style={{ minHeight: '100vh', background }}>
      {/* This div clips horizontal overflow WITHOUT breaking sticky */}
      <div style={{ overflowX: 'clip' }}>
        {/* <Navbar /> */}
        {children}
        <FinalCTA showFAQ={showFAQ} />
      </div>
    </main>
  );
}
