'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// ── Design tokens ──────────────────────────────────────────────────────────────
const G = {
  forest: '#0f4a23',
  mid: '#15803d',
  leaf: '#22c55e',
  mist: '#f0fdf4',
  paper: '#fafaf7',
  ink: '#111410',
  ash: '#6b7a6e',
  white: '#ffffff',
};

// ── Carousel images (swap src to your actual product images) ──────────────────
const SLIDES = [
  {
    src: '/images/Products/product_premium.png',
    alt: 'PlainFuel Lemon Lime',
    label: 'Lemon Lime',
    accent: '#d4f5e2',
    glow: 'rgba(34,197,94,0.22)',
    tag: '01',
  },
  {
    src: '/images/Products/product.png',
    alt: 'PlainFuel Berry Blast',
    label: 'Berry Blast',
    accent: '#ddf0ff',
    glow: 'rgba(56,189,248,0.18)',
    tag: '02',
  },
];

// ── Tiny SVG deco ─────────────────────────────────────────────────────────────
function Squiggle() {
  return (
    <svg viewBox="0 0 160 18" fill="none"
      style={{ position: 'absolute', bottom: -6, left: 0, width: '100%', height: 14, pointerEvents: 'none' }}>
      <path d="M2 10 Q20 2 40 10 Q60 18 80 10 Q100 2 120 10 Q140 18 158 10"
        stroke={G.leaf} strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.9" />
    </svg>
  );
}

function DotGrid() {
  return (
    <svg viewBox="0 0 120 120" width={120} height={120} aria-hidden
      style={{ position: 'absolute', opacity: 0.07, pointerEvents: 'none' }}>
      {Array.from({ length: 6 }, (_, r) =>
        Array.from({ length: 6 }, (_, c) => (
          <circle key={`${r}-${c}`} cx={10 + c * 20} cy={10 + r * 20} r={2.5} fill={G.mid} />
        ))
      )}
    </svg>
  );
}

// ── Image Carousel (right side) ───────────────────────────────────────────────
function ProductCarousel() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const timerRef = useRef<any>(null);

  const advance = (next: number) => {
    setDir(next > idx ? 1 : -1);
    setIdx(next);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDir(1);
      setIdx(i => (i + 1) % SLIDES.length);
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const slide = SLIDES[idx];

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 60, scale: 0.93 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d * -60, scale: 0.93 }),
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 460, margin: '0 auto' }}>

      {/* Bare canvas — no card, no border */}
      <div style={{ position: 'relative', minHeight: 460, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

        {/* Ambient glow blob behind product */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`glow-${idx}`}
            custom={dir}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '72%', height: '72%',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${slide.glow} 0%, transparent 70%)`,
              filter: 'blur(40px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        </AnimatePresence>

        {/* Product image */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`img-${idx}`}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', zIndex: 2, paddingBottom: 32 }}
          >
            <motion.img
              src={slide.src}
              alt={slide.alt}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '100%',
                maxWidth: 340,
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 28px 52px rgba(15,74,35,0.30))',
                display: 'block',
              }}
            />
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Decorative dot grid — bottom right */}
      <div style={{ position: 'absolute', bottom: -20, right: -20, zIndex: -1 }}>
        <DotGrid />
      </div>
    </div>
  );
}

// ── Left content ──────────────────────────────────────────────────────────────
function AboutLeft({ inView }: { inView: boolean }) {
  const lines = [
    { delay: 0.05, text: 'PlainFuel is a daily nutrition supplement designed to simplify how we meet our body\'s needs.' },
    { delay: 0.15, text: 'Instead of taking multiple supplements or tracking different nutrients, PlainFuel brings everything together in one scoop. It combines protein, essential micronutrients, and fiber in a structured way so that your body gets consistent support every day.' },
    { delay: 0.25, text: 'This is not just another protein powder. It is designed to act as a daily nutrition system — something you can rely on without overthinking.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.45 }}
        style={{ marginBottom: 20 }}
      >
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          fontFamily: "'DM Mono', monospace",
          fontSize: 10.5, color: G.mid,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          fontWeight: 600,
        }}>
          <svg viewBox="0 0 16 16" width={14} height={14} fill="none">
            <circle cx="8" cy="8" r="6" stroke={G.leaf} strokeWidth="1.8" />
            <circle cx="8" cy="8" r="2.5" fill={G.leaf} />
          </svg>
          Daily Nutrition
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.58, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 8 }}
      >
        <h2 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(2rem, 3.4vw, 3.1rem)',
          fontWeight: 900,
          color: G.ink,
          lineHeight: 1.1,
          letterSpacing: '-0.025em',
          margin: 0,
        }}>
          PlainFuel
        </h2>
      </motion.div>

      {/* Sub-heading with squiggle */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.56, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 36, position: 'relative', display: 'inline-block' }}
      >
        <h3 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)',
          fontWeight: 700,
          fontStyle: 'italic',
          color: G.mid,
          lineHeight: 1.15,
          margin: 0,
          paddingBottom: 10,
          display: 'inline',
        }}>
          A Simple Approach to Daily Nutrition
        </h3>
        <Squiggle />
      </motion.div>

      {/* Thin rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.22 }}
        style={{
          transformOrigin: 'left',
          height: 1.5,
          background: `linear-gradient(90deg, ${G.leaf} 0%, ${G.leaf}44 55%, transparent 100%)`,
          marginBottom: 32,
          marginTop: 12,
        }}
      />

      {/* "What is PlainFuel?" label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.28 }}
        style={{ marginBottom: 18 }}
      >
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11, color: G.forest,
          letterSpacing: '0.13em', textTransform: 'uppercase',
          fontWeight: 600,
          background: G.mist,
          padding: '5px 12px',
          borderRadius: 4,
          border: `1px solid ${G.leaf}66`,
        }}>
          What is PlainFuel?
        </span>
      </motion.div>

      {/* Body paragraphs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {lines.map(({ delay, text }, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.52, delay: 0.3 + delay, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(14px, 1.6vw, 15.5px)',
              color: '#3a4a3c',
              lineHeight: 1.82,
              margin: 0,
            }}
          >
            {text}
          </motion.p>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.48, delay: 0.62 }}
        style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}
      >
        <a href="#order" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: G.mid,
          color: G.white,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13.5, fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          padding: '13px 28px',
          borderRadius: 10,
          border: `2.5px solid ${G.forest}`,
          boxShadow: `5px 6px 0 ${G.forest}`,
          textDecoration: 'none',
          transition: 'transform 0.12s, box-shadow 0.12s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = `7px 8px 0 ${G.forest}`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `5px 6px 0 ${G.forest}`; }}
        >
          Get PlainFuel
          <svg viewBox="0 0 16 16" width={14} height={14} fill="none">
            <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex' }}>
            {['#3d9a5c', '#2d7a46', '#4aaf6e'].map((bg, i) => (
              <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', border: `2.5px solid ${G.white}`, background: bg, marginLeft: i > 0 ? -8 : 0, boxShadow: '0 1px 4px rgba(15,74,35,0.18)' }} />
            ))}
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: G.ash }}>1,200+ daily users</span>
        </div>
      </motion.div>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function PlainFuelAbout() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500;600&display=swap');

        .pfa-section {
          background: #fafaf7;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(64px,10vw,112px) clamp(24px,6vw,80px);
          position: relative;
          overflow: hidden;
        }
        .pfa-section::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(circle at 15% 25%, rgba(34,197,94,0.06) 0%, transparent 50%),
            radial-gradient(circle at 85% 75%, rgba(15,74,35,0.04) 0%, transparent 50%),
            linear-gradient(rgba(21,128,61,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(21,128,61,0.03) 1px, transparent 1px);
          background-size: auto, auto, 44px 44px, 44px 44px;
          pointer-events: none;
        }
        .pfa-inner {
          max-width: 1120px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(48px, 7vw, 96px);
          align-items: center;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 860px) {
          .pfa-inner {
            grid-template-columns: 1fr !important;
            gap: 52px !important;
          }
        }
      `}</style>

      <section className="pfa-section">
        <div className="pfa-inner" ref={sectionRef}>
          {/* LEFT: text */}
          <AboutLeft inView={inView} />

          {/* RIGHT: carousel */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductCarousel />
          </motion.div>
        </div>
      </section>
    </>
  );
}