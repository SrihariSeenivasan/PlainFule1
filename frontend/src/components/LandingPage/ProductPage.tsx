'use client';

import MainLayout from '../MainLayout';
import Products from './ProductPageSections/Products';

const C = {
  offwhite: '#f7f8f5',
};

export default function ProductPage() {
  return (
    <MainLayout background={C.offwhite}>
        <Products />
    </MainLayout>
  );
}
