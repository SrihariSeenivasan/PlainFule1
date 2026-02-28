'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import SketchHighlight from './SketchHighlight';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, 'change', (y) => {
        setScrolled(y > 60);
    });

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}
        >
            <div className={`mx-4 md:mx-8 rounded-2xl transition-all duration-500 ${scrolled
                ? 'bg-[rgba(255,255,255,0.9)] backdrop-blur-2xl border border-[rgba(34,197,94,0.15)] shadow-[0_8px_40px_rgba(0,0,0,0.1)]'
                : 'bg-transparent'
                }`}>
                <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-3 flex items-center justify-between gap-6">

                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-3 flex-shrink-0">
                        <div className="w-9 h-9 bg-gradient-to-br from-[#22c55e] to-[#15803d] rounded-xl flex items-center justify-center text-white font-black text-base shadow-[0_0_20px_rgba(34,197,94,0.3)] group-hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all duration-300">
                            P
                        </div>
                        <span className="font-playfair text-2xl font-bold text-[var(--foreground)] tracking-tight">
                            Plainfuel
                        </span>
                    </Link>

                    {/* Center Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.12em]">
                        <a href="#investigation" className="text-[var(--foreground)]/60 hover:text-[#22c55e] transition-colors duration-200">Investigation</a>
                        <a href="#inside" className="text-[var(--foreground)]/60 hover:text-[#22c55e] transition-colors duration-200">Inside</a>
                        <a href="#habit" className="text-[var(--foreground)]/60 hover:text-[#22c55e] transition-colors duration-200">Habit</a>
                        <div className="h-3 w-px bg-[var(--foreground)]/10" />
                        <a href="#buy" className="text-[#22c55e] hover:text-[#15803d] transition-colors duration-200">
                            <SketchHighlight type="underline" delay={1.5} color="#22c55e" className="pb-1">Order →</SketchHighlight>
                        </a>
                    </nav>

                    {/* CTA */}
                    <a href="#buy"
                        className="flex-shrink-0 px-6 py-2.5 bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white font-bold text-[11px] uppercase tracking-[0.12em] rounded-full shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_30px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                        Get Started
                    </a>

                </div>
            </div>
        </motion.nav>
    );
}
