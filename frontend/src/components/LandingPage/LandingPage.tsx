import MainLayout from '@/components/MainLayout';
import Herosection from './LandingPageSections/Herosection';
import Blogsection from './LandingPageSections/Blogsection';
import Peoplesection from './LandingPageSections/Peoplesection';
import Productsection from './LandingPageSections/Productsection';
import DoctorsReview from './LandingPageSections/DoctorsReview';
import Chapter1 from './LandingPageSections/Chapter1';
import Chapter2 from './LandingPageSections/Chapter2';
import Chapter3 from './LandingPageSections/Chapter3';


export default function LandingPage() {
  return (
    <MainLayout background="var(--background)">
        <Herosection />
        <Chapter1 />
        <Chapter2 />
        <Chapter3 />
        <Productsection />
        <Blogsection />
        <Peoplesection />
        <DoctorsReview />
    </MainLayout>
  );
}
