import Navbar from '@/components/Navbar';
import HeroExperience from '@/components/HeroExperience';
import ChaosScroll from '@/components/ChaosScroll';
import PhilosophyImpact from '@/components/PhilosophyImpact';
import BalanceTransition from '@/components/BalanceTransition';
import MacroOrbit from '@/components/MacroOrbit';
import ProductShowcase from '@/components/ProductShowcase';
import NotAnother from '@/components/NotAnother';
import EfficiencyGrid from '@/components/EfficiencyGrid';
import FinalCTA from '@/components/FinalCTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] overflow-x-hidden">
      <Navbar />
      <HeroExperience />
      <ChaosScroll />
      <PhilosophyImpact />
      <BalanceTransition />
      <MacroOrbit />
      <ProductShowcase />
      <NotAnother />
      <EfficiencyGrid />
      <FinalCTA />
    </main>
  );
}
