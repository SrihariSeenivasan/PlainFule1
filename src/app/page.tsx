import HeroExperience from '@/components/HeroExperience';
import ChaosScroll from '@/components/ChaosScroll';
import BalanceTransition from '@/components/BalanceTransition';
import ProductShowcase from '@/components/ProductShowcase';
import MacroOrbit from '@/components/MacroOrbit';
import NotAnother from '@/components/NotAnother';
import EfficiencyGrid from '@/components/EfficiencyGrid';
import PhilosophyImpact from '@/components/PhilosophyImpact';
import FinalCTA from '@/components/FinalCTA';

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <HeroExperience />
      <ChaosScroll />
      <BalanceTransition />
      <ProductShowcase />
      <MacroOrbit />
      <NotAnother />
      <EfficiencyGrid />
      <PhilosophyImpact />
      <FinalCTA />
    </main>
  );
}
