'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { StarDoodle, Scribble, ArrowDoodle } from '@/components/Elements/SvgDoodles';

// ─── Local SVG helpers ────────────────────────────────────────────────────────

const CircleDoodle = ({ size = 40, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 44 44" width={size} height={size} style={style} aria-hidden>
    <path d="M22,4 C32,3 41,12 41,22 C41,32 32,41 22,41 C12,41 3,32 3,22 C3,12 12,3 22,4 Z"
      fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeDasharray="4,2" />
  </svg>
);

const ZigZag = ({ style = {} }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 200 16" style={style} aria-hidden>
    <polyline points="0,8 20,2 40,14 60,2 80,14 100,2 120,14 140,2 160,14 180,2 200,8"
      fill="none" stroke="rgba(21,128,61,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HighlightSvg = ({ style = {} }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 180 18" preserveAspectRatio="none" style={style} aria-hidden>
    <path d="M4,14 Q45,4 90,8 Q135,12 176,6"
      fill="none" stroke="rgba(21,128,61,0.5)" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

// ─── Compact stat pill ────────────────────────────────────────────────────────

const StatPill = ({ value, label, delay = 0, color = '#15803d' }: { value: string; label: string; delay?: number; color?: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, rotate: -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: hovered ? 1 : -1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered ? `${color}10` : '#fffef5',
        padding: '8px 12px',
        borderRadius: 10,
        cursor: 'default',
        boxShadow: hovered ? `3px 4px 0 ${color}` : '2px 2px 0 rgba(0,0,0,0.12)',
        transform: `rotate(${hovered ? 1 : -1}deg)`,
        transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
        minWidth: 90,
        border: `1.5px ${hovered ? 'solid' : 'dashed'} ${hovered ? color : 'rgba(0,0,0,0.18)'}`,
      }}
    >
      <span style={{
        display: 'block', fontSize: '1.35rem', fontWeight: 900,
        fontFamily: "'Permanent Marker', cursive", color, lineHeight: 1,
      }}>{value}</span>
      <span style={{
        display: 'block', fontSize: '9px', textTransform: 'uppercase',
        letterSpacing: '0.13em',
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        fontWeight: 600, color: 'rgba(0,0,0,0.45)', marginTop: 3,
      }}>{label}</span>
    </motion.div>
  );
};

// ─── Compact pillar row ───────────────────────────────────────────────────────

const pillars = [
  { icon: '◈', label: 'Bio-identical nutrients' },
  { icon: '◉', label: 'Your unique biological Delta' },
  { icon: '◎', label: 'Zero unnecessary filler' },
];

const PillarRow = ({ icon, label, delay }: { icon: string; label: string; delay: number }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 10px', borderRadius: 8,
        background: hovered ? 'rgba(21,128,61,0.08)' : 'rgba(255,254,245,0.7)',
        border: `1.5px ${hovered ? 'solid' : 'dashed'} ${hovered ? '#15803d' : 'rgba(0,0,0,0.18)'}`,
        cursor: 'default',
        transform: hovered ? 'translateX(4px) rotate(0.4deg)' : 'rotate(0)',
        transition: 'all 0.2s ease',
        boxShadow: hovered ? '2px 2px 0 #15803d' : 'none',
      }}
    >
      <span style={{ color: '#15803d', fontSize: 13, flexShrink: 0 }}>{icon}</span>
      <span style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        fontWeight: 600, fontSize: 12.5,
        color: 'rgba(0,0,0,0.7)', letterSpacing: '0.01em',
        flex: 1,
      }}>{label}</span>
      {hovered && <span style={{ fontSize: 11, color: '#15803d' }}>✓</span>}
    </motion.div>
  );
};

// ─── Compact quote strip ──────────────────────────────────────────────────────

const QuoteStrip = ({ text, delay }: { text: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, rotate: -1 }}
    whileInView={{ opacity: 1, y: 0, rotate: -0.4 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    style={{
      position: 'relative',
      background: '#fffef5',
      padding: '10px 14px 10px 20px',
      borderRadius: 8,
      transform: 'rotate(-0.4deg)',
      boxShadow: '3px 3px 0 rgba(0,0,0,0.09)',
    }}
  >
    {/* tape strip */}
    <div style={{ position: 'absolute', top: -7, left: 16, width: 40, height: 14, background: 'rgba(21,128,61,0.22)', borderRadius: 3, transform: 'rotate(-2deg)' }} />
    {/* left accent bar */}
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
      background: 'repeating-linear-gradient(to bottom, #15803d 0px, #15803d 6px, transparent 6px, transparent 10px)',
      borderRadius: '8px 0 0 8px',
    }} />
    <span style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: 13.5, fontWeight: 500, fontStyle: 'italic',
      color: 'rgb(0, 0, 0)', lineHeight: 1.55, display: 'block',
    }}>
      &ldquo;{text}&rdquo;
    </span>
  </motion.div>
);

// ─── Callout note ─────────────────────────────────────────────────────────────

const CalloutNote = ({ emoji, text, tint, delay, rotate = 0 }: { emoji: string; text: string; tint: string; delay: number; rotate?: number }) => (
  <motion.div
    initial={{ opacity: 0, x: rotate > 0 ? 8 : -8 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay }}
    style={{
      display: 'flex', alignItems: 'center', gap: 8,
      marginBottom: 12,
      background: tint,
      border: '1.5px dashed rgba(0,0,0,0.18)',
      borderRadius: 8, padding: '7px 11px',
      transform: `rotate(${rotate}deg)`,
    }}
  >
    <span style={{ fontSize: 15, flexShrink: 0 }}>{emoji}</span>
    <span style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: 12.5, fontWeight: 600, fontStyle: 'italic',
      color: '#1a1a1a', lineHeight: 1.4,
    }}>{text}</span>
  </motion.div>
);

// ─── Background specks ────────────────────────────────────────────────────────

const SPECKS = [
  { w: 2.1, h: 3.4, left: 12.3, top: 44.7 }, { w: 3.8, h: 2.2, left: 67.1, top:  8.5 },
  { w: 1.8, h: 4.1, left: 31.6, top: 72.3 }, { w: 4.2, h: 1.9, left: 84.4, top: 27.1 },
  { w: 2.9, h: 3.1, left:  5.7, top: 91.6 }, { w: 1.6, h: 2.7, left: 53.2, top: 61.4 },
  { w: 3.5, h: 1.7, left: 76.8, top: 49.2 }, { w: 2.4, h: 4.8, left: 23.9, top: 15.8 },
  { w: 4.0, h: 2.5, left: 91.1, top: 83.3 }, { w: 1.9, h: 3.8, left: 44.6, top: 36.9 },
  { w: 3.2, h: 2.0, left: 58.3, top: 96.1 }, { w: 2.7, h: 3.6, left:  8.2, top: 22.5 },
  { w: 4.5, h: 1.5, left: 39.7, top: 57.8 }, { w: 2.3, h: 2.9, left: 72.5, top: 68.4 },
];

const PencilSpecks = () => (
  <>
    {SPECKS.map((s, i) => (
      <div key={i} style={{
        position: 'absolute', width: s.w, height: s.h,
        borderRadius: '50%', background: 'rgba(0,0,0,0.055)',
        left: `${s.left}%`, top: `${s.top}%`,
      }} />
    ))}
  </>
);

// ─── Section divider tag ──────────────────────────────────────────────────────

const SectionTag = ({ children, rotate = 0 }: { children: React.ReactNode; rotate?: number }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'rgba(21,128,61,0.12)', border: '1.5px dashed #15803d',
    borderRadius: 6, padding: '4px 12px',
    transform: `rotate(${rotate}deg)`,
    boxShadow: '2px 2px 0 rgba(21,128,61,0.18)',
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    fontSize: 10.5, fontWeight: 700, color: '#15803d',
    letterSpacing: '0.07em', textTransform: 'uppercase' as const,
  }}>
    {children}
  </div>
);

// ─── Main section ─────────────────────────────────────────────────────────────

export default function Sciencesection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&family=Permanent+Marker&display=swap');

        .doodle-section {
          background: #fafaf2;
          background-image: radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px);
          background-size: 26px 26px;
        }

        .notebook-lines::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            transparent, transparent 25px,
            rgba(21,128,61,0.07) 25px, rgba(21,128,61,0.07) 26px
          );
          pointer-events: none;
          border-radius: inherit;
        }

        .sci-card {
          background: #fffef5;
          border-radius: 14px;
          position: relative;
          overflow: visible;
        }

        .sci-card::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 15px;
          border: 2px solid rgba(0,0,0,0.1);
          pointer-events: none;
        }

        .sci-card-green::before {
          border-color: rgba(21,128,61,0.18);
        }

        /* corner dog-ear */
        .sci-card .dog-ear {
          position: absolute; bottom: 0; right: 0;
          width: 22px; height: 22px;
          background: linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.07) 50%);
          border-radius: 0 0 14px 0;
        }

        @keyframes wiggle { 0%,100%{transform:rotate(-0.8deg)} 50%{transform:rotate(0.8deg)} }
        .wiggle-slow { animation: wiggle 5s ease-in-out infinite; }

        @keyframes float { 0%,100%{transform:translateY(0)rotate(-2deg)} 50%{transform:translateY(-7px)rotate(2deg)} }
        .float-anim { animation: float 5.5s ease-in-out infinite; }

        /* two-column grid that stacks at 720px */
        .sci-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          align-items: start;
        }

        @media (max-width: 720px) {
          .sci-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* roughen filter */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="roughen2">
            <feTurbulence type="turbulence" baseFrequency="0.025" numOctaves="3" result="noise" seed="5" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <section
        ref={sectionRef}
        className="doodle-section"
        style={{ padding: '52px 24px 48px', position: 'relative', overflow: 'hidden' }}
      >

        {/* ── Background atmosphere ── */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <PencilSpecks />
          <motion.div style={{ y: bgY }} className="float-anim">
            <StarDoodle size={38} rotate={15} style={{ position: 'absolute', top: '6%', left: '4%', opacity: 0.28 }} />
          </motion.div>
          <StarDoodle size={24} rotate={-20} style={{ position: 'absolute', top: '12%', right: '6%', opacity: 0.2 }} />
          <CircleDoodle size={64} style={{ position: 'absolute', bottom: '14%', left: '2%', opacity: 0.16 }} />
          <CircleDoodle size={40} style={{ position: 'absolute', top: '38%', right: '3%', opacity: 0.16 }} />
          <ZigZag style={{ position: 'absolute', bottom: '8%', right: '8%', width: 160, opacity: 0.4 }} />
          <ZigZag style={{ position: 'absolute', top: '4%', left: '18%', width: 110, opacity: 0.35, transform: 'rotate(2deg)' }} />
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* ── Eyebrow + title ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{ textAlign: 'center', marginBottom: 32 }}
          >
            {/* eyebrow tag */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <div style={{
                background: 'rgba(21,128,61,0.13)', border: '1.5px dashed #15803d',
                borderRadius: 7, padding: '5px 16px',
                transform: 'rotate(-1.2deg)',
                boxShadow: '2px 2px 0 rgba(21,128,61,0.18)',
              }}>
                <span style={{
                  fontFamily: "'Permanent Marker', cursive",
                  fontSize: 11.5, color: '#15803d', letterSpacing: '0.07em',
                }}>
                  ✦ The Science of Sufficiency ✦
                </span>
              </div>
            </div>

            {/* headline */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <h2 style={{
                fontFamily: "'Permanent Marker', cursive",
                fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
                color: '#1a1a1a', margin: 0, lineHeight: 1.1,
              }}>
                What&apos;s{' '}
                <span style={{ color: '#15803d' }}>Actually</span>
                {' '}in your food?
              </h2>
              <HighlightSvg style={{
                position: 'absolute', bottom: -6, left: '50%',
                transform: 'translateX(-50%)',
                width: '55%', height: 14, opacity: 0.6,
              }} />
            </div>

            {/* sub-deck */}
            <p style={{
              fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
              fontSize: 13, color: 'rgba(0,0,0,0.48)',
              marginTop: 14, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto',
              lineHeight: 1.6, fontWeight: 400,
            }}>
              Volume is no longer a proxy for vitality — here&apos;s the science behind the gap.
            </p>
          </motion.div>

          {/* ── Two cards ── */}
          <div className="sci-grid">

            {/* ── CARD 1: PROBLEM ── */}
            <motion.div
              initial={{ opacity: 0, x: -22, rotate: -1.5 }}
              whileInView={{ opacity: 1, x: 0, rotate: -0.8 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="sci-card notebook-lines wiggle-slow"
              style={{
                padding: '22px 20px',
                boxShadow: '5px 6px 0 rgba(0,0,0,0.1)',
                transform: 'rotate(-0.8deg)',
              }}
            >
              <div className="dog-ear" />

              {/* ghost number */}
              <span aria-hidden style={{
                position: 'absolute', right: 10, top: -4,
                fontFamily: "'Permanent Marker', cursive",
                fontSize: 'clamp(56px,9vw,96px)', lineHeight: 1,
                color: '#15803d', opacity: 0.05,
                userSelect: 'none', pointerEvents: 'none',
              }}>01</span>

              {/* section tag */}
              <div style={{ marginBottom: 12 }}>
                <SectionTag rotate={-1.2}>
                  <StarDoodle size={10} />
                  The Problem
                </SectionTag>
              </div>

              {/* headline */}
              <motion.h3
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.08 }}
                style={{
                  fontFamily: "'Permanent Marker', cursive",
                  fontSize: 'clamp(1.15rem, 2.4vw, 1.7rem)',
                  lineHeight: 1.25, color: '#1a1a1a',
                  marginBottom: 10, position: 'relative',
                }}
              >
                The Modern Diet.<br />
                <span style={{ color: '#15803d', position: 'relative' }}>
                  An Invisible
                  <Scribble style={{ position: 'absolute', bottom: -6, left: 0, width: '100%', height: 16 }} />
                </span>
                {' '}<span style={{ color: 'rgba(0,0,0,0.16)', fontStyle: 'italic' }}>Depletion.</span>
              </motion.h3>

              {/* body */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.14 }}
                style={{
                  fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
                  fontSize: 12.5, lineHeight: 1.7,
                  color: 'rgba(0,0,0,0.57)', marginBottom: 12, fontWeight: 400,
                }}
              >
                We consume more than ever, yet our cells are starving. High-yield farming and processed soil have hollowed out the modern thali — the calories remain, but the micronutrients have quietly vanished.
              </motion.p>

              {/* callout */}
              <CalloutNote
                emoji="👉"
                text="Volume is no longer a proxy for vitality."
                tint="rgba(254,240,138,0.38)"
                delay={0.2}
                rotate={0.4}
              />

              {/* stat pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                <StatPill value="57%" label="Nutrient loss since 1950" delay={0.25} />
                <StatPill value="3 in 4" label="Indians deficient" delay={0.32} />
              </div>

              {/* quote */}
              <QuoteStrip text="Complexity is the smoke screen for insufficiency." delay={0.38} />

              <ArrowDoodle style={{ position: 'absolute', right: -28, top: '46%', width: 44, display: 'none' }} />
            </motion.div>

            {/* ── CARD 2: SOLUTION ── */}
            <motion.div
              initial={{ opacity: 0, x: 22, rotate: 1.5 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0.8 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="sci-card sci-card-green notebook-lines"
              style={{
                padding: '22px 20px',
                boxShadow: '5px 6px 0 rgba(21,128,61,0.18)',
                transform: 'rotate(0.8deg)',
              }}
            >
              <div className="dog-ear" style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(21,128,61,0.1) 50%)' }} />

              {/* ghost number */}
              <span aria-hidden style={{
                position: 'absolute', right: 10, top: -4,
                fontFamily: "'Permanent Marker', cursive",
                fontSize: 'clamp(56px,9vw,96px)', lineHeight: 1,
                color: '#15803d', opacity: 0.07,
                userSelect: 'none', pointerEvents: 'none',
              }}>02</span>

              {/* section tag */}
              <div style={{ marginBottom: 12 }}>
                <SectionTag rotate={0.8}>
                  ✨ The Reframe
                </SectionTag>
              </div>

              {/* headline */}
              <motion.h3
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                  fontFamily: "'Permanent Marker', cursive",
                  fontSize: 'clamp(1.15rem, 2.4vw, 1.7rem)',
                  lineHeight: 1.25, color: '#1a1a1a',
                  marginBottom: 10, position: 'relative',
                }}
              >
                Precision.{' '}
                <span style={{ color: '#15803d', position: 'relative' }}>
                  Truly
                  <Scribble style={{ position: 'absolute', bottom: -6, left: 0, width: '100%', height: 16 }} />
                </span>
                {' '}<span style={{ color: 'rgba(0,0,0,0.16)', fontStyle: 'italic' }}>Redefined.</span>
              </motion.h3>

              {/* body */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                style={{
                  fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
                  fontSize: 12.5, lineHeight: 1.7,
                  color: 'rgba(0,0,0,0.57)', marginBottom: 12, fontWeight: 400,
                }}
              >
                Supplements shouldn&apos;t be a scattergun approach. We match bio-identical nutrients to your unique biological context — bridging the specific Delta within your thali, nothing more.
              </motion.p>

              {/* callout */}
              <CalloutNote
                emoji="🔬"
                text="True intelligence is invisible."
                tint="rgba(21,128,61,0.06)"
                delay={0.22}
                rotate={-0.4}
              />

              {/* pillar rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                {pillars.map((item, i) => (
                  <PillarRow key={item.label} icon={item.icon} label={item.label} delay={0.3 + i * 0.08} />
                ))}
              </div>

              {/* quote */}
              <QuoteStrip text="Health is the absence of the unnecessary." delay={0.46} />
            </motion.div>

          </div>

          {/* ── Bottom badge strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.25 }}
            style={{
              marginTop: 22,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap', gap: 10,
            }}
          >
            {/* divider line left */}
            <div style={{ flex: 1, maxWidth: 120, height: 1.5, background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.12))' }} />

            <div style={{
              background: 'rgba(255,254,245,0.95)',
              border: '1.5px dashed rgba(0,0,0,0.18)',
              borderRadius: 7, padding: '5px 14px',
              transform: 'rotate(-0.4deg)',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.07)',
            }}>
              <span style={{
                fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
                fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.1em', color: 'rgb(0, 0, 0)',
                textTransform: 'uppercase',
              }}>
                📖 Backed by nutritional science
              </span>
            </div>

            {/* dot separator */}
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(0,0,0,0.18)', flexShrink: 0 }} />

            <div style={{
              background: 'rgba(21,128,61,0.08)',
              border: '1.5px solid rgba(21,128,61,0.28)',
              borderRadius: 7, padding: '5px 14px',
              transform: 'rotate(0.6deg)',
              boxShadow: '2px 2px 0 rgba(21,128,61,0.14)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#15803d', flexShrink: 0 }} />
              <span style={{
                fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
                fontSize: 10.5, fontWeight: 600,
                letterSpacing: '0.1em', color: '#15803d',
                textTransform: 'uppercase',
              }}>
                🇮🇳 Formulated for the Indian body
              </span>
            </div>

            {/* divider line right */}
            <div style={{ flex: 1, maxWidth: 120, height: 1.5, background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.12))' }} />
          </motion.div>

        </div>
      </section>
    </>
  );
}