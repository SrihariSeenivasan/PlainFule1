'use client';

import Navbar from '../Navbar';
import Products from './ProductPageSections/Products';

export default function ProductPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fdfaf3' }}>
      {/* This div clips horizontal overflow WITHOUT breaking sticky */}
      <div style={{ overflowX: 'clip' }}>
        <Navbar />
        <Products />
      </div>
    </main>
  );
}
