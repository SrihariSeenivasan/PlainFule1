'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SketchHighlight from '../SketchHighlight';

// ─── Doodle SVGs ──────────────────────────────────────────────────────────────

const DoodleMg = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 64 64" fill="none" style={style}>
    <path d="M32 6 L54 19 L54 45 L32 58 L10 45 L10 19 Z"
      stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <text x="32" y="37" textAnchor="middle" fontSize="14" fontWeight="700" fill="#22c55e" fontFamily="serif">Mg</text>
    <circle cx="56" cy="18" r="2" fill="#22c55e" opacity="0.5" />
  </svg>
);

const DoodleCa = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 64 64" fill="none" style={style}>
    <ellipse cx="18" cy="14" rx="8" ry="6" stroke="#16a34a" strokeWidth="2" fill="none" />
    <ellipse cx="46" cy="14" rx="8" ry="6" stroke="#16a34a" strokeWidth="2" fill="none" />
    <ellipse cx="18" cy="50" rx="8" ry="6" stroke="#16a34a" strokeWidth="2" fill="none" />
    <ellipse cx="46" cy="50" rx="8" ry="6" stroke="#16a34a" strokeWidth="2" fill="none" />
    <rect x="13" y="19" width="10" height="26" rx="3" stroke="#16a34a" strokeWidth="2" fill="none" />
    <rect x="41" y="19" width="10" height="26" rx="3" stroke="#16a34a" strokeWidth="2" fill="none" />
    <text x="32" y="36" textAnchor="middle" fontSize="11" fontWeight="700" fill="#16a34a" fontFamily="serif">Ca</text>
  </svg>
);

const DoodleLeaf = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 64 64" fill="none" style={style}>
    <path d="M32 56 C32 56 12 40 14 22 C16 8 32 8 32 8 C32 8 48 8 50 22 C52 40 32 56 32 56Z"
      stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" fill="rgba(34,197,94,0.1)" />
    <path d="M32 56 L32 18" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M32 38 L22 28" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M32 30 L42 22" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const DoodleStar = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 40 40" fill="none" style={style}>
    <path d="M20 4 L23 16 L36 16 L26 24 L30 36 L20 28 L10 36 L14 24 L4 16 L17 16 Z"
      stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(34,197,94,0.1)" />
  </svg>
);

const DoodleWave = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 80 30" fill="none" style={style}>
    <path d="M4 15 C12 5 20 25 28 15 C36 5 44 25 52 15 C60 5 68 25 76 15"
      stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" fill="none" />
  </svg>
);

const DoodlePlant = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 50 70" fill="none" style={style}>
    <path d="M25 65 L25 30" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M25 50 C15 45 10 35 14 26 C20 18 30 22 30 30" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" fill="rgba(34,197,94,0.1)" />
    <path d="M25 40 C35 35 40 25 36 16 C30 8 20 12 20 20" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" fill="rgba(34,197,94,0.1)" />
  </svg>
);

// ─── Doodles that burst out during reveal ────────────────────────────────────

const doodlePool = [
  { C: DoodleMg,   w: 52, label: 'Magnesium' },
  { C: DoodleCa,   w: 48, label: 'Calcium'   },
  { C: DoodleLeaf, w: 40, label: ''           },
  { C: DoodleStar, w: 28, label: ''           },
  { C: DoodleWave, w: 64, label: ''           },
  { C: DoodleMg,   w: 36, label: ''           },
  { C: DoodleCa,   w: 40, label: ''           },
  { C: DoodleLeaf, w: 32, label: ''           },
  { C: DoodleStar, w: 22, label: ''           },
  { C: DoodlePlant,w: 36, label: ''           },
];

// Helper function to generate random doodle items - safe outside React component
function generateDoodleItems() {
  return doodlePool.map((d, i) => ({
    ...d, id: i,
    angle:    (Math.PI * 2 * i) / doodlePool.length + (Math.random() - 0.5) * 0.4,
    radius:   130 + Math.random() * 90,
    delay:    0.05 + Math.random() * 0.4,
    rotate:   -25 + Math.random() * 50,
    rotateEnd:-10 + Math.random() * 20,
    opacity:  0.5 + Math.random() * 0.4,
  }));
}

function FloatingDoodles({ active }: { active: boolean }) {
  // useMemo prevents recalculation of the random items - they're generated once and reused
  const items = useMemo(() => generateDoodleItems(), []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {items.map(({ C, w, id, angle, radius, delay, rotate, rotateEnd, opacity, label }) => {
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <motion.div
            key={id}
            className="absolute"
            style={{ width: w, height: w }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate }}
            animate={active
              ? { x, y, opacity: [0, opacity, opacity], scale: [0, 1.2, 1], rotate: rotateEnd }
              : { x: 0, y: 0, opacity: 0, scale: 0 }
            }
            transition={{ duration: 1.4, delay, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <C style={{ width: w, height: w }} />
            {label && (
              <span style={{
                position: 'absolute', top: '100%', left: '50%',
                transform: 'translateX(-50%)', marginTop: 2,
                fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#888', whiteSpace: 'nowrap',
              }}>{label}</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Hand-drawn ring around logo ─────────────────────────────────────────────

function DrawRing({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 340 140"
      style={{ position: 'absolute', width: 340, height: 140, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}
    >
      <motion.ellipse
        cx="170" cy="70" rx="158" ry="60"
        stroke="#22c55e" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="2 5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.3, ease: 'easeInOut', delay: 0.2 }}
      />
      <motion.path
        d="M15 70 C25 18 315 12 325 70 C332 128 20 132 15 70"
        stroke="#22c55e" strokeWidth="1.3" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={active ? { pathLength: 1, opacity: 0.22 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.7, ease: 'easeInOut' }}
      />
    </svg>
  );
}

// ─── Logo Reveal Stage (renders inside hero, not fullscreen) ─────────────────

function LogoRevealStage({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState('blank');
  // blank → rise → burst → hold → done

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase('rise'),  300),
      setTimeout(() => setPhase('burst'), 900),
      setTimeout(() => setPhase('hold'),  1500),
      setTimeout(() => onDone(),          3000),
    ];
    return () => t.forEach(clearTimeout);
  }, [onDone]);

  const isBurst = phase === 'burst' || phase === 'hold';
  const logoUp  = phase !== 'blank';

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
      style={{ background: '#fafaf7', borderRadius: 'inherit' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(34,197,94,0.2) 1px, transparent 1px)',
        backgroundSize: '28px 28px', opacity: 0.6,
      }} />

      {/* Warm glow */}
      <motion.div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, transparent 70%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }}
        animate={{ scale: phase === 'blank' ? 0.3 : 1.2, opacity: phase === 'blank' ? 0 : 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Doodles burst */}
      <FloatingDoodles active={isBurst} />

      {/* Ring */}
      <DrawRing active={isBurst} />

      {/* Corner brackets */}
      {[{ top: 20, left: 20 }, { top: 20, right: 20 }, { bottom: 20, left: 20 }, { bottom: 20, right: 20 }].map((pos, i) => (
        <motion.svg key={i} viewBox="0 0 40 40"
          style={{ position: 'absolute', width: 32, height: 32, ...pos }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isBurst ? 0.45 : 0, scale: isBurst ? 1 : 0 }}
          transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
        >
          <path d={i % 2 === 0 ? 'M8 32 L8 8 L32 8' : 'M8 8 L32 8 L32 32'}
            stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx={i % 2 === 0 ? 8 : 32} cy={i < 2 ? 8 : 32} r="3" fill="#22c55e" />
        </motion.svg>
      ))}

      {/* THE LOGO — centered in hero */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.3, y: 20, filter: 'blur(12px)' }}
        animate={{
          opacity: logoUp ? 1 : 0,
          scale:   phase === 'rise' ? 0.88 : 1,
          y:       phase === 'rise' ? 6 : 0,
          filter:  phase === 'rise' ? 'blur(3px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Warm halo */}
        <div style={{
          position: 'absolute', inset: '-40%',
          background: 'radial-gradient(ellipse, rgba(196,162,58,0.22) 0%, transparent 65%)',
          filter: 'blur(20px)', pointerEvents: 'none',
        }} />

        {/* Logo image */}
        <div style={{ position: 'relative', width: 280, height: 105 }}>
          <Image
            src="/images/plainfuel-logo.png"
            alt="Plainfuel"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Tagline */}
        <motion.p
          style={{
            marginTop: 14, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999',
          }}
          animate={{
            opacity: phase === 'hold' ? 1 : 0,
            letterSpacing: phase === 'hold' ? '0.42em' : '0.15em',
            y: phase === 'hold' ? 0 : 8,
          }}
          transition={{ duration: 0.65 }}
        >
          Fuel. Purely.
        </motion.p>

        {/* Hand-drawn underline under tagline */}
        <svg viewBox="0 0 150 8" style={{ width: 140, height: 8, marginTop: 4 }}>
          <motion.path
            d="M4 4 C30 2 80 6 146 4"
            stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: phase === 'hold' ? 1 : 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// ─── Ingredient badges ────────────────────────────────────────────────────────

const ingredients = [
  { Icon: DoodleMg,   label: 'Magnesium', color: '#22c55e', bg: 'rgba(34,197,94,0.08)'  },
  { Icon: DoodleCa,   label: 'Calcium',   color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
  { Icon: DoodleLeaf, label: 'Natural',   color: '#22c55e', bg: 'rgba(34,197,94,0.08)'  },
];

// ─── Hero Section ─────────────────────────────────────────────────────────────

export default function Herosection() {
  const [revealDone, setRevealDone] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden py-20 bg-[var(--background)]">

      {/* ── Logo Reveal — lives inside the hero ── */}
      <AnimatePresence>
        {!revealDone && (
          <LogoRevealStage key="reveal" onDone={() => setRevealDone(true)} />
        )}
      </AnimatePresence>

      {/* Dot-grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(196,162,58,0.12) 1px, transparent 1px)',
        backgroundSize: '30px 30px', opacity: 0.5,
      }} />

      {/* Warm ambient blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--green-glow)] rounded-full blur-[120px] -mr-64 -mt-64 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--green-glow)] rounded-full blur-[100px] -ml-48 -mb-48 opacity-30" />

      {/* Corner doodle accents */}
      <div className="absolute top-8 right-10 pointer-events-none opacity-25">
        <DoodleWave style={{ width: 80, height: 30 }} />
      </div>
      <div className="absolute bottom-12 left-8 pointer-events-none opacity-20">
        <DoodlePlant style={{ width: 38, height: 54 }} />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT: copy */}
          <div className="order-2 lg:order-1">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: revealDone ? 1 : 0, x: revealDone ? 0 : -20 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="tag-pill mb-6"
            >
              Our Mission
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: revealDone ? 1 : 0, y: revealDone ? 0 : 20 }}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-playfair text-5xl md:text-7xl font-black mb-6 leading-tight"
            >
              The Motto: <br />
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <SketchHighlight type="underline" delay={0.8}>
                  <span className="gradient-text">Bridge the Gap.</span>
                </SketchHighlight>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: revealDone ? 1 : 0, y: revealDone ? 0 : 20 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg md:text-xl text-[var(--foreground)]/60 mb-8 max-w-lg leading-relaxed"
            >
              We identified the precise nutritional deficits in the modern Indian diet.
              PlainFuel isn&apos;t just another supplement; it&apos;s the missing piece of your daily nutrition,
              packaged in a precise, invisible daily pouch.
            </motion.p>

            {/* Ingredient badges */}
            <motion.div
              className="flex flex-wrap gap-3 mb-10"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: revealDone ? 1 : 0, y: revealDone ? 0 : 14 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {ingredients.map(({ Icon, label, color, bg }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: bg, border: `1.5px solid ${color}33`,
                  borderRadius: 999, padding: '5px 12px 5px 7px',
                }}>
                  <Icon style={{ width: 20, height: 20 }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color, letterSpacing: '0.05em' }}>
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: revealDone ? 1 : 0, y: revealDone ? 0 : 20 }}
              transition={{ delay: 0.72, duration: 0.6 }}
            >
              <button className="group glass-green px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-[var(--green-mid)] transition-all duration-300">
                EXPLORE OUR STORY
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* RIGHT: product image */}
          <div className="order-1 lg:order-2 flex justify-center relative">
            {/* Dashed rings */}
            <div style={{
              position: 'absolute', width: 380, height: 380, borderRadius: '50%',
              border: '1.5px dashed rgba(196,162,58,0.3)',
              top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', width: 295, height: 295, borderRadius: '50%',
              border: '1px dashed rgba(90,138,62,0.2)',
              top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none',
            }} />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: revealDone ? 1 : 0, scale: revealDone ? 1 : 0.8, rotate: revealDone ? 0 : -5 }}
              transition={{ type: 'spring', damping: 15, delay: 0.4 }}
              className="relative w-full max-w-md aspect-square"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--green-mid)]/20 to-transparent rounded-full blur-2xl" />
              <Image
                src="/images/product_premium.png"
                alt="Plainfuel Product"
                fill
                className="object-contain float-anim"
              />
            </motion.div>

            {/* Doodle accents around product */}
            {[
              { C: DoodleMg,   w: 36, top: '8%',    right: '4%',  rotate: 15  },
              { C: DoodleCa,   w: 32, bottom: '12%', left: '2%',   rotate: -12 },
              { C: DoodleStar, w: 22, top: '32%',    left: '1%',   rotate: 20  },
              { C: DoodleLeaf, w: 28, bottom: '22%', right: '5%',  rotate: -8  },
            ].map((d, i) => (
              <motion.div key={i} style={{
                position: 'absolute', width: d.w, height: d.w,
                top: d.top, bottom: d.bottom, left: d.left, right: d.right,
                pointerEvents: 'none', rotate: d.rotate,
              }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: revealDone ? 0.6 : 0, scale: revealDone ? 1 : 0 }}
                transition={{ delay: 0.6 + i * 0.1, type: 'spring', damping: 14 }}
              >
                <d.C style={{ width: d.w, height: d.w }} />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}