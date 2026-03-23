'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { BRAND, BRAND_DARK, BRAND_LIGHT, CREAM, DoodleWiggle, GridBg, GreenTag, NotePaper, SectionStyles, FadeUp } from './shared';

const deficiencies = [
  { label: 'B12', rot: -3, detail: 'Energy & brain function' },
  { label: 'D3',  rot:  2, detail: 'Immunity & bone health' },
  { label: 'Mg',  rot: -1, detail: 'Sleep & stress control' },
  { label: 'Ca',  rot:  3, detail: 'Bones & muscles' },
  { label: 'Fe',  rot: -2, detail: 'Oxygen transport' },
];

export default function TheProblem() {
  return (
    <section style={{ background: CREAM, minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(48px,6vw,100px) clamp(20px,5vw,80px)' }}>
      <SectionStyles />
      <GridBg />

      {/* Decorative doodles */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <DoodleWiggle color={BRAND} style={{ position: 'absolute', top: '8%', right: '4%', width: 90, opacity: 0.25, transform: 'rotate(-12deg)' }} />
        <DoodleWiggle color={BRAND} style={{ position: 'absolute', bottom: '12%', left: '4%', width: 70, opacity: 0.18, transform: 'rotate(6deg)' }} />
        <div style={{ position: 'absolute', top: '20%', left: '8%', width: 120, height: 120, borderRadius: '50%', background: BRAND, opacity: 0.05, filter: 'blur(24px)' }} />
      </div>

      <div style={{ maxWidth: 1200, width: '100%', position: 'relative', zIndex: 2 }}>
        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start', marginBottom: 56 }}>
          {/* Left copy */}
          <FadeUp>
            <div style={{ maxWidth: 500 }}>
              <div style={{ marginBottom: 16 }}>
                <GreenTag rotate={-1}>✦ THE PROBLEM</GreenTag>
              </div>
              <h2 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(1.8rem,3.2vw,2.9rem)', lineHeight: 1.15, color: BRAND_DARK, marginBottom: 18 }}>
                Deficiencies don't happen suddenly.{' '}
                <span style={{ position: 'relative', display: 'inline-block', color: BRAND }}>
                  They build slowly.
                  <svg viewBox="0 0 300 16" preserveAspectRatio="none" style={{ position: 'absolute', bottom: -5, left: 0, width: '100%', height: 12, pointerEvents: 'none' }}>
                    <motion.path d="M4,10 Q75,4 150,8 Q225,12 296,6" fill="none" stroke={BRAND} strokeWidth="5" strokeLinecap="round" opacity="0.3"
                      initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} />
                    <motion.path d="M4,8 Q75,2 150,6 Q225,10 296,4" fill="none" stroke={BRAND} strokeWidth="3" strokeLinecap="round"
                      initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }} />
                  </svg>
                </span>
              </h2>
              <div style={{ background: '#fff', border: `3.5px solid ${BRAND_DARK}`, borderRadius: 8, padding: '14px 20px 14px 28px', boxShadow: `5px 5px 0 ${BRAND_DARK}`, position: 'relative', overflow: 'hidden', marginBottom: 28 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: BRAND }} />
                <p style={{ fontFamily: "'Kalam', cursive", fontSize: 15, fontWeight: 700, lineHeight: 1.75, color: BRAND_DARK, margin: 0 }}>
                  Every day you miss a little, you fall a little behind.<br />
                  Your body runs on <span style={{ background: BRAND_LIGHT, padding: '1px 4px', borderRadius: 3 }}>daily input.</span> Miss it daily — and it adds up.
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Right — Calendar */}
          <FadeUp delay={0.15}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              {/* Calendar card */}
              <div style={{ background: '#fff', border: `4px solid ${BRAND_DARK}`, borderRadius: 10, boxShadow: `8px 8px 0 ${BRAND_DARK}`, padding: 16, width: '100%', maxWidth: 280 }}>
                <div style={{ borderBottom: `3px solid ${BRAND_DARK}`, paddingBottom: 10, marginBottom: 12 }}>
                  <p style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 16, color: BRAND_DARK, textAlign: 'center', margin: 0 }}>March 2025</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} style={{ position: 'relative', aspectRatio: '1', border: `2px solid rgba(21,128,61,0.2)`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'Kalam', cursive", fontSize: 13, color: 'rgba(5,46,22,0.35)' }}>{i + 1}</span>
                      <svg style={{ position: 'absolute', inset: '3px' }} viewBox="0 0 40 40">
                        <motion.line x1="4" y1="4" x2="36" y2="36" stroke="#ef4444" strokeWidth={6} strokeLinecap="round"
                          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                          transition={{ duration: 0.15, delay: 0.2 + i * 0.07 }} />
                        <motion.line x1="36" y1="4" x2="4" y2="36" stroke="#ef4444" strokeWidth={6} strokeLinecap="round"
                          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                          transition={{ duration: 0.15, delay: 0.2 + i * 0.07 + 0.1 }} />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drooping figure */}
              <motion.div
                initial={{ rotate: 0, opacity: 0 }} whileInView={{ rotate: -16, opacity: 1 }}
                viewport={{ once: true }} transition={{ duration: 2, delay: 1.2, ease: 'easeOut' }}
                style={{ width: 100 }}
              >
                <svg viewBox="0 0 80 120" style={{ width: '100%' }}>
                  <circle cx="40" cy="14" r="12" stroke={BRAND_DARK} strokeWidth="3" fill={BRAND_LIGHT} />
                  <circle cx="35" cy="12" r="2" fill={BRAND_DARK} />
                  <circle cx="45" cy="12" r="2" fill={BRAND_DARK} />
                  <path d="M 34,20 Q 40,16 46,20" stroke={BRAND_DARK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <line x1="40" y1="26" x2="40" y2="72" stroke={BRAND_DARK} strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 40,44 L 18,58" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 40,44 L 62,58" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="40" y1="72" x2="26" y2="108" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="40" y1="72" x2="54" y2="108" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round" />
                  <text x="55" y="12" fontSize="16" fill={BRAND_DARK} style={{ fontFamily: 'sans-serif' }}>?</text>
                </svg>
                <p style={{ fontFamily: "'Kalam', cursive", fontSize: 13, color: BRAND_DARK, opacity: 0.6, textAlign: 'center', marginTop: 4 }}>You, after 2 weeks.</p>
              </motion.div>
            </div>
          </FadeUp>
        </div>

        {/* Deficiency stamps */}
        <FadeUp delay={0.2}>
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 13, color: BRAND, letterSpacing: '0.12em', marginBottom: 12 }}>DAILY GAPS:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {deficiencies.map((d, idx) => (
                <motion.div
                  key={d.label}
                  className="pf2-card"
                  style={{ transform: `rotate(${d.rot}deg)`, padding: '12px 20px' }}
                  initial={{ opacity: 0, scale: 1.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ delay: 0.6 + idx * 0.15, type: 'spring', stiffness: 220, damping: 14 }}
                >
                  <div className="pf2-card-inner" style={{ paddingLeft: 8 }}>
                    <p style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 22, color: BRAND_DARK, margin: 0 }}>{d.label}</p>
                    <p style={{ fontFamily: "'Kalam', cursive", fontSize: 12, color: BRAND, margin: '3px 0 0' }}>{d.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
