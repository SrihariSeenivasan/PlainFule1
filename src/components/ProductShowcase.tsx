'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Package, ShieldCheck, Microscope } from 'lucide-react';
import SketchHighlight from './SketchHighlight';

const steps = [
    {
        num: '01',
        icon: Microscope,
        title: 'Micro Mill.',
        desc: 'Nature-derived nutrients, milled to a molecular scale that disappears into your food instantly. No texture, no taste, no compromise.',
        color: '#7cb342',
    },
    {
        num: '02',
        icon: ShieldCheck,
        title: 'Bio Guard.',
        desc: 'Our mix-blend technology prevents nutrient oxidation, ensuring 100% absorption at the cellular level. Every milligram counts.',
        color: '#053b05',
    },
    {
        num: '03',
        icon: Package,
        title: 'Completion.',
        desc: '26 Micronutrients filling the silent gaps in your morning. Pure, simple, and invisible. The delta — bridged.',
        color: '#7cb342',
    },
];

export default function ProductShowcase() {
    return (
        <section id="habit" className="bg-[var(--background)] section-pad relative overflow-hidden">

            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px]"
                    style={{ background: 'radial-gradient(ellipse, rgba(122,195,66,0.05) 0%, transparent 70%)' }} />
            </div>

            <div className="max-w-screen-xl mx-auto px-6 md:px-12 relative z-10">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <div className="tag-pill mb-6 mx-auto whitespace-nowrap" style={{ display: 'inline-flex' }}>How It Works</div>
                    <h2 className="font-playfair text-5xl md:text-7xl font-black text-[var(--foreground)] leading-[0.9] tracking-tight">
                        The Formula.<br />
                        <SketchHighlight type="underline" delay={0.8} color="#053b05">
                            <span className="font-playfair italic text-[var(--foreground)]/20">Decoded.</span>
                        </SketchHighlight>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.15 }}
                                className="group glass rounded-3xl p-8 hover:border-[rgba(122,195,66,0.2)] transition-all duration-500 relative overflow-hidden"
                            >
                                {/* Number backdrop */}
                                <div className="absolute top-6 right-6 font-playfair text-8xl font-black text-[var(--foreground)]/[0.04] leading-none select-none">
                                    {step.num}
                                </div>

                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8"
                                    style={{ background: `${step.color}15`, border: `1px solid ${step.color}25` }}>
                                    <Icon className="w-6 h-6" style={{ color: step.color }} />
                                </div>

                                <h3 className="font-playfair text-3xl font-bold text-[var(--foreground)] mb-4">{step.title}</h3>
                                <p className="text-[var(--foreground)]/50 text-base leading-relaxed font-light group-hover:text-[var(--foreground)]/70 transition-colors">{step.desc}</p>

                                {/* Bottom accent line */}
                                <div className="mt-8 h-px w-0 group-hover:w-full transition-all duration-700 rounded-full"
                                    style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }} />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Product image strip */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="glass rounded-3xl overflow-hidden flex flex-col md:flex-row items-center gap-10 md:gap-0"
                >
                    <div className="relative w-[200px] h-[260px] flex-shrink-0">
                        <Image
                            src="/images/product_premium.png"
                            alt="Plainfuel formula"
                            fill
                            className="object-contain filter brightness-[1.05]"
                        />
                    </div>
                    <div className="flex-1 p-10 border-t md:border-t-0 md:border-l" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-[#7cb342] font-black mb-4">The Result</p>
                        <h3 className="font-playfair text-4xl font-bold text-[var(--foreground)] mb-5">One Scoop. Everything.</h3>
                        <p className="text-[var(--foreground)]/50 text-lg font-light leading-relaxed max-w-lg">
                            Mix into your morning oats, smoothie, or batter. It disappears — no taste, no texture. Just your meal, and now, everything your body needs.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            {['Odorless', 'Tasteless', 'Dissolves Instantly', 'Heat Stable'].map((tag) => (
                                <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border"
                                    style={{ color: '#7cb342', borderColor: 'rgba(122,195,66,0.2)', background: 'rgba(122,195,66,0.05)' }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
