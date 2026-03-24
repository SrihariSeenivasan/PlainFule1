'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from 'framer-motion';

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  forest: '#0f4a23',
  mid: '#15803d',
  leaf: '#22c55e',
  lime: '#a3e635',
  mist: '#f0fdf4',
  paper: '#fffef9',
  cream: '#fafaf5',
  ink: '#0d1f10',
  ash: '#5a6b5c',
  white: '#ffffff',
  yellow: '#fef08a',
  amber: '#fbbf24',
};

// ── Slides ────────────────────────────────────────────────────────────────────
const SLIDES = [
  { src: '/images/Products/product_premium.png', alt: 'Lemon Lime', label: 'Lemon Lime', tag: '01', accent: '#bbf7d0', spot: 'rgba(34,197,94,0.18)' },
  { src: '/images/Products/product.png', alt: 'Berry Blast', label: 'Berry Blast', tag: '02', accent: '#bae6fd', spot: 'rgba(56,189,248,0.15)' },
];

// ── Scattered background hand-drawn marks ─────────────────────────────────────
function BgMarks() {
  return (
    <svg viewBox="0 0 1200 820" fill="none" aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>

      {/* Large loose circle — top right */}
      <ellipse cx="1050" cy="130" rx="88" ry="82" stroke={C.leaf} strokeWidth="2"
        strokeDasharray="9 6" opacity="0.18" transform="rotate(-8 1050 130)" />

      {/* Wobbly circle — bottom left */}
      <path d="M110 640 Q145 600 175 635 Q205 668 172 700 Q138 730 108 700 Q76 668 110 640Z"
        stroke={C.mid} strokeWidth="2" fill="none" opacity="0.12" />

      {/* Double-line underline squiggle — center-bottom */}
      <path d="M380 760 Q430 750 480 760 Q530 770 580 760 Q630 750 680 760"
        stroke={C.leaf} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.2" />
      <path d="M390 772 Q440 763 490 772 Q540 781 590 772 Q635 763 675 772"
        stroke={C.leaf} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.12" />

      {/* Floating asterisk — top left */}
      {[0, 60, 120].map(a => (
        <line key={a} x1={68 + Math.cos(a * Math.PI / 180) * 14} y1={72 + Math.sin(a * Math.PI / 180) * 14}
          x2={68 - Math.cos(a * Math.PI / 180) * 14} y2={72 - Math.sin(a * Math.PI / 180) * 14}
          stroke={C.leaf} strokeWidth="2.2" strokeLinecap="round" opacity="0.35" />
      ))}

      {/* 4-point star — bottom right */}
      <path d="M1090 680 L1093 670 L1100 668 L1093 665 L1090 655 L1087 665 L1080 668 L1087 670Z"
        fill={C.leaf} opacity="0.28" />

      {/* Tiny x marks */}
      <path d="M230 180 L238 188 M238 180 L230 188" stroke={C.leaf} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M950 560 L958 568 M958 560 L950 568" stroke={C.mid} strokeWidth="2" strokeLinecap="round" opacity="0.22" />
      <path d="M60 340 L66 346 M66 340 L60 346" stroke={C.leaf} strokeWidth="1.8" strokeLinecap="round" opacity="0.28" />

      {/* Dot cluster — right mid */}
      {[0, 1, 2].map(r => [0, 1, 2].map(c => (
        <circle key={`${r}${c}`} cx={1130 + c * 14} cy={400 + r * 14} r="2.2" fill={C.mid} opacity="0.12" />
      )))}

      {/* Wavy vertical line — left edge */}
      <path d="M28 200 Q36 240 28 280 Q20 320 28 360 Q36 400 28 440"
        stroke={C.leaf} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.14" />

      {/* Graph-paper light grid */}
      {Array.from({ length: 14 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 60} x2="1200" y2={i * 60}
          stroke={C.mid} strokeWidth="0.5" opacity="0.04" />
      ))}
      {Array.from({ length: 22 }, (_, i) => (
        <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="820"
          stroke={C.mid} strokeWidth="0.5" opacity="0.04" />
      ))}
    </svg>
  );
}

// ── Doodle pill badge ─────────────────────────────────────────────────────────
function DoodlePill({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: "'DM Mono', monospace",
      fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase',
      color: C.forest, fontWeight: 600,
      background: C.mist,
      border: `2px solid ${C.forest}`,
      borderRadius: 99, padding: '5px 14px',
      boxShadow: `3px 3px 0 ${C.forest}`,
      ...style,
    }}>{children}</span>
  );
}

// ── Scribble underline ────────────────────────────────────────────────────────
function ScribbleUnder({ color = C.leaf, wide = false }: { color?: string; wide?: boolean }) {
  return (
    <svg viewBox="0 0 220 16" fill="none" aria-hidden
      style={{ position: 'absolute', bottom: -10, left: 0, width: wide ? '100%' : '105%', height: 14, pointerEvents: 'none' }}>
      <path d="M4 10 Q30 3 58 10 Q86 17 114 10 Q142 3 170 10 Q196 17 216 10"
        stroke={color} strokeWidth="3.8" strokeLinecap="round" fill="none" />
      <path d="M10 14 Q50 10 90 14 Q130 18 170 14"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35" />
    </svg>
  );
}

// ── Highlight blob (marker-pen style) ────────────────────────────────────────
function MarkerHighlight({ children, color = C.yellow }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <span style={{
        position: 'absolute', inset: '-2px -4px',
        background: color, borderRadius: 2, zIndex: 0, transform: 'rotate(-0.6deg) scaleX(1.04)',
        opacity: 0.55,
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </span>
  );
}

// ── Hand-drawn arrow SVG ──────────────────────────────────────────────────────
function HandArrow({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 56 32" fill="none" width={56} height={32} aria-hidden style={style}>
      <path d="M4 20 Q16 6 36 10 Q46 12 50 18"
        stroke={C.mid} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M44 12 L52 20 L42 22" stroke={C.mid} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// ── Notebook lines decoration ─────────────────────────────────────────────────
function NotebookLines() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {[80, 108, 136, 164, 192, 220].map(y => (
        <div key={y} style={{
          position: 'absolute', left: 0, right: 0, top: y,
          height: 1, background: `${C.mid}`, opacity: 0.05,
        }} />
      ))}
      {/* Red margin line */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 52,
        width: 1, background: '#fca5a5', opacity: 0.3,
      }} />
    </div>
  );
}

// ── Product carousel ──────────────────────────────────────────────────────────
function ProductCarousel() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-120, 120], [5, -5]);
  const rotateY = useTransform(mouseX, [-120, 120], [-5, 5]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => { setDir(1); setIdx(i => (i + 1) % SLIDES.length); }, 4200);
  };
  useEffect(() => { resetTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  const advance = (next: number) => { setDir(next > idx ? 1 : -1); setIdx(next); resetTimer(); };
  const slide = SLIDES[idx];

  return (
    <div style={{ position: 'relative' }}>

      {/* Floating label top-right */}
      <motion.div
        animate={{ rotate: [0, 2, -2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: -18, right: -12, zIndex: 10,
          background: C.yellow,
          border: `2px solid ${C.ink}`,
          boxShadow: `3px 3px 0 ${C.ink}`,
          borderRadius: 4, padding: '4px 10px',
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.ink,
          transform: 'rotate(4deg)',
        }}
      >New Drop ✦</motion.div>

      {/* 3-D tilt card — hard doodle shadow */}
      <motion.div
        onMouseMove={e => {
          const r = e.currentTarget.getBoundingClientRect();
          mouseX.set(e.clientX - r.left - r.width / 2);
          mouseY.set(e.clientY - r.top - r.height / 2);
        }}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
        style={{ perspective: 800 }}
      >
        <motion.div style={{
          rotateX, rotateY, transformStyle: 'preserve-3d',
          background: C.paper,
          border: `2.5px solid ${C.forest}`,
          boxShadow: `8px 10px 0 ${C.forest}`,
          borderRadius: 18,
          overflow: 'hidden',
          minHeight: 440,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>

          {/* Notebook lines inside card */}
          <NotebookLines />

          {/* Doodle corner spirals */}
          <svg viewBox="0 0 40 40" width={36} height={36} fill="none" aria-hidden
            style={{ position: 'absolute', top: 10, left: 10, opacity: 0.18 }}>
            <path d="M20 20 Q20 8 30 8 Q38 8 38 18 Q38 30 26 32 Q14 34 10 24 Q6 12 18 10"
              stroke={C.mid} strokeWidth="2" fill="none" />
          </svg>
          <svg viewBox="0 0 40 40" width={36} height={36} fill="none" aria-hidden
            style={{ position: 'absolute', bottom: 64, right: 10, opacity: 0.15, transform: 'scaleX(-1)' }}>
            <path d="M20 20 Q20 8 30 8 Q38 8 38 18 Q38 30 26 32 Q14 34 10 24 Q6 12 18 10"
              stroke={C.mid} strokeWidth="2" fill="none" />
          </svg>

          {/* Slide tag */}
          <div style={{
            position: 'absolute', top: 14, right: 16,
            fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.ash,
            letterSpacing: '0.14em', zIndex: 5,
          }}>{slide.tag}/{SLIDES.length.toString().padStart(2, '0')}</div>

          {/* Ambient glow */}
          <AnimatePresence mode="wait">
            <motion.div key={`g-${idx}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              style={{
                position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                background: `radial-gradient(ellipse at 50% 55%, ${slide.spot} 0%, transparent 68%)`,
              }}
            />
          </AnimatePresence>

          {/* Orbit ring */}
          <svg viewBox="0 0 300 300" fill="none"
            style={{
              position: 'absolute', width: 270, height: 270, top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)', zIndex: 1, pointerEvents: 'none'
            }}>
            <ellipse cx="150" cy="150" rx="130" ry="120"
              stroke={C.leaf} strokeWidth="1.5" strokeDasharray="7 5" opacity="0.22"
              transform="rotate(-15 150 150)" />
          </svg>

          {/* Product image */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={`i-${idx}`}
              initial={{ opacity: 0, x: dir * 50, rotate: dir * 4 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: dir * -50, rotate: dir * -4 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'relative', zIndex: 2, padding: '36px 28px 60px' }}
            >
              <motion.img
                src={slide.src} alt={slide.alt}
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '100%', maxWidth: 270, height: 'auto',
                  objectFit: 'contain', display: 'block',
                  filter: `drop-shadow(0 24px 48px rgba(15,74,35,0.28))`,
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Flavor label + dots */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            borderTop: `1.5px dashed ${C.forest}28`,
            background: `linear-gradient(to right, ${slide.accent}55, transparent)`,
            padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 5
          }}>
            <AnimatePresence mode="wait">
              <motion.span key={`l-${idx}`}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 700,
                  fontStyle: 'italic', color: C.forest
                }}>
                {slide.label}
              </motion.span>
            </AnimatePresence>
            <div style={{ display: 'flex', gap: 6 }}>
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => advance(i)} aria-label={`Slide ${i + 1}`}
                  style={{
                    width: i === idx ? 20 : 7, height: 7, borderRadius: 4,
                    border: `2px solid ${C.forest}`, cursor: 'pointer', padding: 0,
                    background: i === idx ? C.mid : 'transparent', transition: 'all 0.25s'
                  }} />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
        {[['1.2K+', 'Users'], ['100%', 'Clean'], ['1', 'Scoop']].map(([v, l], i) => (
          <div key={i} style={{
            flex: 1, background: C.mist,
            border: `1.5px solid ${C.forest}22`,
            borderTop: 'none',
            padding: '10px 12px',
            borderRadius: i === 0 ? '0 0 0 12px' : i === 2 ? '0 0 12px 0' : 0,
          }}>
            <div style={{
              fontFamily: "'Fraunces', serif", fontSize: 20,
              fontWeight: 900, color: C.forest, lineHeight: 1
            }}>{v}</div>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 9.5,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: C.ash, marginTop: 3
            }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Hand-drawn arrow pointing up at card */}
      <HandArrow style={{ position: 'absolute', bottom: -44, left: 16, transform: 'rotate(160deg)', opacity: 0.4 }} />
    </div>
  );
}

// ── Left content ──────────────────────────────────────────────────────────────
function AboutLeft({ inView }: { inView: boolean }) {
  const paragraphs = [
    "PlainFuel is a daily nutrition supplement designed to simplify how we meet our body’s needs.",
    "Instead of taking multiple supplements or tracking different nutrients, PlainFuel brings everything together in one scoop. It combines protein, essential micronutrients, and fiber in a structured way so that your body gets consistent support every day.",
    "This is not just another protein powder. It is designed to act as a daily nutrition system — something you can rely on without overthinking.",
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Eyebrow — stamp style */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.45, type: 'spring', stiffness: 200 }}
        style={{ marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}
      >
        <DoodlePill>
          <svg viewBox="0 0 14 14" width={12} height={12} fill="none">
            <circle cx="7" cy="7" r="5" stroke={C.leaf} strokeWidth="1.8" />
            <circle cx="7" cy="7" r="2" fill={C.leaf} />
          </svg>
          Daily Nutrition
        </DoodlePill>
        {/* Wavy dots trail */}
        <svg viewBox="0 0 48 12" width={44} height={12} fill="none" aria-hidden>
          {[0, 1, 2, 3].map(i => (
            <circle key={i} cx={6 + i * 13} cy={6 + Math.sin(i) * 3} r="2.5"
              fill={C.leaf} opacity={0.18 + i * 0.16} />
          ))}
        </svg>
      </motion.div>

      {/* MAIN HEADING — Plain + Fuel on one line */}
      <div style={{ overflow: 'hidden', marginBottom: 20 }}>
        <motion.h2
          initial={{ y: 80, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.68, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(3rem, 6.5vw, 5.2rem)',
            fontWeight: 900, lineHeight: 0.88,
            letterSpacing: '-0.035em', margin: 0,
            display: 'flex', alignItems: 'baseline',
            gap: 'clamp(8px,1.2vw,18px)', flexWrap: 'nowrap',
          }}
        >
          <span style={{ color: C.ink }}>Plain</span>
          <span style={{ color: C.mid, fontStyle: 'italic' }}>Fuel</span>
        </motion.h2>
      </div>

      {/* Sub-heading with double scribble underline */}
      <motion.div
        initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.56, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', display: 'inline-block', marginBottom: 36 }}
      >
        <h3 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(1.1rem, 2.2vw, 1.7rem)',
          fontWeight: 700, fontStyle: 'italic', color: C.mid,
          margin: 0, lineHeight: 1.2, paddingBottom: 14,
        }}>
          A <MarkerHighlight color={C.yellow}>Simple</MarkerHighlight> Approach to Daily Nutrition
        </h3>
        <ScribbleUnder color={C.leaf} wide />
      </motion.div>



      {/* "What is PlainFuel?" — torn paper badge */}
      <motion.div
        initial={{ opacity: 0, rotate: -4, scale: 0.9 }} animate={inView ? { opacity: 1, rotate: 0, scale: 1 } : {}}
        transition={{ delay: 0.3, type: 'spring', stiffness: 220 }}
        style={{ marginBottom: 20, display: 'inline-block' }}
      >
        <span style={{
          display: 'inline-block',
          fontFamily: "'DM Mono', monospace",
          fontSize: 16.5, color: C.forest,
          letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600,
          background: C.mist,
          padding: '6px 14px',
          borderRadius: 4,
          border: `2px solid ${C.forest}`,
          boxShadow: `3px 3px 0 ${C.forest}`,
          position: 'relative',
        }}>
          ✦ What is PlainFuel?
        </span>
      </motion.div>

      {/* Paragraphs — left-bar style */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 38 }}>
        {paragraphs.map((text, i) => (
          <motion.p key={i}
            initial={{ opacity: 0, x: -18 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.36 + i * 0.1 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(16px, 1.8vw, 18px)',
              color: '#3a4a3c', lineHeight: 1.8, margin: 0,
              paddingLeft: 14,
              borderLeft: `3px solid ${i === 0 ? C.leaf : i === 1 ? C.lime : '#86efac'}`,
            }}
          >{text}</motion.p>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.48, delay: 0.66 }}
        style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}
      >
        <a href="#order" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: C.mid, color: C.white,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, fontWeight: 700,
          letterSpacing: '0.07em', textTransform: 'uppercase',
          padding: '13px 26px', borderRadius: 10,
          border: `2.5px solid ${C.forest}`,
          boxShadow: `6px 7px 0 ${C.forest}`,
          textDecoration: 'none', transition: 'transform 0.12s, box-shadow 0.12s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = `8px 9px 0 ${C.forest}`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `6px 7px 0 ${C.forest}`; }}
        >
          Get PlainFuel
          <svg viewBox="0 0 16 16" width={13} height={13} fill="none">
            <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex' }}>
            {['#3d9a5c', '#2d7a46', '#4aaf6e'].map((bg, i) => (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: '50%',
                border: `2.5px solid ${C.white}`,
                background: bg, marginLeft: i > 0 ? -8 : 0,
                boxShadow: '0 1px 4px rgba(15,74,35,0.18)',
              }} />
            ))}
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.ash }}>
            1,200+ daily users
          </span>
        </div>
      </motion.div>


    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function PlainFuelAbout() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700;1,9..144,900&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');

        .pfa-section {
          background: #fffef9;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(60px, 9vw, 108px) clamp(22px, 5.5vw, 72px);
          position: relative;
          overflow: hidden;
        }

        /* Warm paper tint in corner */
        .pfa-section::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 38%; height: 45%;
          background: radial-gradient(ellipse at top right, rgba(254,240,138,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .pfa-inner {
          max-width: 1120px; width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(44px, 6.5vw, 92px);
          align-items: center;
          position: relative; z-index: 1;
        }

        @media (max-width: 880px) {
          .pfa-inner { grid-template-columns: 1fr !important; gap: 44px !important; }
          .pfa-carousel-col { order: -1; max-width: 400px; margin: 0 auto; width: 100%; }
        }
        @media (max-width: 480px) {
          .pfa-section { padding: 42px 18px 58px; min-height: auto; }
          .pfa-inner { gap: 34px !important; }
          .pfa-carousel-col { max-width: 100% !important; }
        }
      `}</style>

      <section className="pfa-section">
        <BgMarks />

        <div className="pfa-inner" ref={sectionRef}>
          <AboutLeft inView={inView} />

          <motion.div className="pfa-carousel-col"
            initial={{ opacity: 0, x: 28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.62, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductCarousel />
          </motion.div>
        </div>
      </section>
    </>
  );
}