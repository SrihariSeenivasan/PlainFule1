'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import { StarDoodle, Scribble, ArrowDoodle } from '@/components/Elements/SvgDoodles';

const CircleDoodle = ({ size = 40, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 44 44" width={size} height={size} style={style} aria-hidden>
    <path d="M22,4 C32,3 41,12 41,22 C41,32 32,41 22,41 C12,41 3,32 3,22 C3,12 12,3 22,4 Z" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeDasharray="4,2" />
  </svg>
);

const ZigZag = ({ style = {} }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 200 16" style={style} aria-hidden>
    <polyline points="0,8 20,2 40,14 60,2 80,14 100,2 120,14 140,2 160,14 180,2 200,8" fill="none" stroke="rgba(21,128,61,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HighlightSvg = ({ style = {} }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 180 18" preserveAspectRatio="none" style={style} aria-hidden>
    <path d="M4,14 Q45,4 90,8 Q135,12 176,6" fill="none" stroke="rgba(21,128,61,0.5)" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

const StatPill = ({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: hovered ? 1 : -1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', background: '#fffef5', border: '2px solid transparent',
        padding: '12px 16px', borderRadius: '12px', cursor: 'default',
        boxShadow: hovered ? '4px 5px 0px #15803d' : '3px 3px 0px rgba(0,0,0,0.15)',
        transform: `rotate(${hovered ? 1 : -1}deg)`,
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      <svg viewBox="0 0 180 80" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <path d="M5,5 C40,2 120,6 175,4 L175,76 C120,78 40,74 5,76 Z" fill="none" stroke={hovered ? '#15803d' : '#333'} strokeWidth="2" strokeLinecap="round" strokeDasharray={hovered ? 'none' : '5,2'} />
      </svg>
      {/* value stays in Permanent Marker — it's a display number, not content */}
      <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 900, fontFamily: "'Permanent Marker', cursive", color: '#15803d', lineHeight: 1 }}>{value}</span>
      <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", fontWeight: 600, color: 'rgba(0,0,0,0.5)', marginTop: 5 }}>{label}</span>
    </motion.div>
  );
};

const pillars = [
  { icon: '◈', label: 'Bio-identical nutrients' },
  { icon: '◉', label: 'Your unique biological Delta' },
  { icon: '◎', label: 'Zero unnecessary filler' },
];

const PillarRow = ({ icon, label, delay }: { icon: string; label: string; delay: number }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
        borderRadius: 10,
        background: hovered ? 'rgba(21,128,61,0.08)' : 'rgba(255,254,245,0.7)',
        border: `2px ${hovered ? 'solid' : 'dashed'} ${hovered ? '#15803d' : 'rgba(0,0,0,0.2)'}`,
        cursor: 'default',
        transform: hovered ? 'translateX(5px) rotate(0.5deg)' : 'rotate(0)',
        transition: 'all 0.2s ease',
        boxShadow: hovered ? '3px 3px 0 #15803d' : 'none',
      }}
    >
      <span style={{ color: '#15803d', fontSize: 16 }}>{icon}</span>
      <span style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", fontWeight: 600, fontSize: 14, color: 'rgba(0,0,0,0.72)', letterSpacing: '0.01em' }}>{label}</span>
      {hovered && <span style={{ marginLeft: 'auto', fontSize: 13, color: '#15803d' }}>✓</span>}
    </motion.div>
  );
};

const QuoteBox = ({ text, delay }: { text: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 14, rotate: -1 }}
    whileInView={{ opacity: 1, y: 0, rotate: -0.5 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay }}
    style={{ position: 'relative', background: '#fffef5', padding: '18px 20px 18px 28px', borderRadius: 12, transform: 'rotate(-0.5deg)', boxShadow: '4px 4px 0 rgba(0,0,0,0.1)' }}
  >
    <div style={{ position: 'absolute', top: -10, left: 20, width: 48, height: 18, background: 'rgba(21,128,61,0.25)', borderRadius: 3, transform: 'rotate(-2deg)' }} />
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'repeating-linear-gradient(to bottom, #15803d 0px, #15803d 8px, transparent 8px, transparent 12px)', borderRadius: '12px 0 0 12px' }} />
    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2rem', fontWeight: 900, lineHeight: 0.5, display: 'block', color: '#15803d', opacity: 0.5, marginBottom: 8 }}>&quot;</span>
    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 500, fontStyle: 'italic', color: 'rgba(0,0,0,0.65)', lineHeight: 1.6, margin: 0 }}>{text}</p>
  </motion.div>
);

const generateRandomSpecks = () => {
  return [...Array(18)].map(() => ({
    width: Math.random() * 4 + 2, height: Math.random() * 4 + 2,
    left: Math.random() * 100, top: Math.random() * 100,
  }));
};

const PencilSpecks = () => {
  const specks = useMemo(() => generateRandomSpecks(), []);
  return (
    <>
      {specks.map((speck, i) => (
        <div key={i} style={{ position: 'absolute', width: speck.width, height: speck.height, borderRadius: '50%', background: 'rgba(0,0,0,0.06)', left: `${speck.left}%`, top: `${speck.top}%` }} />
      ))}
    </>
  );
};

export default function Sciencesection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&family=Permanent+Marker&display=swap');

        .doodle-section {
          background: #fafaf2;
          background-image: radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .notebook-lines::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(transparent, transparent 27px, rgba(21,128,61,0.08) 27px, rgba(21,128,61,0.08) 28px);
          pointer-events: none;
          border-radius: inherit;
        }

        .doodle-card {
          background: #fffef5;
          border-radius: 18px;
          position: relative;
          overflow: visible;
        }

        .doodle-card::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 20px;
          background: transparent;
          border: 2.5px solid rgba(0,0,0,0.12);
          pointer-events: none;
          filter: url(#roughen);
        }

        @keyframes wiggle { 0%,100% { transform: rotate(-1deg); } 50% { transform: rotate(1deg); } }
        .wiggle-slow { animation: wiggle 4s ease-in-out infinite; }

        @keyframes float { 0%,100% { transform: translateY(0px) rotate(-2deg); } 50% { transform: translateY(-8px) rotate(2deg); } }
        .float-anim { animation: float 5s ease-in-out infinite; }
      `}</style>

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="roughen">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="2" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <section ref={sectionRef} className="doodle-section" style={{ padding: '80px 24px', position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>

        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <PencilSpecks />
          <motion.div style={{ y: bgY }} className="float-anim">
            <StarDoodle size={48} rotate={15} style={{ position: 'absolute', top: '8%', left: '5%', opacity: 0.35 }} />
          </motion.div>
          <StarDoodle size={32} rotate={-20} style={{ position: 'absolute', top: '15%', right: '8%', opacity: 0.25 }} />
          <CircleDoodle size={80} style={{ position: 'absolute', bottom: '20%', left: '3%', opacity: 0.2 }} />
          <CircleDoodle size={50} style={{ position: 'absolute', top: '40%', right: '4%', opacity: 0.2 }} />
          <ZigZag style={{ position: 'absolute', bottom: '10%', right: '10%', width: 200, opacity: 0.5 }} />
          <ZigZag style={{ position: 'absolute', top: '5%', left: '20%', width: 140, opacity: 0.4, transform: 'rotate(3deg)' }} />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 48, flexDirection: 'column' }}>
            <div style={{ background: 'rgba(21,128,61,0.15)', border: '2px dashed #15803d', borderRadius: 8, padding: '6px 20px', transform: 'rotate(-1.5deg)', boxShadow: '3px 3px 0 rgba(21,128,61,0.2)' }}>
              <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 13, color: '#15803d', letterSpacing: '0.08em' }}>
                ✦ The Science of Sufficiency ✦
              </span>
            </div>
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <h1 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: '#1a1a1a', margin: 0, lineHeight: 1.1 }}>
                What&apos;s <span style={{ color: '#15803d' }}>Actually</span> in your food?
              </h1>
              <HighlightSvg style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', width: '60%', height: 18, opacity: 0.7 }} />
            </div>
          </motion.div>

          {/* Main 2-col grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28, alignItems: 'start' }}>

            {/* ── LEFT CARD: PROBLEM ── */}
            <motion.div
              initial={{ opacity: 0, x: -30, rotate: -2 }} whileInView={{ opacity: 1, x: 0, rotate: -1 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="doodle-card notebook-lines"
              style={{ padding: '36px 32px', boxShadow: '6px 8px 0 rgba(0,0,0,0.12)', transform: 'rotate(-1deg)' }}
            >
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.08) 50%)', borderRadius: '0 0 18px 0' }} />

              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} aria-hidden
                style={{ position: 'absolute', right: 16, top: 0, fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(80px,12vw,140px)', lineHeight: 1, color: '#15803d', opacity: 0.05, userSelect: 'none', pointerEvents: 'none' }}>
                01
              </motion.span>

              <motion.div initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(21,128,61,0.09)', border: '2px dashed #15803d', borderRadius: 8, padding: '8px 16px', transform: 'rotate(-1.5deg)' }}>
                  <StarDoodle size={14} color="#15803d" />
                  <span style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", fontSize: 13, fontWeight: 700, color: '#15803d', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    The Science of Sufficiency
                  </span>
                  <StarDoodle size={14} color="#15803d" />
                </div>
              </motion.div>

              {/* Headline — kept in Permanent Marker, it's a section title */}
              <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }}
                style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', lineHeight: 1.2, color: '#1a1a1a', marginBottom: 16, position: 'relative' }}>
                The Modern Diet.<br />
                <span style={{ color: '#15803d', position: 'relative' }}>
                  An Invisible
                  <Scribble style={{ position: 'absolute', bottom: -8, left: 0, width: '100%', height: 20 }} />
                </span>
                <br />
                <span style={{ color: 'rgba(0,0,0,0.18)', fontStyle: 'italic' }}>Depletion.</span>
              </motion.h2>

              {/* Body copy — DM Sans */}
              <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", fontSize: 15, lineHeight: 1.75, color: 'rgba(0,0,0,0.62)', marginBottom: 24, maxWidth: 400, fontWeight: 400 }}>
                We consume more than ever, yet our cells are starving. The modern thali has been hollowed out by processed soil and high-yield farming. The calories remain, but the micronutrients have vanished.
              </motion.p>

              {/* Callout note */}
              <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, background: 'rgba(254,240,138,0.4)', border: '1.5px dashed rgba(0,0,0,0.2)', borderRadius: 10, padding: '10px 14px', transform: 'rotate(0.5deg)' }}>
                <span style={{ fontSize: 20 }}>👉</span>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, fontStyle: 'italic', color: '#1a1a1a' }}>
                  Volume is no longer a proxy for vitality.
                </span>
              </motion.div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 28 }}>
                <StatPill value="57%" label="Nutrient loss since 1950" delay={0.35} />
                <StatPill value="3 in 4" label="Indians micronutrient-deficient" delay={0.45} />
              </div>

              <QuoteBox text="Complexity is the smoke screen for insufficiency." delay={0.5} />

              <ArrowDoodle style={{ position: 'absolute', right: -36, top: '45%', width: 60, display: 'none' }} />
            </motion.div>

            {/* ── RIGHT CARD: SOLUTION ── */}
            <motion.div
              initial={{ opacity: 0, x: 30, rotate: 2 }} whileInView={{ opacity: 1, x: 0, rotate: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
              className="doodle-card notebook-lines"
              style={{ padding: '36px 32px', boxShadow: '6px 8px 0 rgba(21,128,61,0.2)', transform: 'rotate(1deg)' }}
            >
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, background: 'linear-gradient(135deg, transparent 50%, rgba(21,128,61,0.12) 50%)', borderRadius: '0 0 18px 0' }} />

              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 }} aria-hidden
                style={{ position: 'absolute', right: 16, top: 0, fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(80px,12vw,140px)', lineHeight: 1, color: '#15803d', opacity: 0.07, userSelect: 'none', pointerEvents: 'none' }}>
                02
              </motion.span>

              <motion.div initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ marginBottom: 20 }}>
                <div style={{ background: 'rgba(21,128,61,0.15)', border: '1.5px solid #15803d', borderRadius: 6, padding: '3px 10px', transform: 'rotate(-1deg)', fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", fontWeight: 700, fontSize: 12, color: '#15803d', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'inline-block', boxShadow: '2px 2px 0 rgba(21,128,61,0.2)' }}>
                  ✨ The Reframe
                </div>
              </motion.div>

              {/* Headline — kept in Permanent Marker */}
              <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }}
                style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', lineHeight: 1.2, color: '#1a1a1a', marginBottom: 16, position: 'relative' }}>
                Precision.{' '}
                <span style={{ color: '#15803d', position: 'relative' }}>
                  Truly
                  <Scribble style={{ position: 'absolute', bottom: -8, left: 0, width: '100%', height: 20 }} />
                </span>
                <br />
                <span style={{ color: 'rgba(0,0,0,0.18)', fontStyle: 'italic' }}>Redefined.</span>
              </motion.h2>

              {/* Body copy — DM Sans */}
              <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", fontSize: 15, lineHeight: 1.75, color: 'rgba(0,0,0,0.62)', marginBottom: 24, maxWidth: 400, fontWeight: 400 }}>
                Supplements shouldn&apos;t be a scattergun approach of generic fillers. We match bio-identical nutrients to your unique biological context. We don&apos;t just add — we bridge the specific Delta within your thali.
              </motion.p>

              {/* Callout note */}
              <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, background: 'rgba(21,128,61,0.06)', border: '1.5px dashed rgba(21,128,61,0.4)', borderRadius: 10, padding: '10px 14px', transform: 'rotate(-0.5deg)' }}>
                <span style={{ fontSize: 20 }}>🔬</span>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, fontStyle: 'italic', color: '#1a1a1a' }}>
                  True intelligence is invisible.
                </span>
              </motion.div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
                {pillars.map((item, i) => (
                  <PillarRow key={item.label} icon={item.icon} label={item.label} delay={0.4 + i * 0.1} />
                ))}
              </div>

              <QuoteBox text="Health is the absence of the unnecessary." delay={0.6} />
            </motion.div>

          </div>

          {/* Bottom strip */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
            style={{ marginTop: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ background: 'rgba(255,254,245,0.9)', border: '1.5px dashed rgba(0,0,0,0.2)', borderRadius: 8, padding: '6px 16px', transform: 'rotate(-0.5deg)', boxShadow: '2px 2px 0 rgba(0,0,0,0.08)' }}>
              <span style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase' }}>
                📖 Backed by nutritional science
              </span>
            </div>
            <div style={{ background: 'rgba(21,128,61,0.08)', border: '1.5px solid rgba(21,128,61,0.3)', borderRadius: 8, padding: '6px 16px', transform: 'rotate(0.8deg)', boxShadow: '2px 2px 0 rgba(21,128,61,0.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#15803d', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: '#15803d', textTransform: 'uppercase' }}>
                🇮🇳 Formulated for the Indian body
              </span>
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}