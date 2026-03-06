'use client';

import { useState, useEffect, useCallback, useRef, CSSProperties, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface SvgProps { color?: string; style?: CSSProperties; }
interface CheckboxProps { checked?: boolean; color?: string; size?: number; style?: CSSProperties; }
interface StarBurstProps { size?: number; fill?: string; label?: string; style?: CSSProperties; }
interface NotePaperProps { children: ReactNode; rotate?: number; style?: CSSProperties; }
interface LabelItem { icon: 'check' | 'x' | 'star' | 'dot'; label: string; }
interface FloatingLabel {
  emoji?: string; text: string; bg: string; textColor: string;
  rotate: number; position: { top?: string; bottom?: string; left?: string; right?: string };
  floatClass: string; dotTrail?: boolean; items?: LabelItem[];
}
interface NoteItem { text: string; checked: boolean; }
interface Scene {
  id: number; image: string; alt: string;
  badge: string; badgeBg: string; badgeColor: string;
  headline1: string; headline2: string; headline2Color: string;
  noteTitle: string; noteItems: NoteItem[];
  bodyCopy: ReactNode; ctaText: string; ctaHref: string;
  accentColor: string; glowColor: string; ringColor: string;
  starburst: { fill: string; label: string };
  labels: FloatingLabel[];
  flavorTag: string;
  flavorTagBg: string;
}

// ── Brand Color — single source of truth ─────────────────────────────────────
const BRAND        = '#15803d';
const BRAND_DARK   = '#15803d';
const BRAND_LIME   = '#15803d';
const BRAND_MID    = '#15803d';
const BRAND_LIGHT  = '#dcfce7'; // very light tint for highlights only

function DoodleArrow({ color = BRAND_DARK, style = {} }: SvgProps) {
  return (
    <svg viewBox="0 0 80 40" style={{ display: 'block', ...style }}>
      <path d="M4,20 Q30,8 60,20" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M52,10 L64,20 L52,30" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DoodleCircle({ color = BRAND_MID, style = {} }: SvgProps) {
  return (
    <svg viewBox="0 0 100 100" style={{ display: 'block', ...style }}>
      <ellipse cx="50" cy="50" rx="44" ry="42" fill="none" stroke={color} strokeWidth="3.5" strokeDasharray="6 4" strokeLinecap="round" />
    </svg>
  );
}
function DoodleWiggle({ color = BRAND_MID, style = {} }: SvgProps) {
  return (
    <svg viewBox="0 0 120 24" style={{ display: 'block', ...style }}>
      <path d="M4,12 Q20,4 36,12 Q52,20 68,12 Q84,4 100,12 Q110,16 116,12" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function DoodleUnderline({ color = BRAND_MID, style = {} }: SvgProps) {
  return (
    <svg viewBox="0 0 300 16" preserveAspectRatio="none"
      style={{ position: 'absolute', bottom: -8, left: 0, width: '100%', height: 14, pointerEvents: 'none', ...style }}>
      <path d="M4,10 Q75,4 150,8 Q225,12 296,6" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.25" />
      <path d="M4,8 Q75,2 150,6 Q225,10 296,4" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function DoodleCheckbox({ checked = true, color = BRAND_MID, size = 20, style = {} }: CheckboxProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={style} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke={BRAND_DARK} strokeWidth="2.5" />
      {checked && <path d="M6,12 L10,16 L18,8" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}
function StarBurst({ size = 80, fill = BRAND_LIGHT, label, style = {} }: StarBurstProps) {
  const makePts = (outer: number, inner: number) =>
    Array.from({ length: 20 }, (_, i) => {
      const a = (i * Math.PI) / 10;
      const r = i % 2 === 0 ? outer : inner;
      return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
    }).join(' ');
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden suppressHydrationWarning>
      <defs>
        <radialGradient id="sbGrad" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor={fill} stopOpacity="1" />
        </radialGradient>
        <filter id="sbShadow">
          <feDropShadow dx="2" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.2" />
        </filter>
      </defs>
      {/* Main shape */}
      <polygon points={makePts(46, 30)} fill="url(#sbGrad)" stroke={BRAND} strokeWidth="3.5" strokeLinejoin="round" filter="url(#sbShadow)" suppressHydrationWarning />
      {/* Inner accent ring */}
      <polygon points={makePts(39, 25)} fill="none" stroke={BRAND} strokeWidth="1.2" strokeLinejoin="round" opacity="0.25" suppressHydrationWarning />
      {label && (
        <>
          <text x="50" y="43" textAnchor="middle" dominantBaseline="middle"
            style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 15, fill: '#1a1a1a', fontWeight: 900 }}>
            {label}
          </text>
          <text x="50" y="59" textAnchor="middle" dominantBaseline="middle"
            style={{ fontFamily: "'Kalam',cursive", fontSize: 9, fill: '#1a1a1a', fontWeight: 700, opacity: 0.65 }}>
            nutrient
          </text>
        </>
      )}
    </svg>
  );
}
function NotePaper({ children, rotate = 0, style = {} }: NotePaperProps) {
  return (
    <div style={{
      background: '#fffef0', border: `3px solid ${BRAND_DARK}`,
      borderRadius: 6, boxShadow: `5px 5px 0 ${BRAND_DARK}`,
      transform: `rotate(${rotate}deg)`, position: 'relative', overflow: 'hidden', ...style,
    }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 28 + i * 22, height: 1, background: 'rgba(21,128,61,0.15)' }} />
      ))}
      <div style={{ position: 'absolute', left: 28, top: 0, bottom: 0, width: 2, background: 'rgba(21,128,61,0.35)' }} />
      <div style={{ position: 'relative', paddingLeft: 36 }}>{children}</div>
    </div>
  );
}

function SceneDots({ count, active, onDotClick, accentColor }: {
  count: number; active: number; onDotClick: (i: number) => void; accentColor: string;
}) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {Array.from({ length: count }, (_, i) => (
        <button key={i} onClick={() => onDotClick(i)} aria-label={`Scene ${i + 1}`}
          style={{ background: 'none', border: 'none', padding: 3, cursor: 'pointer' }}>
          <motion.div
            animate={{ width: i === active ? 32 : 10, background: i === active ? accentColor : 'transparent' }}
            transition={{ type: 'spring', damping: 14, stiffness: 200 }}
            style={{
              height: 10, borderRadius: 3,
              border: `3px solid ${i === active ? accentColor : BRAND_DARK}`,
              boxShadow: i === active ? `3px 3px 0 ${accentColor}` : `2px 2px 0 ${BRAND_DARK}`,
            }}
          />
        </button>
      ))}
    </div>
  );
}

// ── Scene Data — only Lemon Lime & Berry Blast ──────────────────────────────
const SCENES: Scene[] = [
  {
    id: 1,
    image: '/images/Products/product_premium.png',
    alt: 'PlainFuel Lemon Lime sachet',
    flavorTag: 'Lemon Lime',
    flavorTagBg: BRAND_LIME,
    badge: 'THE PROBLEM',
    badgeBg: BRAND_LIGHT,
    badgeColor: BRAND_DARK,
    headline1: 'Why Are We Still Tired',
    headline2: 'Despite Eating Every Day?',
    headline2Color: BRAND_MID,
    noteTitle: 'DAILY REALITY CHECK:',
    noteItems: [
      { text: 'Eat 3 full meals a day', checked: true },
      { text: 'Still feel exhausted', checked: true },
      { text: 'Brain fog by 3 PM', checked: true },
      { text: 'Getting enough nutrients?', checked: false },
    ],
    bodyCopy: (
      <>
        Modern meals fill the stomach.<br />
        They don&apos;t always{' '}
        <span style={{ background: BRAND_LIGHT, padding: '1px 4px', borderRadius: 2 }}>nourish the body.</span><br />
        Something vital is being left out every single day.
      </>
    ),
    ctaText: "SEE WHAT'S MISSING",
    ctaHref: '#missing',
    accentColor: BRAND,
    glowColor: `rgba(21,128,61,0.22)`,
    ringColor: BRAND,
    starburst: { fill: BRAND_LIGHT, label: 'Mg' },
    labels: [
      { emoji: 'Mg', text: 'Why am I tired?', bg: BRAND_LIGHT, textColor: BRAND, rotate: -4, position: { top: '4%', left: '-4%' }, floatClass: 'label-float-a', dotTrail: true },
      { text: 'WHAT HE EATS:', bg: BRAND_LIGHT, textColor: BRAND, rotate: 3, position: { right: '-6%', top: '26%' }, floatClass: 'label-float-b', items: [{ icon: 'check', label: 'Dal' }, { icon: 'check', label: 'Rice' }, { icon: 'check', label: 'Roti' }, { icon: 'check', label: 'Sabzi' }] },
      { text: 'STILL MISSING:', bg: BRAND_LIGHT, textColor: BRAND, rotate: -3, position: { bottom: '8%', left: '-8%' }, floatClass: 'label-float-c', items: [{ icon: 'x', label: 'Magnesium' }, { icon: 'x', label: 'Vitamin D' }, { icon: 'x', label: 'B12' }, { icon: 'x', label: 'Zinc' }] },
      { emoji: '💤', text: 'Low energy daily', bg: BRAND_LIGHT, textColor: BRAND, rotate: 2, position: { bottom: '4%', right: '-2%' }, floatClass: 'label-float-d' },
    ],
  },
  {
    id: 2,
    image: '/images/Products/product.png',
    alt: 'PlainFuel Berry Blast sachet',
    flavorTag: 'Berry Blast',
    flavorTagBg: BRAND_DARK,
    badge: 'THE SOLUTION ✨',
    badgeBg: BRAND_LIGHT,
    badgeColor: BRAND_DARK,
    headline1: 'One Sachet. One Change.',
    headline2: 'Feel the Difference.',
    headline2Color: BRAND_MID,
    noteTitle: "WHAT'S INSIDE:",
    noteItems: [
      { text: 'Magnesium for muscles', checked: true },
      { text: 'B12 for energy & brain', checked: true },
      { text: 'Vitamin D for immunity', checked: true },
      { text: 'Zinc for cell recovery', checked: true },
    ],
    bodyCopy: (
      <>
        No pills. No routines.<br />
        <span style={{ background: BRAND_LIGHT, padding: '1px 4px', borderRadius: 2 }}>Packed with what your meals miss.</span><br />
        Just PlainFuel — mix, drink, thrive.
      </>
    ),
    ctaText: 'START YOUR JOURNEY',
    ctaHref: '#order',
    accentColor: BRAND,
    glowColor: `rgba(21,128,61,0.22)`,
    ringColor: BRAND,
    starburst: { fill: BRAND_LIGHT, label: 'Ca' },
    labels: [
      { emoji: 'Ca', text: 'Ready to change!', bg: BRAND_LIGHT, textColor: BRAND, rotate: -4, position: { top: '4%', left: '-4%' }, floatClass: 'label-float-a', dotTrail: true },
      { text: 'IN THE SACHET:', bg: BRAND_LIGHT, textColor: BRAND, rotate: 3, position: { right: '-6%', top: '26%' }, floatClass: 'label-float-b', items: [{ icon: 'dot', label: 'Magnesium' }, { icon: 'dot', label: 'Calcium' }, { icon: 'dot', label: 'Vitamin D3' }, { icon: 'dot', label: 'B-Complex' }] },
      { text: 'ZERO JUNK:', bg: BRAND_LIGHT, textColor: BRAND, rotate: -3, position: { bottom: '8%', left: '-8%' }, floatClass: 'label-float-c', items: [{ icon: 'x', label: 'Fillers' }, { icon: 'x', label: 'Sugar' }, { icon: 'x', label: 'Artificial colour' }] },
      { emoji: '🔬', text: 'FSSAI Certified', bg: BRAND_LIGHT, textColor: BRAND, rotate: 2, position: { bottom: '4%', right: '-2%' }, floatClass: 'label-float-d' },
    ],
  },
];

const AUTO_MS = 8000;

export default function HeroSection() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [sceneIdx, setSceneIdx] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const tickRef = useRef<number>(0);

  useEffect(() => {
    tickRef.current = Date.now();
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    let rafId: number;
    function tick() {
      if (!paused && Date.now() - tickRef.current >= AUTO_MS) {
        setSceneIdx((i) => (i + 1) % SCENES.length);
        tickRef.current = Date.now();
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [loaded, paused]);

  useEffect(() => { tickRef.current = Date.now(); }, [sceneIdx]);

  const goToScene = useCallback((i: number) => {
    setSceneIdx(i);
    tickRef.current = Date.now();
  }, []);

  const goPrev = useCallback(() => {
    setSceneIdx((i) => (i - 1 + SCENES.length) % SCENES.length);
    tickRef.current = Date.now();
  }, []);

  const goNext = useCallback(() => {
    setSceneIdx((i) => (i + 1) % SCENES.length);
    tickRef.current = Date.now();
  }, []);

  const scene = SCENES[sceneIdx];
  const sp = { type: 'spring' as const, damping: 14, stiffness: 180 };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Kalam:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .pf-hero {
          background: #f5f5ee; min-height: 100vh;
          position: relative; overflow: hidden;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .pf-hero::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(21,128,61,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(21,128,61,0.05) 1px, transparent 1px);
          background-size: 40px 40px; pointer-events: none;
        }

        .cta-main {
          font-family: 'Permanent Marker', cursive;
          display: inline-flex; align-items: center; gap: 12px;
          color: #fff; font-size: 17px; letter-spacing: 0.04em;
          padding: 15px 32px; border-radius: 6px;
          background: #15803d;
          border: 4px solid #1a1a1a; box-shadow: 7px 8px 0 #1a1a1a;
          text-decoration: none; cursor: pointer;
          transition: transform 0.12s, box-shadow 0.12s;
        }
        .cta-main:hover { transform: translate(-3px,-3px) rotate(-1deg); box-shadow: 10px 11px 0 #1a1a1a; }
        .cta-main:active { transform: translate(3px,3px); box-shadow: 3px 4px 0 #1a1a1a; }

        .cta-lime {
          font-family: 'Permanent Marker', cursive;
          display: inline-flex; align-items: center; gap: 12px;
          color: #fff; font-size: 17px; letter-spacing: 0.04em;
          padding: 15px 32px; border-radius: 6px;
          border: 4px solid #1a1a1a; box-shadow: 7px 8px 0 #1a1a1a;
          background: #15803d;
          text-decoration: none; cursor: pointer;
          transition: transform 0.12s, box-shadow 0.12s;
        }
        .cta-lime:hover { transform: translate(-3px,-3px) rotate(-1deg); box-shadow: 10px 11px 0 #1a1a1a; }
        .cta-lime:active { transform: translate(3px,3px); box-shadow: 3px 4px 0 #1a1a1a; }

        .pulse-dot     { animation: pfBlink 1.6s ease-in-out infinite; }
        .illus-float   { animation: pfFloat 5.5s ease-in-out infinite; }
        .star-spin     { animation: pfSpin 12s linear infinite; }
        .label-float-a { animation: pfFloatSlow 4.5s ease-in-out infinite; }
        .label-float-b { animation: pfFloatSlow 5s ease-in-out 0.8s infinite; }
        .label-float-c { animation: pfFloatSlow 4s ease-in-out 1.2s infinite; }
        .label-float-d { animation: pfFloatSlow 6s ease-in-out 0.4s infinite; }
        .arrow-bounce  { animation: pfArrowBounce 1.7s ease-in-out infinite; }
        .scroll-bounce { animation: pfScrollBounce 1.4s ease-in-out infinite; }

        @keyframes pfBlink      { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        @keyframes pfFloat      { 0%,100%{transform:translateY(0px) rotate(-2deg)} 50%{transform:translateY(-18px) rotate(1deg)} }
        @keyframes pfFloatSlow  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes pfSpin       { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pfArrowBounce{ 0%,100%{transform:translateX(0)} 50%{transform:translateX(7px)} }
        @keyframes pfScrollBounce{0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }

        @media (max-width: 860px) {
          .pf-grid { grid-template-columns: 1fr !important; }
          .pf-illus-col { order: -1; }
        }
      `}</style>

      <section className="pf-hero"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Progress strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, zIndex: 20, background: 'rgba(26,46,26,0.1)' }}>
          {!paused && (
            <motion.div
              key={sceneIdx}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
              style={{ height: '100%', background: BRAND, opacity: 0.85 }}
            />
          )}
        </div>

        {/* Ghost watermark */}
        <div aria-hidden style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          fontFamily: "'Permanent Marker',cursive",
          fontSize: 'clamp(100px,18vw,240px)',
          color: BRAND_DARK, opacity: 0.025,
          userSelect: 'none', whiteSpace: 'nowrap',
          pointerEvents: 'none', zIndex: 0, letterSpacing: '-0.04em',
        }}>PLAINFUEL</div>

        {/* Scene stamp */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`stamp-${sceneIdx}`}
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
            animate={{ opacity: 0.06, scale: 1, rotate: -8 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            aria-hidden
            style={{
              position: 'absolute', top: 20, right: 20, zIndex: 1,
              fontFamily: "'Permanent Marker',cursive",
              fontSize: 'clamp(60px,10vw,130px)',
              color: BRAND_DARK, pointerEvents: 'none', lineHeight: 1,
            }}
          >
            {String(scene.id).padStart(2, '0')}
          </motion.div>
        </AnimatePresence>

        {/* Background doodles */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <DoodleWiggle color={BRAND_LIME} style={{ position: 'absolute', top: '10%', right: '5%', width: 100, opacity: 0.3, transform: 'rotate(-15deg)' }} />
          <DoodleWiggle color={BRAND_DARK} style={{ position: 'absolute', bottom: '18%', left: '3%', width: 70, opacity: 0.08, transform: 'rotate(8deg)' }} />
          <DoodleCircle color={BRAND_MID} style={{ position: 'absolute', top: '5%', left: '8%', width: 60, opacity: 0.08 }} />
          {/* Lime accent blobs */}
          <div style={{ position: 'absolute', top: '15%', right: '10%', width: 120, height: 120, borderRadius: '50%', background: BRAND, opacity: 0.07, filter: 'blur(20px)' }} />
          <div style={{ position: 'absolute', bottom: '20%', left: '6%', width: 80, height: 80, borderRadius: '50%', background: BRAND, opacity: 0.06, filter: 'blur(16px)' }} />
        </div>

        {/* ══ MAIN GRID ══ */}
        <div className="pf-grid" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(24px,4vw,64px)',
          maxWidth: 1200, width: '100%',
          padding: 'clamp(40px,6vw,100px) clamp(20px,5vw,80px)',
          position: 'relative', zIndex: 2, alignItems: 'center',
        }}>

          {/* ── LEFT: Text ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* Badge */}
            <AnimatePresence mode="wait">
              <motion.div key={`badge-${sceneIdx}`}
                initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.32 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9,
                  background: scene.badgeBg, border: `3.5px solid ${BRAND_DARK}`,
                  borderRadius: 4, padding: '7px 16px', boxShadow: `4px 4px 0 ${BRAND_DARK}`,
                  transform: 'rotate(-1.5deg)', width: 'fit-content',
                }}>
                  <div className="pulse-dot" style={{ width: 9, height: 9, borderRadius: '50%', background: scene.accentColor, border: `2px solid ${BRAND_DARK}`, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 12, color: scene.badgeColor, letterSpacing: '0.12em' }}>
                    {scene.badge}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Headline */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div key={`h1-${sceneIdx}`}
                  initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.38, ease: [0.16,1,0.3,1] }}
                  style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 'clamp(1.7rem,3.2vw,2.8rem)', lineHeight: 1.15, color: BRAND_DARK, marginBottom: 4 }}>
                  {scene.headline1}
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div key={`h2-${sceneIdx}`}
                  initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.38, delay: 0.07, ease: [0.16,1,0.3,1] }}
                  style={{ position: 'relative', display: 'inline-block' }}>
                  <span style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 'clamp(1.7rem,3.2vw,2.8rem)', lineHeight: 1.15, color: '#1a1a1a' }}>
                    {scene.headline2}
                  </span>
                  <DoodleUnderline color={BRAND_LIME} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Notepad */}
            <AnimatePresence mode="wait">
              <motion.div key={`note-${sceneIdx}`}
                initial={{ opacity: 0, y: 18, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: -1.5 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.36, delay: 0.1 }}>
                <NotePaper rotate={-1.5} style={{ padding: '16px 20px 18px 20px', maxWidth: 390 }}>
                  <div style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 11, color: '#1a1a1a', marginBottom: 12, letterSpacing: '0.1em' }}>
                    {scene.noteTitle}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {scene.noteItems.map(({ text, checked }, i) => (
                      <motion.div key={`${sceneIdx}-ni-${i}`}
                        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.09, ...sp }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <DoodleCheckbox checked={checked} color={checked ? BRAND_MID : '#ef4444'} size={21} />
                        <span style={{ fontFamily: "'Kalam',cursive", fontSize: 14, fontWeight: 700, color: checked ? BRAND_DARK : '#ef4444', textDecoration: !checked ? 'line-through' : 'none', opacity: !checked ? 0.65 : 1 }}>
                          {text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </NotePaper>
              </motion.div>
            </AnimatePresence>

            {/* Body copy */}
            <AnimatePresence mode="wait">
              <motion.div key={`body-${sceneIdx}`}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.36, delay: 0.16 }}
                style={{ background: '#fff', border: `3.5px solid ${BRAND_DARK}`, borderRadius: 8, padding: '14px 20px 14px 28px', boxShadow: `5px 5px 0 ${BRAND_DARK}`, transform: 'rotate(0.5deg)', maxWidth: 420, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: BRAND }} />
                <p style={{ fontFamily: "'Kalam',cursive", fontSize: 15, fontWeight: 700, lineHeight: 1.75, color: BRAND_DARK, margin: 0 }}>
                  {scene.bodyCopy}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* CTA + Nav */}
            <AnimatePresence mode="wait">
              <motion.div key={`cta-${sceneIdx}`}
                initial={{ opacity: 0, scale: 0.82 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <a href={scene.ctaHref} className="cta-main">
                    {scene.ctaText}
                    <span className="arrow-bounce" style={{ display: 'inline-block', fontSize: 20 }}>→</span>
                  </a>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <DoodleArrow color='#1a1a1a' style={{ width: 42, height: 21, transform: 'rotate(160deg) scaleX(-1)' }} />
                    <span style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 11, color: '#1a1a1a', letterSpacing: '0.08em', transform: 'rotate(-3deg)', display: 'inline-block', marginTop: -2 }}>
                      {sceneIdx === 1 ? 'join us!' : 'start here!'}
                    </span>
                  </div>
                </div>

                {/* Dots + Nav buttons row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 10, color: BRAND, opacity: 0.55, letterSpacing: '0.1em' }}>THE STORY</span>
                  <SceneDots count={SCENES.length} active={sceneIdx} onDotClick={goToScene} accentColor={BRAND} />
                  <span style={{ fontFamily: "'Kalam',cursive", fontSize: 11, fontWeight: 700, color: BRAND, opacity: 0.5 }}>{sceneIdx + 1}/{SCENES.length}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── RIGHT: Illustration ── */}
          <div className="pf-illus-col" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 520 }}>

            {/* Orbit ring */}
            <motion.div
              animate={{ borderColor: BRAND }}
              transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: 'clamp(300px,38vw,500px)', height: 'clamp(300px,38vw,500px)', borderRadius: '50%', border: '5px dashed', opacity: 0.25 }}
            />

            {/* Glow */}
            <motion.div
              animate={{ background: `radial-gradient(circle, rgba(21,128,61,0.25) 0%, transparent 70%)` }}
              transition={{ duration: 0.6 }}
              style={{ position: 'absolute', width: '70%', height: '70%', borderRadius: '50%', filter: 'blur(44px)', pointerEvents: 'none' }}
            />

            {/* Illustration */}
            <AnimatePresence mode="wait">
              <motion.div key={`img-${sceneIdx}`}
                initial={{ opacity: 0, scale: 0.86, x: 60 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -60 }}
                transition={{ duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'relative', zIndex: 4 }}>
                <div className="illus-float">
                  <Image
                    src={scene.image}
                    alt={scene.alt}
                    width={480}
                    height={480}
                    priority={sceneIdx === 0}
                    style={{ width: 'clamp(260px,34vw,460px)', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 24px 48px rgba(21,128,61,0.3))', display: 'block' }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Flavor tag */}
            <AnimatePresence mode="wait">
              <motion.div key={`flavor-${sceneIdx}`}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.3, type: 'spring', damping: 12, stiffness: 200 }}
                style={{
                  position: 'absolute', bottom: '6%', left: '50%',
                  transform: 'translateX(-50%) rotate(-2deg)',
                  background: BRAND,
                  border: `3px solid #1a1a1a`,
                  borderRadius: 6,
                  padding: '6px 18px',
                  boxShadow: `4px 4px 0 #1a1a1a`,
                  fontFamily: "'Permanent Marker',cursive",
                  fontSize: 13,
                  color: '#fff',
                  letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                }}
              >
                {scene.flavorTag}
              </motion.div>
            </AnimatePresence>

            {/* Starburst */}
            <AnimatePresence mode="wait">
              <motion.div key={`star-${sceneIdx}`}
                initial={{ opacity: 0, scale: 0, rotate: -30 }} animate={{ opacity: 1, scale: 1, rotate: 15 }} exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', damping: 8, stiffness: 160, delay: 0.28 }}
                style={{ position: 'absolute', top: '-2%', right: '0%', zIndex: 10 }}>
                <StarBurst size={90} fill={scene.starburst.fill} label={scene.starburst.label} />
              </motion.div>
            </AnimatePresence>

            {/* Side nav arrows */}
            <motion.button
              onClick={goPrev}
              whileHover={{ scale: 1.1, x: -3 }}
              whileTap={{ scale: 0.92 }}
              style={{
                position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)',
                width: 46, height: 46, borderRadius: 6,
                background: BRAND,
                border: `3.5px solid #1a1a1a`, boxShadow: `4px 4px 0 #1a1a1a`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 20,
              }}
              aria-label="Previous"
            >
              <svg viewBox="0 0 28 28" width={20} height={20} fill="none">
                <path d="M18,6 L10,14 L18,22" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>

            <motion.button
              onClick={goNext}
              whileHover={{ scale: 1.1, x: 3 }}
              whileTap={{ scale: 0.92 }}
              style={{
                position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)',
                width: 46, height: 46, borderRadius: 6,
                background: BRAND,
                border: `3.5px solid #1a1a1a`, boxShadow: `4px 4px 0 #1a1a1a`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 20,
              }}
              aria-label="Next"
            >
              <svg viewBox="0 0 28 28" width={20} height={20} fill="none">
                <path d="M10,6 L18,14 L10,22" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>

            {/* Deco arrows */}
            <motion.div animate={{ opacity: loaded ? 0.38 : 0 }} transition={{ delay: 0.9 }}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9 }}>
              <DoodleArrow color={BRAND} style={{ position: 'absolute', top: '12%', left: '8%', width: 40, opacity: 0.4, transform: 'rotate(30deg)' }} />
              <DoodleArrow color={BRAND} style={{ position: 'absolute', bottom: '18%', right: '12%', width: 34, opacity: 0.2, transform: 'rotate(-140deg)' }} />
            </motion.div>
          </div>
        </div>

        {/* Scroll nudge */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: loaded ? 0.65 : 0 }} transition={{ delay: 1.8 }}
          style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 11, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 10, color: BRAND_DARK, letterSpacing: '0.12em' }}>SCROLL</span>
          <div className="scroll-bounce">
            <DoodleArrow color={BRAND_DARK} style={{ width: 28, height: 14, transform: 'rotate(90deg)' }} />
          </div>
        </motion.div>

      </section>
    </>
  );
}