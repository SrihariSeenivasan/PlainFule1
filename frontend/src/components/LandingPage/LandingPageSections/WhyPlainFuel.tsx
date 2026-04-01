'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    CheckCircle2, AlertCircle, TrendingDown,
    Calendar, Sparkles, Activity,
    Microscope, FlaskConical, Target, BarChart2
} from 'lucide-react';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';
import Image from 'next/image';

/* ── Design Tokens (Glacier Elite Selection) ── */


/* ─────────────────────────────────────────────────────────────
   HELPERS & SUB-COMPONENTS
───────────────────────────────────────────────────────────── */

function SectionHeader({ eyebrow, title, subtitle, align = 'center', titleSize = F_SIZE.xl }: {
    eyebrow: string; title: React.ReactNode; subtitle?: React.ReactNode; align?: 'center' | 'left'; titleSize?: string
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <div ref={ref} style={{ textAlign: align, marginBottom: 24, maxWidth: align === 'center' ? 800 : '100%', margin: align === 'center' ? '0 auto 24px' : '0 0 24px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: BRAND.white, border: `1px solid ${BRAND.espresso}15`, backdropFilter: 'blur(10px)', marginBottom: 24 }}
            >
                <Sparkles size={14} color={BRAND.burgundy} />
                <span style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.ink, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONTS.main }}>{eyebrow}</span>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ fontFamily: FONTS.main, fontSize: titleSize, fontWeight: 900, color: BRAND.ink, margin: 0, lineHeight: 1.1, letterSpacing: '-0.03em' }}
            >
                {title}
            </motion.h2>

            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.ink, marginTop: 12, lineHeight: 1.6, fontWeight: 400 }}
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
                background: BRAND.glass,
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                border: `1px solid ${BRAND.white}50`,
                borderRadius: 32,
                padding: 24,
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
        { name: 'Vitamin B12', sym: 'B12', pct: 85, color: BRAND.burgundy, role: 'Nerve function & metabolic energy.' },
        { name: 'Vitamin D3', sym: 'D3', pct: 78, color: BRAND.burgundy, role: 'Immune resilience & bone density.' },
        { name: 'Magnesium', sym: 'Mg', pct: 92, color: BRAND.burgundy, role: 'Muscular recovery & deep sleep.' },
        { name: 'Calcium', sym: 'Ca', pct: 64, color: BRAND.burgundy, role: 'Skeletal structural integrity.' },
        { name: 'Iron', sym: 'Fe', pct: 72, color: BRAND.burgundy, role: 'Oxygen transport & cognitive focus.' },
    ];

    return (
        <div ref={containerRef} style={{ background: BRAND.cream, overflow: 'hidden', position: 'relative' }}>

            {/* ── Ambient Background Radiance ── */}
            <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '60vw', height: '60vw', background: `radial-gradient(circle, ${BRAND.espresso}08 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '50vw', height: '50vw', background: `radial-gradient(circle, ${BRAND.burgundy}05 0%, transparent 70%)`, pointerEvents: 'none' }} />

            {/* ── SECTION 1: THE HOOK ── */}
            <section style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div className="hook-grid">
                    <div>
                        <SectionHeader
                            align="left"
                            eyebrow="The Scientific Need"
                            title="Why is PlainFuel needed?"
                            subtitle="Most people think deficiencies happen suddenly, but that’s not true. Deficiencies build slowly. They are the result of missing small amounts of nutrients every day for months."
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                            {[
                                { icon: <Activity size={18} color={BRAND.ink} />, label: '70% B12 Deficiency', sub: 'In the Indian population' },
                                { icon: <Sparkles size={18} color={BRAND.burgundy} />, label: '80% Low Vitamin D', sub: 'Due to sedentary lifestyles' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    style={{ padding: '24px', borderRadius: 20, background: BRAND.white, border: `1px solid ${BRAND.espresso}08`, boxShadow: '0 12px 24px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}
                                >
                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: BRAND.cream, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stat.icon}</div>
                                            <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 800, color: BRAND.ink }}>{stat.label}</span>
                                        </div>
                                        <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.burgundy, margin: 0 }}>{stat.sub}</p>
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
                        <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: `radial-gradient(circle, ${BRAND.espresso}08 0%, transparent 70%)` }} />
                        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: `8px solid ${BRAND.white}`, boxShadow: '0 40px 100px rgba(0,0,0,0.1)', background: BRAND.cream }}>
                            <Image
                                src="/images/handpack.png"
                                alt="PlainFuel Handpack" fill style={{ objectFit: 'cover' }}
                                priority
                            />
                        </div>
                        <div style={{ position: 'absolute', top: -10, right: 20, padding: '12px 20px', background: BRAND.white, borderRadius: 100, border: `1px solid ${BRAND.espresso}15`, boxShadow: '0 10px 30px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 10, zIndex: 5 }}>
                            <Target size={16} color={BRAND.ink} />
                            <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.ink, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Precision Dosing</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── SECTION 2: DEFICIENCY ACCUMULATION ── */}
            <section style={{ padding: '16px 24px', maxWidth: 1200, margin: '0 auto' }}>
                <GlacierCard className="accumulator-card" style={{ alignItems: 'center' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '4px 12px', borderRadius: 4, background: BRAND.cream, marginBottom: 20 }}>
                            <Calendar size={12} color={BRAND.espresso} />
                            <span style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.espresso, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: FONTS.main }}>Timeline Analysis</span>
                        </div>
                        <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.ink, marginBottom: 12, lineHeight: 1.1 }}>Your body works on daily input.</h3>
                        <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.ink, lineHeight: 1.7, marginBottom: 20 }}>
                            Just like missing homework every day leads to problems later, missing nutrients daily creates long-term gaps.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[
                                { label: 'Month 0-3', text: 'Stores deplete silently. Performance remains stable.', status: 'Silent' },
                                { label: 'Month 4-8', text: 'Fatigue, focus drop, and inconsistent mood.', status: 'Sub-Optimal', color: BRAND.burgundy },
                                { label: 'Month 9+', text: 'Clinical deficiency. The body flags red alerts.', status: 'Critical', color: BRAND.burgundy },
                            ].map((step, i) => (
                                <div key={i} style={{ display: 'flex', gap: 20, padding: '16px 20px', borderRadius: 16, border: `1px solid ${BRAND.espresso}05`, background: 'rgba(255,255,255,0.8)', alignItems: 'center' }}>
                                    <div style={{ minWidth: 100, whiteSpace: 'nowrap', fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.ink, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{step.label}</div>
                                    <div style={{ width: 2, height: 40, background: step.color || BRAND.espresso, opacity: 0.15, flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 700, color: step.color || BRAND.espresso, marginBottom: 2 }}>{step.status}</div>
                                        <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.ink, margin: 0, lineHeight: 1.5 }}>{step.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ padding: '24px', background: '#ffffffff', borderRadius: 24, border: `1px solid ${BRAND.espresso}05`, backdropFilter: 'blur(20px)', position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <BarChart2 size={18} color="#72383D" />
                                <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.espresso, letterSpacing: '0.05em' }}>Deficiency gap — 12 months</span>
                            </div>
                        </div>

                        <div style={{ height: 240, display: 'flex', alignItems: 'flex-end', gap: 6, position: 'relative' }}>
                            {[0, 1, 2, 3].map(l => (
                                <div key={l} style={{ position: 'absolute', left: 0, right: 0, bottom: (l * 80), height: 1, borderTop: `1px solid ${BRAND.espresso}08` }} />
                            ))}

                            {[15, 22, 28, 32, 42, 50, 58, 68, 75, 82, 88, 95].map((h, i) => {
                                const color = i < 4 ? '#4ade80' : i < 7 ? '#facc15' : '#f87171';
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={chartAnim ? { height: `${h}%` } : {}}
                                        transition={{ duration: 0.8, delay: i * 0.05 + 0.5 }}
                                        style={{
                                            flex: 1,
                                            background: `${color}33`,
                                            borderRadius: '4px 4px 1px 1px',
                                            border: `1.5px solid ${color}`,
                                        }}
                                    />
                                );
                            })}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                            {['Jan', 'Jun', 'Dec'].map(m => <span key={m} style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.taupe, fontWeight: 700 }}>{m}</span>)}
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', gap: 16, marginTop: 24, padding: '12px 0', borderTop: `1px solid ${BRAND.espresso}05` }}>
                            {[
                                { label: 'Normal', color: '#4ade80' },
                                { label: 'Warning', color: '#facc15' },
                                { label: 'Critical', color: '#f87171' }
                            ].map(leg => (
                                <div key={leg.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 12, height: 12, borderRadius: 3, background: leg.color }} />
                                    <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 700, color: BRAND.espresso, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{leg.label}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: 20, padding: 16, background: BRAND.white, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ padding: '8px', borderRadius: 8, background: `${BRAND.burgundy}11` }}><Microscope size={16} color={BRAND.burgundy} /></div>
                            <p style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.md, color: BRAND.burgundy, margin: 0, fontWeight: 600 }}>Closing the Gap: Systematic Daily Restoration.</p>
                        </div>
                    </div>
                </GlacierCard>
            </section>

            {/* ── SECTION 3: THE INDIAN REALITY (PREMIUM STYLE) ── */}
            <section style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>
                <SectionHeader
                    eyebrow="Dietary Analysis"
                    title="Today, many of us have started paying attention to protein. But nutrition is not just about protein."
                    subtitle="Our daily diet, especially in India"
                />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        background: BRAND.accent,
                        borderRadius: 48,
                        padding: 18,
                        boxShadow: '0 40px 100px rgba(0,0,0,0.15)',
                        position: 'relative',
                        overflow: 'hidden',
                        border: `1px solid ${BRAND.accent}20`
                    }}
                >
                    <div className="dietary-container" style={{ position: 'relative', zIndex: 1 }}>

                        {/* Left Side: Focused on (Background Image) */}
                        <div style={{ padding: '32px 28px', borderRadius: 36, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 300 }}>
                            <Image
                                src="/images/why/bg-diet.png"
                                alt="Indian Diet"
                                fill
                                style={{ objectFit: 'cover', opacity: 0.3, filter: 'grayscale(0.2)' }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${BRAND.espresso} 0%, ${BRAND.espresso}70 10%)` }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
                                    <div style={{
                                        width: 56, height: 56, borderRadius: 18,
                                        background: '#16a34a',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 8px 16px rgba(22, 163, 74, 0.3)'
                                    }}>
                                        <CheckCircle2 size={28} color={BRAND.white} />
                                    </div>
                                    <h4 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.white, margin: 0, letterSpacing: '-0.02em' }}>Heavily focused on :</h4>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 360 }}>
                                    {['Carbohydrates', 'Fats'].map((tag) => (
                                        <div key={tag} style={{
                                            padding: '16px 20px', borderRadius: 20,
                                            background: 'rgba(255,255,255,0.06)',
                                            border: `1px solid rgba(255,255,255,0.1)`,
                                            backdropFilter: 'blur(12px)',
                                            display: 'flex', alignItems: 'center', gap: 12
                                        }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
                                            <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 800, color: BRAND.white, letterSpacing: '-0.01em' }}>{tag}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: But often lacks (White Card) */}
                        <div style={{ padding: '32px 28px', borderRadius: 36, background: BRAND.white, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 300, boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
                                <div style={{
                                    width: 56, height: 56, borderRadius: 18,
                                    background: '#b45309', // Gold/Brown for alert
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 8px 16px rgba(180, 83, 9, 0.2)'
                                }}>
                                    <AlertCircle size={28} color={BRAND.white} />
                                </div>
                                <h4 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.ink, margin: 0, letterSpacing: '-0.02em' }}>But often lacks:</h4>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {['Protein', 'Fiber', 'Essential micronutrients'].map((tag) => (
                                    <div key={tag} style={{
                                        padding: '14px 20px', borderRadius: 18,
                                        background: BRAND.white,
                                        border: `1px solid ${BRAND.espresso}12`,
                                        display: 'flex', alignItems: 'center', gap: 12,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
                                    }}>
                                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#b45309' }} />
                                        <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 700, color: BRAND.accent, letterSpacing: '-0.01em' }}>{tag}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </motion.div>


            </section>

            <section style={{ padding: '16px 24px', maxWidth: 1200, margin: '0 auto' }}>
                <GlacierCard className="insights-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '24px' }}>
                        <Chip text="Laboratory Insights" />
                        <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.xl, fontWeight: 900, color: BRAND.ink, marginTop: 16 }}>Beyond the Surface.</h3>
                        <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.ink, lineHeight: 1.7, marginBottom: 24 }}>
                            When we look at blood reports, the most common deficiencies are not protein — these are micronutrients, and they play a critical role in how our body functions.
                        </p>

                        <div className="vitamin-grid">
                            {NUTRIENTS.map((n) => (
                                <div key={n.sym} style={{ paddingBottom: 24, borderBottom: `1px solid ${BRAND.espresso}08` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: n.color }}>{n.sym}</span>
                                                <h5 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 800, color: BRAND.ink, margin: 0 }}>{n.name}</h5>
                                            </div>
                                            <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.taupe, margin: 0 }}>{n.role}</p>
                                        </div>
                                        <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: n.color }}>{n.pct}%</span>
                                    </div>
                                    <div style={{ height: 6, background: BRAND.cream, borderRadius: 10, overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={inView ? { width: `${n.pct}%` } : {}}
                                            transition={{ duration: 1, delay: 0.8 }}
                                            style={{ height: '100%', background: n.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ position: 'relative', background: BRAND.white, borderLeft: `1px solid ${BRAND.espresso}10`, minHeight: 400 }}>
                        <Image src="/images/why/bg-blood.png" alt="Lab" fill style={{ objectFit: 'cover' }} priority />
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 40%, transparent 80%)`, zIndex: 1 }} />
                        <div style={{ position: 'absolute', bottom: 48, left: 48, right: 48, zIndex: 2 }}>
                            <div style={{ padding: '32px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.8)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                    <FlaskConical size={20} color={BRAND.espresso} />
                                    <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.ink }}>Pharmacist Formulated</span>
                                </div>
                                <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.ink, fontWeight: 600 }}>
                                    "The real gap isn't hunger — it's systemic nutrient scarcity. PlainFuel was engineered to restore this balance daily."
                                </p>
                            </div>
                        </div>
                    </div>
                </GlacierCard>
            </section>

            <style>{`
            .hook-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 32px; align-items: center; }
            .accumulator-card { display: grid; grid-template-columns: 1fr 1.2fr; gap: 32px; }
            .dietary-container { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
            .insights-card { display: grid; grid-template-columns: 1fr 480px; }
            .vitamin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

            @media (max-width: 900px) {
                .hook-grid { grid-template-columns: 1fr; }
                .accumulator-card { grid-template-columns: 1fr; gap: 24px; padding: 20px !important; }
                .insights-card { grid-template-columns: 1fr; }
                .vitamin-grid { grid-template-columns: 1fr; }
                
                /* Ensure image in insights card has proper height on mobile */
                .insights-card > div:last-child {
                    min-height: 300px !important;
                    border-left: none !important;
                    border-top: 1px solid ${BRAND.espresso}10;
                }
            }

            @media (max-width: 640px) {
                .dietary-container { grid-template-columns: 1fr; }
                .dietary-container > div {
                    padding: 24px 20px !important;
                    min-height: auto !important;
                }
            }

            @media (max-width: 600px) {
                .accumulator-card h3 { font-size: ${F_SIZE.lg} !important; }
                .accumulator-card p { font-size: ${F_SIZE.sm} !important; }
            }
        `}</style>

        </div>
    );
}

function Chip({ text }: { text: string }) {
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRadius: 100, background: BRAND.white, border: `1px solid ${BRAND.espresso}15`, backdropFilter: 'blur(10px)' }}>
            <Sparkles size={12} color={BRAND.burgundy} />
            <span style={{ fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.espresso, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: FONTS.main }}>{text}</span>
        </div>
    );
}
