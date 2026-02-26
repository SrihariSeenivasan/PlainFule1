'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function HeroExperience() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);
    const productY = useTransform(scrollYProgress, [0, 0.6], [0, -60]);

    return (
        <section ref={ref} className="relative min-h-screen overflow-hidden">
            {/* Full-bleed background image */}
            <div className="absolute inset-0">
                <Image src="/images/hero-bg.png" alt="" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/80" />
            </div>

            {/* Nav */}
            <nav className="fixed top-0 inset-x-0 z-50 transition-all">
                <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
                    <span className="font-playfair text-2xl font-bold tracking-tight text-[#171717]">Plainfuel</span>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#171717]/70">
                        <a href="#story" className="hover:text-[#3a6b35] transition-colors">Story</a>
                        <a href="#whats-inside" className="hover:text-[#3a6b35] transition-colors">What&apos;s Inside</a>
                        <a href="#how-it-works" className="hover:text-[#3a6b35] transition-colors">How It Works</a>
                    </div>
                    <a href="#buy" className="inline-flex items-center gap-2 bg-[#3a6b35] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#2d5429] transition-colors shadow-sm">
                        Get Plainfuel
                    </a>
                </div>
            </nav>

            {/* Hero Content */}
            <motion.div style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative z-10 flex flex-col items-center text-center pt-32 md:pt-40 pb-20 px-6">

                {/* Badge */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 bg-[#3a6b35]/10 text-[#3a6b35] text-xs font-semibold px-4 py-2 rounded-full mb-8 border border-[#3a6b35]/20">
                    <span className="w-2 h-2 rounded-full bg-[#3a6b35] animate-pulse" />
                    India&apos;s First Meal Completer
                </motion.div>

                {/* Headline */}
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                    className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#171717] max-w-4xl leading-[1.05]">
                    Complete your meals. <br className="hidden md:block" />
                    <span className="text-[#3a6b35]">Simply.</span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    className="mt-6 text-lg md:text-xl text-[#171717]/60 max-w-2xl font-light leading-relaxed">
                    One scoop adds the protein, fibre, and micronutrients your daily food misses. Not a replacement — a completion.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                    className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <a href="#buy" className="inline-flex items-center gap-2 bg-[#3a6b35] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#2d5429] transition-all shadow-lg shadow-[#3a6b35]/20 hover:shadow-[#3a6b35]/30 hover:-translate-y-0.5 text-base">
                        Start Today — ₹599
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                    <a href="#story" className="inline-flex items-center gap-2 text-[#171717] font-semibold px-8 py-4 rounded-full border border-[#171717]/15 hover:border-[#171717]/30 transition-all hover:-translate-y-0.5 text-base">
                        Our Story
                    </a>
                </motion.div>

                {/* Product Image — the hero */}
                <motion.div style={{ y: productY }}
                    initial={{ opacity: 0, y: 60, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative mt-16 md:mt-20">

                    <div className="relative w-[280px] h-[350px] md:w-[400px] md:h-[500px]">
                        <Image src="/images/product.png" alt="Plainfuel Product" fill className="object-contain drop-shadow-2xl" priority />
                    </div>

                    {/* Floating ingredient badges */}
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 0 }}
                        className="absolute -left-16 md:-left-32 top-1/4 bg-white rounded-2xl px-4 py-3 shadow-lg border border-black/5">
                        <p className="text-xs font-semibold text-[#3a6b35]">🌾 6g Fibre</p>
                    </motion.div>
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                        className="absolute -right-16 md:-right-32 top-1/3 bg-white rounded-2xl px-4 py-3 shadow-lg border border-black/5">
                        <p className="text-xs font-semibold text-[#3a6b35]">💊 40% Micronutrients</p>
                    </motion.div>
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                        className="absolute -left-8 md:-left-20 bottom-8 bg-white rounded-2xl px-4 py-3 shadow-lg border border-black/5">
                        <p className="text-xs font-semibold text-[#3a6b35]">🥩 Complete Protein</p>
                    </motion.div>
                </motion.div>

                {/* Trust bar */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                    className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12 text-[#171717]/40 text-xs font-medium uppercase tracking-wider">
                    <span>🧪 Lab Tested</span>
                    <span className="w-1 h-1 rounded-full bg-[#171717]/20" />
                    <span>🌿 No Artificial Anything</span>
                    <span className="w-1 h-1 rounded-full bg-[#171717]/20" />
                    <span>🇮🇳 Made in India</span>
                    <span className="w-1 h-1 rounded-full bg-[#171717]/20" />
                    <span>⭐ 4.8/5 Rating</span>
                </motion.div>
            </motion.div>
        </section>
    );
}
