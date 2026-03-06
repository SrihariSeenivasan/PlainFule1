'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

const PRODUCT_ROUTES = {
  b12: '/products/vitamin-b-complex',
  calcium: '/products/calcium-magnesium',
  zinc: '/products/zinc-selenium',
  vitaminc: '/products/vitamin-c',
  fiber: '/products/fiber-enzymes',
};

const T = {
  paper: '#fdf8ee',
  paperDark: '#f5edd8',
  ink: '#1c1a16',
  inkLight: '#3d3a32',
  green: '#2d8a4e',
  greenLight: '#4abe6e',
  orange: '#d4500a',
  blue: '#1a5fa8',
  amber: '#b5780a',
  teal: '#0e8a72',
  red: '#c0392b',
};

// ─── SVG helpers ──────────────────────────────────────────────────────────────

function WatercolorBlob({ color, opacity = 0.12, size = 300, style }: { color: string; opacity?: number; size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <path d="M50,20 C80,5 140,10 165,40 C190,70 185,130 160,155 C135,180 70,185 40,160 C10,135 5,80 15,50 C25,20 30,30 50,20Z" fill={color} opacity={opacity} />
    </svg>
  );
}

function InkUnderline({ color = T.green, width = 100, wobble = 1 }: { color?: string; width?: number; wobble?: number }) {
  const mid = width / 2;
  return (
    <svg width={width} height={12} viewBox={`0 0 ${width} 12`} fill="none">
      <path d={`M3 ${8 + wobble} C${mid * 0.4} ${5 + wobble * 2}, ${mid * 0.8} ${10 - wobble}, ${mid} ${7 + wobble}, ${mid * 1.3} ${4 + wobble}, ${mid * 1.7} ${9 - wobble}, ${width - 3} ${6 + wobble}`} stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function InkCircleHighlight({ color = T.orange, width = 100, height = 36 }: { color?: string; width?: number; height?: number }) {
  const w = width; const h = height;
  return (
    <svg width={w + 14} height={h + 14} viewBox={`0 0 ${w + 14} ${h + 14}`} fill="none" style={{ position: 'absolute', top: -7, left: -7, pointerEvents: 'none' }}>
      <path d={`M${w * 0.1},${h * 0.15} C${w * 0.3},${h * -0.1} ${w * 0.7},${h * -0.05} ${w * 0.95},${h * 0.2} C${w * 1.1},${h * 0.5} ${w * 1.05},${h * 0.8} ${w * 0.85},${h * 1.1} C${w * 0.6},${h * 1.25} ${w * 0.3},${h * 1.2} ${w * 0.1},${h * 0.95} C${w * -0.05},${h * 0.7} ${w * -0.05},${h * 0.4} ${w * 0.1},${h * 0.15}Z`} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="7 3" />
    </svg>
  );
}

function CheckMark({ color = T.green, size = 22 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M5 17 L13 25 L27 8" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DoodleStarburst({ color = T.amber, size = 48 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      {Array.from({ length: 8 }).map((_, i) => {
        const r = (i * 45 * Math.PI) / 180;
        return <line key={i} x1={30 + 11 * Math.cos(r)} y1={30 + 11 * Math.sin(r)} x2={30 + 24 * Math.cos(r)} y2={30 + 24 * Math.sin(r)} stroke={color} strokeWidth="2.2" strokeLinecap="round" />;
      })}
      <circle cx="30" cy="30" r="9" stroke={color} strokeWidth="1.8" fill="none" />
    </svg>
  );
}

function StickyNote({ children, color = '#fef08a', rotate = -2, style }: { children: ReactNode; color?: string; rotate?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotate: rotate - 5 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true }}
      transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
      whileHover={{ scale: 1.04, rotate: 0 }}
      style={{
        background: color, padding: '10px 13px', borderRadius: 4,
        boxShadow: '3px 4px 10px rgba(0,0,0,0.13), inset 0 -2px 0 rgba(0,0,0,0.07)',
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", fontSize: 12, fontWeight: 500,
        color: T.inkLight, lineHeight: 1.5, ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

function ChapterLabel({ chapter, title, color }: { chapter: string; title: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}
    >
      <div style={{ background: color, color: '#fff', fontFamily: "'Permanent Marker', cursive", fontSize: 12, padding: '3px 12px', borderRadius: 20, letterSpacing: '0.12em', boxShadow: `2px 2px 0 ${color}50`, whiteSpace: 'nowrap' }}>{chapter}</div>
      <div style={{ flex: 1, height: 1.5, background: `linear-gradient(to right, ${color}60, transparent)` }} />
      <h3 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 22, color: T.ink, whiteSpace: 'nowrap' }}>{title}</h3>
      <div style={{ flex: 1, height: 1.5, background: `linear-gradient(to left, ${color}60, transparent)` }} />
    </motion.div>
  );
}

function FloatingDoodle({ children, style, delay = 0 }: { children: ReactNode; style?: React.CSSProperties; delay?: number }) {
  return (
    <motion.div animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }} transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }} style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      {children}
    </motion.div>
  );
}

function LeafDoodle({ color = T.green, size = 32, flip = false }: { color?: string; size?: number; flip?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <path d="M10 40 C12 25, 25 10, 40 8 C38 23, 25 38, 10 40Z" stroke={color} strokeWidth="2" fill={`${color}15`} strokeLinecap="round" />
      <path d="M10 40 C18 32, 28 22, 40 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function Sparkle({ color = T.amber, size = 22 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2 L17.5 14 L29 16 L17.5 18 L16 30 L14.5 18 L3 16 L14.5 14 Z" stroke={color} strokeWidth="1.8" fill={`${color}20`} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowLeft({ color = T.green, size = 52 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 80 40" fill="none">
      <path d="M76 20 C60 18, 36 16, 18 20" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M25 10 L8 20 L25 30" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function SquigglyBrace({ color = T.green, height = 90, side = 'left' }: { color?: string; height?: number; side?: 'left' | 'right' }) {
  const w = 20;
  const mid = height / 2;
  const path = side === 'left'
    ? `M${w} 6 C${w * 0.3} 6, 4 ${mid * 0.3}, 4 ${mid} C4 ${mid * 1.7}, ${w * 0.3} ${height - 6}, ${w} ${height - 6}`
    : `M4 6 C${w * 0.7} 6, ${w} ${mid * 0.3}, ${w} ${mid} C${w} ${mid * 1.7}, ${w * 0.7} ${height - 6}, 4 ${height - 6}`;
  return (
    <svg width={w + 4} height={height} viewBox={`0 0 ${w + 4} ${height}`} fill="none">
      <path d={path} stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="4 3" />
    </svg>
  );
}

function FactBadge({ emoji, text, color, rotate = 0 }: { emoji: string; text: string; color: string; rotate?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotate: rotate - 8 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true }}
      transition={{ type: 'spring', bounce: 0.45, duration: 0.6 }}
      whileHover={{ scale: 1.07, rotate: 0 }}
      style={{
        background: `${color}14`,
        border: `1.5px solid ${color}`,
        borderRadius: 10,
        padding: '5px 9px',
        display: 'flex', alignItems: 'center', gap: 5,
        boxShadow: `2px 2px 0 ${color}28`,
        transform: `rotate(${rotate}deg)`,
        cursor: 'default',
      }}
    >
      <span style={{ fontSize: 14 }}>{emoji}</span>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, color, lineHeight: 1.3 }}>{text}</span>
    </motion.div>
  );
}

function DottedLine({ color = T.green, height = 28 }: { color?: string; height?: number }) {
  return (
    <svg width="10" height={height} viewBox={`0 0 10 ${height}`} fill="none" style={{ margin: '0 auto', display: 'block' }}>
      <line x1="5" y1="0" x2="5" y2={height} stroke={color} strokeWidth="1.8" strokeDasharray="3 3" strokeLinecap="round" />
    </svg>
  );
}

/** Chapter 1 video — LEFT side decoration column */
function Ch1VideoLeft() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 8, padding: '12px 6px',
      minWidth: 62, maxWidth: 76,
    }}>
      <motion.div
        animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <LeafDoodle color={T.green} size={34} />
      </motion.div>
      <DottedLine color={T.green} height={20} />
      <FactBadge emoji="☀️" text="Morning" color={T.amber} rotate={-4} />
      <DottedLine color={T.amber} height={20} />
      <FactBadge emoji="⚡" text="Energy Dip" color={T.orange} rotate={3} />
      <DottedLine color={T.orange} height={20} />
      <FactBadge emoji="💧" text="1 Sachet" color={T.teal} rotate={-3} />
      <DottedLine color={T.teal} height={20} />
      <FactBadge emoji="🌙" text="Steady" color={T.blue} rotate={4} />
      <DottedLine color={T.green} height={16} />
      <motion.div
        animate={{ rotate: [-5, 5, -5], y: [0, -5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkle color={T.amber} size={24} />
      </motion.div>
    </div>
  );
}

/** Chapter 1 video — RIGHT side decoration column */
function Ch1VideoRight() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 10, padding: '12px 6px',
      minWidth: 66, maxWidth: 82,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <span style={{ fontFamily: "'Caveat', cursive", fontSize: 12, fontWeight: 700, color: T.green, transform: 'rotate(-5deg)', display: 'block' }}>Real story→</span>
        <ArrowLeft color={T.green} size={44} />
      </div>
      <div style={{ height: 6 }} />
      <SquigglyBrace color={T.orange} height={80} side="right" />
      <span style={{ fontFamily: "'Caveat', cursive", fontSize: 12, fontWeight: 700, color: T.orange, transform: 'rotate(4deg)', textAlign: 'center', display: 'block', lineHeight: 1.3 }}>Yours too?</span>
      <div style={{ height: 6 }} />
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}>
        <DoodleStarburst color={T.amber} size={36} />
      </motion.div>
      <div style={{ height: 2 }} />
      <motion.div
        animate={{ rotate: [5, -5, 5], scale: [1, 1.07, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <LeafDoodle color={T.teal} size={30} flip />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: 6 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 6 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
        style={{
          background: '#fef08a',
          border: `1.5px dashed ${T.amber}`,
          borderRadius: 5,
          padding: '5px 8px',
          fontFamily: "'Caveat', cursive",
          fontSize: 11,
          fontWeight: 600,
          color: T.inkLight,
          transform: 'rotate(6deg)',
          boxShadow: '2px 2px 6px rgba(0,0,0,0.10)',
          textAlign: 'center',
          lineHeight: 1.35,
        }}
      >
        📍 Sounds<br />familiar?
      </motion.div>
    </div>
  );
}

// ─── Chapter 1 Step Card ──────────────────────────────────────────────────────

function Ch1StepCard({ icon, step, label, title, desc, color, rotate, delay }: {
  icon: string; step: string; label: string; title: string; desc: string;
  color: string; rotate: number; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ x: -3, scale: 1.015 }}
      style={{
        background: T.paper,
        border: `2px solid ${color}`,
        borderRadius: 12,
        padding: '10px 12px 10px 14px',
        boxShadow: `4px 4px 0 ${color}25`,
        transform: `rotate(${rotate}deg)`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3.5, background: color, borderRadius: '12px 0 0 12px' }} />

      {/* Step circle + emoji */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flexShrink: 0, paddingLeft: 2 }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: color, color: '#fff',
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `2px 2px 0 ${color}44`,
        }}>{step}</div>
        <span style={{ fontSize: 15, lineHeight: 1 }}>{icon}</span>
      </div>

      {/* Text content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700,
          color, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 1,
        }}>{label}</div>
        <div style={{
          fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600,
          color: T.ink, lineHeight: 1.2, marginBottom: 3,
        }}>{title}</div>
        <InkUnderline color={color} width={60} />
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.ink,
          lineHeight: 1.5, marginTop: 3,
        }}>{desc}</div>
      </div>
    </motion.div>
  );
}

// ─── Ch3 Video Decorations ────────────────────────────────────────────────────

function Ch3VideoDecorations() {
  return (
    <>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 13, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', top: 4, left: 6, pointerEvents: 'none', opacity: 0.65, zIndex: 5 }}>
        <DoodleStarburst color={T.green} size={20} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          position: 'absolute', top: 5, left: '16%',
          background: `${T.orange}18`, border: `1.5px solid ${T.orange}`,
          borderRadius: 20, padding: '2px 9px',
          fontFamily: "'Caveat', cursive", fontSize: 14, fontWeight: 700, color: T.orange,
          pointerEvents: 'none', whiteSpace: 'nowrap', transform: 'rotate(-2deg)',
          zIndex: 5,
        }}
      >🔥 60% heat loss</motion.div>

      <motion.div
        initial={{ opacity: 0, y: -6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.18 }}
        style={{
          position: 'absolute', top: 5, right: '10%',
          background: `${T.green}18`, border: `1.5px solid ${T.green}`,
          borderRadius: 20, padding: '2px 9px',
          fontFamily: "'Caveat', cursive", fontSize: 14, fontWeight: 700, color: T.green,
          pointerEvents: 'none', whiteSpace: 'nowrap', transform: 'rotate(2deg)',
          zIndex: 5,
        }}
      >🧠 Brain fog</motion.div>

      <motion.div animate={{ rotate: -360 }} transition={{ duration: 17, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', top: 4, right: 6, pointerEvents: 'none', opacity: 0.6, zIndex: 5 }}>
        <DoodleStarburst color={T.teal} size={18} />
      </motion.div>

      <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.4, repeat: Infinity }}
        style={{ position: 'absolute', bottom: 4, left: 6, pointerEvents: 'none', zIndex: 5 }}>
        <Sparkle color={T.amber} size={18} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.26 }}
        style={{
          position: 'absolute', bottom: 5, left: '12%',
          background: `${T.blue}18`, border: `1.5px solid ${T.blue}`,
          borderRadius: 20, padding: '2px 9px',
          fontFamily: "'Caveat', cursive", fontSize: 14, fontWeight: 700, color: T.blue,
          pointerEvents: 'none', whiteSpace: 'nowrap', transform: 'rotate(-1.5deg)',
          zIndex: 5,
        }}
      >😴 Low energy</motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.34 }}
        style={{
          position: 'absolute', bottom: 5, right: '8%',
          background: `${T.teal}18`, border: `1.5px solid ${T.teal}`,
          borderRadius: 20, padding: '2px 9px',
          fontFamily: "'Caveat', cursive", fontSize: 14, fontWeight: 700, color: T.teal,
          pointerEvents: 'none', whiteSpace: 'nowrap', transform: 'rotate(1.5deg)',
          zIndex: 5,
        }}
      >🥦 50% nutrient loss</motion.div>

      <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
        style={{ position: 'absolute', bottom: 4, right: 6, pointerEvents: 'none', zIndex: 5 }}>
        <Sparkle color={T.orange} size={16} />
      </motion.div>
    </>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function MicronutrientGapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  const gapItems = [
    { id: 'b12',      icon: '🧠', badge: 'ENERGY',      title: 'Vitamin B Complex',   values: 'B6 · B9 · B12',           desc: 'Low B12 & B6 = brain fog, fatigue, mood swings. Most Indians quietly deficient.',        color: T.green,  rotate: -1.5 },
    { id: 'calcium',  icon: '🦴', badge: 'BONES',       title: 'Calcium + Magnesium', values: '300mg Ca · 132mg Mg',      desc: 'Mg controls 300+ enzyme reactions. Without it: poor sleep, cramps, anxiety.',             color: T.blue,   rotate:  1.5 },
    { id: 'zinc',     icon: '🛡️', badge: 'IMMUNITY',   title: 'Zinc + Selenium',     values: '6.8mg Zn · 28mcg Se',      desc: 'Soil depletion means vegetables can\'t carry these minerals anymore.',                    color: T.orange, rotate: -1   },
    { id: 'vitaminc', icon: '🍊', badge: 'ANTIOXIDANT', title: 'Vitamin C',           values: '50mg · Antioxidant',       desc: 'Destroyed by high-heat cooking. Every tadka, every roti — it evaporates.',                color: T.amber,  rotate:  1.5 },
    { id: 'fiber',    icon: '🌾', badge: 'GUT',         title: 'Fiber + Enzymes',     values: '6g Fiber · 100mg Enzymes', desc: 'Without digestive enzymes, your gut can\'t absorb nutrients anyway.',                    color: T.teal,   rotate: -1.5 },
  ];

  const statItems = [
    { num: '75%', label: '3 in 4 people are running low on key nutrients',        sublabel: "You're probably one of them.",            color: T.green,  rotate: -1.5 },
    { num: '60%', label: 'of vitamins B & C are lost to high-heat cooking',       sublabel: 'You cook it. Heat strips it.',             color: T.blue,   rotate:  1   },
    { num: '50%', label: 'nutrient loss in produce within 3 days of harvest',     sublabel: "It looks fresh. It isn't.",               color: T.orange, rotate: -1   },
    { num: '40%', label: "of adults don't meet basic micronutrient intake",       sublabel: 'Even full plates miss key nutrients.',     color: T.amber,  rotate:  1.5 },
    { num: '1',   label: 'scoop closes all 5 gaps. Every single day.',            sublabel: 'One sachet. Complete nutrition.',          color: T.teal,   rotate:  1   },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Permanent+Marker&family=Kalam:wght@300;400;700&family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .mg-root {
          background: ${T.paper};
          position: relative;
          overflow: hidden;
        }
        .mg-root::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(transparent, transparent 35px, rgba(180,160,100,0.055) 35px, rgba(180,160,100,0.055) 36px);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Chapter 1: two-column layout ── */
        .ch1-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          align-items: start;
        }

        .video-with-deco {
          display: flex;
          align-items: stretch;
          gap: 0;
          width: 100%;
          overflow: visible;
        }
        .video-deco-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .video-main-col {
          flex: 1;
          min-width: 0;
        }

        /* ── Chapter 2 ── */
        .story-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          align-items: start;
        }

        /* ── Chapter 3 ── */
        .ch3-grid {
          display: grid;
          grid-template-columns: 1fr 0.8fr 1fr;
          gap: 16px;
          align-items: start;
        }

        .ch3-video-deco {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: visible;
          z-index: 4;
        }

        @media (max-width: 1100px) {
          .ch3-grid { grid-template-columns: 1fr 1fr; }
          .ch3-hide { display: none !important; }
        }
        @media (max-width: 860px) {
          .ch1-grid { grid-template-columns: 1fr; }
          .story-2col { grid-template-columns: 1fr; }
          .ch3-grid { grid-template-columns: 1fr; }
          .ch3-hide { display: flex !important; }
          .ch3-video-deco { display: none; }
          .video-deco-col { display: none; }
        }
      `}</style>

      <section className="mg-root py-16 px-4 md:px-8" ref={sectionRef}>

        {/* Background blobs */}
        <motion.div style={{ y: bgY, position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
          <WatercolorBlob color={T.green}  opacity={0.06} size={440} style={{ top: '0%',  left: '-5%'  }} />
          <WatercolorBlob color={T.amber}  opacity={0.05} size={340} style={{ top: '30%', right: '-4%' }} />
          <WatercolorBlob color={T.blue}   opacity={0.04} size={300} style={{ bottom: '8%', left: '15%' }} />
          <WatercolorBlob color={T.orange} opacity={0.05} size={240} style={{ top: '65%', right: '8%'  }} />
        </motion.div>

        {/* Corner doodles */}
        <FloatingDoodle style={{ top: '4%',  left: '0.5%',  opacity: 0.09, zIndex: 2 }} delay={0}>  <DoodleStarburst color={T.green}  size={60} /></FloatingDoodle>
        <FloatingDoodle style={{ top: '20%', right: '1%',   opacity: 0.07, zIndex: 2 }} delay={1.5}><DoodleStarburst color={T.blue}   size={52} /></FloatingDoodle>
        <FloatingDoodle style={{ bottom: '8%', left: '1.5%', opacity: 0.07, zIndex: 2 }} delay={2}>  <DoodleStarburst color={T.orange} size={48} /></FloatingDoodle>
        <FloatingDoodle style={{ bottom: '20%',right: '1.5%',opacity: 0.06, zIndex: 2 }} delay={0.7}><DoodleStarburst color={T.amber}  size={54} /></FloatingDoodle>

        <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 10 }}>

          {/* ══ HERO TITLE ══════════════════════════════════════════════════════ */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ textAlign: 'center', marginBottom: 56 }}>

            <motion.div
              initial={{ rotate: -3, y: 10 }} whileInView={{ rotate: -3, y: 0 }} viewport={{ once: true }}
              style={{
                display: 'inline-block', background: `${T.green}14`,
                border: `1.5px dashed ${T.green}`, borderRadius: 7, padding: '4px 14px',
                fontFamily: "'Kalam', cursive", fontSize: 11, fontWeight: 700,
                color: T.green, letterSpacing: '0.1em', marginBottom: 18,
              }}
            >
              📋 THE REAL STORY BEHIND YOUR DAILY PLATE
            </motion.div>

            <div>
              <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(28px, 6vw, 54px)', color: T.ink, lineHeight: 1.1, display: 'block' }}>
                The Micronutrient
              </motion.h2>
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.22 }}
                style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(28px, 6vw, 54px)', color: T.green, lineHeight: 1.1 }}>Gap</span>
                <InkCircleHighlight color={T.orange} width={90} height={44} />
              </motion.div>
            </div>

            <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.35 }}
              style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 18px' }}>
              <InkUnderline color={T.green} width={240} wobble={2} />
            </motion.div>

            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.45 }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: T.ink, maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
              You eat three meals a day. You feel tired anyway.<br />
              <strong style={{ color: T.ink }}>Here&apos;s why your plate is lying to you.</strong> 👇
            </motion.p>
          </motion.div>

          {/* ══ CH. 1: YOUR TYPICAL DAY ════════════════════════════════════════ */}
          <ChapterLabel chapter="CHAPTER 1" title="Your Typical Day 🍽️" color={T.green} />

          <div className="ch1-grid" style={{ marginBottom: 56 }}>

            {/* LEFT: Video with left/right doodle decoration columns */}
            <motion.div
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="video-with-deco"
            >
              {/* Left deco column */}
              <div className="video-deco-col">
                <Ch1VideoLeft />
              </div>

              {/* Video */}
              <div className="video-main-col" style={{ borderRadius: 12, overflow: 'hidden', background: T.paperDark }}>
                <video
                  src="/videos/YourTypicalDay.mp4"
                  autoPlay muted loop playsInline controls
                  style={{ width: '100%', height: 'auto', maxHeight: 480, objectFit: 'contain', display: 'block' }}
                />
              </div>

              {/* Right deco column */}
              <div className="video-deco-col">
                <Ch1VideoRight />
              </div>
            </motion.div>

            {/* RIGHT: 4 step cards + sticky note */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{
                fontFamily: "'Caveat', cursive", fontSize: 24, fontWeight: 700,
                color: T.green, letterSpacing: '0.06em', marginBottom: 2,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span>📖</span> How your day actually goes:
              </div>

              <Ch1StepCard icon="☀️" step="1" label="Morning" title="You eat breakfast"
                desc="Paratha + chai + fruit. Wholesome-looking. But already 40% fewer nutrients than it appears."
                color={T.amber} rotate={-1.5} delay={0.05} />

              <Ch1StepCard icon="🔥" step="2" label="Mid-Morning" title="You're still hungry"
                desc="By 11 AM your stomach growls again. Energy dips. Cravings hit. Something's missing."
                color={T.orange} rotate={1} delay={0.12} />

              <Ch1StepCard icon="🌱" step="3" label="You Add PlainFuel" title="One sachet. That's it."
                desc="Mix one sachet with water. No cooking. No sugar crash. Clean, complete nutrition."
                color={T.teal} rotate={-1} delay={0.19} />

              <Ch1StepCard icon="😴" step="4" label="Evening" title="You feel steady & energetic"
                desc="No brain fog. No hunger spikes. Stable energy, better focus. You end the day strong."
                color={T.blue} rotate={1.5} delay={0.26} />

              <StickyNote color="#f0fdf4" rotate={1.5} style={{ alignSelf: 'flex-start', maxWidth: 260, border: `1.5px dashed ${T.green}`, marginTop: 4 }}>
                🌀 This cycle repeats every day — silently draining you.
              </StickyNote>
            </div>
          </div>

          {/* ══ CH. 2: UNCOMFORTABLE TRUTH ═════════════════════════════════════ */}
          <ChapterLabel chapter="CHAPTER 2" title="The Uncomfortable Truth ⚠️" color={T.orange} />

          <div className="story-2col" style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: '👥', stat: '3 in 4', label: 'Indians have at least ONE micronutrient deficiency',   color: T.orange, rotate: -1.5 },
                { icon: '🍳', stat: '60%',    label: 'of B-vitamins disappear when cooking at high heat',    color: T.green,  rotate:  1   },
                { icon: '🥦', stat: '50%',    label: 'nutrient loss in vegetables within 3 days of harvest', color: T.blue,   rotate: -1   },
                { icon: '😶', stat: '0',      label: 'obvious symptoms — just "normal" fatigue and fog',     color: T.amber,  rotate:  1.5 },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  whileHover={{ x: 4, scale: 1.015 }}
                  style={{
                    background: T.paper, border: `2px solid ${item.color}`,
                    borderRadius: 11, padding: '8px 11px',
                    boxShadow: `3px 3px 0 ${item.color}20`,
                    transform: `rotate(${item.rotate}deg)`,
                    display: 'flex', alignItems: 'center', gap: 8,
                    position: 'relative', overflow: 'hidden',
                  }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: item.color, borderRadius: '11px 0 0 11px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckMark color={item.color} size={18} />
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: item.color, lineHeight: 1 }}>{item.stat}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.ink, lineHeight: 1.35 }}>{item.label}</div>
                  </div>
                </motion.div>
              ))}
              <StickyNote color="#fef9c3" rotate={-2} style={{ alignSelf: 'flex-start', maxWidth: 240, marginTop: 2, fontSize: 11 }}>
                ✏️ &ldquo;Eating enough&rdquo; ≠ &ldquo;Getting enough nutrients.&rdquo; That&apos;s the hidden gap.
              </StickyNote>
            </div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              style={{ position: 'relative', width: '100%', height: 280 }}>
              <Image src="/images/DoodleImages/TheUncomfortableTruth.png" alt="The Uncomfortable Truth" fill style={{ objectFit: 'contain' }} />
            </motion.div>
          </div>

          {/* ══ DIVIDER ══════════════════════════════════════════════════════════ */}
          <motion.div initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 56 }}>
            <div style={{ flex: 1, height: 2, background: `linear-gradient(to right, transparent, ${T.green}50)` }} />
            <motion.div animate={{ rotate: [0, 4, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontFamily: "'Permanent Marker', cursive", fontSize: 13, color: T.green,
                padding: '5px 16px', border: `1.5px dashed ${T.green}`, borderRadius: 20,
                background: `${T.green}08`, whiteSpace: 'nowrap',
              }}>
              so what&apos;s missing? 🤔
            </motion.div>
            <div style={{ flex: 1, height: 2, background: `linear-gradient(to left, transparent, ${T.green}50)` }} />
          </motion.div>

          {/* ══ CH. 3: 5 GAPS + NUMBERS ════════════════════════════════════════ */}
          <ChapterLabel chapter="CHAPTER 3" title="The Hidden Nutrient Gaps" color={T.blue} />

          <div className="ch3-grid" style={{ marginBottom: 20 }}>

            {/* LEFT: 5 gap cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: T.blue, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 2, paddingLeft: 3 }}>
                — The 5 Gaps
              </div>
              {gapItems.map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  whileHover={{ x: 3, scale: 1.015 }}
                  onClick={() => { const r = PRODUCT_ROUTES[item.id as keyof typeof PRODUCT_ROUTES]; if (r) window.location.href = r; }}
                  style={{
                    background: T.paper, border: `2px solid ${item.color}`,
                    borderRadius: 11, padding: '8px 10px 8px 12px',
                    boxShadow: `3px 3px 0 ${item.color}20`,
                    transform: `rotate(${item.rotate}deg)`,
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                    position: 'relative', overflow: 'hidden', cursor: 'pointer',
                    minHeight: 72,
                  }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: item.color, borderRadius: '11px 0 0 11px' }} />
                  <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: `${item.color}18`, border: `1.5px solid ${item.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 1 }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: T.ink }}>{item.title}</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: '#fff', background: item.color, padding: '1px 5px', borderRadius: 7 }}>{item.badge}</span>
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, fontWeight: 600, color: item.color, marginBottom: 1 }}>{item.values}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: T.ink, lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CENTER: video + milk card */}
            <div className="ch3-hide" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              <motion.div
                initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.6 }}
                style={{ position: 'relative', width: '100%', paddingTop: 30, paddingBottom: 28 }}
              >
                <div className="ch3-video-deco">
                  <Ch3VideoDecorations />
                </div>
                <div style={{ height: 260, borderRadius: 11, overflow: 'hidden', background: T.paperDark }}>
                  <video src="/videos/Everyday Diets.mp4" autoPlay muted loop playsInline controls
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                </div>
              </motion.div>

              {/* 3 Cups card */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.2, type: 'spring', bounce: 0.35 }}
                whileHover={{ scale: 1.03, rotate: 0 }}
                style={{
                  background: 'linear-gradient(145deg, #f0f9ff, #e0f2fe)',
                  borderRadius: 14, padding: '16px 14px',
                  border: `2px dashed ${T.blue}`,
                  boxShadow: `5px 5px 0 ${T.blue}30`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  textAlign: 'center', transform: 'rotate(-1deg)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: -6, left: '28%', width: 44, height: 13, background: 'rgba(253,230,138,0.80)', borderRadius: 3, transform: 'rotate(-2deg)' }} />
                <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 11, color: T.blue, letterSpacing: '0.08em', marginBottom: 8, marginTop: 2 }}>
                  DID YOU KNOW?
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                  {['🥛', '🥛', '🥛'].map((cup, i) => (
                    <motion.span key={i}
                      initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }}
                      style={{ fontSize: 26, lineHeight: 1 }}>
                      {cup}
                    </motion.span>
                  ))}
                  <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 18, color: T.blue, margin: '0 4px' }}>=</span>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: 0.55, type: 'spring', bounce: 0.5 }}
                    style={{ position: 'relative', width: 60, height: 78 }}>
                    <Image src="/images/Products/orangepack.png" alt="PlainFuel Sachet" fill style={{ objectFit: 'contain' }} />
                  </motion.div>
                </div>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 16, color: T.blue }}>1 Sachet of PlainFuel</span>
                  <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                    <InkUnderline color={T.blue} width={140} wobble={1.5} />
                  </div>
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: '#888', fontStyle: 'italic', marginTop: 8 }}>
                  …minus the calories, the bloat, the hassle. ✨
                </div>
              </motion.div>
            </div>

            {/* RIGHT: stat cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: T.amber, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 2, paddingLeft: 3 }}>
                — The Numbers
              </div>
              {statItems.map((stat, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ x: -3, scale: 1.015 }}
                  style={{
                    background: T.paper, border: `2px solid ${stat.color}`,
                    borderRadius: 11, padding: '8px 10px 8px 12px',
                    boxShadow: `3px 3px 0 ${stat.color}20`,
                    transform: `rotate(${stat.rotate}deg)`,
                    display: 'flex', alignItems: 'center', gap: 10,
                    position: 'relative', overflow: 'hidden',
                    minHeight: 72,
                  }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: stat.color, borderRadius: '11px 0 0 11px' }} />
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: stat.color, lineHeight: 1, flexShrink: 0, minWidth: 48, textAlign: 'center' }}>{stat.num}</div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.ink, fontWeight: 700, lineHeight: 1.3, marginBottom: 2 }}>{stat.label}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.ink, fontStyle: 'italic' }}>{stat.sublabel}</div>
                    <div style={{ marginTop: 3 }}><InkUnderline color={stat.color} width={36} /></div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

          {/* ══ THE FIX ══════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.15, type: 'spring', bounce: 0.3 }}
            style={{ marginTop: 24 }}
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)',
                borderRadius: 16, padding: '16px 24px',
                border: `2.5px dashed ${T.green}`,
                boxShadow: `6px 6px 0 ${T.green}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 16, flexWrap: 'wrap',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: -5, left: '20%', width: 48, height: 12, background: 'rgba(253,230,138,0.80)', borderRadius: 3, transform: 'rotate(-2deg)' }} />
              <WatercolorBlob color={T.green} opacity={0.07} size={180} style={{ top: '-15%', right: '-3%' }} />

              <motion.div animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} style={{ flexShrink: 0 }}>
                <DoodleStarburst color={T.green} size={36} />
              </motion.div>

              <div style={{ flex: 1, minWidth: 160, textAlign: 'center' }}>
                <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 12, color: T.green, letterSpacing: '0.1em', marginBottom: 4 }}>✨ THE FIX IS SIMPLE</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(18px, 2.5vw, 28px)', fontWeight: 700, color: T.ink, lineHeight: 1.2, marginBottom: 6 }}>
                  One Scoop. All 5 Gaps Closed.
                </h3>
                <InkUnderline color={T.green} width={150} wobble={2} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.green, fontWeight: 600, lineHeight: 1.45, marginTop: 6 }}>
                  Precision dosing. Zero compromise. Every day.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start', flexShrink: 0 }}>
                {['No cooking needed', 'No sugar crash', 'All 5 nutrients', 'One sachet daily'].map((point, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: 0.25 + i * 0.08 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <CheckMark color={T.green} size={16} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.inkLight, fontWeight: 500 }}>{point}</span>
                  </motion.div>
                ))}
                <motion.div
                  whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.97 }}
                  style={{
                    marginTop: 4, padding: '8px 22px', borderRadius: 24,
                    background: T.green, color: '#fff',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700,
                    boxShadow: `3px 3px 0 ${T.green}55`, cursor: 'pointer', letterSpacing: '0.04em',
                  }}
                >
                  Shop Now →
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>
    </>
  );
}