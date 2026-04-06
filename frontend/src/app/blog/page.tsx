import MainLayout from '@/components/MainLayout';
import BlogPageComponent from '@/components/LandingPage/BlogPage/BlogListingPage';

export const metadata = {
  title: 'Research Hub - PlainFuel',
  description: 'Clinical insights and nutritional science research curated for informed health decisions.',
};

export default function BlogPage() {
  return (
    <MainLayout background="#ffffff">
      <BlogPageComponent />
    </MainLayout>
  );
}
