'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { BRAND, BRAND_DARK, BRAND_LIGHT, GridBg, GreenTag, SectionStyles, FadeUp } from './shared';

const panels = [
  { id: 1, caption: 'Alarm rings.', sub: '6:30 AM',
    Doodle: () => (
      <svg viewBox="0 0 100 100" style={{ width: '100%', padding: '12px' }}>
        <motion.circle cx="50" cy="48" r="30" fill={BRAND_LIGHT} stroke={BRAND_DARK} strokeWidth="3"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} />
        <motion.path d="M 50,30 L 50,48 L 62,57" fill="none" stroke={BRAND_DARK} strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }} />
        <motion.path d="M 24,22 C 14,12 10,6 20,3" fill="none" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.9 }} />
        <motion.path d="M 76,22 C 86,12 90,6 80,3" fill="none" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 1.0 }} />
        {[-8, 0, 8].map((x, i) => (
          <motion.line key={i} x1={50 + x} y1={4} x2={50 + x} y2={12} stroke={BRAND} strokeWidth="2.5" strokeLinecap="round"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.2 + i * 0.1 }} />
        ))}
        <motion.line x1="30" y1="76" x2="26" y2="88" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.9 }} />
        <motion.line x1="70" y1="76" x2="74" y2="88" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.9 }} />
      </svg>
    ),
  },
  { id: 2, caption: 'Scoop PlainFuel.', sub: '1 scoop. Done.',
    Doodle: () => (
      <svg viewBox="0 0 100 100" style={{ width: '100%', padding: '12px' }}>
        <motion.path d="M 28,18 L 32,88 L 68,88 L 72,18 Z" fill={BRAND_LIGHT} stroke={BRAND_DARK} strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} />
        <motion.path d="M 28,18 L 38,54 L 62,54 L 72,18" fill="none" stroke={BRAND} strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} />
        <motion.line x1="60" y1="14" x2="46" y2="87" stroke={BRAND_DARK} strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }} />
        {[0, 1, 2].map(i => (
          <motion.line key={i} x1={60 + i * 4} y1={30} x2={58 + i * 4} y2={44} stroke={BRAND} strokeWidth="2" strokeLinecap="round"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.0 + i * 0.1 }} />
        ))}
      </svg>
    ),
  },
  { id: 3, caption: 'Mix. Drink.', sub: '30 seconds flat.',
    Doodle: () => (
      <svg viewBox="0 0 100 100" style={{ width: '100%', padding: '12px' }}>
        <motion.path d="M 28,18 L 32,88 L 68,88 L 72,18 Z" fill={BRAND_LIGHT} stroke={BRAND_DARK} strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} />
        <motion.path d="M 55,52 C 62,44 68,54 62,60 C 56,66 48,58 54,50" fill="none" stroke={BRAND} strokeWidth="2.5" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.5 }} />
        <motion.line x1="60" y1="14" x2="48" y2="87" stroke={BRAND_DARK} strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }} />
      </svg>
    ),
  },
  { id: 4, caption: 'Out the door — energized.', sub: 'Every. Single. Day.',
    Doodle: () => (
      <svg viewBox="0 0 100 110" style={{ width: '100%', padding: '8px' }}>
        <circle cx="50" cy="16" r="12" fill={BRAND_LIGHT} stroke={BRAND_DARK} strokeWidth="3" />
        <circle cx="45" cy="14" r="2" fill={BRAND_DARK} />
        <circle cx="55" cy="14" r="2" fill={BRAND_DARK} />
        <path d="M 44,22 Q 50,28 56,22" stroke={BRAND_DARK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="50" y1="28" x2="50" y2="65" stroke={BRAND_DARK} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 50,40 L 28,30 M 50,40 L 72,30" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="65" x2="34" y2="96" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="65" x2="66" y2="96" stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="50" cy="6" rx="14" ry="4" fill="none" stroke={BRAND} strokeWidth="2" />
        {['⚡', '♥', '★'].map((emoji, i) => (
          <motion.text key={i} x={68 + i * 6} y={8 + i * 10} fontSize="10" fill={BRAND_DARK}
            initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ delay: 1.2 + i * 0.2, type: 'spring' }}>
            {emoji}
          </motion.text>
        ))}
      </svg>
    ),
  },
];

export default function HowItFits() {
  return (
    <section style={{ background: BRAND_LIGHT, minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(48px,6vw,100px) clamp(20px,5vw,80px)' }}>
      <SectionStyles />
      <GridBg />
      <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 120, height: 120, borderRadius: '50%', background: BRAND, opacity: 0.08, filter: 'blur(24px)' }} />

      <div style={{ maxWidth: 1100, width: '100%', position: 'relative', zIndex: 2 }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><GreenTag>✦ HOW IT FITS YOUR LIFE</GreenTag></div>
            <h2 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(2rem,4vw,3.2rem)', color: BRAND_DARK, margin: '0 0 8px' }}>
              One scoop daily. That's it.
            </h2>
            <p style={{ fontFamily: "'Kalam', cursive", fontSize: 16, fontWeight: 700, color: BRAND, maxWidth: 480, margin: '0 auto' }}>
              Replace your regular protein. No extra planning. No extra tracking. Works with any diet.
            </p>
          </div>
        </FadeUp>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {panels.map((panel, idx) => (
            <motion.div
              key={panel.id}
              className="pf2-card"
              style={{ transform: `rotate(${idx % 2 === 0 ? -1 : 1}deg)` }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.15 * idx, type: 'spring', stiffness: 140 }}
            >
              <div className="pf2-card-inner">
                {/* Panel header */}
                <div style={{ borderBottom: `3px solid ${BRAND_DARK}`, padding: '8px 12px 8px 40px', background: BRAND, margin: '0 -1px' }}>
                  <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 14, color: '#fff' }}>
                    Panel {panel.id}
                  </span>
                </div>
                {/* Doodle */}
                <div style={{ background: '#fff', padding: 4 }}>
                  <panel.Doodle />
                </div>
                {/* Caption */}
                <div style={{ borderTop: `3px solid ${BRAND_DARK}`, padding: '10px 12px 10px 40px', background: '#fff5' }}>
                  <p style={{ fontFamily: "'Kalam', cursive", fontSize: 14, fontWeight: 700, color: BRAND_DARK, margin: '0 0 2px' }}>{panel.caption}</p>
                  <p style={{ fontFamily: "'Kalam', cursive", fontSize: 12, color: BRAND, margin: 0 }}>{panel.sub}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
