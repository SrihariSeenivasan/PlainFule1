import Navbar from '@/components/Navbar';
import FinalCTA from '@/components/FinalCTA';
import Herosection from '@/components/LandingPageSections/Herosection';
import Blogsection from '@/components/LandingPageSections/Blogsection';
import Peoplesection from '@/components/LandingPageSections/Peoplesection';
import HAWDsection from '@/components/LandingPageSections/HAWDsection';
import Productsection from '@/components/LandingPageSections/Productsection';
import Sciencesection from '@/components/LandingPageSections/Sciencesection';
import InsiderBundleSection from '@/components/LandingPageSections/Insiderbundlesection';

export default function Home() {
  return (
    /*
      KEY FIX:
      - Removed overflow-x-hidden from <main> — this was creating a scroll
        container that broke position:sticky inside ProductSection.
      - Instead, we use a full-width wrapper div with overflow:clip on the
        x-axis only. overflow-clip does NOT create a scroll context (unlike
        overflow-hidden), so position:sticky works correctly against the
        window scroll, while horizontal overflow is still visually clipped.
    */
    <main className="min-h-screen bg-[var(--background)]">
      {/* This div clips horizontal overflow WITHOUT breaking sticky */}
      <div style={{ overflowX: 'clip' }}>
        <Navbar />

        <Herosection />
        <Sciencesection />
        <Productsection />
        <Blogsection />
        <Peoplesection />
        <HAWDsection />
        <InsiderBundleSection />
        <FinalCTA />
      </div>
    </main>
  );
}