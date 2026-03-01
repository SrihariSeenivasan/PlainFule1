'use client';

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  type TargetAndTransition,
  type Transition,
} from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SketchHighlight from '../Elements/SketchHighlight';
import {
  LogoReveal,
  DoodleMg,
  DoodleCa,
  DoodleLeaf,
  DoodleStar,
  DoodleWave,
  DoodlePlant,
} from '../Elements/Loading1';

// ─── Types ────────────────────────────────────────────────────────────────────
type TransitionType = 'wipe' | 'iris' | 'split' | 'rotate' | 'shatter';

interface Slide {
  src: string;
  label: string;
  tag: string;
  accent: string;
  fill: string;
  glow: string;
  transition: TransitionType;
}

interface OrbitalItem {
  C: React.ComponentType<{ style?: React.CSSProperties }>;
  w: number;
  style: React.CSSProperties;
  rotate: number;
  dy: number;
}

const spBouncy = { type: 'spring' as const, damping: 10, stiffness: 200 };

const SLIDES: Slide[] = [
  {
    src: '/images/product_premium.png',
    label: 'Premium Formula',
    tag: 'BEST SELLER',
    accent: '#15803d',
    fill: '#dcfce7',
    glow: 'rgba(34,197,94,0.35)',
    transition: 'wipe',
  },
  {
    src: '/images/limepack.png',
    label: 'Classic Blend',
    tag: 'ESSENTIAL',
    accent: '#16a34a',
    fill: '#bbf7d0',
    glow: 'rgba(22,163,74,0.30)',
    transition: 'iris',
  },
  {
    src: '/images/brownpack.png',
    label: 'Sport Edition',
    tag: 'HIGH PERFORMANCE',
    accent: '#166534',
    fill: '#86efac',
    glow: 'rgba(74,222,128,0.35)',
    transition: 'split',
  },
  {
    src: '/images/redpack.png',
    label: 'Zen Recovery',
    tag: 'SLEEP & RESTORE',
    accent: '#14532d',
    fill: '#d1fae5',
    glow: 'rgba(134,239,172,0.30)',
    transition: 'rotate',
  },
  {
    src: '/images/orangepack.png',
    label: 'Daily Essentials',
    tag: 'EVERYDAY',
    accent: '#15803d',
    fill: '#a7f3d0',
    glow: 'rgba(21,128,61,0.33)',
    transition: 'shatter',
  },
];

type AnimationVariant = {
  initial: TargetAndTransition | undefined;
  animate: TargetAndTransition | undefined;
  exit: TargetAndTransition | undefined;
  transition: Transition | undefined;
};

const TV: Record<TransitionType, AnimationVariant> = {
  wipe: {
    initial: { clipPath: 'inset(0 100% 0 0)', scale: 1.06, opacity: 1 },
    animate: { clipPath: 'inset(0 0% 0 0)', scale: 1, opacity: 1 },
    exit: { clipPath: 'inset(0 0 0 100%)', scale: 0.96, opacity: 1 },
    transition: { duration: 0.5, ease: [0.77, 0, 0.175, 1] },
  },
  iris: {
    initial: { clipPath: 'circle(0% at 50% 50%)', scale: 1.12, opacity: 1 },
    animate: { clipPath: 'circle(75% at 50% 50%)', scale: 1, opacity: 1 },
    exit: { clipPath: 'circle(0% at 50% 50%)', scale: 0.9, opacity: 0 },
    transition: { duration: 0.52, ease: [0.34, 1.56, 0.64, 1] },
  },
  split: {
    initial: { clipPath: 'inset(50% 0 50% 0)', scale: 1.08, opacity: 1 },
    animate: { clipPath: 'inset(0% 0 0% 0)', scale: 1, opacity: 1 },
    exit: { clipPath: 'inset(50% 0 50% 0)', scale: 0.95, opacity: 0 },
    transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
  },
  rotate: {
    initial: { rotate: -15, scale: 0.72, opacity: 0 },
    animate: { rotate: 0, scale: 1, opacity: 1 },
    exit: { rotate: 15, scale: 0.72, opacity: 0 },
    transition: { type: 'spring', damping: 18, stiffness: 160, delay: 0.04 },
  },
  shatter: {
    initial: { clipPath: 'polygon(100% 0,100% 0,100% 100%,100% 100%)', scale: 1.06, opacity: 1 },
    animate: { clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)', scale: 1, opacity: 1 },
    exit: { clipPath: 'polygon(0 0,0 0,0 100%,0 100%)', scale: 0.96, opacity: 1 },
    transition: { duration: 0.46, ease: [0.77, 0, 0.175, 1] },
  },
};

const ORBITALS: OrbitalItem[] = [
  { C: DoodleMg, w: 36, style: { top: '6%', right: '4%' }, rotate: 15, dy: -6 },
  { C: DoodleCa, w: 32, style: { bottom: '10%', left: '2%' }, rotate: -12, dy: 6 },
  { C: DoodleStar, w: 22, style: { top: '32%', left: '0%' }, rotate: 20, dy: -5 },
  { C: DoodleLeaf, w: 28, style: { bottom: '22%', right: '4%' }, rotate: -8, dy: 7 },
];

const INGREDIENTS = [
  { Icon: DoodleMg, label: 'Magnesium', accent: '#14532d', fill: '#dcfce7' },
  { Icon: DoodleCa, label: 'Calcium', accent: '#15803d', fill: '#bbf7d0' },
  { Icon: DoodleLeaf, label: 'Natural', accent: '#166534', fill: '#a7f3d0' },
];

const AUTO_MS = 2600;

// ─── Marker Primitives ────────────────────────────────────────────────────────

function MarkerUnderline({
  color = '#1a1a1a',
  delay = 0,
  style = {},
}: {
  color?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.svg
      viewBox="0 0 220 18"
      preserveAspectRatio="none"
      aria-hidden
      style={{
        position: 'absolute',
        bottom: -4,
        left: '-2%',
        width: '104%',
        height: 18,
        pointerEvents: 'none',
        ...style,
      }}
    >
      <motion.path
        d="M3,10 Q55,5 110,9 Q165,13 217,8"
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.18"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      />
      <motion.path
        d="M3,8 Q55,3 110,7 Q165,11 217,6"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.05, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}

function MarkerArrow({
  dir = 'right',
  size = 44,
  color = '#1a1a1a',
  style = {},
}: {
  dir?: 'right' | 'down' | 'left';
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  const rotate = dir === 'down' ? 90 : dir === 'left' ? 180 : 0;
  return (
    <svg
      viewBox="0 0 52 24"
      width={size}
      height={size * 0.46}
      aria-hidden
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      <path
        d="M2,12 Q18,10 38,12"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M32,5 L42,12 L32,19"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MarkerCheck({
  size = 20,
  color = '#15803d',
  style = {},
}: {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 22 22" width={size} height={size} aria-hidden style={style}>
      <motion.path
        d="M3,11 L9,17 L19,5"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </svg>
  );
}

function MarkerX({
  size = 20,
  color = '#1a1a1a',
  style = {},
}: {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 22 22" width={size} height={size} aria-hidden style={style}>
      <path
        d="M3,3 L19,19 M19,3 L3,19"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarBurstMarker({
  size = 64,
  fill = '#fef08a',
  stroke = '#1a1a1a',
  label,
  style = {},
}: {
  size?: number;
  fill?: string;
  stroke?: string;
  label?: string;
  style?: React.CSSProperties;
}) {
  const pts = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * Math.PI) / 12;
    const r = i % 2 === 0 ? 46 : 32;
    return `${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden style={style}>
      <polygon
        points={pts}
        fill={fill}
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {label && (
        <text
          x="50"
          y="54"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontFamily: "'Permanent Marker',cursive",
            fontSize: 14,
            fill: stroke,
            fontWeight: 900,
          }}
        >
          {label}
        </text>
      )}
    </svg>
  );
}

function CrossHatch({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <defs>
        <pattern
          id="xhatch"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(25)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="10"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.12"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#xhatch)" />
    </svg>
  );
}

function MarkerDotNav({
  count,
  active,
  accent,
  fill,
  onDotClick,
}: {
  count: number;
  active: number;
  accent: string;
  fill: string;
  onDotClick: (i: number) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 18,
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          aria-label={`Slide ${i + 1}`}
          style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer' }}
        >
          <motion.div
            animate={{
              width: i === active ? 28 : 10,
              background: i === active ? fill : 'transparent',
            }}
            transition={{ type: 'spring', damping: 14, stiffness: 200 }}
            style={{
              height: 10,
              borderRadius: 2,
              border: `3px solid ${i === active ? accent : '#1a1a1a'}`,
              boxShadow:
                i === active ? `3px 3px 0 ${accent}` : '2px 2px 0 #1a1a1a',
            }}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Product Carousel ─────────────────────────────────────────────────────────
function ProductCarousel({ revealDone }: { revealDone: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const tickRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    tickRef.current = Date.now();
  }, []);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotX = useSpring(useTransform(rawY, [-1, 1], [6, -6]), {
    stiffness: 180,
    damping: 26,
  });
  const rotY = useSpring(useTransform(rawX, [-1, 1], [-6, 6]), {
    stiffness: 180,
    damping: 26,
  });

  const slide = SLIDES[activeIdx];
  const v = TV[slide.transition];

  useEffect(() => {
    if (!revealDone) return;
    function tick() {
      if (!paused) {
        if (Date.now() - tickRef.current >= AUTO_MS) {
          setActiveIdx((i) => (i + 1) % SLIDES.length);
          tickRef.current = Date.now();
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [revealDone, paused]);

  useEffect(() => {
    tickRef.current = Date.now();
  }, [activeIdx]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = tiltRef.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  }
  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
    setPaused(false);
  }

  return (
    <div style={{ position: 'relative', width: 380, maxWidth: '88vw' }}>

      {/* Thick marker border frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: revealDone ? 1 : 0, scale: revealDone ? 1 : 0.9 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{
          position: 'absolute',
          inset: -18,
          borderRadius: 12,
          border: '4.5px solid #1a1a1a',
          boxShadow: '7px 9px 0 #1a1a1a',
          background: slide.fill,
          zIndex: 0,
          transition: 'background 0.6s ease',
          overflow: 'hidden',
        }}
      >
        <CrossHatch style={{ color: '#1a1a1a', opacity: 1 }} />

        {/* Tag badge on frame */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`tag-${activeIdx}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute',
              top: -2,
              left: 14,
              background: slide.accent,
              border: '3px solid #1a1a1a',
              borderRadius: '0 0 6px 6px',
              padding: '4px 12px',
              zIndex: 10,
              boxShadow: '3px 3px 0 #1a1a1a',
            }}
          >
            <span
              style={{
                fontFamily: "'Permanent Marker',cursive",
                fontSize: 11,
                color: '#fff',
                letterSpacing: '0.1em',
              }}
            >
              {slide.tag}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Watermark index number */}
        <span
          style={{
            position: 'absolute',
            bottom: 8,
            right: 14,
            fontFamily: "'Permanent Marker',cursive",
            fontSize: 80,
            lineHeight: 1,
            color: slide.accent,
            opacity: 0.1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          0{activeIdx + 1}
        </span>
      </motion.div>

      {/* Left annotation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`al-${activeIdx}`}
          initial={{ opacity: 0, x: -20, rotate: 4 }}
          animate={{ opacity: 1, x: 0, rotate: -3 }}
          exit={{ opacity: 0, x: -14 }}
          transition={{ delay: 0.2 }}
          style={{
            position: 'absolute',
            left: -100,
            top: '22%',
            zIndex: 10,
            background: '#fef08a',
            border: '3px solid #1a1a1a',
            borderRadius: 6,
            padding: '5px 11px',
            boxShadow: '4px 4px 0 #1a1a1a',
            transform: 'rotate(-3deg)',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <MarkerCheck size={14} color={slide.accent} />
          <span
            style={{
              fontFamily: "'Permanent Marker',cursive",
              fontSize: 12,
              color: '#1a1a1a',
            }}
          >
            Zero fillers
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Right annotation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`ar-${activeIdx}`}
          initial={{ opacity: 0, x: 20, rotate: -3 }}
          animate={{ opacity: 1, x: 0, rotate: 2 }}
          exit={{ opacity: 0, x: 14 }}
          transition={{ delay: 0.35 }}
          style={{
            position: 'absolute',
            right: -92,
            top: '50%',
            zIndex: 10,
            background: '#bbf7d0',
            border: '3px solid #1a1a1a',
            borderRadius: 6,
            padding: '5px 11px',
            boxShadow: '4px 4px 0 #1a1a1a',
            transform: 'rotate(2deg)',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <MarkerCheck size={14} color={slide.accent} />
          <span
            style={{
              fontFamily: "'Permanent Marker',cursive",
              fontSize: 12,
              color: '#1a1a1a',
            }}
          >
            FSSAI cert
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Starburst */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -30 }}
        animate={{
          opacity: revealDone ? 1 : 0,
          scale: revealDone ? 1 : 0,
          rotate: revealDone ? -12 : -30,
        }}
        transition={{ ...spBouncy, delay: 1.1 }}
        style={{
          position: 'absolute',
          top: -36,
          right: -36,
          zIndex: 10,
        }}
      >
        <motion.div
          animate={{ rotate: [-12, -8, -12] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <StarBurstMarker size={72} fill="#fef08a" stroke="#1a1a1a" label="NEW!" />
        </motion.div>
      </motion.div>

      {/* Glow */}
      <motion.div
        animate={{
          background: `radial-gradient(circle, ${slide.glow} 0%, transparent 68%)`,
        }}
        transition={{ duration: 0.9 }}
        style={{
          position: 'absolute',
          inset: '5%',
          borderRadius: '50%',
          filter: 'blur(36px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Float + tilt */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ repeat: Infinity, duration: 4.4, ease: 'easeInOut', delay: 1 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <motion.div
          ref={tiltRef}
          onMouseEnter={() => setPaused(true)}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{
            rotateX: rotX,
            rotateY: rotY,
            transformStyle: 'preserve-3d',
            perspective: 900,
          }}
        >
          <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4' }}>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeIdx}
                style={{ position: 'absolute', inset: 0 }}
                initial={v.initial}
                animate={v.animate}
                exit={v.exit}
                transition={v.transition}
              >
                <Image
                  src={slide.src}
                  alt={slide.label}
                  fill
                  priority
                  style={{
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 28px 48px rgba(0,0,0,0.25))',
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Shimmer */}
      <AnimatePresence>
        <motion.div
          key={`sh-${activeIdx}`}
          initial={{ x: '-130%', opacity: 0 }}
          animate={{ x: '150%', opacity: 0.45 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 4,
            background:
              'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)',
          }}
        />
      </AnimatePresence>

      {/* Orbitals */}
      {ORBITALS.map((o, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: o.w,
            height: o.w,
            pointerEvents: 'none',
            zIndex: 5,
            ...o.style,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: revealDone ? 0.7 : 0, scale: revealDone ? 1 : 0 }}
          transition={{ ...spBouncy, delay: 0.7 + i * 0.12 }}
        >
          <motion.div
            animate={{
              y: [0, o.dy, 0],
              rotate: [o.rotate, o.rotate + (i % 2 === 0 ? 8 : -8), o.rotate],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.6 + i * 0.7,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          >
            <o.C style={{ width: o.w, height: o.w }} />
          </motion.div>
        </motion.div>
      ))}

      {/* Slide label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`lbl-${activeIdx}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
          style={{
            textAlign: 'center',
            marginTop: 28,
            position: 'relative',
            zIndex: 3,
          }}
        >
          <div style={{ display: 'inline-block', position: 'relative' }}>
            <span
              style={{
                fontFamily: "'Permanent Marker',cursive",
                fontSize: 18,
                color: '#1a1a1a',
                letterSpacing: '0.02em',
                position: 'relative',
              }}
            >
              {slide.label}
            </span>
            <MarkerUnderline color={slide.accent} delay={0} style={{ bottom: -2 }} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot nav */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        <MarkerDotNav
          count={SLIDES.length}
          active={activeIdx}
          accent={slide.accent}
          fill={slide.fill}
          onDotClick={setActiveIdx}
        />
      </div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export default function Herosection() {
  const [revealDone, setRevealDone] = useState(false);
  const words1 = ['Why', 'Are', 'We', 'Still', 'Tired'];
  const words2 = ['Despite', 'Eating', 'Every', 'Day?'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Kalam:wght@400;700&display=swap');

        .marker-hero {
          background: #f5f5ee;
          position: relative;
        }
        .marker-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
          z-index: 0;
        }

        .cta-btn-marker {
          font-family: 'Permanent Marker', cursive;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #15803d;
          color: #fff;
          font-size: 17px;
          letter-spacing: 0.04em;
          padding: 16px 32px;
          border-radius: 6px;
          border: 4px solid #1a1a1a;
          box-shadow: 6px 7px 0 #1a1a1a;
          text-decoration: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .cta-btn-marker:hover {
          transform: translate(-2px, -2px) rotate(-1deg);
          box-shadow: 8px 9px 0 #1a1a1a;
        }
        .cta-btn-marker:active {
          transform: translate(3px, 3px);
          box-shadow: 3px 4px 0 #1a1a1a;
        }
      `}</style>

      <section className="marker-hero min-h-[90vh] flex items-center overflow-hidden py-20 relative">

        <AnimatePresence>
          {!revealDone && (
            <LogoReveal key="reveal" onDone={() => setRevealDone(true)} />
          )}
        </AnimatePresence>

        {/* Ghost lettering background */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Permanent Marker',cursive",
              fontSize: 'clamp(120px, 22vw, 260px)',
              color: '#1a1a1a',
              opacity: 0.03,
              letterSpacing: '-0.04em',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            PLAINFUEL
          </span>
        </div>

        {/* Scattered marks */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          <MarkerArrow
            dir="left"
            size={52}
            color="#15803d"
            style={{
              position: 'absolute',
              top: '18%',
              right: '8%',
              opacity: 0.2,
              transform: 'rotate(-20deg)',
            }}
          />
          <MarkerX
            size={28}
            color="#1a1a1a"
            style={{
              position: 'absolute',
              bottom: '18%',
              left: '6%',
              opacity: 0.08,
              transform: 'rotate(10deg)',
            }}
          />
          <MarkerX
            size={18}
            color="#15803d"
            style={{
              position: 'absolute',
              top: '12%',
              left: '30%',
              opacity: 0.12,
              transform: 'rotate(-5deg)',
            }}
          />
          {[
            { top: '8%', left: '55%' },
            { top: '75%', left: '70%' },
            { top: '40%', left: '8%' },
            { top: '90%', left: '42%' },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                ...pos,
                width: 10 + i * 4,
                height: 10 + i * 4,
                borderRadius: '50%',
                background: '#1a1a1a',
                opacity: 0.05,
              }}
            />
          ))}
        </div>

        {/* Corner accents */}
        <motion.div
          className="absolute top-8 right-10 pointer-events-none"
          style={{ zIndex: 1 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: revealDone ? 0.3 : 0, x: revealDone ? 0 : 20 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <DoodleWave style={{ width: 80, height: 28 }} />
        </motion.div>
        <motion.div
          className="absolute bottom-12 left-8 pointer-events-none"
          style={{ zIndex: 1 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: revealDone ? 0.25 : 0, y: revealDone ? 0 : 20 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <DoodlePlant style={{ width: 36, height: 52 }} />
        </motion.div>

        {/* Main grid */}
        <div
          className="max-w-screen-xl mx-auto px-6 md:px-16 relative w-full"
          style={{ zIndex: 2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* ── LEFT ── */}
            <div className="order-2 lg:order-1">

              {/* Mission tag */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: revealDone ? 1 : 0, x: revealDone ? 0 : -30 }}
                transition={{ delay: 0.2, duration: 0.45 }}
                style={{ marginBottom: 24 }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 9,
                    background: '#dcfce7',
                    border: '3.5px solid #1a1a1a',
                    borderRadius: 4,
                    padding: '6px 16px',
                    boxShadow: '4px 4px 0 #1a1a1a',
                    transform: 'rotate(-1.5deg)',
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#15803d',
                      flexShrink: 0,
                      border: '2px solid #1a1a1a',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Permanent Marker',cursive",
                      fontSize: 13,
                      color: '#14532d',
                      letterSpacing: '0.1em',
                    }}
                  >
                    OUR MISSION
                  </span>
                </div>
              </motion.div>

              {/* Headline */}
              <h1 style={{ marginBottom: 24, marginTop: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.2em',
                    flexWrap: 'wrap',
                    marginBottom: 2,
                  }}
                >
                  {words1.map((w, i) => (
                    <motion.span
                      key={w}
                      initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
                      animate={{
                        opacity: revealDone ? 1 : 0,
                        y: revealDone ? 0 : 28,
                        filter: revealDone ? 'blur(0px)' : 'blur(6px)',
                      }}
                      transition={{
                        delay: 0.3 + i * 0.08,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{
                        fontFamily: "'Permanent Marker',cursive",
                        fontSize: 'clamp(2.8rem, 5.5vw, 4.4rem)',
                        lineHeight: 1.05,
                        color: '#1a1a1a',
                      }}
                    >
                      {w}
                    </motion.span>
                  ))}
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '0.2em',
                    flexWrap: 'wrap',
                    position: 'relative',
                  }}
                >
                  <SketchHighlight type="underline" delay={0.85}>
                    <span
                      style={{
                        display: 'inline-flex',
                        gap: '0.2em',
                        flexWrap: 'wrap',
                        position: 'relative',
                      }}
                    >
                      {words2.map((w, i) => (
                        <motion.span
                          key={w}
                          initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
                          animate={{
                            opacity: revealDone ? 1 : 0,
                            y: revealDone ? 0 : 28,
                            filter: revealDone ? 'blur(0px)' : 'blur(6px)',
                          }}
                          transition={{
                            delay: 0.45 + i * 0.09,
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          style={{
                            fontFamily: "'Permanent Marker',cursive",
                            fontSize: 'clamp(2.8rem, 5.5vw, 4.4rem)',
                            lineHeight: 1.05,
                            color: '#15803d',
                          }}
                        >
                          {w}
                        </motion.span>
                      ))}
                    </span>
                  </SketchHighlight>
                  <MarkerUnderline color="#15803d" delay={0.9} />
                </div>
              </h1>

              {/* Body — thick marker box */}
              <motion.div
                initial={{ opacity: 0, y: 16, rotate: -1.5 }}
                animate={{
                  opacity: revealDone ? 1 : 0,
                  y: revealDone ? 0 : 16,
                  rotate: revealDone ? -1 : -1.5,
                }}
                transition={{ delay: 0.65, duration: 0.5 }}
                style={{
                  position: 'relative',
                  background: '#fff',
                  border: '4px solid #1a1a1a',
                  borderRadius: 8,
                  padding: '18px 20px',
                  marginBottom: 28,
                  maxWidth: 490,
                  boxShadow: '5px 6px 0 #1a1a1a',
                  transform: 'rotate(-1deg)',
                  overflow: 'hidden',
                }}
              >
                <CrossHatch style={{ color: '#1a1a1a', opacity: 1 }} />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 6,
                    background: '#15803d',
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Kalam',cursive",
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#1a1a1a',
                    lineHeight: 1.7,
                    margin: 0,
                    paddingLeft: 12,
                    position: 'relative',
                  }}
                >
                  Modern meals fill the stomach. They don&apos;t always nourish the body. PlainFuel bridges the gap with{' '}
                  <span style={{ background: '#fef08a', padding: '0 3px' }}>
                    precise nutrition
                  </span>{' '}
                  for the modern Indian lifestyle.
                </p>
              </motion.div>

              {/* Ingredient badges */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  marginBottom: 32,
                }}
              >
                {INGREDIENTS.map(({ Icon, label, accent, fill }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20, scale: 0.8, rotate: -4 }}
                    animate={{
                      opacity: revealDone ? 1 : 0,
                      y: revealDone ? 0 : 20,
                      scale: revealDone ? 1 : 0.8,
                      rotate: revealDone ? (i % 2 === 0 ? -2 : 2) : -4,
                    }}
                    transition={{ ...spBouncy, delay: 0.75 + i * 0.1 }}
                    whileHover={{ scale: 1.08, rotate: 0, y: -3 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      background: fill,
                      border: '3px solid #1a1a1a',
                      borderRadius: 4,
                      padding: '7px 14px 7px 9px',
                      boxShadow: '3px 3px 0 #1a1a1a',
                      cursor: 'default',
                    }}
                  >
                    <Icon style={{ width: 20, height: 20 }} />
                    <span
                      style={{
                        fontFamily: "'Permanent Marker',cursive",
                        fontSize: 13,
                        color: accent,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA + label */}
              <motion.div
                initial={{ opacity: 0, scale: 0.75, rotate: -3 }}
                animate={{
                  opacity: revealDone ? 1 : 0,
                  scale: revealDone ? 1 : 0.75,
                  rotate: revealDone ? -1 : -3,
                }}
                transition={{ ...spBouncy, delay: 0.98 }}
                style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}
              >
                <a href="#" className="cta-btn-marker">
                  SEE WHAT&apos;S MISSING
                  <motion.span
                    animate={{ x: [0, 6, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.7,
                      ease: 'easeInOut',
                      delay: 1.6,
                    }}
                  >
                    <ArrowRight size={18} strokeWidth={3} />
                  </motion.span>
                </a>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: revealDone ? 1 : 0 }}
                  transition={{ delay: 1.4 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    marginLeft: 14,
                  }}
                >
                  <MarkerArrow dir="left" size={36} color="#15803d" />
                  <span
                    style={{
                      fontFamily: "'Permanent Marker',cursive",
                      fontSize: 12,
                      color: '#15803d',
                      letterSpacing: '0.06em',
                      transform: 'rotate(-3deg)',
                      display: 'inline-block',
                    }}
                  >
                    start here!
                  </span>
                </motion.div>
              </motion.div>
            </div>

            {/* ── RIGHT ── */}
            <div className="order-1 lg:order-2 flex justify-center relative">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: revealDone ? 1 : 0 }}
                transition={{ delay: 0.4, duration: 0.55 }}
              >
                <ProductCarousel revealDone={revealDone} />
              </motion.div>

              {/* Rotated side label */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: revealDone ? 0.4 : 0 }}
                transition={{ delay: 1.2 }}
                style={{
                  position: 'absolute',
                  right: -8,
                  top: '50%',
                  transform: 'translateY(-50%) rotate(90deg)',
                  transformOrigin: 'center',
                  fontFamily: "'Permanent Marker',cursive",
                  fontSize: 11,
                  color: '#1a1a1a',
                  letterSpacing: '0.14em',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                CHOOSE YOUR FORMULA →
              </motion.div>
            </div>

          </div>
        </div>

        {/* Bottom double rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: revealDone ? 1 : 0 }}
          transition={{ delay: 1.3, duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 5,
            background: '#1a1a1a',
            transformOrigin: 'left',
          }}
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: revealDone ? 1 : 0 }}
          transition={{ delay: 1.42, duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: 8,
            left: 0,
            right: 0,
            height: 2,
            background: '#15803d',
            transformOrigin: 'left',
          }}
        />
      </section>
    </>
  );
}