'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

// ─── PRODUCT ROUTES ───────────────────────────────────────────────────────────
const PRODUCT_ROUTES = {
  b12: '/products/vitamin-b-complex',
  calcium: '/products/calcium-magnesium',
  zinc: '/products/zinc-selenium',
  vitaminc: '/products/vitamin-c',
  fiber: '/products/fiber-enzymes',
};

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
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

// ─── WATERCOLOR BLOB ──────────────────────────────────────────────────────────
function WatercolorBlob({ color, opacity = 0.12, size = 300, style }: { color: string; opacity?: number; size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <path d="M50,20 C80,5 140,10 165,40 C190,70 185,130 160,155 C135,180 70,185 40,160 C10,135 5,80 15,50 C25,20 30,30 50,20Z" fill={color} opacity={opacity} />
    </svg>
  );
}

// ─── SVG HELPERS ──────────────────────────────────────────────────────────────
function InkUnderline({ color = T.green, width = 140, wobble = 1 }: { color?: string; width?: number; wobble?: number }) {
  const mid = width / 2;
  return (
    <svg width={width} height={16} viewBox={`0 0 ${width} 16`} fill="none">
      <path d={`M3 ${10 + wobble} C${mid * 0.4} ${6 + wobble * 2}, ${mid * 0.8} ${13 - wobble}, ${mid} ${9 + wobble}, ${mid * 1.3} ${5 + wobble}, ${mid * 1.7} ${12 - wobble}, ${width - 3} ${8 + wobble}`} stroke={color} strokeWidth="2.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function InkCircleHighlight({ color = T.orange, width = 120, height = 40 }: { color?: string; width?: number; height?: number }) {
  const w = width; const h = height;
  return (
    <svg width={w + 16} height={h + 16} viewBox={`0 0 ${w + 16} ${h + 16}`} fill="none" style={{ position: 'absolute', top: -8, left: -8, pointerEvents: 'none' }}>
      <path d={`M${w * 0.1},${h * 0.15} C${w * 0.3},${h * -0.1} ${w * 0.7},${h * -0.05} ${w * 0.95},${h * 0.2} C${w * 1.1},${h * 0.5} ${w * 1.05},${h * 0.8} ${w * 0.85},${h * 1.1} C${w * 0.6},${h * 1.25} ${w * 0.3},${h * 1.2} ${w * 0.1},${h * 0.95} C${w * -0.05},${h * 0.7} ${w * -0.05},${h * 0.4} ${w * 0.1},${h * 0.15}Z`} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="8 3" />
    </svg>
  );
}

function CheckMark({ color = T.green, size = 28 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M5 17 L13 25 L27 8" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DoodleStarburst({ color = T.amber, size = 60 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      {Array.from({ length: 8 }).map((_, i) => {
        const r = (i * 45 * Math.PI) / 180;
        return <line key={i} x1={30 + 13 * Math.cos(r)} y1={30 + 13 * Math.sin(r)} x2={30 + 27 * Math.cos(r)} y2={30 + 27 * Math.sin(r)} stroke={color} strokeWidth="2.5" strokeLinecap="round" />;
      })}
      <circle cx="30" cy="30" r="11" stroke={color} strokeWidth="2" fill="none" />
    </svg>
  );
}

// ─── STICKY NOTE ─────────────────────────────────────────────────────────────
function StickyNote({ children, color = '#fef08a', rotate = -2, style }: { children: ReactNode; color?: string; rotate?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotate: rotate - 5 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true }}
      transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
      whileHover={{ scale: 1.05, rotate: 0 }}
      style={{
        background: color, padding: '14px 16px', borderRadius: 4,
        boxShadow: '3px 4px 12px rgba(0,0,0,0.15), inset 0 -2px 0 rgba(0,0,0,0.08)',
        fontFamily: "'Caveat', cursive", fontSize: 15, fontWeight: 600,
        color: T.inkLight, lineHeight: 1.5, ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── CHAPTER LABEL ───────────────────────────────────────────────────────────
function ChapterLabel({ chapter, title, color }: { chapter: string; title: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}
    >
      <div style={{ background: color, color: '#fff', fontFamily: "'Permanent Marker', cursive", fontSize: 11, padding: '4px 14px', borderRadius: 20, letterSpacing: '0.12em', boxShadow: `3px 3px 0 ${color}50`, whiteSpace: 'nowrap' }}>{chapter}</div>
      <div style={{ flex: 1, height: 2, background: `linear-gradient(to right, ${color}60, transparent)` }} />
      <h3 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 24, color: T.ink, whiteSpace: 'nowrap' }}>{title}</h3>
      <div style={{ flex: 1, height: 2, background: `linear-gradient(to left, ${color}60, transparent)` }} />
    </motion.div>
  );
}

// ─── FLOATING DOODLE ──────────────────────────────────────────────────────────
function FloatingDoodle({ children, style, delay = 0 }: { children: ReactNode; style?: React.CSSProperties; delay?: number }) {
  return (
    <motion.div animate={{ y: [0, -14, 0], rotate: [-3, 3, -3] }} transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }} style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      {children}
    </motion.div>
  );
}

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────
export default function MicronutrientGapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Permanent+Marker&family=Kalam:wght@300;400;700&display=swap');

        .mg-root {
          background: ${T.paper};
          position: relative;
          overflow: hidden;
        }

        /* Subtle paper ruled lines */
        .mg-root::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            transparent,
            transparent 39px,
            rgba(180,160,100,0.065) 39px,
            rgba(180,160,100,0.065) 40px
          );
          pointer-events: none;
          z-index: 0;
        }

        .nutrient-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 22px;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
        }

        .story-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }

        /* Tape strip decoration */
        .tape {
          position: absolute;
          height: 18px;
          background: rgba(253,230,138,0.75);
          border-radius: 3px;
          transform-origin: center;
        }

        @media (max-width: 900px) {
          .story-2col { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="mg-root py-24 px-4 md:px-8" ref={sectionRef}>

        {/* Parallax watercolor blobs */}
        <motion.div style={{ y: bgY, position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
          <WatercolorBlob color={T.green} opacity={0.07} size={520} style={{ top: '0%', left: '-6%' }} />
          <WatercolorBlob color={T.amber} opacity={0.06} size={400} style={{ top: '28%', right: '-5%' }} />
          <WatercolorBlob color={T.blue} opacity={0.05} size={360} style={{ bottom: '8%', left: '18%' }} />
          <WatercolorBlob color={T.orange} opacity={0.06} size={280} style={{ top: '62%', right: '8%' }} />
        </motion.div>

        {/* Floating bg doodles */}
        <FloatingDoodle style={{ top: '5%', left: '1%', opacity: 0.11, zIndex: 2 }} delay={0}><DoodleStarburst color={T.green} size={80} /></FloatingDoodle>
        <FloatingDoodle style={{ top: '18%', right: '1.5%', opacity: 0.09, zIndex: 2 }} delay={1.5}>
          <svg width="88" height="88" viewBox="0 0 80 80" fill="none"><path d="M40 8 C58 6, 74 22, 74 40 C74 58, 58 72, 40 72 C22 72, 6 58, 6 40 C6 22, 22 6, 40 8 Z" stroke={T.blue} strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray="6 3" /></svg>
        </FloatingDoodle>
        <FloatingDoodle style={{ bottom: '10%', left: '2%', opacity: 0.08, zIndex: 2 }} delay={2}><DoodleStarburst color={T.orange} size={62} /></FloatingDoodle>
        <FloatingDoodle style={{ bottom: '22%', right: '2%', opacity: 0.08, zIndex: 2 }} delay={0.7}><DoodleStarburst color={T.amber} size={72} /></FloatingDoodle>

        <div style={{ maxWidth: 1120, margin: '0 auto', position: 'relative', zIndex: 10 }}>

          {/* ══ HERO TITLE ═══════════════════════════════════════════════════════ */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ textAlign: 'center', marginBottom: 88 }}>

            <motion.div
              initial={{ rotate: -4, y: 12 }} whileInView={{ rotate: -4, y: 0 }} viewport={{ once: true }}
              style={{ display: 'inline-block', background: `${T.green}15`, border: `2px dashed ${T.green}`, borderRadius: 8, padding: '5px 18px', fontFamily: "'Kalam', cursive", fontSize: 13, fontWeight: 700, color: T.green, letterSpacing: '0.1em', marginBottom: 24 }}
            >
              📋 THE REAL STORY BEHIND YOUR DAILY PLATE
            </motion.div>

            <div>
              <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(34px, 7vw, 66px)', color: T.ink, lineHeight: 1.1, display: 'block' }}>
                The Micronutrient
              </motion.h2>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.25 }}
                style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(34px, 7vw, 66px)', color: T.green, lineHeight: 1.1 }}>Gap</span>
                <InkCircleHighlight color={T.orange} width={106} height={52} />
              </motion.div>
            </div>

            <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}
              style={{ display: 'flex', justifyContent: 'center', margin: '14px 0 24px' }}>
              <InkUnderline color={T.green} width={300} wobble={2} />
            </motion.div>

            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
              style={{ fontFamily: "'Caveat', cursive", fontSize: 21, color: '#666', maxWidth: 580, margin: '0 auto', lineHeight: 1.75 }}>
              You eat three meals a day. You feel tired anyway.<br />
              <strong style={{ color: T.ink }}>Here&apos;s why your plate is lying to you.</strong> 👇
            </motion.p>
          </motion.div>

          {/* ══ CH. 1: YOUR TYPICAL DAY ══════════════════════════════════════════ */}
          <ChapterLabel chapter="CHAPTER 1" title="Your Typical Day 🍽️" color={T.green} />

          <div className="story-2col" style={{ marginBottom: 80 }}>

            {/* Left: image */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}
              style={{ background: T.paper, border: `3px solid ${T.green}`, borderRadius: 22, padding: 18, boxShadow: `6px 7px 0 ${T.green}28`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(0,0,0,0.025) 31px, rgba(0,0,0,0.025) 32px)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: 22, top: 0, bottom: 0, width: 1.5, background: `${T.green}22` }} />
              <div className="tape" style={{ top: -7, left: '18%', width: 62, transform: 'rotate(-2deg)' }} />
              <div className="tape" style={{ top: -6, right: '22%', width: 52, transform: 'rotate(3deg)' }} />
              <div style={{ position: 'relative', width: '100%', height: 400 }}>
                <Image src="/images/DoodleImages/YourTypicalDay.png" alt="Your Typical Day" fill style={{ objectFit: 'contain' }} />
              </div>
            </motion.div>

            {/* Right: 4 story step cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                {
                  icon: '☀️', step: '1', label: 'MORNING', title: 'You eat breakfast', color: T.amber, rotate: -2,
                  desc: 'Paratha + chai + fruit. Feels wholesome. But already 40% less nutrients than it looks.',
                },
                {
                  icon: '🔥', step: '2', label: 'COOKING', title: 'Heat kills nutrients', color: T.orange, rotate: 1.5,
                  desc: '200°C+ destroys 60% of B-vitamins and almost all Vitamin C. Your tadka is expensive.',
                },
                {
                  icon: '🌱', step: '3', label: 'SOIL', title: 'The soil is empty', color: T.teal, rotate: -1,
                  desc: 'Modern farming strips Zinc, Selenium & Mg. Your veggies can\'t carry what soil doesn\'t have.',
                },
                {
                  icon: '😴', step: '4', label: 'EVENING', title: 'You feel drained', color: T.blue, rotate: 2,
                  desc: 'No illness — just fog, low energy & poor sleep. Subclinical deficiency is silent but costly.',
                },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ x: -5, scale: 1.02 }}
                  style={{
                    background: T.paper, border: `2.5px solid ${item.color}`, borderRadius: 16,
                    padding: '14px 16px', boxShadow: `5px 5px 0 ${item.color}28`,
                    transform: `rotate(${item.rotate}deg)`,
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    position: 'relative', overflow: 'hidden',
                  }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: item.color, borderRadius: '16px 0 0 16px' }} />
                  {/* Step number + icon */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: item.color, color: '#fff',
                      fontFamily: "'Permanent Marker', cursive", fontSize: 14,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `2px 2px 0 ${item.color}55`,
                    }}>{item.step}</div>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Kalam', cursive", fontSize: 10, fontWeight: 700, color: item.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 16, color: T.ink, lineHeight: 1.2, marginBottom: 4 }}>{item.title}</div>
                    <InkUnderline color={item.color} width={80} />
                    <div style={{ fontFamily: "'Caveat', cursive", fontSize: 15, color: '#555', lineHeight: 1.5, marginTop: 4 }}>{item.desc}</div>
                  </div>
                </motion.div>
              ))}

              <StickyNote color="#f0fdf4" rotate={2} style={{ alignSelf: 'flex-start', maxWidth: 290, border: `1.5px dashed ${T.green}` }}>
                🌀 This cycle repeats every. single. day — silently draining you.
              </StickyNote>
            </div>
          </div>

          {/* ══ CH. 2: UNCOMFORTABLE TRUTH ═══════════════════════════════════════ */}
          <ChapterLabel chapter="CHAPTER 2" title="The Uncomfortable Truth ⚠️" color={T.orange} />

          <div className="story-2col" style={{ marginBottom: 80 }}>

            {/* Left: fact cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '👥', stat: '3 in 4', label: 'Indians have at least ONE micronutrient deficiency', color: T.orange, rotate: -2 },
                { icon: '🍳', stat: '60%', label: 'of B-vitamins disappear when cooking at high heat', color: T.green, rotate: 1.5 },
                { icon: '🥦', stat: '50%', label: 'nutrient loss in vegetables within 3 days of harvest', color: T.blue, rotate: -1 },
                { icon: '😶', stat: '0', label: 'obvious symptoms — just "normal" fatigue and fog', color: T.amber, rotate: 2 },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                  style={{
                    background: T.paper, border: `2.5px solid ${item.color}`, borderRadius: 16,
                    padding: '14px 16px', boxShadow: `5px 5px 0 ${item.color}28`,
                    transform: `rotate(${item.rotate}deg)`,
                    display: 'flex', alignItems: 'center', gap: 14,
                    position: 'relative', overflow: 'hidden',
                  }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: item.color, borderRadius: '16px 0 0 16px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckMark color={item.color} size={26} />
                    <span style={{ fontSize: 22 }}>{item.icon}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 30, color: item.color, lineHeight: 1 }}>{item.stat}</div>
                    <div style={{ fontFamily: "'Caveat', cursive", fontSize: 15, color: '#555', lineHeight: 1.4 }}>{item.label}</div>
                  </div>
                </motion.div>
              ))}

              <StickyNote color="#fef9c3" rotate={-2.5} style={{ alignSelf: 'flex-start', maxWidth: 290 }}>
                ✏️ &ldquo;Eating enough&rdquo; ≠ &ldquo;Getting enough nutrients.&rdquo;<br />That&apos;s the hidden gap.
              </StickyNote>
            </div>

            {/* Right: image */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}
              style={{ background: T.paper, border: `3px solid ${T.orange}`, borderRadius: 22, padding: 18, boxShadow: `6px 7px 0 ${T.orange}28`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(0,0,0,0.025) 31px, rgba(0,0,0,0.025) 32px)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: 22, top: 0, bottom: 0, width: 1.5, background: `${T.orange}18` }} />
              <div className="tape" style={{ top: -6, left: '28%', width: 56, transform: 'rotate(2deg)' }} />
              <div className="tape" style={{ top: -5, right: '18%', width: 44, transform: 'rotate(-3deg)' }} />
              <div style={{ position: 'relative', width: '100%', height: 400 }}>
                <Image src="/images/DoodleImages/TheUncomfortableTruth.png" alt="The Uncomfortable Truth" fill style={{ objectFit: 'contain' }} />
              </div>
            </motion.div>
          </div>

          {/* ══ DIVIDER ═══════════════════════════════════════════════════════════ */}
          <motion.div initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 80 }}>
            <div style={{ flex: 1, height: 2.5, background: `linear-gradient(to right, transparent, ${T.green}55)` }} />
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 15, color: T.green, padding: '6px 20px', border: `2px dashed ${T.green}`, borderRadius: 20, background: `${T.green}08`, whiteSpace: 'nowrap' }}>
              so what&apos;s missing? 🤔
            </motion.div>
            <div style={{ flex: 1, height: 2.5, background: `linear-gradient(to left, transparent, ${T.green}55)` }} />
          </motion.div>

          {/* ══ CH. 3: THE 5 GAPS ════════════════════════════════════════════════ */}
          <ChapterLabel chapter="CHAPTER 3" title="5 Critical Gaps 🕳️" color={T.blue} />

          <div className="story-2col" style={{ marginBottom: 80 }}>

            {/* Left: image */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}
                style={{ background: T.paper, border: `3px solid ${T.blue}`, borderRadius: 22, padding: 18, boxShadow: `6px 7px 0 ${T.blue}28`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(0,0,0,0.025) 31px, rgba(0,0,0,0.025) 32px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', left: 22, top: 0, bottom: 0, width: 1.5, background: `${T.blue}22` }} />
                <div className="tape" style={{ top: -6, left: '25%', width: 58, transform: 'rotate(-2deg)' }} />
                <div className="tape" style={{ top: -5, right: '20%', width: 46, transform: 'rotate(3deg)' }} />
                <div style={{ position: 'relative', width: '100%', height: 400 }}>
                  <Image src="/images/DoodleImages/ADayRunningOnGaps.png" alt="A Day Running on Gaps" fill style={{ objectFit: 'contain' }} />
                </div>
              </motion.div>

              {/* The Fix card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, type: 'spring', bounce: 0.3 }}
                whileHover={{ scale: 1.03, rotate: 0 }}
                style={{ background: 'linear-gradient(145deg, #f0fdf4, #dcfce7)', borderRadius: 18, padding: '24px 20px', border: `3px dashed ${T.green}`, boxShadow: `6px 6px 0 ${T.green}38`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transform: 'rotate(1deg)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(transparent, transparent 28px, rgba(0,0,0,0.025) 28px, rgba(0,0,0,0.025) 29px)', pointerEvents: 'none' }} />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} style={{ marginBottom: 10 }}>
                  <DoodleStarburst color={T.green} size={52} />
                </motion.div>
                <h3 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 20, color: T.ink, marginBottom: 8 }}>The Fix ✨</h3>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: T.green, fontWeight: 700, lineHeight: 1.55 }}>
                  One Scoop. All 5 gaps closed.<br />Precision dosing. Every day.
                </p>
                <motion.div whileHover={{ scale: 1.08 }} style={{ marginTop: 14, padding: '7px 22px', borderRadius: 24, background: T.green, color: '#fff', fontFamily: "'Caveat', cursive", fontSize: 15, fontWeight: 700, boxShadow: `3px 3px 0 ${T.green}55`, cursor: 'pointer' }}>
                  Shop Now →
                </motion.div>
              </motion.div>
            </div>

            {/* Right: 5 gap cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { id: 'b12', icon: '🧠', badge: 'ENERGY', title: 'Vitamin B Complex', values: 'B6 · B9 · B12', desc: 'Powers every cell. Low B12 & B6 = brain fog, fatigue, mood swings. Most Indians are quietly deficient.', color: T.green, rotate: -1.5 },
                { id: 'calcium', icon: '🦴', badge: 'BONES', title: 'Calcium + Magnesium', values: '300mg Ca · 132mg Mg', desc: 'Mg controls 300+ enzyme reactions. Without it: poor sleep, cramps, anxiety. Diet rarely covers it.', color: T.blue, rotate: 1.5 },
                { id: 'zinc', icon: '🛡️', badge: 'IMMUNITY', title: 'Zinc + Selenium', values: '6.8mg Zn · 28mcg Se', desc: 'Soil depletion means your vegetables can\'t carry these minerals. Immunity suffers silently.', color: T.orange, rotate: -1 },
                { id: 'vitaminc', icon: '🍊', badge: 'ANTIOXIDANT', title: 'Vitamin C', values: '50mg · Antioxidant', desc: 'Destroyed entirely by high-heat cooking. Every tadka, every roti — Vitamin C evaporates.', color: T.amber, rotate: 1.5 },
                { id: 'fiber', icon: '🌾', badge: 'GUT', title: 'Fiber + Enzymes', values: '6g Fiber · 100mg Enzymes', desc: 'You may eat fiber, but without digestive enzymes your gut can\'t absorb the nutrients anyway.', color: T.teal, rotate: -1.5 },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.09 }}
                  whileHover={{ x: -5, scale: 1.02 }}
                  onClick={() => { const r = PRODUCT_ROUTES[item.id as keyof typeof PRODUCT_ROUTES]; if (r) window.location.href = r; }}
                  style={{
                    background: T.paper, border: `2.5px solid ${item.color}`, borderRadius: 16,
                    padding: '12px 14px 12px 18px', boxShadow: `5px 5px 0 ${item.color}28`,
                    transform: `rotate(${item.rotate}deg)`,
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    position: 'relative', overflow: 'hidden', cursor: 'pointer',
                  }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: item.color, borderRadius: '16px 0 0 16px' }} />
                  <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: `${item.color}18`, border: `2px solid ${item.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 15, color: T.ink }}>{item.title}</span>
                      <span style={{ fontFamily: "'Kalam', cursive", fontSize: 10, fontWeight: 700, color: '#fff', background: item.color, padding: '1px 8px', borderRadius: 10 }}>{item.badge}</span>
                    </div>
                    <div style={{ fontFamily: "'Caveat', cursive", fontSize: 12, fontWeight: 700, color: item.color, marginBottom: 3 }}>{item.values}</div>
                    <div style={{ fontFamily: "'Caveat', cursive", fontSize: 14, color: '#666', lineHeight: 1.45 }}>{item.desc}</div>
                  </div>
                  <div style={{ flexShrink: 0, fontFamily: "'Caveat', cursive", fontSize: 12, color: item.color, fontWeight: 700, alignSelf: 'center' }}>→</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ══ CH. 4: THE NUMBERS ════════════════════════════════════════════════ */}
          <ChapterLabel chapter="CHAPTER 4" title="The Numbers Don't Lie 📊" color={T.amber} />

          <div className="story-2col" style={{ marginBottom: 20 }}>

            {/* Left: stat cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { num: '75%', label: '3 out of 4 people are running low on key nutrients', sublabel: 'You\'re probably one of them.', color: T.green, rotate: -2 },
                { num: '60%', label: 'of vitamins B & C are lost to high-heat cooking', sublabel: 'You cook it. Heat strips it.', color: T.orange, rotate: 1.5 },
                { num: '50%', label: 'nutrient loss in produce within just 3 days of harvest', sublabel: 'It looks fresh. It isn\'t.', color: T.blue, rotate: -1 },
                { num: '1', label: 'scoop. That\'s all it takes to close all 5 gaps daily.', sublabel: 'So if the soil is weak… heat destroys… storage depletes…', color: T.teal, rotate: 2 },
              ].map((stat, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                  style={{
                    background: T.paper, border: `2.5px solid ${stat.color}`, borderRadius: 16,
                    padding: '14px 18px', boxShadow: `5px 5px 0 ${stat.color}28`,
                    transform: `rotate(${stat.rotate}deg)`,
                    display: 'flex', alignItems: 'center', gap: 16,
                    position: 'relative', overflow: 'hidden',
                  }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: stat.color, borderRadius: '16px 0 0 16px' }} />
                  <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 40, color: stat.color, lineHeight: 1, flexShrink: 0, minWidth: 72, textAlign: 'center' }}>{stat.num}</div>
                  <div>
                    <div style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: T.ink, fontWeight: 700, lineHeight: 1.35, marginBottom: 3 }}>{stat.label}</div>
                    <div style={{ fontFamily: "'Kalam', cursive", fontSize: 12, color: '#999', fontStyle: 'italic' }}>{stat.sublabel}</div>
                    <div style={{ marginTop: 5 }}><InkUnderline color={stat.color} width={60} /></div>
                  </div>
                </motion.div>
              ))}

              <StickyNote color="#fffbeb" rotate={-2} style={{ alignSelf: 'flex-start', maxWidth: 300, border: `1.5px dashed ${T.amber}` }}>
                ✏️ <strong>1 Scoop. 5 Gaps Closed.</strong><br />That&apos;s the only math that matters.
              </StickyNote>
            </div>

            {/* Right: image */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }}
              style={{ background: T.paper, border: `3px solid ${T.amber}`, borderRadius: 22, padding: 18, boxShadow: `6px 7px 0 ${T.amber}28`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(0,0,0,0.025) 31px, rgba(0,0,0,0.025) 32px)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: 22, top: 0, bottom: 0, width: 1.5, background: `${T.amber}22` }} />
              <div className="tape" style={{ top: -6, left: '22%', width: 58, transform: 'rotate(2deg)' }} />
              <div className="tape" style={{ top: -5, right: '18%', width: 48, transform: 'rotate(-3deg)' }} />
              <div style={{ position: 'relative', width: '100%', height: 400 }}>
                <Image src="/images/DoodleImages/TheNumbersDontLie.png" alt="The Numbers Don't Lie" fill style={{ objectFit: 'contain' }} />
              </div>
            </motion.div>
          </div>

        </div>
      </section>
    </>
  );
}