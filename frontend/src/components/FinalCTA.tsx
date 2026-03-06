'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram, Mail, Twitter } from 'lucide-react';
import { useRef, useState } from 'react';

// ─── Doodle SVG Primitives ────────────────────────────────────────────────────

const ScribbleUnderline = ({ color = '#15803d', delay = 0, style = {} }: { color?: string; delay?: number; style?: React.CSSProperties }) => (
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

const StarBurst = ({ size = 28, rotate = 0, color = '#15803d', style = {} }: { size?: number; rotate?: number; color?: string; style?: React.CSSProperties }) => (
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
        border: `2px ${open ? 'solid' : 'dashed'} ${open ? '#15803d' : 'rgba(0,0,0,0.15)'}`,
        boxShadow: open ? '5px 6px 0 rgba(21,128,61,0.2)' : '3px 4px 0 rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        transform: `rotate(${open ? 0 : rotations[index]}deg)`,
      }}
    >
      {/* notebook lines */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden', pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(transparent,transparent 27px,rgba(21,128,61,0.07) 27px,rgba(21,128,61,0.07) 28px)',
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
          fontSize: 18, color: '#0a0a0a', margin: 0, lineHeight: 1.4, flex: 1,
        }}>{q}</p>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 22, color: '#15803d', fontWeight: 900,
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
            fontSize: 20, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.6, margin: 0,
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

export default function FinalCTA({ onNavigate }: { onNavigate?: (view: string) => void } = {}) {
  const sectionRef = useRef(null);

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
                <span style={{ fontFamily: "'Caveat',cursive", fontSize: 17, fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  🧠 Biological Logic
                </span>
              </div>

              <div style={{ position: 'relative', display: 'inline-block' }}>
                <h3 style={{
                  fontFamily: "'Permanent Marker',cursive",
                  fontSize: 'clamp(2rem,4vw,3rem)',
                  color: '#0a0a0a',
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
          padding: '48px 0',
          position: 'relative',
        }}>
          <ZigZag width={200} style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', opacity: 0.3 }} />

          <div style={{
            maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1,
          }}>
            {/* Top row: Logo + Links */}
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              alignItems: 'flex-start', justifyContent: 'space-between', gap: 40, marginBottom: 32,
            }}>

              {/* Logo — permanently tilted upward */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}
              >
                <div
                  style={{
                    position: 'relative', width: 320, height: 120, flexShrink: 0,
                    transform: 'rotate(-8deg)',
                    transformOrigin: 'left center',
                  }}
                >
                  <Image
                    src="/images/plainfuel.png"
                    alt="Plainfuel"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <StarBurst size={12} style={{ opacity: 0.5 }} />
              </motion.div>

              {/* Links Section */}
              <div style={{
                display: 'flex', gap: 32, flexWrap: 'wrap', flex: '1 1 auto', justifyContent: 'flex-end', alignItems: 'flex-start',
              }}>

                {/* Quick Links */}
                {onNavigate && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                  >
                    <p style={{
                      fontFamily: "'Permanent Marker',cursive",
                      fontSize: 14, fontWeight: 700,
                      color: '#666', margin: '0 0 8px 0',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>Quick Links</p>
                    <motion.button
                      onClick={() => onNavigate('products')}
                      whileHover={{ rotate: -3, y: -2 }}
                      style={{
                        fontFamily: "'Caveat',cursive",
                        fontSize: 16, fontWeight: 700,
                        color: '#1a1a1a',
                        background: '#fffef5',
                        border: '1.5px dashed rgba(0,0,0,0.15)',
                        borderRadius: 8,
                        padding: '4px 10px',
                        boxShadow: '2px 2px 0 rgba(0,0,0,0.07)',
                        cursor: 'pointer',
                        transition: 'color 0.2s, border-color 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#15803d';
                        e.currentTarget.style.borderColor = 'rgba(21,128,61,0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#1a1a1a';
                        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)';
                      }}
                    >
                      Products
                    </motion.button>
                  </motion.div>
                )}

                {/* Policy Links */}
                {onNavigate && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                  >
                    <p style={{
                      fontFamily: "'Permanent Marker',cursive",
                      fontSize: 14, fontWeight: 700,
                      color: '#666', margin: '0 0 8px 0',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>Policies</p>
                    {[
                      { label: 'Shipping', view: 'shipping' },
                      { label: 'Returns', view: 'return' },
                      { label: 'Privacy', view: 'privacy' },
                      { label: 'Terms', view: 'terms' },
                    ].map(({ label, view }, i) => (
                      <motion.button
                        key={label}
                        onClick={() => onNavigate(view)}
                        whileHover={{ rotate: i % 2 === 0 ? -3 : 3, y: -2 }}
                        style={{
                          fontFamily: "'Caveat',cursive",
                          fontSize: 16, fontWeight: 700,
                          color: '#1a1a1a',
                          background: '#fffef5',
                          border: '1.5px dashed rgba(0,0,0,0.15)',
                          borderRadius: 8,
                          padding: '4px 10px',
                          boxShadow: '2px 2px 0 rgba(0,0,0,0.07)',
                          cursor: 'pointer',
                          transition: 'color 0.2s, border-color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#15803d';
                          e.currentTarget.style.borderColor = 'rgba(21,128,61,0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#1a1a1a';
                          e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)';
                        }}
                      >
                        {label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {/* Social links */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <p style={{
                    fontFamily: "'Permanent Marker',cursive",
                    fontSize: 14, fontWeight: 700,
                    color: '#666', margin: '0 0 8px 0',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>Follow Us</p>
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
                        fontSize: 16, fontWeight: 700,
                        color: '#1a1a1a',
                        textDecoration: 'none',
                        background: '#fffef5',
                        border: '1.5px dashed rgba(0,0,0,0.15)',
                        borderRadius: 8,
                        padding: '4px 10px',
                        boxShadow: '2px 2px 0 rgba(0,0,0,0.07)',
                        transition: 'color 0.2s, border-color 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#15803d';
                        e.currentTarget.style.borderColor = 'rgba(21,128,61,0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#1a1a1a';
                        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)';
                      }}
                    >
                      <Icon size={14} />
                      {label}
                    </motion.a>
                  ))}
                </motion.div>

              </div>
            </div>

            {/* Bottom: Copyright */}
            <div style={{
              borderTop: '1.5px dashed rgba(0,0,0,0.12)',
              paddingTop: 24,
              textAlign: 'center',
            }}>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{
                  display: 'inline-block',
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
                  fontSize: 15, fontWeight: 700,
                  color: '#1a1a1a',
                  margin: 0,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>© 2026 Designed for Longevity ✦</p>
              </motion.div>
            </div>
          </div>
        </footer>

      </section>
    </>
  );
} 