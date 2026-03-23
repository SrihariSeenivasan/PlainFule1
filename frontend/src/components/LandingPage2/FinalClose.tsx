'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { BRAND, BRAND_DARK, BRAND_LIGHT, CREAM, DoodleArrow, GridBg, GreenTag, SectionStyles, FadeUp } from './shared';

const timelineWithout = [
  { label: '1M', detail: 'Tired, sluggish' },
  { label: '3M', detail: 'Gaps widening' },
  { label: '6M', detail: 'Deficiencies show' },
  { label: '12M', detail: 'Health declining' },
];

const timelineWith = [
  { label: '1M', detail: 'Feeling steadier' },
  { label: '3M', detail: 'Consistent energy' },
  { label: '6M', detail: 'Nutrients full' },
  { label: '12M', detail: 'Thriving daily' },
];

export default function FinalClose() {
  return (
    <section style={{ background: '#f5f5ee', minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(48px,6vw,100px) clamp(20px,5vw,80px)', flexDirection: 'column' }}>
      <SectionStyles />
      <GridBg />
      <div style={{ position: 'absolute', bottom: '10%', right: '6%', width: 160, height: 160, borderRadius: '50%', background: BRAND, opacity: 0.08, filter: 'blur(36px)' }} />

      <div style={{ maxWidth: 1100, width: '100%', position: 'relative', zIndex: 2 }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><GreenTag>✦ THE CHOICE</GreenTag></div>
            <h2 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(2rem,4.5vw,3.6rem)', color: BRAND_DARK, margin: '0 0 10px', lineHeight: 1.1 }}>
              Most health problems build quietly<br />over time.
            </h2>
            <p style={{ fontFamily: "'Kalam', cursive", fontSize: 17, fontWeight: 700, color: BRAND, margin: 0 }}>
              So does prevention.
            </p>
          </div>
        </FadeUp>

        {/* Two timelines */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 56 }}>
          {/* Without */}
          <motion.div
            className="pf2-card"
            style={{ transform: 'rotate(-0.5deg)' }}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 120 }}
          >
            <div className="pf2-card-inner" style={{ padding: '20px 20px 20px 38px' }}>
              <div style={{ marginBottom: 16, paddingBottom: 10, borderBottom: `2px solid rgba(21,128,61,0.2)` }}>
                <p style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 13, color: '#6b7280', letterSpacing: '0.1em', margin: 0 }}>without daily nutrition</p>
              </div>
              {timelineWithout.map((t, i) => (
                <motion.div key={t.label}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14, position: 'relative' }}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.15 * i, type: 'spring', stiffness: 160 }}>
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', border: `3px solid #ef4444`, background: '#fff' }} />
                    {i < 3 && <div style={{ width: 2, height: 28, background: 'rgba(239,68,68,0.3)' }} />}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 16, color: '#ef4444', margin: '0 0 2px' }}>{t.label}</p>
                    <p style={{ fontFamily: "'Kalam', cursive", fontSize: 14, fontWeight: 700, color: '#374151', margin: 0 }}>{t.detail}</p>
                  </div>
                </motion.div>
              ))}
              {/* Drooping figure */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                <svg viewBox="0 0 60 80" style={{ width: 50 }}>
                  <circle cx="30" cy="12" r="9" fill={CREAM} stroke="#6b7280" strokeWidth="2.5" />
                  <line x1="30" y1="21" x2="30" y2="54" stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 30,34 L 14,44 M 30,34 L 46,44" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="30" y1="54" x2="20" y2="74" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="30" y1="54" x2="40" y2="74" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* With PlainFuel */}
          <motion.div
            style={{ background: BRAND_DARK, border: `4px solid ${BRAND_DARK}`, borderRadius: 8, boxShadow: `7px 7px 0 ${BRAND}`, overflow: 'hidden', transform: 'rotate(0.5deg)', position: 'relative' }}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 120 }}
          >
            {/* Notebook lines */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 28 + i * 24, height: 1, background: 'rgba(134,239,172,0.1)' }} />
            ))}
            <div style={{ position: 'absolute', left: 30, top: 0, bottom: 0, width: 2, background: 'rgba(134,239,172,0.2)' }} />
            <div style={{ position: 'relative', padding: '20px 20px 20px 44px' }}>
              <div style={{ marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid rgba(134,239,172,0.2)' }}>
                <p style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 13, color: BRAND_LIGHT, letterSpacing: '0.1em', margin: 0 }}>with PlainFuel</p>
              </div>
              {timelineWith.map((t, i) => (
                <motion.div key={t.label}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.15 * i, type: 'spring', stiffness: 160 }}>
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', border: `3px solid ${BRAND}`, background: BRAND_DARK, boxShadow: `0 0 8px ${BRAND}` }} />
                    {i < 3 && <div style={{ width: 2, height: 28, background: `rgba(21,128,61,0.4)` }} />}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 16, color: BRAND, margin: '0 0 2px' }}>{t.label}</p>
                    <p style={{ fontFamily: "'Kalam', cursive", fontSize: 14, fontWeight: 700, color: BRAND_LIGHT, margin: 0 }}>{t.detail}</p>
                  </div>
                </motion.div>
              ))}
              {/* Glowing figure */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                <svg viewBox="0 0 60 80" style={{ width: 50, filter: `drop-shadow(0 0 8px ${BRAND})` }}>
                  <circle cx="30" cy="12" r="9" fill={BRAND_DARK} stroke={BRAND} strokeWidth="2.5" />
                  <ellipse cx="30" cy="10" rx="9" ry="3" fill="none" stroke={BRAND_LIGHT} strokeWidth="1.5" />
                  <path d="M 26,12 L 26,16 M 34,12 L 34,16" stroke={BRAND} strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 25,20 Q 30,26 35,20" stroke={BRAND} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <line x1="30" y1="21" x2="30" y2="54" stroke={BRAND} strokeWidth="3" strokeLinecap="round" />
                  <path d="M 30,34 L 10,22 L 8,10" stroke={BRAND} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="30" y1="54" x2="20" y2="74" stroke={BRAND} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="30" y1="54" x2="40" y2="74" stroke={BRAND} strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Final CTA */}
        <FadeUp delay={0.2}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: CREAM, border: `4px solid ${BRAND_DARK}`, borderRadius: 14, padding: 'clamp(28px,4vw,48px) clamp(24px,5vw,64px)', boxShadow: `9px 9px 0 ${BRAND_DARK}`, maxWidth: 640, margin: '0 auto', transform: 'rotate(-0.5deg)', position: 'relative', overflow: 'hidden' }}>
              {/* Notebook lines */}
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 32 + i * 28, height: 1, background: 'rgba(21,128,61,0.1)' }} />
              ))}
              <div style={{ position: 'absolute', left: 32, top: 0, bottom: 0, width: 2, background: 'rgba(21,128,61,0.25)' }} />
              <div style={{ position: 'relative', paddingLeft: 16 }}>
                <p style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(14px,2vw,18px)', color: BRAND, letterSpacing: '0.1em', marginBottom: 10 }}>
                  A SIMPLE DAILY HABIT
                </p>
                <h3 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(22px,3.5vw,36px)', color: BRAND_DARK, margin: '0 0 14px', lineHeight: 1.2 }}>
                  One scoop. Done daily.<br />
                  <span style={{ color: BRAND }}>That's PlainFuel.</span>
                </h3>
                <p style={{ fontFamily: "'Kalam', cursive", fontSize: 16, fontWeight: 700, color: BRAND_DARK, opacity: 0.75, margin: '0 0 28px' }}>
                  ₹899 • 30-day supply • Free delivery
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                  <motion.button
                    className="pf2-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    animate={{ boxShadow: ['7px 8px 0 #052e16', '9px 10px 0 #052e16', '7px 8px 0 #052e16'] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    Start Your Daily Habit →
                  </motion.button>
                  <DoodleArrow color={BRAND_DARK} style={{ width: 40, height: 20, opacity: 0.5, transform: 'rotate(150deg) scaleX(-1)' }} />
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
