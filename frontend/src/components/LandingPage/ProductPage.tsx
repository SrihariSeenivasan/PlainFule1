'use client';

import MainLayout from '../MainLayout';
import Products from './ProductPageSections/Products';
import { BRAND } from '@/lib/typography';

export default function ProductPage() {
  return (
    <MainLayout background={BRAND.white}>
        <Products />
    </MainLayout>
  );
}
