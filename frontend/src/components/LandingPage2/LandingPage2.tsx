'use client';

import React from 'react';
import DoodleBackground from './DoodleBackground';
import Hero from './Hero';
import TheProblem from './TheProblem';
import FoodIsntPractical from './FoodIsntPractical';
import BrokenSystem from './BrokenSystem';
import WhatContains from './WhatContains';
import HowItFits from './HowItFits';
import FinalClose from './FinalClose';

export default function LandingPage2() {
  return (
    <div className="relative bg-[#faf8f2] text-black min-h-screen font-sans overflow-x-hidden selection:bg-black selection:text-[#faf8f2]">
      {/* Animated doodle scatter background — fixed, behind all content */}
      <DoodleBackground />

      {/* All sections sit above the background */}
      <div className="relative z-10">
        <Hero />
        <TheProblem />
        <FoodIsntPractical />
        <BrokenSystem />
        <WhatContains />
        <HowItFits />
        <FinalClose />
      </div>
    </div>
  );
}
