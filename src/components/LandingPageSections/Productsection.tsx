'use client';

/*
 * FONT SYSTEM — matching screenshot exactly:
 *
 *  F_DISPLAY  =  "Permanent Marker"  →  chunky black marker headlines ("The Modern Diet.", "Precision.")  — like screenshot
 *               thick marker strokes, rough edges, very dark #1a1a1a
 *
 *  F_SCRIPT   =  "Caveat"         →  green handwritten italic accent  ("An Invisible", "Truly", "01")
 *               flowing, loose, slightly slanted marker feel
 *
 *  F_BODY     =  "Caveat"         →  gray italic body copy  ("We consume more than ever…")
 *               same font, lighter weight, muted color, italic
 *
 *  Add to global CSS:
 *  @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Caveat:wght@400;600;700&display=swap');
 */

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import {
  ShoppingCart,
  ArrowRight,
  Zap,
  Shield,
  Star,
  type LucideIcon,
} from 'lucide-react';

/* ── font vars ── */
const FD = "'Permanent Marker', 'Segoe Print', cursive";   /* Display — chunky black marker (like screenshot 'The Modern Diet.') */
const FS = "'Caveat', cursive";                                        /* Script  — green handwritten */

/* ─────────────────────────────────────
   TYPES
───────────────────────────────────── */
interface Nutrient {
  label: string;
  value: string;
  sub: string;
  yRatio: number;
}
interface Product {
  id: number;
  name: string;
  headline: string;         /* e.g. "Begin"   — displayed in FD black */
  accentWord: string;       /* e.g. "Fast."   — displayed in FS green italic */
  grayWord: string;         /* e.g. "Always." — displayed in FS gray italic */
  sub: string;
  tag: string;
  duration: string;
  price: string;
  image: string;
  accent: string;
  accentGlow: string;
  accentSoft: string;
  desc: string;
  badges: string[];
  icon: LucideIcon;
  nutrients: Nutrient[];
}

/* ─────────────────────────────────────
   DATA
───────────────────────────────────── */
const PRODUCTS: Product[] = [
  {
    id: 0,
    name: 'Starter Pack',
    headline:    'The Beginning.',
    accentWord:  'Just Start.',
    grayWord:    'Stay consistent.',
    sub: 'Delta',
    tag: 'Trial · 7 Pouches',
    duration: '7 Days',
    price: '₹1,500',
    image: '/images/product.png',
    accent: '#22c55e',
    accentGlow: 'rgba(34,197,94,0.22)',
    accentSoft: 'rgba(34,197,94,0.09)',
    desc: 'We consume more than ever, yet our cells are starving. Seven precise pouches calibrated for first-cycle adaptation.',
    badges: ['7-Day Trial', 'Starter Formula', 'Free Delivery'],
    icon: Zap,
    nutrients: [
      { label: 'Protein',     value: '18g',   sub: 'per pouch', yRatio: 0.18 },
      { label: 'Vitamin C',   value: '80mg',  sub: '100% DV',   yRatio: 0.37 },
      { label: 'Zinc',        value: '11mg',  sub: 'Immune+',   yRatio: 0.58 },
      { label: 'Vitamin B12', value: '2.4µg', sub: 'Energy',    yRatio: 0.77 },
    ],
  },
  {
    id: 1,
    name: 'Balanced',
    headline:    'The Balance.',
    accentWord:  'Truly Yours.',
    grayWord:    'Sustained.',
    sub: 'Delta',
    tag: 'Subscription · 15 Pouches',
    duration: '15 Days',
    price: '₹2,500',
    image: '/images/Pack1.png',
    accent: '#22c55e',
    accentGlow: 'rgba(34,197,94,0.22)',
    accentSoft: 'rgba(34,197,94,0.09)',
    desc: 'Supplements shouldn\'t be a scattergun approach of generic fillers. We match bio-identical nutrients to your unique biological context.',
    badges: ['15-Day Cycle', 'Balanced Formula', 'Priority Shipping'],
    icon: Shield,
    nutrients: [
      { label: 'Protein',   value: '24g',    sub: 'per pouch',  yRatio: 0.18 },
      { label: 'Omega-3',   value: '500mg',  sub: 'Brain fuel', yRatio: 0.37 },
      { label: 'Magnesium', value: '200mg',  sub: 'Recovery',   yRatio: 0.58 },
      { label: 'Vitamin D', value: '1000IU', sub: 'Daily dose', yRatio: 0.77 },
    ],
  },
  {
    id: 2,
    name: 'Monthly',
    headline:    'The Protocol.',
    accentWord:  'Fully Committed.',
    grayWord:    'Dominate.',
    sub: 'Delta',
    tag: 'Full Cycle · 30 Pouches',
    duration: '30 Days',
    price: '₹4,500',
    image: '/images/Pack2.png',
    accent: '#22c55e',
    accentGlow: 'rgba(34,197,94,0.22)',
    accentSoft: 'rgba(34,197,94,0.09)',
    desc: 'Full commitment. Maximum transformation. The complete monthly protocol — we bridge the specific Delta within your thali.',
    badges: ['30-Day Protocol', 'Premium Formula', 'Exclusive Access'],
    icon: Star,
    nutrients: [
      { label: 'Protein',   value: '30g',  sub: 'per pouch',   yRatio: 0.18 },
      { label: 'Creatine',  value: '3g',   sub: 'Strength',    yRatio: 0.37 },
      { label: 'Vitamin E', value: '15mg', sub: 'Antioxidant', yRatio: 0.58 },
      { label: 'Iron',      value: '18mg', sub: 'Endurance',   yRatio: 0.77 },
    ],
  },
];

/* ─────────────────────────────────────
   GLOBAL SVG FILTERS
───────────────────────────────────── */
function DoodleFilters() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute', top: 0, left: 0 }}>
      <defs>
        <filter id="sk" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="3" result="noise" seed="7" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="skHeavy" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="2" result="noise" seed="3" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="lineGlow" x="-30%" y="-200%" width="160%" height="500%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
    </svg>
  );
}

/* ─────────────────────────────────────
   BACKGROUND DOODLES
───────────────────────────────────── */
const FLOAT_SHAPES = [
  { x: '82%', y: '14%', ch: '○', sz: 22, d: 0    },
  { x: '6%',  y: '46%', ch: '△', sz: 18, d: 0.9  },
  { x: '89%', y: '68%', ch: '◇', sz: 20, d: 0.4  },
  { x: '13%', y: '17%', ch: '×', sz: 16, d: 1.4  },
  { x: '76%', y: '82%', ch: '+', sz: 18, d: 0.7  },
] as const;

const STAR_COORDS = [
  { x: '81%', y: '11%', s: 18 },
  { x: '94%', y: '46%', s: 14 },
  { x: '3%',  y: '30%', s: 16 },
  { x: '7%',  y: '72%', s: 12 },
] as const;

function BgDoodles({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.09 }}>
        <motion.path
          d="M0 25% Q25% 22% 50% 25% Q75% 28% 100% 25%"
          fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round"
          animate={{ d: ['M0 25% Q25% 22% 50% 25% Q75% 28% 100% 25%', 'M0 25% Q25% 28% 50% 25% Q75% 22% 100% 25%'] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        <motion.path
          d="M0 76% Q30% 72% 60% 76% Q90% 80% 110% 76%"
          fill="none" stroke={accent} strokeWidth="1.2" strokeLinecap="round"
          animate={{ d: ['M0 76% Q30% 72% 60% 76% Q90% 80% 110% 76%', 'M0 76% Q30% 80% 60% 76% Q90% 72% 110% 76%'] }}
          transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 1 }}
        />
        {STAR_COORDS.map((st, i) => (
          <motion.text key={i} x={st.x} y={st.y} fontSize={st.s} fill={accent} textAnchor="middle"
            animate={{ opacity: [0.3, 0.9, 0.3], rotate: [0, 18, 0] }}
            transition={{ duration: 3 + i * 0.6, delay: i * 0.5, repeat: Infinity }}
          >
            ✦
          </motion.text>
        ))}
        <polyline points="2%,90% 4%,87% 6%,90% 8%,87% 10%,90% 12%,87%"
          fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <motion.circle cx="90%" cy="9%" r="58" fill="none" stroke={accent}
          strokeWidth="1.5" strokeDasharray="8 6"
          animate={{ strokeDashoffset: [0, -56] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
        <circle cx="5%" cy="61%" r="26" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="5 4" />
      </svg>
      {FLOAT_SHAPES.map((item, i) => (
        <motion.span key={i} className="absolute select-none"
          style={{ left: item.x, top: item.y, fontSize: item.sz, color: accent, opacity: 0.14, fontFamily: 'cursive' }}
          animate={{ y: [0, -10, 0], rotate: [0, 13, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4 + i * 0.5, delay: item.d, repeat: Infinity, ease: 'easeInOut' }}
        >
          {item.ch}
        </motion.span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────
   DOODLE PARTICLES
───────────────────────────────────── */
const PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: (i * 37.3 + 11) % 100,
  y: (i * 53.7 + 7) % 100,
  size: (i % 3) + 1.5,
  dur: 6 + (i % 5) * 1.5,
  delay: (i % 7) * 0.8,
  op: 0.08 + (i % 4) * 0.06,
  dx: ((i % 5) - 2) * 9,
  shape: i % 4,
}));

function DoodleParticles({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map((p) => (
        <motion.div key={p.id} className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -30, 0], x: [0, p.dx, 0], opacity: [p.op, p.op * 2, p.op] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {p.shape === 0 && <svg width={p.size * 4} height={p.size * 4} viewBox="0 0 12 12"><circle cx="6" cy="6" r="4" fill="none" stroke={accent} strokeWidth="1.4" strokeDasharray="2.5 2" /></svg>}
          {p.shape === 1 && <svg width={p.size * 3} height={p.size * 3} viewBox="0 0 12 12"><line x1="2" y1="6" x2="10" y2="6" stroke={accent} strokeWidth="1.6" strokeLinecap="round" /><line x1="6" y1="2" x2="6" y2="10" stroke={accent} strokeWidth="1.6" strokeLinecap="round" /></svg>}
          {p.shape === 2 && <svg width={p.size * 3} height={p.size * 3} viewBox="0 0 12 12"><path d="M6 1L7.2 4.6L11 4.6L8 6.9L9.2 10.5L6 8.2L2.8 10.5L4 6.9L1 4.6L4.8 4.6Z" fill={accent} opacity={0.5} /></svg>}
          {p.shape === 3 && <svg width={p.size * 3} height={p.size * 3} viewBox="0 0 12 12"><rect x="2" y="2" width="8" height="8" fill="none" stroke={accent} strokeWidth="1.4" strokeDasharray="2 2" transform="rotate(15 6 6)" /></svg>}
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────
   SKETCHY PILL — like "⚡ The Market Problem"
   Uses the dashed wobbly border from screenshot
───────────────────────────────────── */
function SketchPill({ children, accent, accentSoft }: { children: ReactNode; accent: string; accentSoft: string }) {
  return (
    <div className="relative inline-flex items-center gap-2 px-3 py-1.5">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <motion.rect x="1" y="1" width="98%" height="90%" rx="18" ry="18"
          fill={accentSoft} stroke={accent} strokeWidth="1.5" strokeDasharray="5 3"
          filter="url(#sk)"
          animate={{ strokeDashoffset: [0, -28] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
    </div>
  );
}

/* ─────────────────────────────────────
   WOBBLY BADGE (like "7-Day Trial" pills in screenshot)
───────────────────────────────────── */
function WobblyBadge({ label, accent, accentSoft, delay }: { label: string; accent: string; accentSoft: string; delay: number }) {
  return (
    <motion.div className="relative inline-block"
      initial={{ opacity: 0, scale: 0.6, rotate: -7 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 20 }}
    >
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <motion.rect x="2" y="2" width="96%" height="88%" rx="16" ry="16"
          fill={accentSoft} stroke={accent} strokeWidth="1.6" strokeDasharray="5 3"
          filter="url(#sk)"
          animate={{ strokeDashoffset: [0, -24] }}
          transition={{ duration: 5 + delay, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
      {/* Badge label in Caveat script — like screenshot */}
      <span className="relative px-3 py-1.5 inline-block"
        style={{ fontFamily: FS, fontSize: '14px', fontWeight: 600, color: accent, fontStyle: 'italic' }}>
        {label}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────
   SKETCH BUTTON — ORDER NOW
───────────────────────────────────── */
function SketchButton({ accent, accentGlow, children }: { accent: string; accentGlow: string; children: ReactNode }) {
  return (
    <motion.button className="relative overflow-hidden" style={{ padding: '11px 26px' }}
      whileHover={{ scale: 1.05, boxShadow: `0 6px 30px ${accentGlow}` }}
      whileTap={{ scale: 0.96, rotate: -1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
    >
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <motion.rect x="1" y="1" width="98%" height="94%" rx="14" ry="14"
          fill={accent} stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" filter="url(#sk)" />
        <motion.rect x="4" y="4" width="92%" height="86%" rx="10" ry="10"
          fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="7 5"
          filter="url(#sk)"
          animate={{ strokeDashoffset: [0, -38] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(110deg, transparent 22%, rgba(255,255,255,0.2) 50%, transparent 78%)' }}
        animate={{ x: ['-140%', '200%'] }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
      />
      {/* Button label in Caveat */}
      <span className="relative z-10 flex items-center gap-2"
        style={{ fontFamily: FS, fontSize: '17px', fontWeight: 700, color: '#111', letterSpacing: '0.04em' }}>
        {children}
      </span>
    </motion.button>
  );
}

/* ─────────────────────────────────────
   SKETCH NAV BUTTON
───────────────────────────────────── */
function SketchNavBtn({ index, isActive, accent, onClick }: { index: number; isActive: boolean; accent: string; onClick: () => void }) {
  return (
    <motion.button onClick={onClick} className="relative w-10 h-10 flex items-center justify-center"
      whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}>
      <svg className="absolute inset-0" width="40" height="40" viewBox="0 0 40 40" fill="none">
        <motion.circle cx="20" cy="20" r="17"
          fill={isActive ? accent + '22' : 'transparent'}
          stroke={isActive ? accent : 'rgba(0,0,0,0.14)'}
          strokeWidth="1.8" strokeDasharray={isActive ? '0' : '5 3'}
          filter="url(#sk)"
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        {isActive && (
          <motion.circle cx="20" cy="20" r="19" fill="none"
            stroke={accent} strokeWidth="1" strokeDasharray="4 4" opacity={0.4}
            animate={{ strokeDashoffset: [0, -28] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </svg>
      {/* Nav number in Caveat like "01" "02" */}
      <span className="relative z-10"
        style={{ fontFamily: FS, fontSize: '15px', fontWeight: 700, color: isActive ? accent : 'rgba(0,0,0,0.28)' }}>
        {String(index + 1).padStart(2, '0')}
      </span>
    </motion.button>
  );
}

/* ─────────────────────────────────────
   PRICE TICKER
───────────────────────────────────── */
function PriceTicker({ price }: { price: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={price}
        initial={{ y: 24, opacity: 0, rotate: -2 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: -24, opacity: 0, rotate: 2 }}
        transition={{ duration: 0.34, type: 'spring', stiffness: 280 }}
      >
        {/* Price in Caveat — big handwritten number */}
        <span style={{ fontFamily: FS, fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)', fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>
          {price}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────
   STAGE CONSTANTS
───────────────────────────────────── */
const STAGE_W   = 460;
const STAGE_H   = 520;
const IMG_W     = 268;
const IMG_H     = 352;
const IMG_LEFT  = (STAGE_W - IMG_W) / 2;
const IMG_TOP   = (STAGE_H - IMG_H) / 2;
const IMG_RIGHT = IMG_LEFT + IMG_W;

/* ─────────────────────────────────────
   SKETCH CORNER BRACKETS
───────────────────────────────────── */
function SketchBrackets({ accent, w, h }: { accent: string; w: number; h: number }) {
  const sz = 26;
  const paths = [
    `M ${sz} 0 L 0 0 L 0 ${sz}`,
    `M ${w - sz} 0 L ${w} 0 L ${w} ${sz}`,
    `M ${w} ${h - sz} L ${w} ${h} L ${w - sz} ${h}`,
    `M 0 ${h - sz} L 0 ${h} L ${sz} ${h}`,
  ];
  return (
    <svg className="absolute pointer-events-none" style={{ top: 0, left: 0 }} width={w} height={h} fill="none">
      {paths.map((d, i) => (
        <motion.path key={i} d={d} stroke={accent} strokeWidth="2.2" strokeLinecap="round"
          filter="url(#sk)"
          animate={{ opacity: [0.45, 0.95, 0.45] }}
          transition={{ duration: 2.4, delay: i * 0.28, repeat: Infinity }}
        />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────
   HEX GRID
───────────────────────────────────── */
const HEX_CELLS = Array.from({ length: 19 }, (_, i) => {
  const col = i % 4, row = Math.floor(i / 4);
  return { id: i, cx: col * 56 + (row % 2) * 28 - 84, cy: row * 48 - 96, delay: (col + row) * 0.14, ring: col + row };
});

function HexGrid({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <svg width="380" height="380" viewBox="-190 -190 380 380" style={{ opacity: 0.1 }}>
        {HEX_CELLS.map((c) => (
          <motion.polygon key={c.id} points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11"
            fill="none" stroke={accent} strokeWidth="0.8" strokeDasharray="3 3"
            transform={`translate(${c.cx},${c.cy})`}
            animate={{ strokeOpacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3.4 + (c.ring % 3) * 0.5, delay: c.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────
   NUTRIENT ANNOTATIONS
   Lines from product right edge → cards
   Card label uses: Permanent Marker for label name, Caveat green for value
───────────────────────────────────── */
function NutrientAnnotations({
  accent, accentSoft, nutrients, activeIdx,
}: { accent: string; accentSoft: string; accentGlow: string; nutrients: Nutrient[]; activeIdx: number }) {
  const SVG_W  = STAGE_W + 220;
  const CARD_X = IMG_RIGHT + 28;

  return (
    <AnimatePresence mode="wait">
      <motion.div key={`ann-${activeIdx}`} className="absolute inset-0 pointer-events-none"
        style={{ width: SVG_W, height: STAGE_H }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.38 }}
      >
        <svg width={SVG_W} height={STAGE_H} style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
          <defs>
            <marker id={`tip-${activeIdx}`} markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto">
              <path d="M8 1.5 L1 4 L8 6.5" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>

          {nutrients.map((n, i) => {
            const dotX  = IMG_RIGHT;
            const lineY = IMG_TOP + n.yRatio * IMG_H;
            const cardY = lineY - 26;

            return (
              <motion.g key={n.label}>
                {/* Dashed line */}
                <motion.line x1={dotX} y1={lineY} x2={CARD_X - 4} y2={lineY}
                  stroke={accent} strokeWidth="1.5" strokeDasharray="5 4" strokeLinecap="round"
                  filter="url(#lineGlow)"
                  markerStart={`url(#tip-${activeIdx})`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.7 }}
                  transition={{ duration: 0.5, delay: i * 0.11 + 0.1, ease: 'easeOut' }}
                />
                {/* Dot on product */}
                <motion.circle cx={dotX} cy={lineY} r={4} fill={accent} opacity={0.92}
                  initial={{ scale: 0 }} animate={{ scale: [0, 1.8, 1] }}
                  transition={{ duration: 0.38, delay: i * 0.11 + 0.42, ease: 'backOut' }}
                />
                <motion.circle cx={dotX} cy={lineY} r={4} fill="none" stroke={accent} strokeWidth="1.1"
                  animate={{ r: [4, 13], opacity: [0.5, 0] }}
                  transition={{ duration: 2, delay: i * 0.11 + 0.6, repeat: Infinity, ease: 'easeOut' }}
                />
                {/* Card with sketchy doodle border */}
                <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.34, delay: i * 0.1 + 0.18 }}
                >
                  <rect x={CARD_X} y={cardY} width={160} height={54} rx={10}
                    fill={accentSoft} stroke={accent} strokeWidth="1.6" strokeDasharray="5 3"
                    filter="url(#sk)" opacity={0.95}
                  />
                  <motion.circle cx={CARD_X} cy={lineY} r={4.5}
                    fill="white" stroke={accent} strokeWidth="2"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2.2, delay: i * 0.3, repeat: Infinity }}
                  />
                  {/* Value — Caveat green, big */}
                  <text x={CARD_X + 16} y={cardY + 22}
                    fill={accent} fontSize="18" fontWeight="700" fontFamily={FS} fontStyle="italic">
                    {n.value}
                  </text>
                  {/* Sub — small Caveat */}
                  <text x={CARD_X + 16 + Math.max(n.value.length * 9, 26)} y={cardY + 21}
                    fill={accent} fontSize="8" fontWeight="600" letterSpacing="1.2" opacity={0.55}
                    fontFamily={FS} style={{ textTransform: 'uppercase' }}>
                    {n.sub}
                  </text>
                  {/* Label — Permanent Marker display, small caps style */}
                  <text x={CARD_X + 16} y={cardY + 38}
                    fill="rgba(0,0,0,0.5)" fontSize="9" fontWeight="400" letterSpacing="1.8"
                    fontFamily={FD} style={{ textTransform: 'uppercase' }}>
                    {n.label}
                  </text>
                  {/* Animated bar */}
                  <motion.rect x={CARD_X + 16} y={cardY + 44} height={2} rx={1}
                    fill={accent} opacity={0.28}
                    initial={{ width: 0 }} animate={{ width: 126 }}
                    transition={{ duration: 0.5, delay: i * 0.1 + 0.38 }}
                  />
                </motion.g>
              </motion.g>
            );
          })}
        </svg>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────
   PRODUCT STAGE
───────────────────────────────────── */
function ProductStage({ activeIdx, mouseX, mouseY }: {
  activeIdx: number; mouseX: MotionValue<number>; mouseY: MotionValue<number>;
}) {
  const product  = PRODUCTS[activeIdx];
  const rotateX  = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY  = useTransform(mouseX, [-0.5, 0.5], [-11, 11]);
  const springRX = useSpring(rotateX, { stiffness: 70, damping: 18 });
  const springRY = useSpring(rotateY, { stiffness: 70, damping: 18 });

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: STAGE_W, height: STAGE_H }}>
      {/* Blob */}
      <motion.div className="absolute pointer-events-none" style={{ width: 330, height: 330 }}
        animate={{ rotate: [0, 360] }} transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}>
        <svg viewBox="-120 -120 240 240" width="100%" height="100%">
          <defs>
            <radialGradient id="bGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={product.accent} stopOpacity="0.22" />
              <stop offset="100%" stopColor={product.accent} stopOpacity="0" />
            </radialGradient>
          </defs>
          <motion.path fill="url(#bGrad)"
            animate={{ d: [
              'M55,-65C67,-52,70,-32,67,-13C64,6,55,24,41,42C27,60,9,78,-12,80C-33,82,-55,67,-68,46C-81,25,-83,-3,-74,-26Z',
              'M50,-60C63,-48,70,-28,68,-10C66,8,55,25,41,43C27,61,9,79,-12,81C-33,83,-57,68,-70,46Z',
              'M55,-65C67,-52,70,-32,67,-13C64,6,55,24,41,42C27,60,9,78,-12,80C-33,82,-55,67,-68,46C-81,25,-83,-3,-74,-26Z',
            ]}}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>

      <HexGrid accent={product.accent} />

      {/* Brackets */}
      <div className="absolute" style={{ left: IMG_LEFT - 14, top: IMG_TOP - 14, width: IMG_W + 28, height: IMG_H + 28 }}>
        <SketchBrackets accent={product.accent} w={IMG_W + 28} h={IMG_H + 28} />
      </div>

      {/* Scan sweep */}
      <div className="absolute overflow-hidden pointer-events-none" style={{ width: IMG_W, height: IMG_H, left: IMG_LEFT, top: IMG_TOP }}>
        <motion.div className="absolute inset-x-0"
          style={{ background: `linear-gradient(180deg, transparent 0%, ${product.accent}1e 50%, transparent 100%)`, height: '28%' }}
          animate={{ top: ['-28%', '128%'] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', repeatDelay: 1.8 }}
        />
      </div>

      {/* Ground shadow */}
      <motion.div className="absolute rounded-full blur-2xl"
        animate={{ backgroundColor: product.accent, scaleX: [1, 1.2, 1], opacity: [0.18, 0.28, 0.18] }}
        transition={{ backgroundColor: { duration: 0.7 }, scaleX: { duration: 3, repeat: Infinity }, opacity: { duration: 3, repeat: Infinity } }}
        style={{ width: 190, height: 24, bottom: 20 }}
      />

      {/* Product image */}
      <AnimatePresence mode="wait">
        <motion.div key={`img-${activeIdx}`}
          initial={{ opacity: 0, scale: 0.35, y: 48, rotateY: -38, filter: 'blur(14px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.38, y: -44, rotateY: 38, filter: 'blur(10px)' }}
          transition={{ duration: 0.62, type: 'spring', bounce: 0.2 }}
          style={{
            rotateX: springRX, rotateY: springRY,
            transformStyle: 'preserve-3d', position: 'relative', zIndex: 10,
            filter: [`drop-shadow(0 44px 52px ${product.accentGlow})`, `drop-shadow(0 0 22px ${product.accentGlow})`].join(' '),
          }}
        >
          <motion.div animate={{ y: [0, -18, 0], rotateZ: [-0.6, 0.6, -0.6] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}>
            <div style={{ position: 'relative', width: IMG_W, height: IMG_H }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image} alt={product.name} style={{ width: IMG_W, height: IMG_H, objectFit: 'contain', display: 'block' }} />
              <motion.div
                style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, transparent 22%, rgba(255,255,255,0.16) 50%, transparent 78%)', borderRadius: 8, pointerEvents: 'none' }}
                animate={{ x: ['-120%', '180%'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3.2 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Dashed ring pulses */}
      {[1, 2, 3].map((ring) => (
        <motion.div key={ring} className="absolute rounded-full pointer-events-none"
          style={{ border: `1.5px dashed ${product.accent}` }}
          animate={{ width: [50, 420], height: [50, 420], opacity: [0.32, 0] }}
          transition={{ duration: 4, delay: ring * 1.25, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* Annotations */}
      <NutrientAnnotations
        accent={product.accent} accentSoft={product.accentSoft} accentGlow={product.accentGlow}
        nutrients={product.nutrients} activeIdx={activeIdx}
      />
    </div>
  );
}

/* ─────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────── */
export default function ProductSection() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const stageRef  = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const rawProgress    = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, { stiffness: 50, damping: 18 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    function onScroll() {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const top      = wrap.getBoundingClientRect().top + window.scrollY;
      const scrolled = window.scrollY - top;
      const total    = window.innerHeight * 2;
      const progress = Math.min(1, Math.max(0, scrolled / total));
      rawProgress.set(progress);
      if      (progress < 1 / 3) setActiveIdx(0);
      else if (progress < 2 / 3) setActiveIdx(1);
      else                        setActiveIdx(2);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [rawProgress]);

  const bandStart    = activeIdx / 3;
  const bandEnd      = (activeIdx + 1) / 3;
  const fillProgress = useTransform(smoothProgress, [bandStart, bandEnd], [0, 1]);
  const fillWidth    = useTransform(fillProgress, (v: number) =>
    `${Math.round(Math.min(100, Math.max(0, v * 100)))}%`
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width  - 0.5);
    mouseY.set((e.clientY - r.top)  / r.height - 0.5);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => { mouseX.set(0); mouseY.set(0); }, [mouseX, mouseY]);

  const scrollToProduct = useCallback((i: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const top = wrap.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (i / 3) * window.innerHeight * 2, behavior: 'smooth' });
  }, []);

  const product = PRODUCTS[activeIdx];
  const Icon    = product.icon;

  return (
    <>
      <DoodleFilters />

      <div ref={wrapRef} style={{ height: '300vh', position: 'relative' }}>
        <div style={{
          position: 'sticky', top: 0, height: '100vh', width: '100%',
          overflow: 'hidden', background: '#f5f5ee',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Atmosphere */}
          <motion.div className="absolute inset-0 pointer-events-none"
            animate={{ background: `radial-gradient(ellipse 65% 65% at 65% 52%, ${product.accentGlow} 0%, transparent 65%)` }}
            transition={{ duration: 0.9 }} />
          <motion.div className="absolute inset-0 pointer-events-none"
            animate={{ background: `radial-gradient(ellipse 42% 44% at 8% 80%, ${product.accentSoft} 0%, transparent 72%)` }}
            transition={{ duration: 0.9 }} />

          {/* Paper grain */}
          <div className="absolute inset-0 pointer-events-none" style={{
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }} />

          <BgDoodles accent={product.accent} />
          <DoodleParticles accent={product.accent} />

          {/* ══════ HEADER ══════ */}
          <div style={{ flexShrink: 0 }} className="relative z-20 flex items-start justify-between px-6 sm:px-10 md:px-14 pt-6 sm:pt-8">
            <div>
              {/* Sketch pill — like "⚡ The Market Problem" */}
              <SketchPill accent={product.accent} accentSoft={product.accentSoft}>
                <motion.div className="w-1.5 h-1.5 rounded-full"
                  animate={{ backgroundColor: product.accent, scale: [1, 1.7, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }} />
                {/* Pill text in Caveat italic */}
                <span style={{ fontFamily: FS, fontSize: '13px', fontWeight: 600, color: product.accent, fontStyle: 'italic' }}>
                  The Shop
                </span>
              </SketchPill>

              {/* Title block — Permanent Marker black + Caveat green italic */}
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-0.5">
                  <svg width="18" height="9" viewBox="0 0 18 9" fill="none">
                    <path d="M1 4.5 Q9 2 17 4.5" stroke={product.accent} strokeWidth="1.5" strokeLinecap="round" filter="url(#sk)" opacity="0.45" />
                  </svg>
                  {/* "Select Your" — Caveat muted */}
                  <span style={{ fontFamily: FS, fontSize: '12px', color: 'rgba(0,0,0,0.36)', letterSpacing: '0.22em', textTransform: 'uppercase', fontStyle: 'italic' }}>
                    Select Your
                  </span>
                </div>

                {/* "Fuel" — Permanent Marker BLACK bold serif (like "What's" in screenshot) */}
                {/* "Cycle."  — Caveat GREEN italic (like "ACTUALLY" in screenshot) */}
                <div style={{ lineHeight: 1 }}>
                  <span style={{ fontFamily: FD, fontSize: 'clamp(2.4rem, 6vw, 4.4rem)', color: '#1a1a1a', letterSpacing: '-0.01em' }}>
                    Fuel{' '}
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.span key={`fctitle-${activeIdx}`}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      style={{ fontFamily: FS, fontSize: 'clamp(2.5rem, 6.5vw, 4.6rem)', fontWeight: 700, color: product.accent, fontStyle: 'italic' }}
                    >
                      Cycle.
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Squiggly underline */}
                <svg width="260" height="12" viewBox="0 0 260 12" fill="none" style={{ display: 'block', marginTop: 3 }}>
                  <motion.path
                    d="M2 7 Q22 2 44 7 Q66 12 88 6 Q110 2 132 7 Q154 12 176 6 Q198 2 220 7 Q242 11 258 7"
                    stroke={product.accent} strokeWidth="2.5" strokeLinecap="round" filter="url(#sk)"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                  />
                </svg>
              </div>
            </div>

            {/* Step nav */}
            <div className="hidden md:flex flex-col items-end gap-3">
              <div className="flex items-center gap-1">
                {PRODUCTS.map((_, i) => (
                  <SketchNavBtn key={i} index={i} isActive={i === activeIdx} accent={product.accent} onClick={() => scrollToProduct(i)} />
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="12" height="18" viewBox="0 0 12 18" fill="none">
                  <motion.path d="M6 1 L6 14 M2 11 L6 15 L10 11"
                    stroke={product.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                    animate={{ y: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity }} />
                </svg>
                <span style={{ fontFamily: FS, fontSize: '12px', color: 'rgba(0,0,0,0.34)', letterSpacing: '0.08em', fontStyle: 'italic' }}>scroll</span>
              </div>
            </div>
          </div>

          {/* ══════ BODY ══════ */}
          <div className="relative z-10 flex flex-col lg:flex-row px-6 sm:px-10 md:px-14 gap-4 lg:gap-0"
            style={{ flex: 1, minHeight: 0, alignItems: 'center', overflow: 'hidden' }}>

            {/* LEFT COPY */}
            <div className="flex flex-col justify-center w-full lg:w-auto flex-shrink-0" style={{ maxWidth: 400 }}>

              {/* Tag */}
              <AnimatePresence mode="wait">
                <motion.div key={`tag-${activeIdx}`}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 14 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 mb-3"
                >
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <svg className="absolute inset-0" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <motion.rect x="2" y="2" width="28" height="28" rx="8"
                        fill={product.accentSoft} stroke={product.accent} strokeWidth="1.6" strokeDasharray="4 2.5"
                        filter="url(#sk)"
                        animate={{ strokeDashoffset: [0, -20] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      />
                    </svg>
                    <Icon style={{ color: product.accent, width: 14, height: 14, position: 'relative', zIndex: 1 }} />
                  </div>
                  {/* Tag text — Caveat italic */}
                  <span style={{ fontFamily: FS, fontSize: '14px', fontWeight: 600, color: product.accent, letterSpacing: '0.08em', textTransform: 'uppercase', fontStyle: 'italic' }}>
                    {product.tag}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* ── THREE-LINE HEADLINE — matching screenshot exactly ──
                  Line 1: "The Beginning."   →  Permanent Marker, #1a1a1a, large
                  Line 2: "Just Start."      →  Caveat, green, italic, large
                  Line 3: "Stay consistent." →  Caveat, gray, italic, slightly smaller
              */}
              <div style={{ overflow: 'hidden', marginBottom: 6 }}>
                <AnimatePresence mode="wait">
                  <motion.div key={`hl-${activeIdx}`}
                    initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-110%', opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Line 1 — Permanent Marker BLACK (like "The Modern Diet." in screenshot) */}
                    <div style={{
                      fontFamily: FD,
                      fontSize: 'clamp(1.9rem, 4.8vw, 3.2rem)',
                      color: '#1a1a1a',
                      lineHeight: 1.05,
                      letterSpacing: '0.01em',
                    }}>
                      {product.headline}
                    </div>

                    {/* Line 2 — Caveat GREEN italic (like "An Invisible" in screenshot — the accent phrase) */}
                    <div style={{
                      fontFamily: FS,
                      fontSize: 'clamp(1.9rem, 5vw, 3.2rem)',
                      fontWeight: 700,
                      color: product.accent,
                      fontStyle: 'italic',
                      lineHeight: 1.05,
                      textShadow: `0 0 40px ${product.accentGlow}`,
                    }}>
                      {product.accentWord}
                    </div>

                    {/* Line 3 — Caveat GRAY italic (like "Depletion." in screenshot — the muted third line) */}
                    <div style={{
                      fontFamily: FS,
                      fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
                      fontWeight: 600,
                      color: 'rgba(0,0,0,0.32)',
                      fontStyle: 'italic',
                      lineHeight: 1.1,
                    }}>
                      {product.grayWord}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Description — Caveat italic body copy (like screenshot paragraphs) */}
              <AnimatePresence mode="wait">
                <motion.div key={`desc-${activeIdx}`}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.36, delay: 0.08 }}
                  className="relative mb-5" style={{ maxWidth: 315 }}
                >
                  {/* Sketchy left border bar */}
                  <svg className="absolute" style={{ left: 0, top: 0, height: '100%' }} width="5" viewBox="0 0 5 100" preserveAspectRatio="none">
                    <motion.path d="M2.5 0 Q3.5 25 2.5 50 Q1.5 75 2.5 100"
                      stroke={product.accent} strokeWidth="2" strokeLinecap="round" fill="none"
                      filter="url(#sk)"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.45 }}
                    />
                  </svg>
                  <p className="pl-4"
                    style={{ fontFamily: FS, fontSize: '15px', fontStyle: 'italic', color: 'rgba(0,0,0,0.5)', lineHeight: 1.6 }}>
                    {product.desc}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Badges — Caveat italic inside wobbly dashed pills */}
              <AnimatePresence mode="wait">
                <motion.div key={`bdg-${activeIdx}`} className="flex flex-wrap gap-2 mb-5"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.26 }}>
                  {product.badges.map((badge, i) => (
                    <WobblyBadge key={badge} label={badge} accent={product.accent} accentSoft={product.accentSoft} delay={i * 0.07 + 0.1} />
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Price + CTA */}
              <div className="flex flex-wrap items-end gap-5">
                <div>
                  {/* "PRICE" label — Permanent Marker small */}
                  <div className="mb-0.5">
                    <span style={{ fontFamily: FD, fontSize: '10px', color: 'rgba(0,0,0,0.36)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                      Price
                    </span>
                  </div>
                  {/* Price number — Caveat big */}
                  <PriceTicker price={product.price} />
                  {/* "7 Days supply" — Caveat italic small */}
                  <div>
                    <span style={{ fontFamily: FS, fontSize: '13px', color: 'rgba(0,0,0,0.38)', fontStyle: 'italic' }}>
                      {product.duration} supply
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <AnimatePresence mode="wait">
                    <motion.div key={`cta-${activeIdx}`}
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.22 }}>
                      <SketchButton accent={product.accent} accentGlow={product.accentGlow}>
                        <ShoppingCart className="w-4 h-4" />
                        Order Now
                      </SketchButton>
                    </motion.div>
                  </AnimatePresence>

                  <motion.button className="flex items-center gap-1"
                    style={{ fontFamily: FS, fontSize: '15px', color: 'rgba(0,0,0,0.38)', fontStyle: 'italic' }}
                    whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* CENTER / RIGHT: stage */}
            <div ref={stageRef} className="flex items-center justify-center"
              style={{ flex: 1, minWidth: 0, overflow: 'visible', perspective: '1200px' }}
              onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
              <ProductStage activeIdx={activeIdx} mouseX={mouseX} mouseY={mouseY} />
            </div>

            {/* FAR-RIGHT vertical nav rail */}
            <div className="hidden xl:flex flex-col items-center justify-center flex-shrink-0" style={{ width: 58 }}>
              <div className="relative flex flex-col items-center">
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
                  style={{ width: 1, backgroundImage: `repeating-linear-gradient(to bottom, ${product.accent}35 0, ${product.accent}35 4px, transparent 4px, transparent 10px)` }} />
                {PRODUCTS.map((p, i) => (
                  <button key={i} onClick={() => scrollToProduct(i)} className="relative z-10 flex flex-col items-center gap-2 py-5">
                    <motion.div animate={{ scale: i === activeIdx ? 1.5 : 1 }} transition={{ duration: 0.3 }}>
                      <svg width="12" height="12" viewBox="0 0 12 12">
                        <motion.circle cx="6" cy="6" r="4.5"
                          fill={i === activeIdx ? p.accent : 'transparent'}
                          stroke={i === activeIdx ? p.accent : 'rgba(0,0,0,0.2)'}
                          strokeWidth="1.4" strokeDasharray={i === activeIdx ? '0' : '3 2'}
                          filter="url(#sk)"
                          animate={{ filter: i === activeIdx ? `drop-shadow(0 0 5px ${p.accent})` : 'none' }}
                          transition={{ duration: 0.3 }}
                        />
                      </svg>
                    </motion.div>
                    <motion.span animate={{ opacity: i === activeIdx ? 1 : 0.24, color: i === activeIdx ? p.accent : '#000' }}
                      transition={{ duration: 0.3 }}
                      style={{ writingMode: 'vertical-rl', letterSpacing: '0.14em', fontFamily: FS, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', fontStyle: 'italic' }}>
                      {p.name}
                    </motion.span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ══════ BOTTOM PROGRESS ══════ */}
          <div style={{ flexShrink: 0 }} className="relative z-20 px-6 sm:px-10 md:px-14 pb-5 sm:pb-6">
            <div className="flex items-center justify-between mb-2">
              {/* Progress label — Caveat italic */}
              <span style={{ fontFamily: FS, fontSize: '13px', color: 'rgba(0,0,0,0.34)', fontStyle: 'italic' }}>
                {String(activeIdx + 1).padStart(2, '0')} / 03
              </span>
              {/* Product name — Permanent Marker */}
              <motion.span
                style={{ fontFamily: FD, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                animate={{ color: product.accent }} transition={{ duration: 0.4 }}>
                {product.name}
              </motion.span>
            </div>

            {/* Doodle progress track */}
            <div className="relative" style={{ height: 8 }}>
              <svg className="absolute inset-0 w-full" height="8" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                <path d="M0 4 Q50% 2 100% 4" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2.5" strokeLinecap="round" filter="url(#sk)" />
              </svg>
              <motion.div style={{
                position: 'absolute', top: 2, left: 0, height: 4, borderRadius: 999,
                width: fillWidth, backgroundColor: product.accent, boxShadow: `0 0 12px ${product.accent}`,
              }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}