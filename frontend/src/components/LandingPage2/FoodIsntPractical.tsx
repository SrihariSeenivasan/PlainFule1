'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { BRAND, BRAND_DARK, BRAND_LIGHT, GridBg, GreenTag, SectionStyles, FadeUp } from './shared';

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const step = Math.max(1, Math.ceil(target / 55));
    const t = setInterval(() => { v = Math.min(v + step, target); setN(v); if (v >= target) clearInterval(t); }, 22);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{n}{suffix}</span>;
}

const panels = [
  {
    qty: 600, suffix: 'g', food: 'Spinach', reason: 'Just for Iron',
    Doodle: () => (
      <svg viewBox="0 0 140 120" style={{ width: '100%', height: '100%' }}>
        {[
          [70, 80, 32, 12, -20], [95, 65, 28, 11, 15],
          [50, 68, 26, 10, -50], [85, 100, 24, 9, 40],
          [108, 82, 22, 9, -10], [62, 108, 20, 8, 58],
          [42, 98, 18, 8, -68],
        ].map(([cx, cy, rx, ry, rotate], i) => (
          <motion.g key={i} transform={`rotate(${rotate}, ${cx}, ${cy})`}>
            <motion.ellipse cx={cx} cy={cy} rx={rx} ry={ry}
              stroke={BRAND_DARK} strokeWidth="2.5" fill={BRAND_LIGHT}
              initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.1 * i, type: 'spring', stiffness: 180 }} />
            <motion.line x1={cx} y1={cy - ry} x2={cx} y2={cy + ry}
              stroke={BRAND} strokeWidth="1.5" strokeLinecap="round"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.1 * i + 0.2, duration: 0.3 }} />
          </motion.g>
        ))}
      </svg>
    ),
  },
  {
    qty: 300, suffix: 'g', food: 'Ragi Rotis', reason: 'Just for Calcium',
    Doodle: () => (
      <svg viewBox="0 0 140 160" style={{ width: '100%', height: '100%' }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <motion.g key={i}>
            <motion.ellipse cx={70} cy={142 - i * 20} rx={46} ry={11}
              stroke={BRAND_DARK} strokeWidth="2.5" fill={i % 2 === 0 ? BRAND_LIGHT : '#fff'}
              initial={{ scaleX: 0, opacity: 0 }} whileInView={{ scaleX: 1, opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }} />
            {i > 0 && <>
              <motion.line x1={24} y1={142 - (i - 1) * 20} x2={24} y2={142 - i * 20}
                stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.15 }} />
              <motion.line x1={116} y1={142 - (i - 1) * 20} x2={116} y2={142 - i * 20}
                stroke={BRAND_DARK} strokeWidth="2.5" strokeLinecap="round"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.15 }} />
            </>}
          </motion.g>
        ))}
      </svg>
    ),
  },
  {
    qty: 15, suffix: '+', food: 'Eggs', reason: 'Just for Vitamin D3',
    Doodle: () => (
      <svg viewBox="0 0 140 170" style={{ width: '100%', height: '100%' }}>
        {[[70, 152], [52, 133], [88, 133], [70, 115], [52, 97], [88, 97], [70, 80], [52, 63], [88, 63]].map(([cx, cy], i) => (
          <motion.ellipse key={i} cx={cx} cy={cy} rx={16} ry={19}
            stroke={BRAND_DARK} strokeWidth="2.5" fill={i % 3 === 0 ? BRAND_LIGHT : '#fff'}
            initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 220 }} />
        ))}
      </svg>
    ),
  },
];

export default function FoodIsntPractical() {
  const [crossed, setCrossed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.5 });
  useEffect(() => { if (inView) { const t = setTimeout(() => setCrossed(true), 2200); return () => clearTimeout(t); } }, [inView]);

  return (
    <section ref={sectionRef} style={{ background: '#f5f5ee', minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(48px,6vw,100px) clamp(20px,5vw,80px)' }}>
      <SectionStyles />
      <GridBg />
      <div style={{ position: 'absolute', top: '15%', right: '5%', width: 130, height: 130, borderRadius: '50%', background: BRAND, opacity: 0.06, filter: 'blur(28px)' }} />

      <div style={{ maxWidth: 1100, width: '100%', position: 'relative', zIndex: 2 }}>
        <FadeUp>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><GreenTag>✦ THE FOOD MATH</GreenTag></div>
            <h2 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(2rem,4vw,3.2rem)', color: BRAND_DARK, margin: '0 0 12px' }}>
              Yes, you can get it from food.
            </h2>
            <p style={{ fontFamily: "'Kalam', cursive", fontSize: 17, fontWeight: 700, color: BRAND, margin: 0 }}>
              Here's what that actually looks like:
            </p>
          </div>
        </FadeUp>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
          {panels.map((panel, idx) => (
            <motion.div
              key={panel.food}
              className="pf2-card"
              style={{ transform: `rotate(${idx % 2 === 0 ? -1 : 1}deg)` }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.15 * idx, type: 'spring', stiffness: 140 }}
            >
              <div className="pf2-card-inner" style={{ padding: '20px 20px 20px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(48px,6vw,72px)', color: BRAND_DARK, lineHeight: 1 }}>
                  <CountUp target={panel.qty} suffix={panel.suffix} />
                </div>
                <div style={{ width: 140, height: 140, margin: '8px 0' }}>
                  <panel.Doodle />
                </div>
                <p style={{ fontFamily: "'Kalam', cursive", fontSize: 20, fontWeight: 700, color: BRAND_DARK, margin: '4px 0 2px' }}>{panel.food}</p>
                <p style={{ fontFamily: "'Kalam', cursive", fontSize: 13, color: BRAND, margin: 0 }}>{panel.reason}</p>

                {/* Big X overlay */}
                {crossed && (
                  <motion.div style={{ position: 'absolute', inset: 0, background: 'rgba(255,254,240,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                    <svg viewBox="0 0 100 100" style={{ width: '75%', height: '75%' }}>
                      <motion.line x1="8" y1="8" x2="92" y2="92" stroke="#ef4444" strokeWidth={10} strokeLinecap="round"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25 }} />
                      <motion.line x1="92" y1="8" x2="8" y2="92" stroke="#ef4444" strokeWidth={10} strokeLinecap="round"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25, delay: 0.22 }} />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={crossed ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.4 }}
        >
          <div style={{ background: '#fff', border: `4px solid ${BRAND_DARK}`, borderRadius: 10, padding: '18px 36px', boxShadow: `7px 7px 0 ${BRAND_DARK}`, display: 'inline-block', transform: 'rotate(-1deg)' }}>
            <p style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(28px,4vw,48px)', color: BRAND_DARK, margin: 0 }}>
              Not happening. 🙅
            </p>
            <p style={{ fontFamily: "'Kalam', cursive", fontSize: 16, fontWeight: 700, color: BRAND, margin: '6px 0 0' }}>
              This isn't practical. And you know it.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
