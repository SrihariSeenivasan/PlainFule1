'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Activity, Sparkles, Target } from 'lucide-react';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';

/* ─────────────────────────────────────────────────────────────
   MAGNETIC CURSOR ORBS — floating ambient spheres
───────────────────────────────────────────────────────────── */
function AmbientOrb({ x, y, size, delay, color }: { x: string; y: string; size: number; delay: number; color: string }) {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: [1, 1.15, 1],
                opacity: [0.12, 0.2, 0.12],
                y: [0, -18, 0],
            }}
            transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: size,
                height: size,
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, ${color}55, ${color}00)`,
                filter: 'blur(2px)',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
}

/* ─────────────────────────────────────────────────────────────
   KINETIC TEXT — letter-by-letter stagger reveal
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
function EyebrowBadge({ label, align = 'left', delay = 0 }: { label: string; align?: 'left' | 'center'; delay?: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: align === 'center' ? 0 : -20, y: align === 'center' ? 20 : 0 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 16px',
                borderRadius: 100,
                background: BRAND.light,
                border: `1px solid ${BRAND.tertiary}`,
                backdropFilter: 'blur(10px)',
                marginBottom: 20,
            }}
        >
            <Sparkles size={13} color={BRAND.primaryDark} />
            <span style={{
                fontSize: F_SIZE.sm,
                fontWeight: 800,
                color: BRAND.primary,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: FONTS.main,
            }}>{label}</span>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────
   DIAGONAL MARQUEE STRIP — scrolling data ribbon
───────────────────────────────────────────────────────────── */
function MarqueeStrip() {
    const items = ['Precision Dosing', '70% B12 Deficiency', 'Scientific Nutrition', '80% Low Vitamin D', 'PlainFuel', 'Evidence-Based', 'Daily Essentials'];
    return (
        <div style={{
            overflow: 'hidden',
            background: BRAND.primary,
            padding: '10px 0',
            margin: '40px 0',
            position: 'relative',
            zIndex: 2,
        }}>
            <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap', width: 'max-content' }}
            >
                {[...items, ...items, ...items, ...items].map((item, i) => (
                    <span key={i} style={{
                        fontFamily: FONTS.main,
                        fontSize: F_SIZE.sm,
                        fontWeight: 800,
                        color: BRAND.white,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        padding: '0 32px',
                        borderRight: i % items.length !== items.length - 1 ? `1px solid ${BRAND.white}22` : 'none',
                    }}>
                        {item}
                        {i % items.length < items.length - 1 && (
                            <span style={{ marginLeft: 32, opacity: 0.4 }}>✦</span>
                        )}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   STAT SPLIT — editorial big-number style
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
            style={{ position: 'relative', flex: 1, minWidth: 200 }}
        >
            {/* Top accent line */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.7, delay: index * 0.15 + 0.2 }}
                style={{
                    height: 3,
                    background: `linear-gradient(90deg, ${BRAND.secondary}, transparent)`,
                    borderRadius: 2,
                    marginBottom: 20,
                    transformOrigin: 'left',
                }}
            />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                {/* Icon in geometric shape */}
                <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    border: `1.5px solid ${BRAND.tertiary}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: BRAND.secondary,
                    flexShrink: 0,
                    background: `${BRAND.secondary}08`,
                }}>
                    {icon}
                </div>

                <div>
                    {/* Big editorial number */}
                    <div style={{
                        fontFamily: FONTS.main,
                        fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
                        fontWeight: 900,
                        color: BRAND.primary,
                        lineHeight: 0.9,
                        letterSpacing: '-0.04em',
                        marginBottom: 8,
                    }}>
                        {number}
                    </div>
                    <div style={{
                        fontFamily: FONTS.main,
                        fontSize: F_SIZE.md,
                        fontWeight: 700,
                        color: BRAND.primary,
                        marginBottom: 4,
                    }}>
                        {label}
                    </div>
                    <div style={{
                        fontFamily: FONTS.main,
                        fontSize: F_SIZE.sm,
                        color: BRAND.secondary,
                        fontWeight: 400,
                    }}>
                        {sub}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────
   TILT VIDEO ORB — 3D-tilt interactive element
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
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        rotX.set(((e.clientY - cy) / rect.height) * -20);
        rotY.set(((e.clientX - cx) / rect.width) * 20);
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
            style={{
                perspective: 800,
                width: '100%',
                maxWidth: 460,
                margin: '0 auto',
                cursor: 'none',
            }}
        >
            <motion.div
                style={{
                    rotateX: springX,
                    rotateY: springY,
                    transformStyle: 'preserve-3d',
                    position: 'relative',
                }}
            >
                {/* Outer glow ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    style={{
                        position: 'absolute',
                        inset: -16,
                        borderRadius: '50%',
                        border: `1.5px dashed ${BRAND.primary}22`,
                        zIndex: 0,
                    }}
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                    style={{
                        position: 'absolute',
                        inset: -32,
                        borderRadius: '50%',
                        border: `1px dashed ${BRAND.secondary}18`,
                        zIndex: 0,
                    }}
                />

                {/* Orb body */}
                <div style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `6px solid ${BRAND.white}`,
                    boxShadow: `0 32px 80px rgba(0,0,0,0.12), 0 0 0 1px ${BRAND.tertiary}`,
                    background: BRAND.light,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    {/* Inner shimmer */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: `conic-gradient(from 0deg, transparent 70%, ${BRAND.primary}08 80%, transparent 90%)`,
                            borderRadius: '50%',
                        }}
                    />

                    {/* Play button */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, zIndex: 2, position: 'relative' }}>
                        <motion.div
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: BRAND.primaryDark,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 12px 40px ${BRAND.primaryDark}40`,
                                cursor: 'pointer',
                            }}
                        >
                            {/* Pulse rings */}
                            {[1, 2].map(r => (
                                <motion.div
                                    key={r}
                                    animate={{ scale: [1, 1.7], opacity: [0.3, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: r * 0.7, ease: 'easeOut' }}
                                    style={{
                                        position: 'absolute',
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        border: `2px solid ${BRAND.primaryDark}`,
                                    }}
                                />
                            ))}
                            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ marginLeft: 4 }}>
                                <path d="M10 6L26 16L10 26V6Z" fill="white" />
                            </svg>
                        </motion.div>
                        <span style={{
                            fontFamily: FONTS.main,
                            fontSize: F_SIZE.md,
                            fontWeight: 700,
                            color: BRAND.primary,
                            letterSpacing: '0.05em',
                        }}>
                            Play Video
                        </span>
                    </div>
                </div>

                {/* Floating badge — Precision Dosing */}
                <motion.div
                    initial={{ opacity: 0, x: 20, y: -10 }}
                    animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    style={{
                        position: 'absolute',
                        top: -14,
                        right: -8,
                        padding: '10px 18px',
                        background: BRAND.white,
                        borderRadius: 100,
                        border: `1px solid ${BRAND.tertiary}`,
                        boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        zIndex: 5,
                    }}
                >
                    <Target size={14} color={BRAND.primary} />
                    <span style={{
                        fontFamily: FONTS.main,
                        fontSize: F_SIZE.sm,
                        fontWeight: 800,
                        color: BRAND.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                    }}>
                        Precision Dosing
                    </span>
                </motion.div>

                {/* Floating bottom-left label */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    style={{
                        position: 'absolute',
                        bottom: 10,
                        left: -20,
                        padding: '8px 14px',
                        background: BRAND.primaryDark,
                        borderRadius: 10,
                        boxShadow: `0 8px 24px ${BRAND.primaryDark}33`,
                        zIndex: 5,
                    }}
                >
                    <span style={{
                        fontFamily: FONTS.main,
                        fontSize: F_SIZE.sm,
                        fontWeight: 700,
                        color: BRAND.white,
                    }}>
                        Science-Backed
                    </span>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────
   PROGRESSIVE REVEAL SUBTITLE — word-by-word
───────────────────────────────────────────────────────────── */
function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const words = text.split(' ');

    return (
        <p ref={ref} style={{
            fontFamily: FONTS.main,
            fontSize: F_SIZE.md,
            color: BRAND.primary,
            lineHeight: 1.7,
            fontWeight: 400,
            margin: '16px 0 0',
        }}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
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
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function Chapter1() {
    const containerRef = useRef<HTMLDivElement>(null);
    const inView = useInView(containerRef, { once: true, margin: '-80px' });

    return (
        <div
            ref={containerRef}
            style={{ background: BRAND.white, overflow: 'hidden', position: 'relative' }}
        >
            {/* ── Ambient Orbs ── */}
            <AmbientOrb x="70%" y="5%" size={500} delay={0} color={BRAND.primary} />
            <AmbientOrb x="-8%" y="55%" size={380} delay={1.5} color={BRAND.secondary} />
            <AmbientOrb x="85%" y="65%" size={260} delay={2.5} color={BRAND.primary} />

            {/* ── CHAPTER LABEL — ultra-minimal centered stamp ── */}
            <section style={{ padding: '52px 24px 0', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        style={{ height: 1, width: 80, background: BRAND.primary, opacity: 0.2, transformOrigin: 'right' }}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '6px 20px',
                            borderRadius: 100,
                            background: BRAND.light,
                            border: `1px solid ${BRAND.tertiary}`,
                        }}
                    >
                        <Sparkles size={13} color={BRAND.primaryDark} />
                        <span style={{
                            fontSize: F_SIZE.lg,
                            fontWeight: 800,
                            color: BRAND.primary,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            fontFamily: FONTS.main,
                        }}>Chapter 1</span>
                    </motion.div>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        style={{ height: 1, width: 80, background: BRAND.primary, opacity: 0.2, transformOrigin: 'left' }}
                    />
                </div>
            </section>

            {/* ── SECTION 1: MAIN EDITORIAL HERO ── */}
            <section style={{ padding: '64px 24px 40px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

                {/* Large editorial background number */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontFamily: FONTS.main,
                        fontSize: 'clamp(180px, 30vw, 340px)',
                        fontWeight: 900,
                        color: `${BRAND.primary}04`,
                        letterSpacing: '-0.05em',
                        lineHeight: 1,
                        userSelect: 'none',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap',
                        zIndex: 0,
                    }}
                >
                    01
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.15fr 0.85fr',
                    gap: 'clamp(48px, 6vw, 88px)',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    {/* ── LEFT: CONTENT COLUMN ── */}
                    <div>
                        <EyebrowBadge label="The Scientific Need" delay={0.1} />

                        {/* Kinetic headline */}
                        <h2 style={{
                            fontFamily: FONTS.main,
                            fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
                            fontWeight: 900,
                            color: BRAND.primary,
                            margin: '0 0 4px',
                            lineHeight: 1.08,
                            letterSpacing: '-0.035em',
                        }}>
                            <KineticText text="Why is" delay={0.2} />
                            <br />
                            <KineticText text="PlainFuel" delay={0.45} />
                            <br />
                            <KineticText text="needed?" delay={0.65} />
                        </h2>

                        {/* Word-reveal subtitle */}
                        <WordReveal
                            text="Most people think deficiencies happen suddenly, but that's not true. Deficiencies build slowly. They are the result of missing small amounts of nutrients every day for months."
                            delay={0.9}
                        />

                        {/* ── STATS: editorial split layout ── */}
                        <div style={{
                            display: 'flex',
                            gap: 0,
                            marginTop: 44,
                            paddingTop: 32,
                            borderTop: `1px solid ${BRAND.tertiary}`,
                            flexWrap: 'wrap',
                        }}>
                            {/* Vertical divider between stats */}
                            <div style={{ flex: 1, minWidth: 200, paddingRight: 32 }}>
                                <StatSplit
                                    icon={<Activity size={18} />}
                                    number="70%"
                                    label="B12 Deficiency"
                                    sub="In the Indian population"
                                    index={0}
                                />
                            </div>
                            <div style={{
                                width: 1,
                                background: BRAND.tertiary,
                                margin: '0 0',
                                alignSelf: 'stretch',
                            }} />
                            <div style={{ flex: 1, minWidth: 200, paddingLeft: 32 }}>
                                <StatSplit
                                    icon={<Sparkles size={18} />}
                                    number="80%"
                                    label="Low Vitamin D"
                                    sub="Due to sedentary lifestyles"
                                    index={1}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: 3D TILT ORB ── */}
                    <TiltVideoOrb inView={inView} />
                </div>
            </section>

            {/* ── MARQUEE STRIP ── */}
            <MarqueeStrip />
        </div>
    );
}