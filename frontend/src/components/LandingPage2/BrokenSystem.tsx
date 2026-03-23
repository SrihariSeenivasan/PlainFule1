'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { BRAND, BRAND_DARK, BRAND_LIGHT, GridBg, GreenTag, SectionStyles, FadeUp } from './shared';

export default function BrokenSystem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.4 });
  const [stage, setStage] = useState<'chaos' | 'clean'>('chaos');
  useEffect(() => { if (inView) { const t = setTimeout(() => setStage('clean'), 3000); return () => clearTimeout(t); } }, [inView]);

  const bottles = [
    { left: '12%', delay: 0.3, rot: -25 }, { left: '28%', delay: 0.5, rot: 15 },
    { left: '45%', delay: 0.2, rot: -10 }, { left: '60%', delay: 0.6, rot: 30 },
    { left: '75%', delay: 0.4, rot: -20 }, { left: '20%', delay: 0.8, rot: 8 },
    { left: '55%', delay: 0.1, rot: -35 }, { left: '82%', delay: 0.7, rot: 20 },
    { left: '38%', delay: 0.9, rot: 12 }, { left: '65%', delay: 0.35, rot: -15 },
  ];

  return (
    <section ref={sectionRef} style={{ background: BRAND_LIGHT, minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(48px,6vw,100px) clamp(20px,5vw,80px)' }}>
      <SectionStyles />
      <GridBg />

      <div style={{ maxWidth: 1100, width: '100%', position: 'relative', zIndex: 2 }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><GreenTag>✦ TODAY'S BROKEN SYSTEM</GreenTag></div>
            <h2 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(1.9rem,3.8vw,3.2rem)', color: BRAND_DARK, margin: '0 0 12px' }}>
              So people turn to supplements.
            </h2>
            <p style={{ fontFamily: "'Kalam', cursive", fontSize: 17, fontWeight: 700, color: BRAND, maxWidth: 500, margin: '0 auto' }}>
              Multiple supplements. Different timings. Hard to track. Hard to maintain.
            </p>
          </div>
        </FadeUp>

        {/* Chaos zone */}
        <div style={{ position: 'relative', height: 340, overflow: 'hidden', marginBottom: 32 }}>
          {/* Falling bottles */}
          {inView && stage === 'chaos' && bottles.map((b, i) => (
            <motion.div
              key={i}
              style={{ position: 'absolute', left: b.left, top: 0, rotate: b.rot }}
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 220, opacity: 1 }}
              transition={{ delay: b.delay, duration: 1.0, type: 'spring', bounce: 0.25 }}
            >
              <svg viewBox="0 0 36 64" style={{ width: i % 2 === 0 ? 36 : 28 }}>
                <rect x="7" y="0" width="22" height="10" rx="3" fill={BRAND_LIGHT} stroke={BRAND_DARK} strokeWidth="2.5" />
                <rect x="3" y="10" width="30" height="48" rx="5" fill={i % 3 === 0 ? '#fff' : BRAND_LIGHT} stroke={BRAND_DARK} strokeWidth="2.5" />
                <line x1="3" y1="26" x2="33" y2="26" stroke={BRAND} strokeWidth="1.5" />
                <rect x="9" y="30" width="18" height="12" rx="2" fill={BRAND_LIGHT} stroke={BRAND} strokeWidth="1.5" />
              </svg>
            </motion.div>
          ))}

          {/* Confused figure */}
          {stage === 'chaos' && (
            <motion.div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4 }}>
              <svg viewBox="0 0 80 110" style={{ width: 80 }}>
                <circle cx="40" cy="14" r="12" fill={BRAND_LIGHT} stroke={BRAND_DARK} strokeWidth="3" />
                <circle cx="35" cy="12" r="2" fill={BRAND_DARK} />
                <circle cx="45" cy="12" r="2" fill={BRAND_DARK} />
                <path d="M 33,20 Q 40,16 47,20" stroke={BRAND_DARK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <line x1="40" y1="26" x2="40" y2="68" stroke={BRAND_DARK} strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 40,44 L 15,38 L 12,33" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 40,44 L 65,38 L 68,33" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="40" y1="68" x2="26" y2="100" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="40" y1="68" x2="54" y2="100" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round" />
                <text x="55" y="10" fontSize="18" fill={BRAND_DARK}>?</text>
              </svg>
            </motion.div>
          )}

          {/* Clean single scoop */}
          {stage === 'clean' && (
            <motion.div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <svg viewBox="0 0 200 200" style={{ width: 180 }}>
                <motion.path d="M 55,65 C 35,70 25,100 35,128 C 45,158 80,170 100,170 C 120,170 155,158 165,128 C 175,100 165,70 145,65 Z"
                  stroke={BRAND_DARK} strokeWidth="4" fill={BRAND_LIGHT}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
                <motion.path d="M 143,66 L 170,28" stroke={BRAND_DARK} strokeWidth={4.5} fill="none" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.9 }} />
                <motion.path d="M 62,70 C 82,58 118,58 138,70"
                  stroke={BRAND_DARK} strokeWidth="3.5" fill="none" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.8 }} />
                {[108, 126, 146].map((y, i) => (
                  <motion.path key={y} d={`M ${72},${y} Q 100,${y - 10} ${128},${y}`}
                    stroke={BRAND} strokeWidth="2.5" fill="none" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 1.2 + i * 0.1 }} />
                ))}
              </svg>

              {/* Thumbs-up figure */}
              <svg viewBox="0 0 80 100" style={{ width: 70 }}>
                <circle cx="40" cy="14" r="12" fill={BRAND_LIGHT} stroke={BRAND_DARK} strokeWidth="3" />
                <path d="M 34,12 L 34,16 M 46,12 L 46,16" stroke={BRAND_DARK} strokeWidth="3" strokeLinecap="round" />
                <path d="M 34,22 Q 40,28 46,22" stroke={BRAND_DARK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <line x1="40" y1="26" x2="40" y2="68" stroke={BRAND_DARK} strokeWidth="3.5" strokeLinecap="round" />
                <line x1="40" y1="68" x2="26" y2="95" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="40" y1="68" x2="54" y2="95" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 40,42 L 10,28 L 8,14 M 5,14 L 18,11 L 18,25" stroke={BRAND_DARK} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div style={{ background: '#fff', border: `4px solid ${BRAND_DARK}`, borderRadius: 8, padding: '12px 28px', boxShadow: `6px 6px 0 ${BRAND_DARK}`, transform: 'rotate(-1deg)' }}>
                <p style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 26, color: BRAND_DARK, margin: 0 }}>One and done. ✓</p>
              </div>
            </motion.div>
          )}
        </div>

        <FadeUp delay={0.3}>
          <div style={{ background: '#fff', border: `4px solid ${BRAND_DARK}`, borderRadius: 8, padding: '18px 28px 18px 36px', boxShadow: `6px 6px 0 ${BRAND_DARK}`, maxWidth: 600, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: BRAND }} />
            <p style={{ fontFamily: "'Kalam', cursive", fontSize: 17, fontWeight: 700, color: BRAND_DARK, margin: 0 }}>
              The problem isn't effort.{' '}
              <span style={{ fontFamily: "'Permanent Marker', cursive", color: BRAND }}>The system is too complex.</span>
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
