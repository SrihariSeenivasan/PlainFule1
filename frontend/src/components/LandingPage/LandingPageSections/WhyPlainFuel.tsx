'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    CheckCircle2, AlertCircle, TrendingDown,
    Calendar, Sparkles, Activity,
    Microscope, FlaskConical, Target
} from 'lucide-react';
import Image from 'next/image';

/* ── Design Tokens (Glacier Elite Selection) ── */
const C = {
    forest: '#0a3d1f',
    deep: '#071a0d',
    mid: '#14532d',
    leaf: '#16a34a',
    ink: '#070d08',
    white: '#ffffff',
    offwhite: '#fafafa',
    silver: '#64748b',
    mist: '#f1f5f9',
    gold: '#854d0e',
    goldLight: '#a16207',
    champagne: '#fef3c7',
    glass: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(0, 0, 0, 0.05)',
    glowGreen: 'rgba(22, 101, 52, 0.08)',
    glowGold: 'rgba(184, 149, 58, 0.06)',
};

const FONTS = {
    main: "'Montserrat', sans-serif",
    accent: "'Caveat', cursive",
};

/* ─────────────────────────────────────────────────────────────
   HELPERS & SUB-COMPONENTS
───────────────────────────────────────────────────────────── */

function SectionHeader({ eyebrow, title, subtitle, align = 'center' }: {
    eyebrow: string; title: string; subtitle?: string; align?: 'center' | 'left'
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <div ref={ref} style={{ textAlign: align, marginBottom: 80, maxWidth: align === 'center' ? 800 : '100%', margin: align === 'center' ? '0 auto 80px' : '0 0 80px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: C.white, border: `1px solid ${C.forest}15`, backdropFilter: 'blur(10px)', marginBottom: 24 }}
            >
                <Sparkles size={14} color={C.gold} />
                <span style={{ fontSize: 10, fontWeight: 800, color: C.forest, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONTS.main }}>{eyebrow}</span>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ fontFamily: FONTS.main, fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: C.ink, margin: 0, lineHeight: 1.1, letterSpacing: '-0.03em' }}
            >
                {title}
            </motion.h2>

            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ fontFamily: FONTS.main, fontSize: 'clamp(16px, 1.8vw, 19px)', color: C.silver, marginTop: 24, lineHeight: 1.6, fontWeight: 400 }}
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
}

function GlacierCard({ children, style = {}, delay = 0, className = "" }: { children: React.ReactNode; style?: React.CSSProperties; delay?: number; className?: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
            style={{
                background: C.glass,
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                border: `1px solid ${C.white}50`,
                borderRadius: 32,
                padding: 48,
                boxShadow: '0 40px 80px rgba(0, 0, 0, 0.05)',
                position: 'relative',
                overflow: 'hidden',
                ...style
            }}
        >
            {children}
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */

export default function WhyPlainFuel() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [chartAnim, setChartAnim] = useState(false);
    const inView = useInView(containerRef, { once: true, margin: '-100px' });

    useEffect(() => {
        if (inView) setTimeout(() => setChartAnim(true), 500);
    }, [inView]);

    const NUTRIENTS = [
        { name: 'Vitamin B12', sym: 'B12', pct: 85, color: '#0a3d1f', role: 'Nerve function & metabolic energy.' },
        { name: 'Vitamin D3', sym: 'D3', pct: 78, color: '#854d0e', role: 'Immune resilience & bone density.' },
        { name: 'Magnesium', sym: 'Mg', pct: 92, color: '#0a3d1f', role: 'Muscular recovery & deep sleep.' },
        { name: 'Calcium', sym: 'Ca', pct: 64, color: '#854d0e', role: 'Skeletal structural integrity.' },
        { name: 'Iron', sym: 'Fe', pct: 72, color: '#0a3d1f', role: 'Oxygen transport & cognitive focus.' },
    ];

    return (
        <div ref={containerRef} style={{ background: C.offwhite, overflow: 'hidden', position: 'relative' }}>

            {/* ── Ambient Background Radiance ── */}
            <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '60vw', height: '60vw', background: `radial-gradient(circle, ${C.forest}08 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '50vw', height: '50vw', background: `radial-gradient(circle, ${C.gold}05 0%, transparent 70%)`, pointerEvents: 'none' }} />

            {/* ── SECTION 1: THE HOOK ── */}
            <section style={{ padding: 'clamp(80px, 12vw, 160px) 24px 80px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div className="hook-grid">
                    <div>
                        <SectionHeader
                            align="left"
                            eyebrow="The Scientific Need"
                            title="Why is PlainFuel needed?"
                            subtitle="Most people think deficiencies happen suddenly, but that’s not true. Deficiencies build slowly.
They are the result of missing small amounts of nutrients every day for months."
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: -40 }}>
                            {[
                                { icon: <Activity size={18} color={C.forest} />, label: '70% B12 Deficiency', sub: 'In the Indian population' },
                                { icon: <Sparkles size={18} color={C.gold} />, label: '80% Low Vitamin D', sub: 'Due to sedentary lifestyles' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    style={{ padding: '24px', borderRadius: 20, background: C.white, border: `1px solid ${C.forest}08`, boxShadow: '0 12px 24px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}
                                >
                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.mist, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stat.icon}</div>
                                            <span style={{ fontFamily: FONTS.main, fontSize: 15, fontWeight: 800, color: C.ink }}>{stat.label}</span>
                                        </div>
                                        <p style={{ fontFamily: FONTS.main, fontSize: 13, color: C.silver, margin: 0 }}>{stat.sub}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                        animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{ position: 'relative', width: '100%', aspectRatio: '1/1', maxWidth: 500, margin: '0 auto' }}
                    >
                        <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: `radial-gradient(circle, ${C.forest}08 0%, transparent 70%)` }} />
                        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: `8px solid ${C.white}`, boxShadow: '0 40px 100px rgba(0,0,0,0.1)', background: C.mist }}>
                            <Image
                                src="/images/handpack.png"
                                alt="PlainFuel Handpack" fill style={{ objectFit: 'cover' }}
                                priority
                            />
                        </div>
                        <div style={{ position: 'absolute', top: -10, right: 20, padding: '12px 20px', background: C.white, borderRadius: 100, border: `1px solid ${C.forest}15`, boxShadow: '0 10px 30px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 10, zIndex: 5 }}>
                            <Target size={16} color={C.forest} />
                            <span style={{ fontFamily: FONTS.main, fontSize: 11, fontWeight: 800, color: C.forest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Precision Dosing</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── SECTION 2: DEFICIENCY ACCUMULATION ── */}
            <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
                <GlacierCard className="accumulator-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'center' }}>
                    <Image src="/images/why/bg-slow.png" alt="Slow" fill style={{ objectFit: 'cover', opacity: 0.05, pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '4px 12px', borderRadius: 4, background: C.mist, marginBottom: 20 }}>
                            <Calendar size={12} color={C.forest} />
                            <span style={{ fontSize: 9, fontWeight: 900, color: C.forest, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: FONTS.main }}>Timeline Analysis</span>
                        </div>
                        <h3 style={{ fontFamily: FONTS.main, fontSize: 36, fontWeight: 900, color: C.ink, marginBottom: 24, lineHeight: 1.1 }}>Your body works on daily input.</h3>
                        <p style={{ fontFamily: FONTS.main, fontSize: 16, color: C.silver, lineHeight: 1.7, marginBottom: 40 }}>
                            Just like missing homework every day leads to problems later, missing nutrients daily creates long-term gaps.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[
                                { label: 'Month 0-3', text: 'Stores deplete silently. Performance remains stable.', status: 'Silent' },
                                { label: 'Month 4-8', text: 'Fatigue, focus drop, and inconsistent mood.', status: 'Sub-Optimal', color: C.gold },
                                { label: 'Month 9+', text: 'Clinical deficiency. The body flags red alerts.', status: 'Critical', color: '#991b1b' },
                            ].map((step, i) => (
                                <div key={i} style={{ display: 'flex', gap: 16, padding: '16px 20px', borderRadius: 16, border: `1px solid ${C.forest}05`, background: 'rgba(255,255,255,0.8)' }}>
                                    <div style={{ minWidth: 80, fontFamily: FONTS.main, fontSize: 11, fontWeight: 900, color: C.silver, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{step.label}</div>
                                    <div style={{ width: 2, background: step.color || C.forest, opacity: 0.2 }} />
                                    <div>
                                        <div style={{ fontFamily: FONTS.main, fontSize: 14, fontWeight: 700, color: step.color || C.forest, marginBottom: 2 }}>{step.status}</div>
                                        <p style={{ fontFamily: FONTS.main, fontSize: 13, color: '#4a554d', margin: 0, lineHeight: 1.5 }}>{step.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ padding: '32px', background: 'rgba(255,255,255,0.4)', borderRadius: 24, border: `1px solid ${C.forest}05`, backdropFilter: 'blur(20px)', position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                            <span style={{ fontFamily: FONTS.main, fontSize: 12, fontWeight: 800, color: C.ink, letterSpacing: '0.05em' }}>Biomarker Depletion Graph (12 Mo)</span>
                            <TrendingDown size={18} color={C.gold} />
                        </div>

                        <div style={{ height: 240, display: 'flex', alignItems: 'flex-end', gap: 6, position: 'relative' }}>
                            {[0, 1, 2, 3].map(l => (
                                <div key={l} style={{ position: 'absolute', left: 0, right: 0, bottom: (l * 80), height: 1, borderTop: `1px solid ${C.forest}08` }} />
                            ))}

                            {[90, 85, 80, 72, 65, 58, 50, 42, 35, 28, 22, 15].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={chartAnim ? { height: `${h}%` } : {}}
                                    transition={{ duration: 0.8, delay: i * 0.05 + 0.5 }}
                                    style={{
                                        flex: 1,
                                        background: i > 8 ? `linear-gradient(to top, #991b1b, #ef4444)` : i > 4 ? `linear-gradient(to top, ${C.gold}, #f59e0b)` : `linear-gradient(to top, ${C.forest}, ${C.leaf})`,
                                        borderRadius: '4px 4px 1px 1px',
                                        opacity: 0.85
                                    }}
                                />
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                            {['Jan', 'Apr', 'Aug', 'Dec'].map(m => <span key={m} style={{ fontFamily: FONTS.main, fontSize: 10, color: C.silver, fontWeight: 700 }}>{m}</span>)}
                        </div>

                        <div style={{ marginTop: 32, padding: 16, background: C.white, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ padding: '8px', borderRadius: 8, background: `${C.gold}11` }}><Microscope size={16} color={C.gold} /></div>
                            <p style={{ fontFamily: FONTS.accent, fontSize: 16, color: C.gold, margin: 0, fontWeight: 600 }}>Closing the Gap: Systematic Daily Restoration.</p>
                        </div>
                    </div>
                </GlacierCard>
            </section>

            {/* ── SECTION 3: THE INDIAN REALITY ── */}
            <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
                <SectionHeader eyebrow="Dietary Profile" title="Today, many of us have started paying attention to protein. But nutrition is not just about protein." subtitle="Our daily diet, especially in India, is heavily focused on Carbohydrates and Fats. But it often lacks: Protein, Fiber, and Essential micronutrients." />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        background: `linear-gradient(135deg, ${C.deep} 0%, ${C.forest} 100%)`,
                        borderRadius: 36,
                        padding: '12px',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Ambient premium lighting inside the dark container */}
                    <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '60%', height: '60%', background: `radial-gradient(circle, ${C.leaf}30 0%, transparent 60%)`, pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '50%', height: '50%', background: `radial-gradient(circle, ${C.gold}20 0%, transparent 60%)`, pointerEvents: 'none' }} />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, position: 'relative', zIndex: 1, height: '100%' }}>

                        {/* LEFT PANE: Heavily Focused On */}
                        <div style={{ padding: '40px', borderRadius: 28, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                            <Image src="/images/why/bg-diet.png" alt="Diet Pattern" fill style={{ objectFit: 'cover', opacity: 0.08, mixBlendMode: 'luminosity' }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 16, background: `linear-gradient(135deg, ${C.leaf} 0%, #15803d 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 20px rgba(22, 163, 74, 0.3)` }}>
                                        <CheckCircle2 size={24} color={C.white} />
                                    </div>
                                    <h4 style={{ fontFamily: FONTS.main, fontSize: 20, fontWeight: 800, color: C.white, margin: 0 }}>Heavily focused on:</h4>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {['Carbohydrates', 'Fats'].map((tag, i) => (
                                        <motion.div
                                            key={tag}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.1 + (i * 0.1) }}
                                            whileHover={{ x: 4, background: 'rgba(255,255,255,0.08)' }}
                                            style={{ padding: '16px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.08)`, display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.3s ease' }}
                                        >
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.leaf, boxShadow: `0 0 8px ${C.leaf}` }} />
                                            <span style={{ fontFamily: FONTS.main, fontSize: 15, fontWeight: 700, color: C.white }}>{tag}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT PANE: But often lacks */}
                        <div style={{ padding: '40px', borderRadius: 28, background: 'rgba(255,255,255,0.98)', border: `1px solid ${C.white}`, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 16, background: `linear-gradient(135deg, ${C.gold} 0%, #d4af37 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 20px rgba(184, 149, 58, 0.3)` }}>
                                        <AlertCircle size={24} color={C.white} />
                                    </div>
                                    <h4 style={{ fontFamily: FONTS.main, fontSize: 20, fontWeight: 800, color: C.ink, margin: 0 }}>But often lacks:</h4>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexGrow: 1 }}>
                                    {['Protein', 'Fiber', 'Essential micronutrients'].map((tag, i) => (
                                        <motion.div
                                            key={tag}
                                            initial={{ opacity: 0, x: 10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + (i * 0.1) }}
                                            whileHover={{ x: 4, scale: 1.01 }}
                                            style={{ padding: '16px 24px', borderRadius: 16, background: C.white, border: `1px solid ${C.gold}20`, boxShadow: `0 8px 20px ${C.gold}08`, display: 'flex', alignItems: 'center', gap: 12 }}
                                        >
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold, boxShadow: `0 0 8px ${C.gold}` }} />
                                            <span style={{ fontFamily: FONTS.main, fontSize: 15, fontWeight: 700, color: C.forest }}>{tag}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </section>

            {/* ── SECTION 4: BEYOND THE SURFACE ── */}
            <section style={{ padding: '80px 24px 160px', maxWidth: 1200, margin: '0 auto' }}>
                <GlacierCard className="beyond-card" style={{ padding: 0, display: 'grid', gridTemplateColumns: '1fr 480px', overflow: 'hidden' }}>
                    <div style={{ padding: 'clamp(32px, 6vw, 64px)' }}>
                        <Chip text="Laboratory Insights" />
                        <h3 style={{ fontFamily: FONTS.main, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: C.ink, marginTop: 24, marginBottom: 24 }}>Beyond the Surface.</h3>
                        <p style={{ fontFamily: FONTS.main, fontSize: 18, color: C.silver, lineHeight: 1.7, marginBottom: 48 }}>
                            When we look at blood reports, the most common deficiencies are not protein —  these are micronutrients, and they play a critical role in how our body functions.
                        </p>

                        <div className="vitamin-grid">
                            {NUTRIENTS.map((n, i) => (
                                <div key={n.sym} style={{ paddingBottom: 24, borderBottom: `1px solid ${C.forest}08` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                                <span style={{ fontFamily: FONTS.main, fontSize: 12, fontWeight: 900, color: n.color, letterSpacing: '0.1em' }}>{n.sym}</span>
                                                <h5 style={{ fontFamily: FONTS.main, fontSize: 16, fontWeight: 800, color: C.ink, margin: 0 }}>{n.name}</h5>
                                            </div>
                                            <p style={{ fontFamily: FONTS.main, fontSize: 12, color: C.silver, margin: 0, lineHeight: 1.4 }}>{n.role}</p>
                                        </div>
                                        <span style={{ fontFamily: FONTS.main, fontSize: 14, fontWeight: 800, color: n.color, whiteSpace: 'nowrap' }}>{n.pct}%</span>
                                    </div>
                                    <div style={{ height: 6, background: C.mist, borderRadius: 10, overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={inView ? { width: `${n.pct}%` } : {}}
                                            transition={{ duration: 1, delay: 0.8 + i * 0.1, ease: 'easeOut' }}
                                            style={{ height: '100%', borderRadius: 10, background: n.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="beyond-image-area" style={{ position: 'relative', background: C.white, borderLeft: `1px solid ${C.forest}10`, minHeight: 400 }}>
                        <Image
                            src="/images/why/bg-blood.png"
                            alt="Lab" fill style={{ objectFit: 'cover' }}
                            priority
                        />
                        {/* White fade from bottom to top */}
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 40%, transparent 80%)`, zIndex: 1 }} />
                        <div style={{ position: 'absolute', bottom: 48, left: 48, right: 48, zIndex: 2 }}>
                            <div style={{ padding: '32px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                    <FlaskConical size={20} color={C.forest} />
                                    <span style={{ fontFamily: FONTS.main, fontSize: 13, fontWeight: 800, color: C.forest, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pharmacist Formulated</span>
                                </div>
                                <p style={{ fontFamily: FONTS.main, fontSize: 14, color: C.ink, lineHeight: 1.6, margin: 0, fontWeight: 600 }}>
                                    "The real gap isn't hunger — it's systemic nutrient scarcity. PlainFuel was engineered to restore this balance daily."
                                </p>
                            </div>
                        </div>
                    </div>
                </GlacierCard>
            </section>

            <style>{`
            .hook-grid {
                display: grid;
                grid-template-columns: minmax(0, 1.2fr) 0.8fr;
                gap: 80px;
                align-items: center;
            }
            .reality-grid, .vitamin-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 32px;
            }
            
            @media (max-width: 1100px) {
                .beyond-card {
                    grid-template-columns: 1fr !important;
                }
                .beyond-image-area {
                    display: none;
                }
            }
            
            @media (max-width: 900px) {
                .hook-grid, .accumulator-card, .reality-grid {
                    grid-template-columns: 1fr !important;
                    gap: 48px;
                }
                .hook-grid > div:last-child {
                    order: -1;
                }
            }
            
            @media (max-width: 640px) {
                .vitamin-grid {
                    grid-template-columns: 1fr !important;
                }
            }
        `}</style>

        </div>
    );
}

function Chip({ text }: { text: string }) {
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: C.white, border: `1px solid ${C.forest}15`, backdropFilter: 'blur(10px)' }}>
            <Sparkles size={12} color={C.gold} />
            <span style={{ fontSize: 9, fontWeight: 900, color: C.forest, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONTS.main }}>{text}</span>
        </div>
    );
}