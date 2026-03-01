'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, type ReactNode, type CSSProperties } from 'react';

// ─── PRODUCT NAVIGATION MAP ───────────────────────────────────────────────────
const PRODUCT_ROUTES = {
  b12: '/products/vitamin-b-complex',
  calcium: '/products/calcium-magnesium',
  zinc: '/products/zinc-selenium',
  vitaminc: '/products/vitamin-c',
  fiber: '/products/fiber-enzymes',
};

// ─── HAND-DRAWN SVG ICONS ────────────────────────────────────────────────────

function ScribbleUnderline({ color = '#22c55e', width = 120 }) {
  return (
    <svg width={width} height="12" viewBox={`0 0 ${width} 12`} fill="none">
      <path d={`M4 8 C${width * 0.2} 4, ${width * 0.4} 10, ${width * 0.6} 5, ${width * 0.8} 8, ${width - 4} 6`}
        stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function HandDrawnCircle({ size = 80, color = '#22c55e' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <path d="M40 8 C58 6, 74 22, 74 40 C74 58, 58 72, 40 72 C22 72, 6 58, 6 40 C6 22, 22 6, 40 8 Z"
        stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray="6 3" />
    </svg>
  );
}

function DoodleStarburst({ color = '#f59e0b', size = 60 }: { color?: string; size?: number }) {
  const rays = 8;
  const lines = Array.from({ length: rays }).map((_, i) => {
    const angle = (i * 360) / rays;
    const rad = (angle * Math.PI) / 180;
    const x1 = 30 + 12 * Math.cos(rad);
    const y1 = 30 + 12 * Math.sin(rad);
    const x2 = 30 + 26 * Math.cos(rad);
    const y2 = 30 + 26 * Math.sin(rad);
    return { x1, y1, x2, y2 };
  });
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      ))}
      <circle cx="30" cy="30" r="10" stroke={color} strokeWidth="2" fill="none" />
    </svg>
  );
}

function CheckmarkDoodle({ color = '#22c55e' }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 10 C6 13, 8 16, 10 14 C12 12, 16 6, 18 4" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// ─── FLOATING DOODLE ELEMENTS ────────────────────────────────────────────────
function FloatingDoodle({ children, style, delay = 0 }: { children: ReactNode; style?: CSSProperties; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}
    >
      {children}
    </motion.div>
  );
}

// ─── PROBLEM STORY CARD ───────────────────────────────────────────────────────
function ProblemCard({ emoji, title, body, accent, delay, rotation = 0 }: { emoji: string; title: string; body: string[]; accent: string; delay: number; rotation?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: rotation - 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ scale: 1.03, rotate: 0 }}
      style={{
        background: '#fffef5',
        border: `2px solid ${accent}`,
        borderRadius: 16,
        padding: '22px 20px',
        boxShadow: `4px 4px 0 ${accent}40`,
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* tape effect */}
      <div style={{
        position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
        width: 50, height: 16, background: `${accent}30`,
        borderRadius: 4, border: `1px solid ${accent}50`,
      }} />

      <div style={{ fontSize: 36, marginBottom: 10, textAlign: 'center' }}>{emoji}</div>
      <h3 style={{
        fontFamily: "'Permanent Marker', cursive",
        fontSize: 15, color: '#1a1a1a', marginBottom: 10, textAlign: 'center',
      }}>{title}</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {body.map((item: string, i: number) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Caveat', cursive", fontSize: 15, color: '#555' }}>
            <CheckmarkDoodle color={accent} />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ─── NUTRIENT INGREDIENT CARD ────────────────────────────────────────────────
function NutrientCard({ id, icon, title, badge, values, why, tip, accentHex, delay, rotation = -1 }: { id: string; icon: ReactNode; title: string; badge: string; values: string[]; why: string[]; tip: string; accentHex: string; delay: number; rotation?: number }) {
  const [hovered, setHovered] = useState(false);
  const route = PRODUCT_ROUTES[id as keyof typeof PRODUCT_ROUTES];

  const handleClick = () => {
    if (route) window.location.href = route;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotate: rotation }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.04, rotate: 0, y: -6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleClick}
      style={{
        background: '#fffef5',
        borderRadius: 18,
        padding: '28px 22px 22px',
        border: `2.5px solid ${accentHex}`,
        boxShadow: hovered ? `6px 6px 0 ${accentHex}60, 0 12px 32px ${accentHex}25` : `4px 4px 0 ${accentHex}30`,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease',
      }}
    >
      {/* Paper texture lines */}
      <div style={{
        position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(transparent, transparent 28px, rgba(0,0,0,0.03) 28px, rgba(0,0,0,0.03) 29px)',
        pointerEvents: 'none',
      }} />

      {/* "Click me" badge */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'absolute', top: 10, right: 10,
              background: accentHex, color: '#fff',
              fontFamily: "'Caveat', cursive", fontWeight: 700, fontSize: 12,
              padding: '3px 10px', borderRadius: 12,
            }}
          >
            View Product →
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left margin line */}
      <div style={{
        position: 'absolute', left: 18, top: 0, bottom: 0,
        width: 1.5, background: `${accentHex}25`,
      }} />

      {/* Nutrient badge */}
      <div style={{
        position: 'absolute', top: -1, left: 28,
        background: accentHex, color: '#fff',
        fontFamily: "'Caveat', cursive", fontSize: 11, fontWeight: 700,
        padding: '2px 10px', borderRadius: '0 0 8px 8px',
      }}>
        {badge}
      </div>

      {/* Icon area */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, marginTop: 10, position: 'relative' }}>
        <motion.div animate={hovered ? { rotate: [0, -10, 10, 0], scale: 1.1 } : {}} transition={{ duration: 0.4 }}>
          {icon}
        </motion.div>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Permanent Marker', cursive",
        fontSize: 18, color: '#1a1a1a', textAlign: 'center', marginBottom: 8,
      }}>
        {title}
      </h3>

      {/* Scribble underline */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <ScribbleUnderline color={accentHex} width={100} />
      </div>

      {/* Values */}
      <div style={{ marginBottom: 12, textAlign: 'center' }}>
        {values.map((val: string, i: number) => (
          <span key={i} style={{
            display: 'inline-block',
            fontFamily: "'Caveat', cursive", fontSize: 15, fontWeight: 700,
            color: accentHex, background: `${accentHex}12`,
            padding: '2px 10px', borderRadius: 20, margin: '2px 3px',
            border: `1px dashed ${accentHex}40`,
          }}>
            {val}
          </span>
        ))}
      </div>

      {/* Why it matters */}
      <div style={{ marginBottom: 12 }}>
        <p style={{
          fontFamily: "'Caveat', cursive", fontSize: 12, fontWeight: 700,
          color: '#999', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>Why it matters:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {why.map((w: string, i: number) => (
            <span key={i} style={{
              fontFamily: "'Caveat', cursive", fontSize: 14, color: '#555',
              background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: 8,
            }}>
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div style={{
        padding: '8px 10px', borderRadius: 10,
        background: `${accentHex}12`, border: `1.5px dashed ${accentHex}50`,
        fontFamily: "'Caveat', cursive", fontSize: 14, color: '#1a1a1a', fontWeight: 600,
      }}>
        👉 {tip}
      </div>
    </motion.div>
  );
}

// ─── STORY TIMELINE ENTRY ───────────────────────────────────────────────────
function TimelineEntry({ step, title, desc, accent, delay }: { step: string | number; title: string; desc: string; accent: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}
    >
      <div style={{
        flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
        background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Permanent Marker', cursive", color: '#fff', fontSize: 16,
        boxShadow: `0 4px 10px ${accent}50`,
      }}>{step}</div>
      <div>
        <p style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 16, color: '#1a1a1a', marginBottom: 4 }}>{title}</p>
        <p style={{ fontFamily: "'Caveat', cursive", fontSize: 15, color: '#666', lineHeight: 1.5 }}>{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function MicronutrientGapSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Permanent+Marker&display=swap');

        .mg-section {
          background: #fafaf0;
          position: relative;
          overflow: hidden;
        }

        .mg-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 20%, rgba(34,197,94,0.06) 0%, transparent 60%),
            radial-gradient(circle at 80% 80%, rgba(59,130,246,0.06) 0%, transparent 60%);
          pointer-events: none;
        }

        .ruled-bg {
          background-image: repeating-linear-gradient(
            transparent, transparent 31px,
            rgba(34,197,94,0.08) 31px, rgba(34,197,94,0.08) 32px
          );
        }
      `}</style>

      <section className="mg-section py-24 px-4 md:px-8">

        {/* ── Floating Background Doodles ── */}
        <FloatingDoodle style={{ top: '5%', left: '2%', opacity: 0.12 }} delay={0}>
          <DoodleStarburst color="#22c55e" size={80} />
        </FloatingDoodle>
        <FloatingDoodle style={{ top: '15%', right: '3%', opacity: 0.1 }} delay={1.5}>
          <HandDrawnCircle size={100} color="#3b82f6" />
        </FloatingDoodle>
        <FloatingDoodle style={{ bottom: '10%', left: '5%', opacity: 0.1 }} delay={2}>
          <DoodleStarburst color="#f97316" size={60} />
        </FloatingDoodle>
        <FloatingDoodle style={{ bottom: '20%', right: '4%', opacity: 0.08 }} delay={0.8}>
          <HandDrawnCircle size={90} color="#f59e0b" />
        </FloatingDoodle>

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 10 }}>

          {/* ══ SECTION 1: THE STORY OPENER ════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            {/* Notebook label */}
            <motion.div
              initial={{ rotate: -3, scale: 0.9 }}
              animate={{ rotate: -3, scale: 1 }}
              style={{
                display: 'inline-block',
                background: 'rgba(34,197,94,0.12)',
                border: '2px dashed #22c55e',
                borderRadius: 10,
                padding: '6px 20px',
                fontFamily: "'Caveat', cursive",
                fontSize: 14, fontWeight: 700, color: '#22c55e',
                letterSpacing: '0.08em', marginBottom: 20,
              }}
            >
              📋 THE REAL STORY BEHIND YOUR DAILY PLATE
            </motion.div>

            <h2 style={{
              fontFamily: "'Permanent Marker', cursive",
              fontSize: 'clamp(32px, 6vw, 56px)',
              color: '#1a1a1a', marginBottom: 8, lineHeight: 1.2,
            }}>
              The Micronutrient Gap
            </h2>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <ScribbleUnderline color="#22c55e" width={260} />
            </div>

            <p style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 20, color: '#555',
              maxWidth: 600, margin: '0 auto', lineHeight: 1.7,
            }}>
              You eat three meals a day. You feel tired anyway. Here&apos;s why your plate is lying to you. 👇
            </p>
          </motion.div>

          {/* ══ SECTION 2: THE STORY JOURNEY (Vertical Timeline) ═══════════════ */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 40, marginBottom: 72, alignItems: 'center',
          }}
            className="story-grid"
          >
            {/* Left: Timeline */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                background: '#fffef5', borderRadius: 20,
                padding: '32px 28px',
                border: '2px solid rgba(0,0,0,0.08)',
                boxShadow: '4px 4px 0 rgba(0,0,0,0.06)',
              }}
              className="ruled-bg"
            >
              <h3 style={{
                fontFamily: "'Permanent Marker', cursive",
                fontSize: 20, color: '#1a1a1a', marginBottom: 24,
              }}>
                The Vicious Cycle 🔄
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
                {/* vertical line */}
                <div style={{
                  position: 'absolute', left: 19, top: 40, bottom: 10,
                  width: 2, background: 'linear-gradient(#22c55e, #f97316, #3b82f6)',
                  borderRadius: 2, opacity: 0.3,
                }} />
                <TimelineEntry step="1" title="You eat cooked food" desc="Heat destroys up to 60% of B-vitamins and most of Vitamin C." accent="#22c55e" delay={0} />
                <TimelineEntry step="2" title="Soil is depleted" desc="Modern farming strips zinc, selenium, magnesium from the soil you grow on." accent="#f97316" delay={0.1} />
                <TimelineEntry step="3" title="Nutrients degrade in storage" desc="Vegetables lose 30-50% nutrition within 3 days of harvest." accent="#3b82f6" delay={0.2} />
                <TimelineEntry step="4" title="You feel 'fine' but run on empty" desc="Subclinical deficiency = no obvious symptoms, just slow everything." accent="#f59e0b" delay={0.3} />
              </div>
            </motion.div>

            {/* Right: Problem cards (stacked asymmetrically) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { emoji: '📊', title: 'Your Typical Day', body: ['High carbs (rice / roti)', 'Moderate protein', 'Minimal enzyme support', 'Vitamins cooked away'], accent: '#22c55e', rot: -2 },
                { emoji: '⚠️', title: 'The Uncomfortable Truth', body: ['3 in 4 Indians are deficient', 'Fatigue despite eating enough', 'Soil depletion is real'], accent: '#f97316', rot: 2 },
              ].map((card, i) => (
                <ProblemCard key={i} {...card} rotation={card.rot} delay={i * 0.15} />
              ))}
            </div>
          </div>

          {/* ══ DIVIDER: Hand-drawn wave ════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 60, display: 'flex', alignItems: 'center', gap: 16 }}
          >
            <div style={{ flex: 1, height: 2, background: 'linear-gradient(to right, transparent, #22c55e50)' }} />
            <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 14, color: '#22c55e', whiteSpace: 'nowrap' }}>
              so what&apos;s missing?
            </span>
            <div style={{ flex: 1, height: 2, background: 'linear-gradient(to left, transparent, #22c55e50)' }} />
          </motion.div>

          {/* ══ SECTION 3: THE 5 GAPS (Clickable Cards) ════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 40 }}
          >
            <h2 style={{
              fontFamily: "'Permanent Marker', cursive",
              fontSize: 'clamp(26px, 5vw, 44px)',
              color: '#1a1a1a', marginBottom: 8,
            }}>
              5 Critical <span style={{ color: '#22c55e' }}>Gaps</span> in Your Plate
            </h2>
            <p style={{
              fontFamily: "'Caveat', cursive", fontSize: 18, color: '#888',
            }}>
              👆 Tap any card to explore the product
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: 24, marginBottom: 64,
          }}>
            <NutrientCard
              id="b12"
              icon={
                <svg viewBox="0 0 64 64" width={60} height={60} fill="none">
                  <path d="M32 6 C50 4 60 20 58 38 C56 56 40 62 26 58 C12 54 4 40 8 24 C12 8 24 4 32 6" stroke="#22c55e" strokeWidth="2.5" fill="none" />
                  <text x="32" y="38" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#22c55e" fontFamily="serif">B</text>
                </svg>
              }
              title="Vitamin B Complex"
              badge="🧠 ENERGY"
              values={['B6', 'B9 Folic Acid', 'B12']}
              why={['Energy production', 'Brain function', 'Hormone balance', 'Beats fatigue']}
              tip="Most people are low in B12 & B6."
              accentHex="#22c55e"
              delay={0}
              rotation={-2}
            />

            <NutrientCard
              id="calcium"
              icon={
                <svg viewBox="0 0 64 64" width={60} height={60} fill="none">
                  <rect x="10" y="10" width="44" height="44" rx="8" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeDasharray="5 3" />
                  <circle cx="32" cy="32" r="10" fill="#3b82f630" stroke="#3b82f6" strokeWidth="2" />
                  <path d="M26 32 L38 32 M32 26 L32 38" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              }
              title="Calcium + Magnesium"
              badge="🦴 BONES"
              values={['300 mg Ca', '132 mg Mg']}
              why={['Bone strength', 'Muscle function', 'Better sleep', 'Stress control']}
              tip="Daily diet rarely gives optimal magnesium."
              accentHex="#3b82f6"
              delay={0.1}
              rotation={1}
            />

            <NutrientCard
              id="zinc"
              icon={
                <svg viewBox="0 0 64 64" width={60} height={60} fill="none">
                  <path d="M32 8 L48 20 L48 40 C48 54 32 60 32 60 C32 60 16 54 16 40 L16 20 Z" stroke="#f97316" strokeWidth="2.5" fill="none" />
                  <circle cx="32" cy="40" r="7" fill="#f9731630" stroke="#f97316" strokeWidth="2" />
                  <path d="M32 33 L32 40" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              title="Zinc + Selenium"
              badge="🛡 IMMUNITY"
              values={['6.8 mg Zinc', '28 mcg Se']}
              why={['Immunity', 'Skin repair', 'Thyroid support', 'Recovery']}
              tip="Soil depletion = mineral depletion in food."
              accentHex="#f97316"
              delay={0.2}
              rotation={-1}
            />

            <NutrientCard
              id="vitaminc"
              icon={
                <svg viewBox="0 0 64 64" width={60} height={60} fill="none">
                  <circle cx="32" cy="32" r="22" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
                  <text x="32" y="40" textAnchor="middle" fontSize="26" fontWeight="bold" fill="#f59e0b" fontFamily="serif">C</text>
                  {[0,60,120,180,240,300].map((deg, i) => {
                    const r = (deg * Math.PI) / 180;
                    return <circle key={i} cx={32 + 28 * Math.cos(r)} cy={32 + 28 * Math.sin(r)} r="3" fill="#f59e0b60" />;
                  })}
                </svg>
              }
              title="Vitamin C"
              badge="🍊 ANTIOXIDANT"
              values={['50 mg Vit C', 'Antioxidant']}
              why={['Immunity', 'Collagen', 'Recovery', 'Antioxidant']}
              tip="Cooking destroys Vitamin C in regular meals."
              accentHex="#f59e0b"
              delay={0.3}
              rotation={2}
            />

            <NutrientCard
              id="fiber"
              icon={
                <svg viewBox="0 0 64 64" width={60} height={60} fill="none">
                  {[18, 28, 38, 48].map((x, i) => (
                    <path key={i} d={`M${x} 10 C${x - 4} 22 ${x + 4} 34 ${x} 46 C${x - 3} 52 ${x + 3} 56 ${x} 58`}
                      stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  ))}
                </svg>
              }
              title="Fiber + Enzymes"
              badge="🌾 GUT HEALTH"
              values={['6 g Fiber', '100 mg Enzymes']}
              why={['Better digestion', 'Less bloating', 'Nutrient absorption', 'Gut health']}
              tip="Most people eat fiber but lack digestive enzyme support."
              accentHex="#10b981"
              delay={0.4}
              rotation={-2}
            />

            {/* Solution card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5, type: 'spring', bounce: 0.3 }}
              whileHover={{ scale: 1.05, rotate: 0 }}
              style={{
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                borderRadius: 18, padding: '28px 22px',
                border: '2.5px dashed #22c55e',
                boxShadow: '6px 6px 0 rgba(34,197,94,0.25)',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center',
                textAlign: 'center', cursor: 'default',
                transform: 'rotate(1deg)',
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                style={{ marginBottom: 14 }}
              >
                <DoodleStarburst color="#22c55e" size={56} />
              </motion.div>
              <h3 style={{
                fontFamily: "'Permanent Marker', cursive",
                fontSize: 20, color: '#1a1a1a', marginBottom: 10,
              }}>The Fix ✨</h3>
              <p style={{
                fontFamily: "'Caveat', cursive", fontSize: 16,
                color: '#16a34a', fontWeight: 700, lineHeight: 1.5,
              }}>
                One Scoop.<br />All 5 gaps.<br />Precision dosing. Daily.
              </p>
              <div style={{
                marginTop: 14, padding: '6px 16px', borderRadius: 20,
                background: '#22c55e', color: '#fff',
                fontFamily: "'Caveat', cursive", fontSize: 14, fontWeight: 700,
              }}>
                Shop Now →
              </div>
            </motion.div>
          </div>

          {/* ══ SECTION 4: STAT CALLOUTS ════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: '#fffef5',
              border: '2px solid rgba(0,0,0,0.08)',
              borderRadius: 20, padding: '32px',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.05)',
            }}
          >
            <h3 style={{
              fontFamily: "'Permanent Marker', cursive",
              fontSize: 22, color: '#1a1a1a',
              textAlign: 'center', marginBottom: 28,
            }}>
              The numbers don&apos;t lie 📊
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20 }}>
              {[
                { num: '75%', label: 'Indians have at least one micronutrient deficiency', color: '#22c55e' },
                { num: '60%', label: 'Vitamin loss from cooking at high heat', color: '#f97316' },
                { num: '50%', label: 'Nutrient drop in produce within 3 days of harvest', color: '#3b82f6' },
                { num: '1', label: 'scoop to close all 5 gaps every day', color: '#10b981' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ textAlign: 'center', padding: 16 }}
                >
                  <div style={{
                    fontFamily: "'Permanent Marker', cursive",
                    fontSize: 40, color: stat.color, lineHeight: 1,
                    marginBottom: 8,
                  }}>{stat.num}</div>
                  <div style={{
                    fontFamily: "'Caveat', cursive", fontSize: 15,
                    color: '#666', lineHeight: 1.4,
                  }}>{stat.label}</div>
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
                    <ScribbleUnderline color={stat.color} width={60} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* Responsive grid fix */}
      <style>{`
        @media (max-width: 640px) {
          .story-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}