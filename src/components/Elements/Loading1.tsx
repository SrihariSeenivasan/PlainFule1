'use client';

import { motion,  } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

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

// ─── Logo Reveal Stage (reusable component) ─────────────────────────────

export function LogoReveal({ onDone }: { onDone: () => void }) {
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

      {/* THE LOGO — centered */}
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
            src="/images/plainfuel.png"
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

export { DoodleMg, DoodleCa, DoodleLeaf, DoodleStar, DoodleWave, DoodlePlant };
