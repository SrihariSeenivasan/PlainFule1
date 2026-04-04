'use client';

import { useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Activity, Sparkles, Target, Calendar, Crosshair } from 'lucide-react';
import { F_SIZE, BRAND, FONTS, TYPOGRAPHY } from '@/lib/typography';

/* ─────────────────────────────────────────────────────────────
   AMBIENT ORBS
───────────────────────────────────────────────────────────── */
function AmbientOrb({ x, y, size, delay, color }: { x: string; y: string; size: number; delay: number; color: string }) {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1], y: [0, -18, 0] }}
            transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
            style={{
                position: 'absolute', left: x, top: y, width: size, height: size,
                borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, ${color}44, ${color}00)`,
                filter: 'blur(2px)', pointerEvents: 'none', zIndex: 0,
            }}
        />
    );
}

/* ─────────────────────────────────────────────────────────────
   KINETIC TEXT
───────────────────────────────────────────────────────────── */
function KineticText({ text, style, delay = 0 }: { text: string; style?: React.CSSProperties; delay?: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <span ref={ref} style={{ display: 'inline-block', ...style }}>
            {text.split('').map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30, rotateX: -60 }}
                    animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                    transition={{ duration: 0.5, delay: delay + i * 0.025, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'inline-block', transformOrigin: 'bottom' }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </span>
    );
}

/* ─────────────────────────────────────────────────────────────
   EYEBROW BADGE
───────────────────────────────────────────────────────────── */
function EyebrowBadge({ label, icon, delay = 0 }: { label: string; icon?: React.ReactNode; delay?: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '5px 14px', borderRadius: 100,
                background: BRAND.light, border: `1px solid ${BRAND.tertiary}`,
                backdropFilter: 'blur(10px)', marginBottom: 20,
            }}
        >
            {icon ?? <Sparkles size={13} color={BRAND.primaryDark} />}
            <span style={{ ...TYPOGRAPHY.eyebrow, color: BRAND.primaryDark } as React.CSSProperties}>
                {label}
            </span>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────
   MARQUEE STRIP
───────────────────────────────────────────────────────────── */
function MarqueeStrip() {
    const items = ['Precision Dosing', '70% B12 Deficiency', 'Scientific Nutrition', '80% Low Vitamin D', 'PlainFuel', 'Evidence-Based', 'Daily Essentials'];
    return (
        <div style={{ overflow: 'hidden', background: BRAND.primary, padding: '10px 0', margin: '40px 0', position: 'relative', zIndex: 2 }}>
            <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap', width: 'max-content' }}
            >
                {[...items, ...items, ...items, ...items].map((item, i) => (
                    <span key={i} style={{
                        ...TYPOGRAPHY.eyebrow,
                        color: BRAND.white,
                        padding: '0 32px',
                        borderRight: i % items.length !== items.length - 1 ? `1px solid ${BRAND.white}22` : 'none',
                    } as React.CSSProperties}>
                        {item}
                        {i % items.length < items.length - 1 && <span style={{ marginLeft: 32, opacity: 0.4 }}>✦</span>}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   STAT SPLIT
───────────────────────────────────────────────────────────── */
function StatSplit({ icon, number, label, sub, index }: {
    icon: React.ReactNode; number: string; label: string; sub: string; index: number;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', flex: 1, minWidth: 160 }}
        >
            <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.7, delay: index * 0.15 + 0.2 }}
                style={{
                    height: 2, background: `linear-gradient(90deg, ${BRAND.primaryDark}, transparent)`,
                    borderRadius: 2, marginBottom: 16, transformOrigin: 'left',
                }}
            />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    border: `1.5px solid ${BRAND.tertiary}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: BRAND.primaryDark, flexShrink: 0, background: `${BRAND.primaryDark}08`,
                }}>{icon}</div>
                <div>
                    <div style={{
                        fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900,
                        color: BRAND.primary, lineHeight: 0.9, letterSpacing: '-0.04em',
                        marginBottom: 6, fontFamily: FONTS.main,
                    }}>{number}</div>
                    <div style={{ ...TYPOGRAPHY.headingMD, color: BRAND.primary, marginBottom: 2 } as React.CSSProperties}>
                        {label}
                    </div>
                    <div style={{ ...TYPOGRAPHY.bodySM, color: BRAND.secondary } as React.CSSProperties}>
                        {sub}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────
   TILT VIDEO ORB  (Section 1 hero orb)
───────────────────────────────────────────────────────────── */
function TiltVideoOrb({ inView }: { inView: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const rotX = useMotionValue(0);
    const rotY = useMotionValue(0);
    const springX = useSpring(rotX, { stiffness: 120, damping: 22 });
    const springY = useSpring(rotY, { stiffness: 120, damping: 22 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        rotX.set(((e.clientY - rect.top - rect.height / 2) / rect.height) * -20);
        rotY.set(((e.clientX - rect.left - rect.width / 2) / rect.width) * 20);
    };
    const handleMouseLeave = () => { rotX.set(0); rotY.set(0); };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 800, width: '100%', maxWidth: 420, margin: '0 auto', cursor: 'none' }}
        >
            <motion.div style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d', position: 'relative' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: `1.5px dashed ${BRAND.primary}22`, zIndex: 0 }} />
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', inset: -32, borderRadius: '50%', border: `1px dashed ${BRAND.secondary}22`, zIndex: 0 }} />
                <div style={{
                    width: '100%', aspectRatio: '1/1', borderRadius: '50%', overflow: 'hidden',
                    border: `5px solid ${BRAND.white}`, boxShadow: `0 24px 64px rgba(50,45,41,0.12), 0 0 0 1px ${BRAND.tertiary}`,
                    background: BRAND.light, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', zIndex: 1,
                }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        style={{ position: 'absolute', inset: 0, background: `conic-gradient(from 0deg, transparent 70%, ${BRAND.primary}06 80%, transparent 90%)`, borderRadius: '50%' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, zIndex: 2, position: 'relative' }}>
                        <motion.div
                            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                            style={{
                                width: 72, height: 72, borderRadius: '50%', background: BRAND.primaryDark,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: `0 12px 40px ${BRAND.primaryDark}44`, cursor: 'pointer', position: 'relative',
                            }}
                        >
                            {[1, 2].map(r => (
                                <motion.div key={r} animate={{ scale: [1, 1.7], opacity: [0.3, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: r * 0.7, ease: 'easeOut' }}
                                    style={{ position: 'absolute', width: 72, height: 72, borderRadius: '50%', border: `2px solid ${BRAND.primaryDark}` }} />
                            ))}
                            <svg width="26" height="26" viewBox="0 0 32 32" fill="none" style={{ marginLeft: 4 }}>
                                <path d="M10 6L26 16L10 26V6Z" fill={BRAND.white} />
                            </svg>
                        </motion.div>
                        <span style={{ ...TYPOGRAPHY.bodySM, color: BRAND.primary, letterSpacing: '0.05em' } as React.CSSProperties}>
                            Play Video
                        </span>
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0, x: 20, y: -10 }}
                    animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    style={{
                        position: 'absolute', top: -12, right: -8, padding: '8px 16px',
                        background: BRAND.white, borderRadius: 100, border: `1px solid ${BRAND.tertiary}`,
                        boxShadow: '0 10px 28px rgba(0,0,0,0.08)',
                        display: 'flex', alignItems: 'center', gap: 7, zIndex: 5,
                    }}
                >
                    <Target size={13} color={BRAND.primary} />
                    <span style={{ ...TYPOGRAPHY.eyebrow, color: BRAND.primary, fontSize: '0.7rem' } as React.CSSProperties}>
                        Precision Dosing
                    </span>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────
   WORD REVEAL SUBTITLE
───────────────────────────────────────────────────────────── */
function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const words = text.split(' ');
    return (
        <p ref={ref} style={{ ...TYPOGRAPHY.bodyMD, color: BRAND.secondary, lineHeight: 1.75, margin: '14px 0 0' } as React.CSSProperties}>
            {words.map((word, i) => (
                <motion.span key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: delay + i * 0.04, ease: 'easeOut' }}
                    style={{ display: 'inline-block', marginRight: '0.3em' }}
                >
                    {word}
                </motion.span>
            ))}
        </p>
    );
}

/* ─────────────────────────────────────────────────────────────
   TIMELINE STORY
───────────────────────────────────────────────────────────── */
const SEVERITY_LABELS = ['Mild', 'Noticeable', 'Concerning', 'Serious', 'Critical'];
const SEVERITY_COLORS = ['#F9F5F1', '#F2E9E3', '#E9D8CF', '#DEC4B8', '#D0A99A'];
const BORDER_COLORS   = ['#D1C7BD', '#C4998A', '#A0655A', '#72383D', '#322D29'];

function TimelineStory() {
    const timeline = [
        { month: 'Month 1', symptom: 'Feeling tired' },
        { month: 'Month 2', symptom: 'Feeling weak and muscle loss' },
        { month: 'Month 3', symptom: 'Pain in joints' },
        { month: 'Month 4', symptom: 'Sickness' },
        { month: 'Month 5+', symptom: 'Getting worse — lack of nutrition' },
    ];

    return (
        <div style={{ marginTop: 28, position: 'relative' }}>
            <div style={{
                position: 'absolute', left: 19, top: 8, bottom: 8, width: 2,
                background: `linear-gradient(180deg, ${BRAND.tertiary} 0%, ${BRAND.primaryDark} 100%)`,
                borderRadius: 2, zIndex: 0,
            }} />

            {timeline.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 10, position: 'relative', zIndex: 1 }}
                >
                    <div style={{
                        width: 16, height: 16, borderRadius: '50%',
                        border: `2.5px solid ${BORDER_COLORS[i]}`,
                        background: i === 4 ? BRAND.primaryDark : BRAND.white,
                        flexShrink: 0, marginTop: 15, zIndex: 2,
                        boxShadow: `0 0 0 3px ${SEVERITY_COLORS[i]}`,
                    }} />

                    <div style={{
                        flex: 1, padding: '12px 16px', borderRadius: 12,
                        background: SEVERITY_COLORS[i],
                        borderLeft: `3px solid ${BORDER_COLORS[i]}`,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{
                                ...TYPOGRAPHY.eyebrow,
                                fontSize: '0.7rem',
                                color: BORDER_COLORS[i],
                            } as React.CSSProperties}>
                                {item.month}
                            </span>
                            <span style={{
                                ...TYPOGRAPHY.eyebrow,
                                fontSize: '0.65rem',
                                color: BORDER_COLORS[i],
                                padding: '2px 8px', borderRadius: 100,
                                background: `${BORDER_COLORS[i]}22`,
                            } as React.CSSProperties}>
                                {SEVERITY_LABELS[i]}
                            </span>
                        </div>
                        <p style={{ ...TYPOGRAPHY.headingMD, color: BRAND.primary, margin: 0 } as React.CSSProperties}>
                            {item.symptom}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function Chapter1() {
    const containerRef = useRef<HTMLDivElement>(null);
    const inView = useInView(containerRef, { once: true, margin: '-80px' });

    return (
        <div ref={containerRef} style={{ background: BRAND.white, overflow: 'hidden', position: 'relative' }}>

            {/* Responsive styles */}
            <style>{`
                .ch1-sec1-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
                    gap: clamp(40px, 6vw, 80px);
                    align-items: center;
                    position: relative;
                    z-index: 1;
                }
                .ch1-stat-row {
                    display: flex;
                    gap: 0;
                    margin-top: 40px;
                    padding-top: 28px;
                    border-top: 1px solid ${BRAND.tertiary};
                    flex-wrap: wrap;
                }
                .ch1-stat-divider {
                    width: 1px;
                    background: ${BRAND.tertiary};
                    align-self: stretch;
                }
                .ch1-sec2-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                    gap: clamp(24px, 5vw, 64px);
                    align-items: start;
                    position: relative;
                    z-index: 1;
                }
                .ch1-orb-wrap {
                    display: block;
                }

                /* ── Tablet: ≤ 860px ── */
                @media (max-width: 860px) {
                    .ch1-sec1-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .ch1-orb-wrap {
                        max-width: 320px;
                        margin: 0 auto;
                    }
                    .ch1-sec2-grid {
                        grid-template-columns: 1fr !important;
                    }
                }

                /* ── Mobile: ≤ 600px ── */
                @media (max-width: 600px) {
                    .ch1-stat-divider {
                        display: none;
                    }
                    .ch1-stat-row {
                        flex-direction: column;
                        gap: 28px;
                    }
                    .ch1-stat-row > div {
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                    }
                    .ch1-orb-wrap {
                        max-width: 260px;
                    }
                }
            `}</style>

            {/* ── Ambient Orbs ── */}
            <AmbientOrb x="70%" y="5%" size={480} delay={0} color={BRAND.primary} />
            <AmbientOrb x="-8%" y="55%" size={360} delay={1.5} color={BRAND.secondary} />
            <AmbientOrb x="85%" y="65%" size={240} delay={2.5} color={BRAND.primaryDark} />

            {/* ════════════════════════════════════════════
                CHAPTER LABEL
            ════════════════════════════════════════════ */}
            <section style={{ padding: '52px 24px 0', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 3vw, 20px)', flexWrap: 'nowrap' }}>
                    <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        style={{ height: 1, width: 'clamp(24px, 10vw, 72px)', background: BRAND.primary, opacity: 0.18, transformOrigin: 'right', flexShrink: 0 }} />

                    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.6 }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '6px 18px', borderRadius: 100,
                            background: BRAND.light, border: `1px solid ${BRAND.tertiary}`,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <Sparkles size={13} color={BRAND.primaryDark} />
                        <span style={{ ...TYPOGRAPHY.eyebrow, color: BRAND.primary, fontSize: 'clamp(0.75rem, 2.5vw, 1.1rem)' } as React.CSSProperties}>
                            Chapter 1
                        </span>
                    </motion.div>

                    <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        style={{ height: 1, width: 'clamp(24px, 10vw, 72px)', background: BRAND.primary, opacity: 0.18, transformOrigin: 'left', flexShrink: 0 }} />
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ textAlign: 'center', marginTop: 14 }}
                >
                    <p style={{ ...TYPOGRAPHY.bodyMD, color: BRAND.secondary, margin: 0, lineHeight: 1.65 } as React.CSSProperties}>
                        We have daily required amounts of{' '}
                        <span style={{ color: BRAND.primary, fontWeight: 700 }}>micronutrients</span> and{' '}
                        <span style={{ color: BRAND.primary, fontWeight: 700 }}>macronutrients</span>
                    </p>
                </motion.div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 1 — EDITORIAL HERO
            ════════════════════════════════════════════ */}
            <section style={{ padding: '64px 24px 40px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

                {/* Ghost number */}
                <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: 'clamp(160px, 28vw, 300px)', fontWeight: 900,
                        color: `${BRAND.primary}03`, letterSpacing: '-0.05em',
                        lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
                        whiteSpace: 'nowrap', zIndex: 0, fontFamily: FONTS.main,
                    }}
                >
                    01
                </motion.div>

                {/* Responsive grid: 2-col on desktop, 1-col on tablet/mobile */}
                <div className="ch1-sec1-grid">
                    {/* Left copy */}
                    <div>
                        <EyebrowBadge label="The Scientific Need" delay={0.1} />

                        <h2 style={{
                            fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', fontWeight: 900,
                            color: BRAND.primary, margin: '0 0 4px', lineHeight: 1.08,
                            letterSpacing: '-0.035em', fontFamily: FONTS.main,
                        }}>
                            <KineticText text="Why is" delay={0.2} />
                            <br />
                            <KineticText text="PlainFuel needed?" delay={0.45} style={{ color: BRAND.primaryDark }} />
                        </h2>

                        <WordReveal
                            text="Most people think deficiencies happen suddenly, but that's not true. Deficiencies build slowly. They are the result of missing small amounts of nutrients every day for months."
                            delay={0.9}
                        />

                        {/* Stat row — collapses to column on mobile */}
                        <div className="ch1-stat-row">
                            <div style={{ flex: 1, minWidth: 160, paddingRight: 28 }}>
                                <StatSplit icon={<Activity size={16} />} number="70%" label="B12 Deficiency" sub="In the Indian population" index={0} />
                            </div>
                            <div className="ch1-stat-divider" />
                            <div style={{ flex: 1, minWidth: 160, paddingLeft: 28 }}>
                                <StatSplit icon={<Sparkles size={16} />} number="80%" label="Low Vitamin D" sub="Due to sedentary lifestyles" index={1} />
                            </div>
                        </div>
                    </div>

                    {/* Right orb — centred below copy on mobile */}
                    <div className="ch1-orb-wrap">
                        <TiltVideoOrb inView={inView} />
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 2 — VIDEO LEFT / TIMELINE RIGHT
            ════════════════════════════════════════════ */}
            <section style={{ padding: '50px 24px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

                {/* Ghost number */}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ duration: 1.2 }}
                    style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: 'clamp(160px, 26vw, 280px)', fontWeight: 900,
                        color: `${BRAND.primary}03`, letterSpacing: '-0.05em',
                        lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
                        whiteSpace: 'nowrap', zIndex: 0, fontFamily: FONTS.main,
                    }}
                >
                    02
                </motion.div>

                {/* ── ROW 1: HEADING + DESCRIPTION (FULL WIDTH) ── */}
                <div style={{ marginBottom: '48px', position: 'relative', zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.6 }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '5px 14px', borderRadius: 100,
                            background: BRAND.light, border: `1px solid ${BRAND.tertiary}`,
                            marginBottom: 20,
                        }}
                    >
                        <Calendar size={13} color={BRAND.primaryDark} />
                        <span style={{ ...TYPOGRAPHY.eyebrow, color: BRAND.primaryDark } as React.CSSProperties}>
                            Timeline Analysis
                        </span>
                    </motion.div>

                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
                        style={{
                            fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900,
                            color: BRAND.primary, lineHeight: 1.1,
                            margin: '0 0 14px', letterSpacing: '-0.03em',
                            fontFamily: FONTS.main,
                        }}
                    >
                        Your body works on{' '}
                        <span style={{
                            color: BRAND.primaryDark,
                            fontFamily: FONTS.accent,
                            fontStyle: 'italic',
                            fontSize: '1.1em',
                        }}>
                            daily input.
                        </span>
                    </motion.h2>

                    <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
                        style={{ ...TYPOGRAPHY.bodyMD, color: BRAND.secondary, lineHeight: 1.75, margin: 0 } as React.CSSProperties}
                    >
                        Just like missing homework every day leads to problems later, missing nutrients daily creates long-term gaps.
                    </motion.p>
                </div>

                {/* ── ROW 2: VIDEO LEFT + TIMELINE RIGHT — collapses to 1-col on tablet/mobile ── */}
                <div className="ch1-sec2-grid">

                    {/* ── LEFT: VIDEO PLACEHOLDER ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -28 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{ minWidth: 0 }}
                    >
                        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 7,
                                padding: '5px 13px', borderRadius: 100,
                                background: BRAND.light, border: `1px solid ${BRAND.tertiary}`,
                                marginBottom: 14,
                            }}
                        >
                            <span style={{
                                width: 7, height: 7, borderRadius: '50%',
                                background: BRAND.primaryDark, display: 'inline-block',
                            }} />
                            <span style={{ ...TYPOGRAPHY.eyebrow, color: BRAND.primaryDark, fontSize: '0.7rem' } as React.CSSProperties}>
                                Your Typical Day
                            </span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            style={{
                                width: '100%',
                                aspectRatio: '4/3',
                                borderRadius: 16,
                                border: `2px dashed ${BRAND.tertiary}`,
                                background: `${BRAND.primary}05`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: 16,
                                padding: 32,
                            }}
                        >
                            <div style={{
                                width: 56, height: 56, borderRadius: '50%',
                                background: `${BRAND.primary}10`,
                                border: `2px solid ${BRAND.tertiary}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Target size={28} color={BRAND.primary} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{
                                    ...TYPOGRAPHY.headingMD, color: BRAND.primary, margin: '0 0 4px',
                                } as React.CSSProperties}>
                                    Video Coming Soon
                                </p>
                                <p style={{
                                    ...TYPOGRAPHY.bodySM, color: BRAND.secondary, margin: 0,
                                } as React.CSSProperties}>
                                    Your Typical Day video will be available here
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* ── RIGHT: TIMELINE ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 28 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{ minWidth: 0 }}
                    >
                        <TimelineStory />
                    </motion.div>

                </div>
            </section>

            {/* ── MARQUEE STRIP ── */}
            <MarqueeStrip />

        </div>
    );
}