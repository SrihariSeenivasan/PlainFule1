'use client';

import { useParams } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import BlogDetailPage from '@/components/LandingPage/BlogPage/BlogDetailPage';

export default function BlogDetailPageRoute() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <MainLayout background="#ffffff">
      <BlogDetailPage slug={slug} />
    </MainLayout>
  );
}
