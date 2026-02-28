'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface StatPillProps {
    value: string;
    label: string;
    delay?: number;
}

const StatPill = ({ value, label, delay = 0 }: StatPillProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="flex flex-col gap-1 px-4 py-3 rounded-xl cursor-default"
        style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
        }}
    >
        <span className="text-2xl font-black leading-none tracking-tight" style={{ color: 'var(--green-bright)' }}>{value}</span>
        <span className="text-[9px] uppercase tracking-[0.2em] font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
    </motion.div>
);

interface PillarItem {
    icon: string;
    label: string;
}

const pillars: PillarItem[] = [
    { icon: '◈', label: 'Bio-identical nutrients' },
    { icon: '◉', label: 'Your unique biological Delta' },
    { icon: '◎', label: 'Zero unnecessary filler' },
];

export default function Sciencesection() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

    return (
        <section ref={sectionRef} className="py-16 md:py-24 bg-[var(--background)] px-4 md:px-8 relative overflow-hidden">

            {/* ambient glows */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    style={{
                        y: bgY,
                        background: 'radial-gradient(circle, var(--green-bright) 0%, transparent 70%)',
                        opacity: 0.06,
                    }}
                    className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full"
                />
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
            </div>

            <div className="max-w-screen-xl mx-auto relative z-10">

                {/* eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-4 mb-10"
                >
                    <span className="h-px w-14" style={{ background: 'linear-gradient(to right, transparent, var(--green-bright))' }} />
                    <span className="text-[9px] font-black uppercase tracking-[0.35em]" style={{ color: 'var(--green-bright)' }}>
                        The Science of Sufficiency
                    </span>
                    <span className="h-px w-14" style={{ background: 'linear-gradient(to left, transparent, var(--green-bright))' }} />
                </motion.div>

                {/* main card */}
                <div
                    className="rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
                    style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(16px)',
                        boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
                    }}
                >

                    {/* ── LEFT: PROBLEM ── */}
                    <div
                        className="relative p-7 sm:p-9 md:p-11 flex flex-col justify-between gap-7 overflow-hidden border-b lg:border-b-0 lg:border-r"
                        style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.18)' }}
                    >
                        {/* watermark */}
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.2 }}
                            aria-hidden
                            className="absolute right-2 top-0 font-black select-none pointer-events-none"
                            style={{ fontSize: 'clamp(80px, 12vw, 160px)', lineHeight: 1, color: 'var(--green-bright)', opacity: 0.07 }}
                        >01</motion.span>

                        <div className="relative z-10">
                            <motion.span
                                initial={{ opacity: 0, x: -8 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-[9px] font-black uppercase tracking-[0.3em] inline-flex items-center gap-2 mb-5"
                                style={{ color: 'var(--green-bright)' }}
                            >
                                <span className="w-4 h-px" style={{ background: 'var(--green-bright)' }} />
                                The Market Problem
                            </motion.span>

                            <motion.h2
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="font-playfair font-black mb-5 leading-[1.0]"
                                style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.8rem)', color: 'var(--foreground)' }}
                            >
                                The Modern Diet.<br />
                                <span className="font-light" style={{ color: 'var(--green-bright)' }}>An&nbsp;Invisible</span>
                                <br />
                                <span className="font-light italic" style={{ opacity: 0.2 }}>Depletion.</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="text-sm leading-relaxed mb-6 max-w-[400px] font-light"
                                style={{ color: 'rgba(255,255,255,0.42)' }}
                            >
                                We consume more than ever, yet our cells are starving. The modern thali has been hollowed out by processed soil and high-yield farming. The calories remain, but the micronutrients have vanished.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="relative mb-6 pl-4 py-0.5"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
                                    style={{ background: 'linear-gradient(to bottom, var(--green-bright), transparent)' }} />
                                <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                                    Volume is no longer a proxy for vitality.
                                </span>
                            </motion.div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <StatPill value="57%" label="Nutrient loss since 1950" delay={0.35} />
                                <StatPill value="3 in 4" label="Indians micronutrient-deficient" delay={0.45} />
                            </div>
                        </div>

                        {/* quote */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                            className="relative z-10 rounded-xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(74,222,128,0.06) 0%, transparent 100%)',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            <div className="absolute top-0 left-0 w-[2px] h-full" style={{ background: 'var(--green-bright)' }} />
                            <div className="p-5 pl-6">
                                <span className="text-2xl font-black leading-none block mb-1" style={{ color: 'var(--green-bright)', opacity: 0.4 }}>"</span>
                                <p className="text-xs italic font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.48)' }}>
                                    Complexity is the smoke screen for insufficiency.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* ── RIGHT: SOLUTION ── */}
                    <div className="relative p-7 sm:p-9 md:p-11 flex flex-col justify-between gap-7 overflow-hidden">

                        {/* watermark */}
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.3 }}
                            aria-hidden
                            className="absolute right-2 top-0 font-black select-none pointer-events-none"
                            style={{ fontSize: 'clamp(80px, 12vw, 160px)', lineHeight: 1, color: 'var(--green-bright)', opacity: 0.07 }}
                        >02</motion.span>

                        <div className="relative z-10">
                            <motion.span
                                initial={{ opacity: 0, x: -8 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-[9px] font-black uppercase tracking-[0.3em] inline-flex items-center gap-2 mb-5"
                                style={{ color: 'var(--green-bright)' }}
                            >
                                <span className="w-4 h-px" style={{ background: 'var(--green-bright)' }} />
                                The Reframe
                            </motion.span>

                            <motion.h2
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="font-playfair font-black mb-5 leading-[1.0]"
                                style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.8rem)', color: 'var(--foreground)' }}
                            >
                                Precision.<br />
                                <span className="font-light" style={{ color: 'var(--green-bright)' }}>Truly</span>
                                <br />
                                <span className="font-light italic" style={{ opacity: 0.2 }}>Redefined.</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="text-sm leading-relaxed mb-6 max-w-[400px] font-light"
                                style={{ color: 'rgba(255,255,255,0.42)' }}
                            >
                                Supplements shouldn't be a scattergun approach of generic fillers. We believe in matching bio-identical nutrients to your unique biological context. We don't just add; we bridge the specific Delta that exists within your thali.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="relative mb-6 pl-4 py-0.5"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
                                    style={{ background: 'linear-gradient(to bottom, var(--green-bright), transparent)' }} />
                                <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                                    True intelligence is invisible.
                                </span>
                            </motion.div>

                            <div className="flex flex-col gap-2 mb-6">
                                {pillars.map((item: PillarItem, i: number) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-default"
                                        style={{
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            background: 'rgba(255,255,255,0.02)',
                                            transition: 'background 0.25s, border-color 0.25s, transform 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            const el = e.currentTarget as HTMLDivElement;
                                            el.style.background = 'rgba(74,222,128,0.05)';
                                            el.style.borderColor = 'rgba(74,222,128,0.18)';
                                            el.style.transform = 'translateX(3px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            const el = e.currentTarget as HTMLDivElement;
                                            el.style.background = 'rgba(255,255,255,0.02)';
                                            el.style.borderColor = 'rgba(255,255,255,0.06)';
                                            el.style.transform = 'translateX(0)';
                                        }}
                                    >
                                        <span className="text-sm" style={{ color: 'var(--green-bright)' }}>{item.icon}</span>
                                        <span className="text-xs font-medium tracking-wide" style={{ color: 'rgba(255,255,255,0.62)' }}>{item.label}</span>
                                        <span className="ml-auto text-xs" style={{ color: 'var(--green-bright)', opacity: 0.3 }}>→</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* quote */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.55 }}
                            className="relative z-10 rounded-xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(74,222,128,0.06) 0%, transparent 100%)',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            <div className="absolute top-0 left-0 w-[2px] h-full" style={{ background: 'var(--green-bright)' }} />
                            <div className="p-5 pl-6">
                                <span className="text-2xl font-black leading-none block mb-1" style={{ color: 'var(--green-bright)', opacity: 0.4 }}>"</span>
                                <p className="text-xs italic font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.48)' }}>
                                    Health is the absence of the unnecessary.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                </div>

                {/* bottom strip */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-5 flex items-center justify-between px-1"
                >
                    <span className="text-[9px] uppercase tracking-[0.25em]" style={{ color: 'rgba(255,255,255,0.15)' }}>
                        Backed by nutritional science
                    </span>
                    <div className="flex gap-2 items-center">
                        <span className="w-1 h-1 rounded-full" style={{ background: 'var(--green-bright)' }} />
                        <span className="text-[9px] uppercase tracking-[0.25em]" style={{ color: 'rgba(255,255,255,0.15)' }}>
                            Formulated for the Indian body
                        </span>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}