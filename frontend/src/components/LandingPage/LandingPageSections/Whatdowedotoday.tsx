'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// ── Design Tokens (Light Refined Aesthetic) ──────────────────────────────────
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
    glassDark: 'rgba(255, 255, 255, 0.85)',
};

function Chip({ children }: { children: React.ReactNode }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 13, letterSpacing: '0.26em', textTransform: 'uppercase',
            color: C.goldLight, fontWeight: 700,
            border: `1px solid ${C.goldLight}40`,
            borderRadius: 2, padding: '5px 14px',
            backgroundColor: 'rgba(184, 149, 58, 0.05)',
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
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Caveat:wght@500;600;700&display=swap');
                
                .glacier-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
                }
                .main-cards-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }
                .main-card-box {
                    border-radius: 24px;
                    padding: 24px;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                @media (max-width: 1024px) {
                    .main-cards-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <section
                ref={sectionRef}
                style={{
                    backgroundColor: C.offwhite,
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '32px 40px',
                }}
            >
                <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>

                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <motion.div {...fadeUp(0)}>
                            <Chip>The Challenge</Chip>
                        </motion.div>
                        <motion.h2 {...fadeUp(0.12)} style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
                            fontWeight: 900, letterSpacing: '-0.04em', color: C.ink, marginTop: 12
                        }}>What do we do today?</motion.h2 >
                        <motion.p {...fadeUp(0.24)} style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: 18, color: C.ink, maxWidth: 640, margin: '12px auto 0', lineHeight: 1.6
                        }}>
                            To fill this gap, most people turn to supplements.
                        </motion.p>
                    </div>

                    <div className="main-cards-grid">
                        <motion.div {...fadeUp(0.4)} className="glacier-card main-card-box">
                            <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 28, fontWeight: 900, color: C.ink }}> But this creates another problem:</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {['Multiple supplements', 'Different timings', 'Difficult to track'].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 700, color: C.forest }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.leaf }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, color: C.ink, lineHeight: 1.8, margin: 0 }}>
                                In a busy daily life, maintaining this routine becomes hard. That’s why most people start with good intent but stop within a few days or weeks. So the real issue is not effort. The issue is that the system is too complex.
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp(0.5)} className="glacier-card main-card-box" style={{ background: C.deep, border: 'none' }}>
                            <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 28, fontWeight: 900, color: C.white }}>What PlainFuel does?</h3>
                            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, margin: 0 }}>
                                PlainFuel simplifies this entire process. Instead of managing multiple supplements, you take one sachet daily. It can replace your regular protein sachet, while also providing essential vitamins, minerals, fiber, and digestive support.
                            </p>
                            <div style={{
                                display: 'flex',
                                gap: '16px',
                                flexWrap: 'wrap',
                                fontFamily: "'Montserrat', sans-serif",
                                fontSize: 13,
                                fontWeight: 700,
                                color: C.white,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {['No extra planning', 'No extra tracking', 'Just a simple daily habit'].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: C.white }} />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 40, height: 2, background: C.leaf }} />
                                <span style={{ fontFamily: "'Caveat', cursive", fontSize: 24, color: C.leaf, fontWeight: 700 }}>One Sachet Daily.</span>
                            </div>
                        </motion.div>
                    </div>


                </div>
            </section>
        </>
    );
}