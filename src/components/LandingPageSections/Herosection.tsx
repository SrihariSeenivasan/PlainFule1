'use client';

// ─────────────────────────────────────────────────────────────────────────────
// PlainFuel – Story Carousel Hero  (TypeScript / Next.js)
// 5-scene narrative: Tired → Discovery → Action → Consuming → Transformed
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef, CSSProperties, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { StarDoodle } from '@/components/Elements/SvgDoodles';

// ── Types ─────────────────────────────────────────────────────────────────────

interface SvgProps {
  color?: string;
  style?: CSSProperties;
}

interface CheckboxProps {
  checked?: boolean;
  color?: string;
  size?: number;
  style?: CSSProperties;
}

interface StarBurstProps {
  size?: number;
  fill?: string;
  label?: string;
  style?: CSSProperties;
}

interface NotePaperProps {
  children: ReactNode;
  rotate?: number;
  style?: CSSProperties;
}

interface LabelItem {
  icon: 'check' | 'x' | 'star' | 'dot';
  label: string;
}

interface FloatingLabel {
  emoji?: string;
  text: string;
  bg: string;
  textColor: string;
  rotate: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  floatClass: string;
  dotTrail?: boolean;
  items?: LabelItem[];
}

interface NoteItem {
  text: string;
  checked: boolean;
}

interface Scene {
  id: number;
  image: string;
  alt: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  headline1: string;
  headline2: string;
  headline2Color: string;
  noteTitle: string;
  noteItems: NoteItem[];
  bodyCopy: ReactNode;
  ctaText: string;
  ctaHref: string;
  accentColor: string;
  glowColor: string;
  ringColor: string;
  starburst: { fill: string; label: string };
  labels: FloatingLabel[];
}

// ── SVG Doodle Primitives ─────────────────────────────────────────────────────

function DoodleArrow({ color = '#1a1a1a', style = {} }: SvgProps) {
  return (
    <svg viewBox="0 0 80 40" style={{ display: 'block', ...style }}>
      <path d="M4,20 Q30,8 60,20" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M52,10 L64,20 L52,30" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DoodleCircle({ color = '#15803d', style = {} }: SvgProps) {
  return (
    <svg viewBox="0 0 100 100" style={{ display: 'block', ...style }}>
      <ellipse cx="50" cy="50" rx="44" ry="42" fill="none" stroke={color} strokeWidth="3.5" strokeDasharray="6 4" strokeLinecap="round" />
    </svg>
  );
}

function DoodleWiggle({ color = '#15803d', style = {} }: SvgProps) {
  return (
    <svg viewBox="0 0 120 24" style={{ display: 'block', ...style }}>
      <path d="M4,12 Q20,4 36,12 Q52,20 68,12 Q84,4 100,12 Q110,16 116,12" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function DoodleUnderline({ color = '#15803d', style = {} }: SvgProps) {
  return (
    <svg viewBox="0 0 300 16" preserveAspectRatio="none"
      style={{ position: 'absolute', bottom: -8, left: 0, width: '100%', height: 14, pointerEvents: 'none', ...style }}>
      <path d="M4,10 Q75,4 150,8 Q225,12 296,6" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.25" />
      <path d="M4,8 Q75,2 150,6 Q225,10 296,4" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function DoodleCheckbox({ checked = true, color = '#15803d', size = 20, style = {} }: CheckboxProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={style} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="#1a1a1a" strokeWidth="2.5" />
      {checked && <path d="M6,12 L10,16 L18,8" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

function DoodleX({ size = 14, color = '#ef4444' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 22 22" width={size} height={size} aria-hidden>
      <path d="M3,3 L19,19 M19,3 L3,19" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function StarBurst({ size = 80, fill = '#fef08a', label, style = {} }: StarBurstProps) {
  const pts = Array.from({ length: 20 }, (_, i) => {
    const a = (i * Math.PI) / 10;
    const r = i % 2 === 0 ? 46 : 30;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(' ');
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden>
      <polygon points={pts} fill={fill} stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
      {label && (
        <text x="50" y="55" textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 14, fill: '#1a1a1a', fontWeight: 900 }}>
          {label}
        </text>
      )}
    </svg>
  );
}

function NotePaper({ children, rotate = 0, style = {} }: NotePaperProps) {
  return (
    <div style={{
      background: '#fffef0', border: '3px solid #1a1a1a',
      borderRadius: 6, boxShadow: '5px 5px 0 #1a1a1a',
      transform: `rotate(${rotate}deg)`, position: 'relative', overflow: 'hidden', ...style,
    }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 28 + i * 22, height: 1, background: 'rgba(147,197,253,0.4)' }} />
      ))}
      <div style={{ position: 'absolute', left: 28, top: 0, bottom: 0, width: 2, background: 'rgba(239,68,68,0.25)' }} />
      <div style={{ position: 'relative', paddingLeft: 36 }}>{children}</div>
    </div>
  );
}

// ── Scene Progress Dots ───────────────────────────────────────────────────────

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
              border: `3px solid ${i === active ? accentColor : '#1a1a1a'}`,
              boxShadow: i === active ? `3px 3px 0 ${accentColor}` : '2px 2px 0 #1a1a1a',
            }}
          />
        </button>
      ))}
    </div>
  );
}

// ── Scene Data ────────────────────────────────────────────────────────────────

const SCENES: Scene[] = [
  // SCENE 1 — Low Energy / Problem
  {
    id: 1,
    image: '/images/DoodleImages/hero1.png',
    alt: 'Tired boy sitting at a table with food, looking exhausted with fog clouds above',
    badge: 'THE PROBLEM',
    badgeBg: '#fee2e2',
    badgeColor: '#991b1b',
    headline1: 'Why Are We Still Tired',
    headline2: 'Despite Eating Every Day?',
    headline2Color: '#dc2626',
    noteTitle: 'DAILY REALITY CHECK:',
    noteItems: [
      { text: 'Eat 3 full meals a day', checked: true },
      { text: 'Still feel exhausted', checked: true },
      { text: 'Brain fog by 3 PM', checked: true },
      { text: 'Getting enough nutrients?', checked: false },
    ],
    bodyCopy: <>Modern meals fill the stomach.<br />They don&apos;t always <span style={{ background: '#fef08a', padding: '1px 4px', borderRadius: 2 }}>nourish the body.</span><br />Something vital is being left out every single day.</>,
    ctaText: "SEE WHAT'S MISSING",
    ctaHref: '#missing',
    accentColor: '#dc2626',
    glowColor: 'rgba(239,68,68,0.18)',
    ringColor: '#dc2626',
    starburst: { fill: '#fee2e2', label: 'Mg' },
    labels: [
      { emoji: 'Mg', text: 'Why am I tired?', bg: '#fef08a', textColor: '#1a1a1a', rotate: -4, position: { top: '4%', left: '-4%' }, floatClass: 'label-float-a', dotTrail: true },
      { text: 'WHAT HE EATS:', bg: '#bbf7d0', textColor: '#14532d', rotate: 3, position: { right: '-6%', top: '26%' }, floatClass: 'label-float-b', items: [{ icon: 'check', label: 'Dal' }, { icon: 'check', label: 'Rice' }, { icon: 'check', label: 'Roti' }, { icon: 'check', label: 'Sabzi' }] },
      { text: 'STILL MISSING:', bg: '#fee2e2', textColor: '#991b1b', rotate: -3, position: { bottom: '8%', left: '-8%' }, floatClass: 'label-float-c', items: [{ icon: 'x', label: 'Magnesium' }, { icon: 'x', label: 'Vitamin D' }, { icon: 'x', label: 'B12' }, { icon: 'x', label: 'Zinc' }] },
      { emoji: '💤', text: 'Low energy daily', bg: '#e0e7ff', textColor: '#3730a3', rotate: 2, position: { bottom: '4%', right: '-2%' }, floatClass: 'label-float-d' },
    ],
  },

  // SCENE 2 — Discovery / Lightbulb
  {
    id: 2,
    image: '/images/DoodleImages/hero2.png',
    alt: 'Boy with hopeful smile and a lightbulb, thinking about PlainFuel sachets',
    badge: 'THE DISCOVERY',
    badgeBg: '#fef08a',
    badgeColor: '#92400e',
    headline1: 'Wait… What If the Answer',
    headline2: 'Was Always This Simple?',
    headline2Color: '#d97706',
    noteTitle: 'THE LIGHTBULB MOMENT:',
    noteItems: [
      { text: 'Food alone isn\'t enough', checked: true },
      { text: 'Micronutrients matter most', checked: true },
      { text: 'PlainFuel fills the gap', checked: true },
      { text: 'Science-backed formula', checked: true },
    ],
    bodyCopy: <>Most people eat right but still fall short.<br />The missing link? <span style={{ background: '#fef08a', padding: '1px 4px', borderRadius: 2 }}>Micronutrients.</span><br />PlainFuel was built to fix exactly this — simply.</>,
    ctaText: 'DISCOVER PLAINFUEL',
    ctaHref: '#discover',
    accentColor: '#d97706',
    glowColor: 'rgba(251,191,36,0.25)',
    ringColor: '#f59e0b',
    starburst: { fill: '#fef08a', label: 'Zn' },
    labels: [
      { emoji: 'Zn', text: 'Eureka moment!', bg: '#fef08a', textColor: '#92400e', rotate: -4, position: { top: '4%', left: '-4%' }, floatClass: 'label-float-a', dotTrail: true },
      { text: 'THE SOLUTION:', bg: '#dcfce7', textColor: '#14532d', rotate: 3, position: { right: '-6%', top: '26%' }, floatClass: 'label-float-b', items: [{ icon: 'star', label: 'PlainFuel box' }, { icon: 'star', label: 'Color sachets' }, { icon: 'star', label: '5 nutrients' }, { icon: 'star', label: '1 daily dose' }] },
      { text: 'WHY IT WORKS:', bg: '#e0f2fe', textColor: '#075985', rotate: -3, position: { bottom: '8%', left: '-8%' }, floatClass: 'label-float-c', items: [{ icon: 'check', label: 'Lab tested' }, { icon: 'check', label: 'No fillers' }, { icon: 'check', label: 'Easy sachets' }] },
      { emoji: '✨', text: 'Hope restored!', bg: '#fef9c3', textColor: '#713f12', rotate: 2, position: { bottom: '4%', right: '-2%' }, floatClass: 'label-float-d' },
    ],
  },

  // SCENE 3 — Taking Action
  {
    id: 3,
    image: '/images/DoodleImages/hero3.png',
    alt: 'Boy holding a PlainFuel red sachet confidently, ready to take action',
    badge: 'TAKING ACTION',
    badgeBg: '#dbeafe',
    badgeColor: '#1e40af',
    headline1: 'He Made a Choice.',
    headline2: 'One Sachet. One Change.',
    headline2Color: '#2563eb',
    noteTitle: "WHAT'S INSIDE:",
    noteItems: [
      { text: 'Magnesium for muscles', checked: true },
      { text: 'B12 for energy & brain', checked: true },
      { text: 'Vitamin D for immunity', checked: true },
      { text: 'Zinc for cell recovery', checked: true },
    ],
    bodyCopy: <>One small red sachet.<br /><span style={{ background: '#dbeafe', padding: '1px 4px', borderRadius: 2 }}>Packed with what your meals miss.</span><br />No pills. No routines. Just PlainFuel.</>,
    ctaText: 'SEE INGREDIENTS',
    ctaHref: '#ingredients',
    accentColor: '#2563eb',
    glowColor: 'rgba(59,130,246,0.2)',
    ringColor: '#3b82f6',
    starburst: { fill: '#dbeafe', label: 'Ca' },
    labels: [
      { emoji: 'Ca', text: 'Ready to change!', bg: '#dbeafe', textColor: '#1e40af', rotate: -4, position: { top: '4%', left: '-4%' }, floatClass: 'label-float-a', dotTrail: true },
      { text: 'IN THE SACHET:', bg: '#dcfce7', textColor: '#14532d', rotate: 3, position: { right: '-6%', top: '26%' }, floatClass: 'label-float-b', items: [{ icon: 'dot', label: 'Magnesium' }, { icon: 'dot', label: 'Calcium' }, { icon: 'dot', label: 'Vitamin D3' }, { icon: 'dot', label: 'B-Complex' }] },
      { text: 'ZERO JUNK:', bg: '#fee2e2', textColor: '#991b1b', rotate: -3, position: { bottom: '8%', left: '-8%' }, floatClass: 'label-float-c', items: [{ icon: 'x', label: 'Fillers' }, { icon: 'x', label: 'Sugar' }, { icon: 'x', label: 'Artificial colour' }] },
      { emoji: '🔬', text: 'FSSAI Certified', bg: '#dcfce7', textColor: '#14532d', rotate: 2, position: { bottom: '4%', right: '-2%' }, floatClass: 'label-float-d' },
    ],
  },

  // SCENE 4 — Consuming
  {
    id: 4,
    image: '/images/DoodleImages/hero4.png',
    alt: 'Boy pouring PlainFuel powder into a glass of water with an energy swirl effect',
    badge: 'THE RITUAL',
    badgeBg: '#ffedd5',
    badgeColor: '#9a3412',
    headline1: 'Just Mix. Just Drink.',
    headline2: "That's Your Daily Ritual.",
    headline2Color: '#ea580c',
    noteTitle: 'HOW EASY IS IT:',
    noteItems: [
      { text: 'Tear open one sachet', checked: true },
      { text: 'Pour into 200ml water', checked: true },
      { text: 'Stir for 10 seconds', checked: true },
      { text: 'Done. Feel the shift.', checked: true },
    ],
    bodyCopy: <>No measuring. No tablets. No guesswork.<br /><span style={{ background: '#ffedd5', padding: '1px 4px', borderRadius: 2 }}>One sachet a day</span> — your body gets what it needs.<br />The swirl dissolves. The energy builds.</>,
    ctaText: 'TRY YOUR FIRST BOX',
    ctaHref: '#order',
    accentColor: '#ea580c',
    glowColor: 'rgba(249,115,22,0.22)',
    ringColor: '#f97316',
    starburst: { fill: '#ffedd5', label: 'B' },
    labels: [
      { emoji: 'B', text: 'Mix & drink!', bg: '#ffedd5', textColor: '#9a3412', rotate: -4, position: { top: '4%', left: '-4%' }, floatClass: 'label-float-a', dotTrail: true },
      { text: 'ENERGY SWIRL:', bg: '#fef9c3', textColor: '#713f12', rotate: 3, position: { right: '-6%', top: '26%' }, floatClass: 'label-float-b', items: [{ icon: 'star', label: 'Dissolves fast' }, { icon: 'star', label: 'Great taste' }, { icon: 'star', label: 'Clear colour' }, { icon: 'star', label: 'No residue' }] },
      { text: 'JUST 30 SECS:', bg: '#dcfce7', textColor: '#14532d', rotate: -3, position: { bottom: '8%', left: '-8%' }, floatClass: 'label-float-c', items: [{ icon: 'check', label: 'Tear sachet' }, { icon: 'check', label: 'Add water' }, { icon: 'check', label: 'Stir & drink' }] },
      { emoji: '⚡', text: 'Energy incoming!', bg: '#fef08a', textColor: '#713f12', rotate: 2, position: { bottom: '4%', right: '-2%' }, floatClass: 'label-float-d' },
    ],
  },

  // SCENE 5 — Transformation
  {
    id: 5,
    image: '/images/DoodleImages/hero5.png',
    alt: 'Boy energetic and happy, standing with raised fist and golden glow, nutrient icons floating around',
    badge: 'THE RESULT ✨',
    badgeBg: '#dcfce7',
    badgeColor: '#14532d',
    headline1: 'This Is What Nourished',
    headline2: 'Actually Feels Like.',
    headline2Color: '#15803d',
    noteTitle: 'THE TRANSFORMATION:',
    noteItems: [
      { text: 'Energy that lasts all day', checked: true },
      { text: 'Sharp & focused mind', checked: true },
      { text: 'Strong immune system', checked: true },
      { text: 'No more 3 PM crash', checked: true },
    ],
    bodyCopy: <>Same meals. Same schedule.<br />But now with <span style={{ background: '#bbf7d0', padding: '1px 4px', borderRadius: 2 }}>PlainFuel in the mix</span> — everything changed.<br />This is what your body was always capable of.</>,
    ctaText: 'START YOUR JOURNEY',
    ctaHref: '#order',
    accentColor: '#15803d',
    glowColor: 'rgba(21,128,61,0.3)',
    ringColor: '#15803d',
    starburst: { fill: '#dcfce7', label: 'Mg' },
    labels: [
      { emoji: 'Mg', text: 'Fully energized!', bg: '#fef08a', textColor: '#713f12', rotate: -4, position: { top: '4%', left: '-4%' }, floatClass: 'label-float-a', dotTrail: true },
      { text: 'NUTRIENTS ABSORBED:', bg: '#dcfce7', textColor: '#14532d', rotate: 3, position: { right: '-6%', top: '26%' }, floatClass: 'label-float-b', items: [{ icon: 'star', label: 'Ca — Calcium' }, { icon: 'star', label: 'Fiber' }, { icon: 'star', label: 'Mg — Magnesium' }, { icon: 'star', label: 'Zn — Zinc' }] },
      { text: 'FEELING NOW:', bg: '#bbf7d0', textColor: '#14532d', rotate: -3, position: { bottom: '8%', left: '-8%' }, floatClass: 'label-float-c', items: [{ icon: 'check', label: 'Full of energy' }, { icon: 'check', label: 'Clear headed' }, { icon: 'check', label: 'Happy & strong' }] },
      { emoji: '⭐', text: '30-day results!', bg: '#dcfce7', textColor: '#14532d', rotate: 2, position: { bottom: '4%', right: '-2%' }, floatClass: 'label-float-d' },
    ],
  },
];

const AUTO_MS = 8000;

// ─── Main Export ──────────────────────────────────────────────────────────────
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

  const scene = SCENES[sceneIdx];
  const sp = { type: 'spring' as const, damping: 14, stiffness: 180 };

  function renderLabel(label: FloatingLabel, idx: number) {
    return (
      <AnimatePresence key={`${sceneIdx}-lbl-${idx}`} mode="wait">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ delay: 0.55 + idx * 0.14, ...sp }}
          style={{ position: 'absolute', zIndex: 10, ...label.position }}
        >
          <div className={label.floatClass} style={{
            background: label.bg, border: '3px solid #1a1a1a',
            borderRadius: 6, boxShadow: '4px 4px 0 #1a1a1a',
            padding: '8px 14px', transform: `rotate(${label.rotate}deg)`, whiteSpace: 'nowrap',
          }}>
            <div style={{
              fontFamily: "'Permanent Marker',cursive", fontSize: 11, color: label.textColor,
              letterSpacing: '0.1em', marginBottom: label.items ? 6 : 0,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {label.emoji && <span style={{ fontSize: 15 }}>{label.emoji}</span>}
              {label.text}
            </div>
            {label.items?.map((item, ii) => (
              <div key={ii} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                {item.icon === 'check' && <DoodleCheckbox checked size={14} color="#15803d" />}
                {item.icon === 'x' && <DoodleX size={14} />}
                {item.icon === 'star' && <span style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 11, color: scene.accentColor }}>★</span>}
                {item.icon === 'dot' && <div style={{ width: 7, height: 7, borderRadius: '50%', background: scene.accentColor, border: '1.5px solid #1a1a1a', flexShrink: 0 }} />}
                <span style={{ fontFamily: "'Kalam',cursive", fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{item.label}</span>
              </div>
            ))}
          </div>
          {label.dotTrail && (
            <>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: label.bg, border: '2px solid #1a1a1a', margin: '4px 0 0 20px' }} />
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: label.bg, border: '2px solid #1a1a1a', margin: '3px 0 0 28px' }} />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

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
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 40px 40px; pointer-events: none;
        }

        .cta-main {
          font-family: 'Permanent Marker', cursive;
          display: inline-flex; align-items: center; gap: 12px;
          color: #fff; font-size: 17px; letter-spacing: 0.04em;
          padding: 15px 32px; border-radius: 6px;
          border: 4px solid #1a1a1a; box-shadow: 7px 8px 0 #1a1a1a;
          text-decoration: none; cursor: pointer;
          transition: transform 0.12s, box-shadow 0.12s;
        }
        .cta-main:hover { transform: translate(-3px,-3px) rotate(-1deg); box-shadow: 10px 11px 0 #1a1a1a; }
        .cta-main:active { transform: translate(3px,3px); box-shadow: 3px 4px 0 #1a1a1a; }

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
        {/* Auto-advance progress strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, zIndex: 20, background: 'rgba(0,0,0,0.07)' }}>
          {!paused && (
            <motion.div
              key={sceneIdx}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
              style={{ height: '100%', background: scene.accentColor, opacity: 0.75 }}
            />
          )}
        </div>

        {/* Ghost watermark */}
        <div aria-hidden style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          fontFamily: "'Permanent Marker',cursive",
          fontSize: 'clamp(100px,18vw,240px)',
          color: '#1a1a1a', opacity: 0.025,
          userSelect: 'none', whiteSpace: 'nowrap',
          pointerEvents: 'none', zIndex: 0, letterSpacing: '-0.04em',
        }}>PLAINFUEL</div>

        {/* Scene number watermark stamp */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`stamp-${sceneIdx}`}
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
            animate={{ opacity: 0.07, scale: 1, rotate: -8 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            aria-hidden
            style={{
              position: 'absolute', top: 20, right: 20, zIndex: 1,
              fontFamily: "'Permanent Marker',cursive",
              fontSize: 'clamp(60px,10vw,130px)',
              color: scene.accentColor, pointerEvents: 'none', lineHeight: 1,
            }}
          >
            {String(scene.id).padStart(2, '0')}
          </motion.div>
        </AnimatePresence>

        {/* Background doodles */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <DoodleWiggle color="#15803d" style={{ position: 'absolute', top: '10%', right: '5%', width: 100, opacity: 0.12, transform: 'rotate(-15deg)' }} />
          <DoodleWiggle color="#1a1a1a" style={{ position: 'absolute', bottom: '18%', left: '3%', width: 70, opacity: 0.07, transform: 'rotate(8deg)' }} />
          <DoodleCircle color="#15803d" style={{ position: 'absolute', top: '5%', left: '8%', width: 60, opacity: 0.06 }} />
          {([[8,20],[90,30],[15,75],[85,65],[50,90]] as [number,number][]).map(([l,t],i) => (
            <div key={i} style={{ position: 'absolute', left:`${l}%`, top:`${t}%`, width:8+i*3, height:8+i*3, borderRadius:'50%', background:'#1a1a1a', opacity:0.04 }} />
          ))}
        </div>

        {/* ══════════ MAIN GRID ══════════ */}
        <div className="pf-grid" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(24px,4vw,64px)',
          maxWidth: 1200, width: '100%',
          padding: 'clamp(40px,6vw,100px) clamp(20px,5vw,80px)',
          position: 'relative', zIndex: 2, alignItems: 'center',
        }}>

          {/* ────── LEFT: Text ────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* Scene badge */}
            <AnimatePresence mode="wait">
              <motion.div key={`badge-${sceneIdx}`}
                initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.32 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9,
                  background: scene.badgeBg, border: '3.5px solid #1a1a1a',
                  borderRadius: 4, padding: '7px 16px', boxShadow: '4px 4px 0 #1a1a1a',
                  transform: 'rotate(-1.5deg)', width: 'fit-content',
                }}>
                  <div className="pulse-dot" style={{ width: 9, height: 9, borderRadius: '50%', background: scene.accentColor, border: '2px solid #1a1a1a', flexShrink: 0 }} />
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
                  style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 'clamp(1.7rem,3.2vw,2.8rem)', lineHeight: 1.15, color: '#1a1a1a', marginBottom: 4 }}>
                  {scene.headline1}
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div key={`h2-${sceneIdx}`}
                  initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.38, delay: 0.07, ease: [0.16,1,0.3,1] }}
                  style={{ position: 'relative', display: 'inline-block' }}>
                  <span style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 'clamp(1.7rem,3.2vw,2.8rem)', lineHeight: 1.15, color: scene.headline2Color }}>
                    {scene.headline2}
                  </span>
                  <DoodleUnderline color={scene.headline2Color} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Notepad checklist */}
            <AnimatePresence mode="wait">
              <motion.div key={`note-${sceneIdx}`}
                initial={{ opacity: 0, y: 18, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: -1.5 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.36, delay: 0.1 }}>
                <NotePaper rotate={-1.5} style={{ padding: '16px 20px 18px 20px', maxWidth: 390 }}>
                  <div style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 11, color: scene.accentColor, marginBottom: 12, letterSpacing: '0.1em' }}>
                    {scene.noteTitle}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {scene.noteItems.map(({ text, checked }, i) => (
                      <motion.div key={`${sceneIdx}-ni-${i}`}
                        initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.09, ...sp }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <DoodleCheckbox checked={checked} color={checked ? scene.accentColor : '#ef4444'} size={21} />
                        <span style={{ fontFamily: "'Kalam',cursive", fontSize: 14, fontWeight: 700, color: checked ? '#1a1a1a' : '#ef4444', textDecoration: !checked ? 'line-through' : 'none', opacity: !checked ? 0.65 : 1 }}>
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
                style={{ background: '#fff', border: '3.5px solid #1a1a1a', borderRadius: 8, padding: '14px 20px 14px 28px', boxShadow: '5px 5px 0 #1a1a1a', transform: 'rotate(0.5deg)', maxWidth: 420, position: 'relative', overflow: 'hidden' }}>
                <motion.div animate={{ background: scene.accentColor }} transition={{ duration: 0.4 }}
                  style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6 }} />
                <p style={{ fontFamily: "'Kalam',cursive", fontSize: 15, fontWeight: 700, lineHeight: 1.75, color: '#1a1a1a', margin: 0 }}>
                  {scene.bodyCopy}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* CTA + dots */}
            <AnimatePresence mode="wait">
              <motion.div key={`cta-${sceneIdx}`}
                initial={{ opacity: 0, scale: 0.82 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <a href={scene.ctaHref} className="cta-main" style={{ background: scene.accentColor }}>
                    {scene.ctaText}
                    <span className="arrow-bounce" style={{ display: 'inline-block', fontSize: 20 }}>→</span>
                  </a>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <DoodleArrow color={scene.accentColor} style={{ width: 42, height: 21, transform: 'rotate(160deg) scaleX(-1)' }} />
                    <span style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 11, color: scene.accentColor, letterSpacing: '0.08em', transform: 'rotate(-3deg)', display: 'inline-block', marginTop: -2 }}>
                      {sceneIdx === 4 ? 'join us!' : 'start here!'}
                    </span>
                  </div>
                </div>

                {/* Scene nav dots */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 10, color: '#1a1a1a', opacity: 0.45, letterSpacing: '0.1em' }}>THE STORY</span>
                  <SceneDots count={SCENES.length} active={sceneIdx} onDotClick={goToScene} accentColor={scene.accentColor} />
                  <span style={{ fontFamily: "'Kalam',cursive", fontSize: 11, fontWeight: 700, color: '#1a1a1a', opacity: 0.4 }}>{sceneIdx + 1}/{SCENES.length}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ────── RIGHT: Illustration ────── */}
          <div className="pf-illus-col" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 520 }}>

            {/* Orbit ring — color animates */}
            <motion.div
              animate={{ borderColor: scene.ringColor }}
              transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: 'clamp(300px,38vw,500px)', height: 'clamp(300px,38vw,500px)', borderRadius: '50%', border: '5px dashed', opacity: 0.2 }}
            />

            {/* Glow — color animates */}
            <motion.div
              animate={{ background: `radial-gradient(circle, ${scene.glowColor} 0%, transparent 70%)` }}
              transition={{ duration: 0.6 }}
              style={{ position: 'absolute', width: '70%', height: '70%', borderRadius: '50%', filter: 'blur(44px)', pointerEvents: 'none' }}
            />

            {/* THE ILLUSTRATION — slides between scenes */}
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
                    style={{ width: 'clamp(260px,34vw,460px)', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.28))', display: 'block' }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Starburst */}
            <AnimatePresence mode="wait">
              <motion.div key={`star-${sceneIdx}`}
                initial={{ opacity: 0, scale: 0, rotate: -30 }} animate={{ opacity: 1, scale: 1, rotate: 15 }} exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', damping: 8, stiffness: 160, delay: 0.28 }}
                style={{ position: 'absolute', top: '-2%', right: '0%', zIndex: 10 }}>
                <div className="star-spin">
                  <StarBurst size={78} fill={scene.starburst.fill} label={scene.starburst.label} />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Floating annotation labels */}
            {scene.labels.map((label, idx) => renderLabel(label, idx))}

            {/* Decorative arrows */}
            <motion.div animate={{ opacity: loaded ? 0.38 : 0 }} transition={{ delay: 0.9 }}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9 }}>
              <DoodleArrow color={scene.accentColor} style={{ position: 'absolute', top: '12%', left: '8%', width: 40, opacity: 0.35, transform: 'rotate(30deg)' }} />
              <DoodleArrow color="#1a1a1a" style={{ position: 'absolute', bottom: '18%', right: '12%', width: 34, opacity: 0.18, transform: 'rotate(-140deg)' }} />
            </motion.div>
          </div>
        </div>

        {/* Bottom double rule */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: loaded ? 1 : 0 }}
          transition={{ delay: 1.4, duration: 0.7, ease: 'easeOut' }}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, background: '#1a1a1a', transformOrigin: 'left', zIndex: 10 }} />
        <motion.div animate={{ background: scene.accentColor, scaleX: loaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'absolute', bottom: 8, left: 0, right: 0, height: 2.5, transformOrigin: 'left', zIndex: 10 }} />

        {/* Scroll nudge */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: loaded ? 0.65 : 0 }} transition={{ delay: 1.8 }}
          style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 11, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 10, color: '#1a1a1a', letterSpacing: '0.12em' }}>SCROLL</span>
          <div className="scroll-bounce">
            <DoodleArrow color="#1a1a1a" style={{ width: 28, height: 14, transform: 'rotate(90deg)' }} />
          </div>
        </motion.div>

      </section>
    </>
  );
}