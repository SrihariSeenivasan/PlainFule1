'use client';

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, type TargetAndTransition, type Transition } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SketchHighlight from '../Elements/SketchHighlight';
import { LogoReveal, DoodleMg, DoodleCa, DoodleLeaf, DoodleStar, DoodleWave, DoodlePlant } from '../Elements/Loading1';

// ─── Types ────────────────────────────────────────────────────────────────────
type TransitionType = 'wipe' | 'iris' | 'split' | 'rotate' | 'shatter';

interface Slide {
  src: string;
  label: string;
  tag: string;
  accent: string;
  glow: string;
  transition: TransitionType;
}

// ─── Spring presets ───────────────────────────────────────────────────────────
const spBouncy = { type: 'spring' as const, damping: 10, stiffness: 200 };


// ─── Slide data ───────────────────────────────────────────────────────────────
// Replace src with your actual product image paths
const SLIDES: Slide[] = [
  {
    src: '/images/product_premium.png',
    label: 'Premium Formula', tag: 'Best Seller',
    accent: '#22c55e', glow: 'rgba(34,197,94,0.35)',
    transition: 'wipe',
  },
  {
    src: '/images/limepack.png',
    label: 'Classic Blend', tag: 'Essential',
    accent: '#16a34a', glow: 'rgba(22,163,74,0.30)',
    transition: 'iris',
  },
  {
    src: '/images/brownpack.png',
    label: 'Sport Edition', tag: 'High Performance',
    accent: '#4ade80', glow: 'rgba(74,222,128,0.35)',
    transition: 'split',
  },
  {
    src: '/images/redpack.png',
    label: 'Zen Recovery', tag: 'Sleep & Restore',
    accent: '#86efac', glow: 'rgba(134,239,172,0.30)',
    transition: 'rotate',
  },
  {
    src: '/images/orangepack.png',
    label: 'Daily Essentials', tag: 'Everyday',
    accent: '#15803d', glow: 'rgba(21,128,61,0.33)',
    transition: 'shatter',
  },
];

// ─── Clip-path variants ───────────────────────────────────────────────────────
type AnimationVariant = {
  initial: TargetAndTransition | undefined;
  animate: TargetAndTransition | undefined;
  exit: TargetAndTransition | undefined;
  transition: Transition | undefined;
};

const TV: Record<TransitionType, AnimationVariant> = {
  wipe: {
    initial:    { clipPath: 'inset(0 100% 0 0)',    scale: 1.06, opacity: 1 },
    animate:    { clipPath: 'inset(0 0% 0 0)',       scale: 1,    opacity: 1 },
    exit:       { clipPath: 'inset(0 0 0 100%)',     scale: 0.96, opacity: 1 },
    transition: { duration: 0.5, ease: [0.77, 0, 0.175, 1] },
  },
  iris: {
    initial:    { clipPath: 'circle(0% at 50% 50%)',  scale: 1.12, opacity: 1 },
    animate:    { clipPath: 'circle(75% at 50% 50%)', scale: 1,    opacity: 1 },
    exit:       { clipPath: 'circle(0% at 50% 50%)',  scale: 0.9,  opacity: 0 },
    transition: { duration: 0.52, ease: [0.34, 1.56, 0.64, 1] },
  },
  split: {
    initial:    { clipPath: 'inset(50% 0 50% 0)', scale: 1.08, opacity: 1 },
    animate:    { clipPath: 'inset(0% 0 0% 0)',   scale: 1,    opacity: 1 },
    exit:       { clipPath: 'inset(50% 0 50% 0)', scale: 0.95, opacity: 0 },
    transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
  },
  rotate: {
    initial:    { rotate: -15, scale: 0.72, opacity: 0 },
    animate:    { rotate: 0,   scale: 1,    opacity: 1 },
    exit:       { rotate: 15,  scale: 0.72, opacity: 0 },
    transition: { type: 'spring', damping: 18, stiffness: 160, delay: 0.04 },
  },
  shatter: {
    initial:    { clipPath: 'polygon(100% 0,100% 0,100% 100%,100% 100%)', scale: 1.06, opacity: 1 },
    animate:    { clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)',        scale: 1,    opacity: 1 },
    exit:       { clipPath: 'polygon(0 0,0 0,0 100%,0 100%)',              scale: 0.96, opacity: 1 },
    transition: { duration: 0.46, ease: [0.77, 0, 0.175, 1] },
  },
};

// ─── Orbital doodles ──────────────────────────────────────────────────────────
const ORBITALS = [
  { C: DoodleMg,   w: 36, style: { top: '6%',    right: '4%'  }, rotate: 15,  dy: -6 },
  { C: DoodleCa,   w: 32, style: { bottom: '10%',left: '2%'   }, rotate: -12, dy:  6 },
  { C: DoodleStar, w: 22, style: { top: '32%',   left: '0%'   }, rotate: 20,  dy: -5 },
  { C: DoodleLeaf, w: 28, style: { bottom: '22%',right: '4%'  }, rotate: -8,  dy:  7 },
] as const;

const INGREDIENTS = [
  { Icon: DoodleMg,   label: 'Magnesium', color: '#22c55e', bg: 'rgba(34,197,94,0.08)'  },
  { Icon: DoodleCa,   label: 'Calcium',   color: '#16a34a', bg: 'rgba(22,163,74,0.08)'  },
  { Icon: DoodleLeaf, label: 'Natural',   color: '#22c55e', bg: 'rgba(34,197,94,0.08)'  },
];

const AUTO_MS = 2400;

// ─── Product Carousel (clean — no UI chrome) ──────────────────────────────────
function ProductCarousel({ revealDone }: { revealDone: boolean }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused]       = useState(false);
  const tickRef = useRef<number>(0);
  const rafRef  = useRef<number>(0);
  const tiltRef = useRef<HTMLDivElement>(null);

  // Initialize tickRef after mount to avoid impure function during render
  useEffect(() => {
    tickRef.current = Date.now();
  }, []);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotX = useSpring(useTransform(rawY, [-1, 1], [8, -8]), { stiffness: 180, damping: 24 });
  const rotY = useSpring(useTransform(rawX, [-1, 1], [-8, 8]), { stiffness: 180, damping: 24 });

  const slide = SLIDES[activeIdx];
  const v     = TV[slide.transition];

  // Auto-advance via RAF
  useEffect(() => {
    if (!revealDone) return;
    function tick() {
      if (!paused) {
        const elapsed = Date.now() - tickRef.current;
        if (elapsed >= AUTO_MS) {
          setActiveIdx(i => (i + 1) % SLIDES.length);
          tickRef.current = Date.now();
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [revealDone, paused]);

  // Reset tick on index change
  useEffect(() => { tickRef.current = Date.now(); }, [activeIdx]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = tiltRef.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set(((e.clientX - r.left) / r.width  - 0.5) * 2);
    rawY.set(((e.clientY - r.top)  / r.height - 0.5) * 2);
  }
  function onMouseLeave() {
    rawX.set(0); rawY.set(0); setPaused(false);
  }

  return (
    <div
      style={{ position: 'relative', width: 400, maxWidth: '90vw' }}
    >
      {/* Glow disc */}
      <motion.div
        animate={{ background: `radial-gradient(circle, ${slide.glow} 0%, transparent 68%)` }}
        transition={{ duration: 1 }}
        style={{
          position: 'absolute', inset: '10%', top: '20%',
          borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none',
          animation: 'none',
        }}
      />

      {/* Float wrapper */}
      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ repeat: Infinity, duration: 4.4, ease: 'easeInOut', delay: 1 }}
        style={{ position: 'relative' }}
      >
        {/* Tilt + carousel frame */}
        <motion.div
          ref={tiltRef}
          onMouseEnter={() => setPaused(true)}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 900 }}
        >
          {/* Image frame — NO border-radius, NO overflow clip */}
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
                  className="object-contain"
                  style={{ filter: 'drop-shadow(0 32px 56px rgba(0,0,0,0.2))' }}
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Shimmer on slide change */}
      <AnimatePresence>
        <motion.div
          key={`shimmer-${activeIdx}`}
          initial={{ x: '-130%', opacity: 0 }}
          animate={{ x: '150%',  opacity: 0.38 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4,
            background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)',
          }}
        />
      </AnimatePresence>

      {/* Orbital doodles */}
      {ORBITALS.map((o, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', width: o.w, height: o.w, pointerEvents: 'none', ...o.style }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: revealDone ? 0.6 : 0, scale: revealDone ? 1 : 0 }}
          transition={{ ...spBouncy, delay: 0.7 + i * 0.12 }}
        >
          <motion.div
            animate={{ y: [0, o.dy, 0], rotate: [o.rotate, o.rotate + (i % 2 === 0 ? 8 : -8), o.rotate] }}
            transition={{ repeat: Infinity, duration: 3.6 + i * 0.7, ease: 'easeInOut', delay: i * 0.4 }}
          >
            <o.C style={{ width: o.w, height: o.w }} />
          </motion.div>
        </motion.div>
      ))}

      {/* Slide label — minimal, below image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          style={{ textAlign: 'center', marginTop: 20 }}
        >
          <div style={{
            fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: slide.accent, marginBottom: 3,
          }}>
            {slide.tag}
          </div>
          <div style={{
            fontSize: '0.85rem', fontWeight: 600,
            color: 'var(--foreground)', opacity: 0.6,
          }}>
            {slide.label}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export default function Herosection() {
  const [revealDone, setRevealDone] = useState(false);
  const words1 = ['The', 'Motto:'];
  const words2 = ['Bridge', 'the', 'Gap.'];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden py-20 bg-[var(--background)]">

      <AnimatePresence>
        {!revealDone && <LogoReveal key="reveal" onDone={() => setRevealDone(true)} />}
      </AnimatePresence>

      {/* Dot-grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(196,162,58,0.13) 1.2px, transparent 1.2px)',
        backgroundSize: '28px 28px', opacity: 0.5,
      }} />

      {/* Ambient blobs */}
      <motion.div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full -mr-64 -mt-64"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.18), transparent 70%)', filter: 'blur(80px)' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full -ml-48 -mb-48"
        style={{ background: 'radial-gradient(circle, rgba(21,128,61,0.14), transparent 70%)', filter: 'blur(70px)' }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
      />

      {/* Corner doodles */}
      <motion.div className="absolute top-8 right-10 pointer-events-none"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: revealDone ? 0.22 : 0, x: revealDone ? 0 : 20 }}
        transition={{ delay: 1, duration: 0.6 }}>
        <DoodleWave style={{ width: 80, height: 30 }} />
      </motion.div>
      <motion.div className="absolute bottom-12 left-8 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: revealDone ? 0.18 : 0, y: revealDone ? 0 : 20 }}
        transition={{ delay: 1.1, duration: 0.6 }}>
        <DoodlePlant style={{ width: 38, height: 54 }} />
      </motion.div>

      <div className="max-w-screen-xl mx-auto px-6 md:px-16 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT ── */}
          <div className="order-2 lg:order-1">

            {/* Tag pill */}
            <motion.div
              initial={{ opacity: 0, x: -28, filter: 'blur(6px)' }}
              animate={{ opacity: revealDone ? 1 : 0, x: revealDone ? 0 : -28, filter: revealDone ? 'blur(0px)' : 'blur(6px)' }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', borderRadius: 999,
                border: '1.5px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.07)',
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: '#16a34a',
                textTransform: 'uppercase', marginBottom: 28,
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}
              />
              Our Mission
            </motion.div>

            {/* Headline */}
            <h1 className="font-playfair text-5xl md:text-[4.2rem] font-black mb-6 leading-[1.08]">
              <div style={{ display: 'flex', gap: '0.28em', flexWrap: 'wrap', marginBottom: '0.1em' }}>
                {words1.map((w, i) => (
                  <motion.span key={w}
                    initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
                    animate={{ opacity: revealDone ? 1 : 0, y: revealDone ? 0 : 32, filter: revealDone ? 'blur(0px)' : 'blur(8px)' }}
                    transition={{ delay: 0.35 + i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >{w}</motion.span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.28em', flexWrap: 'wrap' }}>
                <SketchHighlight type="underline" delay={0.88}>
                  <span style={{ display: 'inline-flex', gap: '0.28em', flexWrap: 'wrap' }}>
                    {words2.map((w, i) => (
                      <motion.span key={w} className="gradient-text"
                        initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
                        animate={{ opacity: revealDone ? 1 : 0, y: revealDone ? 0 : 32, filter: revealDone ? 'blur(0px)' : 'blur(8px)' }}
                        transition={{ delay: 0.5 + i * 0.09, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      >{w}</motion.span>
                    ))}
                  </span>
                </SketchHighlight>
              </div>
            </h1>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: revealDone ? 1 : 0, y: revealDone ? 0 : 18 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-lg md:text-xl text-[var(--foreground)]/55 mb-8 max-w-lg leading-relaxed"
            >
              We identified the precise nutritional deficits in the modern Indian diet.
              PlainFuel isn&apos;t just another supplement; it&apos;s the missing piece of your daily nutrition,
              packaged in a precise, invisible daily pouch.
            </motion.p>

            {/* Ingredient badges */}
            <div className="flex flex-wrap gap-3 mb-10">
              {INGREDIENTS.map(({ Icon, label, color, bg }, i) => (
                <motion.div key={label}
                  initial={{ opacity: 0, y: 22, scale: 0.82 }}
                  animate={{ opacity: revealDone ? 1 : 0, y: revealDone ? 0 : 22, scale: revealDone ? 1 : 0.82 }}
                  transition={{ ...spBouncy, delay: 0.78 + i * 0.1 }}
                  whileHover={{ scale: 1.07, y: -2 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    background: bg, border: `1.5px solid ${color}33`,
                    borderRadius: 999, padding: '5px 13px 5px 7px',
                    position: 'relative', overflow: 'hidden', cursor: 'default',
                  }}
                >
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: revealDone ? '220%' : '-100%' }}
                    transition={{ delay: 1.05 + i * 0.12, duration: 0.65, ease: 'easeOut' }}
                    style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, transparent, ${color}20, transparent)`, pointerEvents: 'none' }}
                  />
                  <Icon style={{ width: 20, height: 20 }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color, letterSpacing: '0.06em' }}>{label}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{ opacity: revealDone ? 1 : 0, scale: revealDone ? 1 : 0.72 }}
              transition={{ ...spBouncy, delay: 1.0 }}
            >
              <motion.button
                className="glass-green px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-[var(--green-mid)] transition-colors duration-300"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={spBouncy}
              >
                EXPLORE OUR STORY
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut', delay: 1.6 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.button>
            </motion.div>
          </div>

          {/* ── RIGHT ── */}
          <div className="order-1 lg:order-2 flex justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: revealDone ? 1 : 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <ProductCarousel revealDone={revealDone} />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}