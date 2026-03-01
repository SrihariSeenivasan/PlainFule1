'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Instagram, Mail, Twitter } from 'lucide-react';
import { useRef, useState } from 'react';

// ─── Doodle SVG Primitives ────────────────────────────────────────────────────

const ScribbleUnderline = ({ color = '#22c55e', delay = 0, style = {} }: { color?: string; delay?: number; style?: React.CSSProperties }) => (
  <motion.svg
    viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden
    style={{ position: 'absolute', bottom: -6, left: 0, width: '100%', height: 12, pointerEvents: 'none', ...style }}
  >
    <motion.path
      d="M4,8 Q50,2 100,6 Q150,10 196,4"
      fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    />
  </motion.svg>
);

const DoodleCircle = ({ delay = 0, style = {}, color = '#22c55e' }: { delay?: number; style?: React.CSSProperties; color?: string }) => (
  <motion.svg
    viewBox="0 0 120 56" preserveAspectRatio="none" aria-hidden
    style={{ position: 'absolute', inset: '-12px -16px', width: 'calc(100% + 32px)', height: 'calc(100% + 24px)', pointerEvents: 'none', ...style }}
  >
    <motion.path
      d="M10,28 Q8,8 60,4 Q112,0 114,28 Q116,48 60,52 Q4,56 10,28 Z"
      fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="8,3"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, delay, ease: 'easeInOut' }}
    />
  </motion.svg>
);

const StarBurst = ({ size = 28, rotate = 0, color = '#22c55e', style = {} }: { size?: number; rotate?: number; color?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden
    style={{ transform: `rotate(${rotate}deg)`, ...style }}>
    <path
      d="M16,2 L17.8,12 L28,10 L20,17 L24,27 L16,21 L8,27 L12,17 L4,10 L14.2,12 Z"
      fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const CircleScribble = ({ size = 60, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden style={style}>
    <path
      d="M32,6 C48,5 58,18 58,32 C58,46 48,59 32,58 C16,59 6,46 6,32 C6,18 16,5 32,6 Z"
      fill="none" stroke="rgba(34,197,94,0.25)" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,3"
    />
  </svg>
);

const ZigZag = ({ width = 160, style = {} }: { width?: number; style?: React.CSSProperties }) => (
  <svg viewBox={`0 0 ${width} 14`} width={width} height={14} aria-hidden style={style}>
    <polyline
      points={Array.from({ length: Math.floor(width / 16) }, (_, i) =>
        `${i * 16},${i % 2 === 0 ? 2 : 12}`).join(' ')}
      fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const TapeStrip = ({ rotate = -2, style = {} }: { rotate?: number; style?: React.CSSProperties }) => (
  <div style={{
    position: 'absolute',
    width: 56, height: 20,
    background: 'rgba(254,240,138,0.6)',
    borderRadius: 4,
    border: '1px solid rgba(0,0,0,0.1)',
    transform: `rotate(${rotate}deg)`,
    ...style,
  }} />
);

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

const FaqCard = ({ q, a, index }: { q: string; a: string; index: number }) => {
  const [open, setOpen] = useState(false);
  const rotations = [-1.2, 0.8, -0.6, 1.0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: rotations[index] }}
      whileInView={{ opacity: 1, y: 0, rotate: open ? 0 : rotations[index] }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onClick={() => setOpen(v => !v)}
      style={{
        position: 'relative',
        background: '#fffef5',
        borderRadius: 16,
        padding: '20px 22px',
        cursor: 'pointer',
        border: `2px ${open ? 'solid' : 'dashed'} ${open ? '#22c55e' : 'rgba(0,0,0,0.15)'}`,
        boxShadow: open ? '5px 6px 0 rgba(34,197,94,0.2)' : '3px 4px 0 rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        transform: `rotate(${open ? 0 : rotations[index]}deg)`,
      }}
    >
      {/* notebook lines */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden', pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(transparent,transparent 27px,rgba(34,197,94,0.07) 27px,rgba(34,197,94,0.07) 28px)',
      }} />

      {/* corner dog-ear */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0, width: 24, height: 24,
        background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.06) 50%)',
        borderRadius: '0 0 14px 0',
      }} />

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <p style={{
          fontFamily: "'Permanent Marker', cursive",
          fontSize: 15, color: '#1a1a1a', margin: 0, lineHeight: 1.4, flex: 1,
        }}>{q}</p>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 22, color: '#22c55e', fontWeight: 900,
            lineHeight: 1, flexShrink: 0,
          }}
        >+</motion.span>
      </div>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <div style={{ paddingTop: 10, borderTop: '1.5px dashed rgba(34,197,94,0.3)', marginTop: 12 }}>
          <p style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.6)', lineHeight: 1.6, margin: 0,
          }}>{a}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const faqs = [
  { q: 'Is this a meal replacement?', a: "Plainfuel is a completer. We provide the 20% your high-quality meals usually miss — not a replacement." },
  { q: 'Why neutral taste?', a: "Habit science. We integrated into your current meals so you don't have to change your palette." },
  { q: 'Is it safe?', a: "Standardized by pharmacists. FSSAI certified. No artificial fillers, megadoses or synthetics." },
  { q: 'How do I use it?', a: "One scoop in your morning oats, smoothie, or batter. It disappears instantly — no texture, no taste." },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FinalCTA() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const productY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const bgRotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700;900&family=Permanent+Marker&display=swap');

        @keyframes floatProduct {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-14px) rotate(1deg); }
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        .float-product { animation: floatProduct 5s ease-in-out infinite; }
        .spin-slow { animation: spin-slow 18s linear infinite; }

        .doodle-section {
          background: #fafaf2;
          background-image: radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      <section id="buy" ref={sectionRef} style={{ position: 'relative', overflow: 'hidden' }}>

        {/* ── CTA BLOCK ─────────────────────────────────────────────────────── */}
        <div className="doodle-section" style={{ padding: '80px 0', position: 'relative', overflow: 'hidden' }}>

          {/* Background floating doodles */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <StarBurst size={56} rotate={20} style={{ position: 'absolute', top: '8%', left: '4%', opacity: 0.2 }} />
            <StarBurst size={36} rotate={-15} style={{ position: 'absolute', top: '20%', right: '5%', opacity: 0.2 }} />
            <CircleScribble size={100} style={{ position: 'absolute', bottom: '15%', left: '2%', opacity: 0.6 }} />
            <CircleScribble size={60} style={{ position: 'absolute', top: '30%', right: '8%', opacity: 0.5 }} />
            <ZigZag width={180} style={{ position: 'absolute', bottom: '8%', right: '12%', opacity: 0.7 }} />
            <ZigZag width={120} style={{ position: 'absolute', top: '5%', left: '30%', opacity: 0.5, transform: 'rotate(-3deg)' }} />
            {/* spinning badge */}
            <motion.div
              style={{ position: 'absolute', top: '12%', right: '18%', rotate: bgRotate }}
              className="spin-slow"
            >
              <svg viewBox="0 0 90 90" width={72} height={72} aria-hidden>
                <path id="spin-text-path" d="M45,45 m-30,0 a30,30 0 1,1 60,0 a30,30 0 1,1 -60,0" fill="none" />
                <text style={{ fontFamily: "'Caveat',cursive", fontSize: 9, fill: '#22c55e', fontWeight: 700 }}>
                  <textPath href="#spin-text-path">✦ LAUNCH PRICE ✦ LIMITED ✦ 33% OFF ✦</textPath>
                </text>
                <circle cx="45" cy="45" r="18" fill="#22c55e" />
                <text x="45" y="50" textAnchor="middle" style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 10, fill: '#fff' }}>NEW!</text>
              </svg>
            </motion.div>
          </div>

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: 56 }}
            >
              <div style={{
                background: 'rgba(34,197,94,0.12)',
                border: '2px dashed #22c55e',
                borderRadius: 8,
                padding: '6px 20px',
                transform: 'rotate(-1.5deg)',
                boxShadow: '3px 3px 0 rgba(34,197,94,0.2)',
              }}>
                <span style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 14, color: '#16a34a', letterSpacing: '0.06em' }}>
                  ✦ The New Protocol ✦
                </span>
              </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 48, alignItems: 'center' }}>

              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88, rotate: -4 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -2 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}
              >
                {/* Hand-drawn frame */}
                <div style={{ position: 'relative', width: 300, flexShrink: 0 }}>
                  <motion.div style={{ y: productY }} className="float-product">
                    {/* Sketchy border frame */}
                    <svg viewBox="0 0 320 420" preserveAspectRatio="none" aria-hidden
                      style={{ position: 'absolute', inset: '-20px', width: 'calc(100% + 40px)', height: 'calc(100% + 40px)', pointerEvents: 'none', zIndex: 2 }}>
                      <path
                        d="M14,14 Q80,8 160,12 Q240,8 306,14 L306,406 Q240,412 160,408 Q80,412 14,406 Z"
                        fill="none" stroke="#22c55e" strokeWidth="2.5"
                        strokeLinecap="round" strokeDasharray="10,4"
                      />
                    </svg>

                    {/* Tape strips */}
                    <TapeStrip rotate={-2} style={{ top: -10, left: 30, zIndex: 3 }} />
                    <TapeStrip rotate={2} style={{ bottom: -10, right: 30, zIndex: 3 }} />

                    {/* Glow blob */}
                    <div style={{
                      position: 'absolute', inset: '-20%',
                      background: 'radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)',
                      borderRadius: '50%', pointerEvents: 'none',
                    }} />

                    <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4' }}>
                      <Image
                        src="/images/product_premium.png"
                        alt="Order Plainfuel"
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  </motion.div>

                  {/* Annotation labels */}
                  <motion.div
                    initial={{ opacity: 0, x: -20, rotate: 3 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    style={{
                      position: 'absolute', left: -70, top: '30%',
                      background: '#fffef5',
                      border: '1.5px dashed rgba(34,197,94,0.5)',
                      borderRadius: 8, padding: '5px 10px',
                      boxShadow: '3px 3px 0 rgba(34,197,94,0.15)',
                      transform: 'rotate(-2deg)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span style={{ fontFamily: "'Caveat',cursive", fontSize: 13, fontWeight: 700, color: '#22c55e' }}>Zero fillers ✓</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20, rotate: -2 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    style={{
                      position: 'absolute', right: -65, top: '55%',
                      background: '#fffef5',
                      border: '1.5px dashed rgba(34,197,94,0.5)',
                      borderRadius: 8, padding: '5px 10px',
                      boxShadow: '3px 3px 0 rgba(34,197,94,0.15)',
                      transform: 'rotate(1.5deg)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span style={{ fontFamily: "'Caveat',cursive", fontSize: 13, fontWeight: 700, color: '#22c55e' }}>FSSAI cert ✓</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Copy Side */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.15 }}
              >
                {/* Headline */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  style={{
                    fontFamily: "'Permanent Marker',cursive",
                    fontSize: 'clamp(2.4rem,5vw,4rem)',
                    lineHeight: 1.1,
                    color: '#1a1a1a',
                    marginBottom: 20,
                    marginTop: 0,
                  }}
                >
                  Begin the{' '}
                  <span style={{ position: 'relative', display: 'inline-block', color: '#22c55e' }}>
                    Completion.
                    <DoodleCircle delay={0.8} />
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  style={{
                    fontFamily: "'Caveat',cursive",
                    fontSize: 18,
                    fontWeight: 600,
                    color: 'rgba(0,0,0,0.55)',
                    lineHeight: 1.65,
                    marginBottom: 32,
                    maxWidth: 400,
                  }}
                >
                  Your biology doesn&apos;t wait for the right moment. Start bridging the gap today with the only precision habit built for urban life.
                </motion.p>

                {/* Price Card */}
                <motion.div
                  initial={{ opacity: 0, y: 16, rotate: -1 }}
                  whileInView={{ opacity: 1, y: 0, rotate: -0.5 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  style={{
                    position: 'relative',
                    background: '#fffef5',
                    border: '2.5px dashed rgba(34,197,94,0.5)',
                    borderRadius: 18,
                    padding: '24px 28px',
                    marginBottom: 28,
                    transform: 'rotate(-0.5deg)',
                    boxShadow: '5px 6px 0 rgba(34,197,94,0.15)',
                  }}
                >
                  <TapeStrip rotate={-1.5} style={{ top: -11, left: 24 }} />
                  {/* notebook lines */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden', pointerEvents: 'none',
                    backgroundImage: 'repeating-linear-gradient(transparent,transparent 27px,rgba(34,197,94,0.08) 27px,rgba(34,197,94,0.08) 28px)',
                  }} />

                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 'clamp(2.5rem,6vw,3.8rem)', color: '#1a1a1a', lineHeight: 1 }}>
                      ₹599
                    </span>
                    <span style={{ fontFamily: "'Caveat',cursive", fontSize: 22, color: 'rgba(0,0,0,0.2)', textDecoration: 'line-through', fontWeight: 700 }}>
                      ₹899
                    </span>
                    <motion.span
                      animate={{ rotate: [-2, 2, -2] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        background: '#22c55e',
                        color: '#fff',
                        fontFamily: "'Permanent Marker',cursive",
                        fontSize: 11,
                        letterSpacing: '0.08em',
                        padding: '4px 10px',
                        borderRadius: 6,
                        boxShadow: '2px 2px 0 #15803d',
                        display: 'inline-block',
                      }}
                    >
                      33% OFF
                    </motion.span>
                  </div>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StarBurst size={14} color="#22c55e" />
                    <span style={{
                      fontFamily: "'Caveat',cursive",
                      fontSize: 14, fontWeight: 700,
                      color: '#22c55e', letterSpacing: '0.06em',
                    }}>30 Servings • Free Shipping • Launch Price</span>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.a
                  href="#"
                  initial={{ opacity: 0, y: 12, rotate: -1 }}
                  whileInView={{ opacity: 1, y: 0, rotate: -1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ rotate: 0, scale: 1.02, boxShadow: '6px 7px 0 #15803d' }}
                  whileTap={{ scale: 0.97, rotate: 0 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    background: '#22c55e',
                    color: '#fff',
                    fontFamily: "'Permanent Marker',cursive",
                    fontSize: 16,
                    letterSpacing: '0.05em',
                    padding: '16px 32px',
                    borderRadius: 14,
                    border: '2.5px solid #15803d',
                    boxShadow: '4px 5px 0 #15803d',
                    textDecoration: 'none',
                    transform: 'rotate(-1deg)',
                    marginBottom: 20,
                    width: '100%',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* inner doodle stroke */}
                  <svg viewBox="0 0 260 56" preserveAspectRatio="none" aria-hidden
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <path
                      d="M8,4 Q130,1 252,4 L252,52 Q130,55 8,52 Z"
                      fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"
                      strokeLinecap="round" strokeDasharray="8,4"
                    />
                  </svg>
                  Reserve Your Protocol
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ display: 'inline-block', fontSize: 18 }}
                  >→</motion.span>
                </motion.a>

                {/* Trust badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.55 }}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}
                >
                  {['✅ Risk Free', '🧪 Lab Verified', '🏥 Derm Safe'].map((badge, i) => (
                    <span key={i} style={{
                      fontFamily: "'Caveat',cursive",
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'rgba(0,0,0,0.45)',
                      background: '#fffef5',
                      border: '1.5px dashed rgba(0,0,0,0.15)',
                      borderRadius: 8,
                      padding: '4px 10px',
                      transform: `rotate(${(i - 1) * 0.8}deg)`,
                      display: 'inline-block',
                    }}>{badge}</span>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── FAQ BLOCK ─────────────────────────────────────────────────────── */}
        <div style={{
          background: '#fffef5',
          borderTop: '2px dashed rgba(34,197,94,0.2)',
          padding: '72px 0',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* bg dots */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />
          <CircleScribble size={90} style={{ position: 'absolute', top: 20, right: '5%', opacity: 0.4 }} />
          <StarBurst size={40} rotate={30} style={{ position: 'absolute', bottom: 30, left: '3%', opacity: 0.2 }} />

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ marginBottom: 44 }}
            >
              <div style={{
                display: 'inline-block',
                background: 'rgba(254,240,138,0.5)',
                border: '1.5px dashed rgba(0,0,0,0.2)',
                borderRadius: 6,
                padding: '4px 14px',
                marginBottom: 14,
                transform: 'rotate(-1deg)',
                boxShadow: '2px 2px 0 rgba(0,0,0,0.07)',
              }}>
                <span style={{ fontFamily: "'Caveat',cursive", fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  🧠 Biological Logic
                </span>
              </div>

              <div style={{ position: 'relative', display: 'inline-block' }}>
                <h3 style={{
                  fontFamily: "'Permanent Marker',cursive",
                  fontSize: 'clamp(2rem,4vw,3rem)',
                  color: '#1a1a1a',
                  margin: 0,
                  lineHeight: 1.1,
                }}>Common Questions</h3>
                <ScribbleUnderline delay={0.4} />
              </div>
            </motion.div>

            {/* FAQ Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
              gap: 20,
            }}>
              {faqs.map((faq, i) => (
                <FaqCard key={i} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <footer style={{
          background: '#fafaf2',
          borderTop: '2px dashed rgba(34,197,94,0.2)',
          padding: '36px 0',
          position: 'relative',
        }}>
          <ZigZag width={200} style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', opacity: 0.3 }} />

          <div style={{
            maxWidth: 1200, margin: '0 auto', padding: '0 24px',
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'space-between', gap: 20,
          }}>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <div style={{
                position: 'relative', width: 34, height: 34, flexShrink: 0,
              }}>
                <svg viewBox="0 0 40 40" width={34} height={34}>
                  <path
                    d="M5,5 Q20,2 35,5 Q38,5 38,20 Q38,35 35,36 Q20,38 5,36 Q2,35 2,20 Q2,5 5,5 Z"
                    fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeDasharray="6,2"
                  />
                  <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle"
                    style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 16, fill: '#16a34a', fontWeight: 900 }}>P</text>
                </svg>
              </div>
              <span style={{ fontFamily: "'Permanent Marker',cursive", fontSize: 20, color: '#1a1a1a', letterSpacing: '0.02em' }}>
                Plainfuel
              </span>
              <StarBurst size={12} style={{ opacity: 0.5 }} />
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
            >
              {[
                { icon: Instagram, label: 'Instagram', href: '#' },
                { icon: Twitter, label: 'Twitter', href: '#' },
                { icon: Mail, label: 'Contact', href: '#' },
              ].map(({ icon: Icon, label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ rotate: i % 2 === 0 ? -3 : 3, y: -2 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontFamily: "'Caveat',cursive",
                    fontSize: 14, fontWeight: 700,
                    color: 'rgba(0,0,0,0.45)',
                    textDecoration: 'none',
                    background: '#fffef5',
                    border: '1.5px dashed rgba(0,0,0,0.15)',
                    borderRadius: 8,
                    padding: '5px 12px',
                    boxShadow: '2px 2px 0 rgba(0,0,0,0.07)',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#22c55e';
                    e.currentTarget.style.borderColor = 'rgba(34,197,94,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(0,0,0,0.45)';
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)';
                  }}
                >
                  <Icon size={14} />
                  {label}
                </motion.a>
              ))}
            </motion.div>

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{
                background: '#fffef5',
                border: '1.5px dashed rgba(0,0,0,0.12)',
                borderRadius: 8,
                padding: '5px 14px',
                transform: 'rotate(0.5deg)',
                boxShadow: '2px 2px 0 rgba(0,0,0,0.05)',
              }}
            >
              <p style={{
                fontFamily: "'Caveat',cursive",
                fontSize: 12, fontWeight: 700,
                color: 'rgba(0,0,0,0.3)',
                margin: 0,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>© 2026 Designed for Longevity ✦</p>
            </motion.div>
          </div>
        </footer>

      </section>
    </>
  );
}