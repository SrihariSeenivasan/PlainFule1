import Navbar from '@/components/Navbar';
import FinalCTA from '@/components/FinalCTA';
import Herosection from './LandingPageSections/Herosection';
import Blogsection from './LandingPageSections/Blogsection';
import Peoplesection from './LandingPageSections/Peoplesection';
import HAWDsection from './LandingPageSections/HAWDsection';
import Productsection from './LandingPageSections/Productsection';
import MicronutrientGapSection from './LandingPageSections/MicronutrientGapSection';
import DoctorsReview from './LandingPageSections/DoctorsReview';
import ProblemSection from './LandingPageSections/TheProblem';
import WhyPlainFuel from './LandingPageSections/WhyPlainFuel';
import CanWeGetFromFood from './LandingPageSections/CanWeGetFromFood';
import WhatDoWeDoToday from './LandingPageSections/Whatdowedotoday';
import FiveInOneSection from './LandingPageSections/FiveInOneSection';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* This div clips horizontal overflow WITHOUT breaking sticky */}
      <div style={{ overflowX: 'clip' }}>
        <Navbar />
        <Herosection />
        <WhyPlainFuel />
        <CanWeGetFromFood />
        <WhatDoWeDoToday />
        <FiveInOneSection />
        <Productsection />
        <HAWDsection />
        <Blogsection />
        <Peoplesection />
        <DoctorsReview />
        <FinalCTA />
      </div>
    </main>
  );
}
