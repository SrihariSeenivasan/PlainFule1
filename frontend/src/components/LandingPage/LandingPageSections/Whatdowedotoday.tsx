'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { F_SIZE, FONTS, BRAND } from '@/lib/typography';

function Chip({ children }: { children: React.ReactNode }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: FONTS.main,
            fontSize: F_SIZE.sm, letterSpacing: '0.26em', textTransform: 'uppercase',
            color: BRAND.burgundy, fontWeight: 900,
            border: `1px solid ${BRAND.burgundy}40`,
            borderRadius: 4, padding: '6px 16px',
            backgroundColor: `${BRAND.burgundy}08`,
        }}>{children}</span>
    );
}

export default function WhatDoWeDoToday() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const inView = useInView(sectionRef, { once: true, margin: '-100px' });

    const fadeUp = (delay: number) => ({
        initial: { opacity: 0, y: 30 },
        animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
        transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as any },
    });

    return (
        <section
            ref={sectionRef}
            style={{
                backgroundColor: BRAND.cream,
                position: 'relative',
                overflow: 'hidden',
                padding: '32px 24px',
            }}
        >
            <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <motion.div {...fadeUp(0)}>
                        <Chip>The Challenge</Chip>
                    </motion.div>
                    <motion.h2 {...fadeUp(0.1)} style={{
                        fontFamily: FONTS.main,
                        fontSize: F_SIZE.xl,
                        fontWeight: 900, letterSpacing: '-0.04em', color: BRAND.ink, marginTop: 16, lineHeight: 1.1
                    }}>What do we do today?</motion.h2>
                    <motion.p {...fadeUp(0.2)} style={{
                        fontFamily: FONTS.main,
                        fontSize: F_SIZE.md, color: BRAND.ink, maxWidth: 600, margin: '12px auto 0', lineHeight: 1.7, fontWeight: 500
                    }}>
                        To fill the nutritional gap, most people turn to a complex routine of supplements.
                    </motion.p>
                </div>

                {/* Content Grid */}
                <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

                    {/* Problem Card */}
                    <motion.div {...fadeUp(0.3)} style={{ background: BRAND.white, borderRadius: 40, padding: '32px', border: `1px solid ${BRAND.espresso}08`, boxShadow: '0 20px 40px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.accent, margin: 0 }}>But this creates another problem:</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {['Multiple separate supplements', 'Confusing timings', 'Difficult to maintain consistency'].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 700, color: BRAND.secondary }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: BRAND.taupe }} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.ink, lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
                            Maintaining a complex routine is a logistical challenge. Most people start with good intent but stop within days. The real issue isn't effort—it's that the current system is too complex for a busy life.
                        </p>
                    </motion.div>

                    {/* Solution Card */}
                    <motion.div {...fadeUp(0.4)} style={{ background: BRAND.espresso, borderRadius: 40, padding: '32px', boxShadow: '0 40px 80px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.white, margin: 0 }}>What PlainFuel does?</h3>
                        <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.stone, lineHeight: 1.8, margin: 0, opacity: 0.9 }}>
                            PlainFuel simplifies this entire process. Instead of managing multiple supplements, you take one sachet daily. It replaces your regular protein sachet while providing essential vitamins, minerals, and digestive support.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {['NO EXTRA PLANNING', 'NO EXTRA TRACKING', 'JUST A SIMPLE DAILY HABIT'].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.white, letterSpacing: '0.1em' }}>
                                    <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: BRAND.stone, opacity: 0.5 }} />
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 20 }}>
                            <div style={{ width: 40, height: 2, background: BRAND.stone, opacity: 0.3 }} />
                            <span style={{ fontFamily: FONTS.accent, fontSize: '1.8rem', color: BRAND.stone, fontWeight: 700 }}>One Sachet Daily.</span>
                        </div>
                    </motion.div>

                </div>

            </div>

            <style>{`
                @media (max-width: 900px) {
                    .cards-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
}
