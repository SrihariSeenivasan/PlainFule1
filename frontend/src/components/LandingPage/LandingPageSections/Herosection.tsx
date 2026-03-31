'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { F_SIZE, COLORS, FONTS, BRAND } from '@/lib/typography';

// ── Slides data ───────────────────────────────────────────────────────────────
const SLIDES = [
  {
    src: '/images/Products/product_premium.png',
    alt: 'Lemon Lime',
    label: 'Lemon Lime',
    tag: '01',
    sub: 'Citrus — Light & Refreshing',
    glow: 'rgba(74,222,128,0.22)',
    specs: [
      { k: 'Protein', v: '25g' },
      { k: 'Fiber', v: '8g' },
      { k: 'Calories', v: '140' },
    ],
  },
  {
    src: '/images/Products/product.png',
    alt: 'Berry Blast',
    label: 'Berry Blast',
    tag: '02',
    sub: 'Mixed Berry — Bold & Sweet',
    glow: 'rgba(167,139,250,0.22)',
    specs: [
      { k: 'Protein', v: '25g' },
      { k: 'Fiber', v: '8g' },
      { k: 'Calories', v: '140' },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function GoldLine({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      height: 1, width: '100%',
      background: `linear-gradient(to right, transparent, ${BRAND.burgundy}99, transparent)`,
      ...style,
    }} />
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: FONTS.main,
      fontSize: F_SIZE.sm, letterSpacing: '0.26em', textTransform: 'uppercase',
      color: BRAND.espresso, fontWeight: 700,
      border: `1px solid ${BRAND.espresso}40`,
      borderRadius: 2, padding: '5px 14px',
      backgroundColor: 'rgba(10, 61, 31, 0.05)',
    }}>{children}</span>
  );
}

// ── Product Panel ────────────────────────────────────────────────────────────
function ProductPanel() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDir(1);
      setIdx(i => (i + 1) % SLIDES.length);
    }, 5000);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const advance = (next: number) => {
    setDir(next > idx ? 1 : -1);
    setIdx(next);
    resetTimer();
  };

  const slide = SLIDES[idx];
  const OVERLAY_HEIGHT = 220;
  const CARD_HEIGHT = 620;
  const IMAGE_AREA = CARD_HEIGHT - OVERLAY_HEIGHT;

  return (
    <div style={{
      position: 'relative',
      borderRadius: 12,
      overflow: 'hidden',
      height: CARD_HEIGHT,
      width: '100%',
      boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.06)',
      background: COLORS.white,
      border: '1px solid rgba(0,0,0,0.05)',
    }}>

      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${idx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg, #f8f9f8 0%, #f1f5f1 45%, #ffffff 100%)',
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%', transform: 'translateX(-50%)',
            width: 500, height: IMAGE_AREA,
            background: `radial-gradient(ellipse at 50% 55%, ${slide.glow} 0%, transparent 65%)`,
            opacity: 0.15,
          }} />
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
            <defs>
              <pattern id="dotgrid" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="14" cy="14" r="0.9" fill={BRAND.burgundy} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotgrid)" />
          </svg>
        </motion.div>
      </AnimatePresence>

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 20,
        background: `linear-gradient(to right, transparent 5%, ${BRAND.burgundy}44 35%, ${BRAND.burgundy} 50%, ${BRAND.burgundy}44 65%, transparent 95%)`,
      }} />

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 15,
        padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: FONTS.accent,
          fontSize: F_SIZE.md, letterSpacing: '0.04em',
          color: `${COLORS.ink}44`, fontWeight: 700,
        }}>PlainFuel — Daily Edition</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => advance(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === idx ? 28 : 7, height: 3,
                border: 'none', cursor: 'pointer', padding: 0,
                background: i === idx ? BRAND.espresso : `${COLORS.silver}33`,
                borderRadius: 1.5, transition: 'all 0.35s ease',
              }}
            />
          ))}
          <span style={{
            fontFamily: FONTS.main,
            fontSize: F_SIZE.sm, letterSpacing: '0.2em',
            color: `${COLORS.ink}33`, fontWeight: 700, marginLeft: 4,
          }}>{slide.tag}/{SLIDES.length.toString().padStart(2, '0')}</span>
        </div>
      </div>

      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: IMAGE_AREA,
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`img-${idx}`}
            initial={{ opacity: 0, x: dir * 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir * -50, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }}
            style={{ width: '72%', maxWidth: 280 }}
          >
            <motion.img
              src={slide.src}
              alt={slide.alt}
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.08)) drop-shadow(0 4px 8px rgba(0,0,0,0.05))',
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: OVERLAY_HEIGHT,
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ height: 1, width: '100%', background: 'rgba(0,0,0,0.05)' }} />

        <div style={{ padding: '18px 24px 0', flex: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`info-${idx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.38 }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                <span style={{
                  fontFamily: FONTS.main,
                  fontSize: F_SIZE.lg, fontWeight: 800,
                  color: COLORS.ink, letterSpacing: '-0.02em', lineHeight: 1,
                }}>{slide.label}</span>
                <span style={{
                  fontFamily: FONTS.accent,
                  fontSize: F_SIZE.md, color: BRAND.espresso, fontWeight: 700,
                  letterSpacing: '0.02em',
                }}>Flavor</span>
              </div>
              <div style={{
                fontFamily: FONTS.main,
                fontSize: F_SIZE.sm, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: `${COLORS.silver}`, fontWeight: 600,
                marginBottom: 0,
              }}>{slide.sub}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{ margin: '14px 24px 0', height: 1, background: 'rgba(0,0,0,0.05)' }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          flex: 1,
          padding: '0',
        }}>
          {slide.specs.map(({ k, v }, i) => (
            <div key={k} style={{
              padding: '12px 24px',
              borderRight: i < 2 ? `1px solid rgba(0,0,0,0.05)` : 'none',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3,
            }}>
              <span style={{
                fontFamily: FONTS.main,
                fontSize: F_SIZE.lg, fontWeight: 800,
                color: COLORS.ink, lineHeight: 1,
              }}>{v}</span>
              <span style={{
                fontFamily: FONTS.main,
                fontSize: F_SIZE.sm, letterSpacing: '0.24em',
                textTransform: 'uppercase', color: `${COLORS.silver}`, fontWeight: 700,
              }}>{k}</span>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: `1px solid rgba(0,0,0,0.05)`,
          padding: '11px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flex: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#72383D',
              boxShadow: '0 0 7px rgba(22,163,74,0.4)',
            }} />
            <span style={{
              fontFamily: FONTS.main,
              fontSize: F_SIZE.sm, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: `${COLORS.silver}`, fontWeight: 700,
            }}>In Stock — Ships in 2 days</span>
          </div>
          <a href="#order" style={{
            fontFamily: FONTS.main,
            fontSize: F_SIZE.sm, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: BRAND.espresso, fontWeight: 900,
            textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Order Now
            <svg viewBox="0 0 16 16" width={10} height={10} fill="none">
              <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Left Content ─────────────────────────────────────────────────────────────
function AboutLeft({ inView }: { inView: boolean }) {
  const paragraphs = [
    "PlainFuel is a daily nutrition supplement designed to simplify how we meet our body's needs.",
    "Instead of taking multiple supplements or tracking different nutrients, PlainFuel brings everything together in one sachet. It combines protein, essential micronutrients, and fiber in a structured way so that your body gets consistent support every day.",
    "This is not just another protein powder. It is designed to act as a daily nutrition system — something you can rely on without overthinking.",
  ];

  const fromLeft = (delay: number) => ({
    initial: { opacity: 0, x: -40 },
    animate: inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 },
    transition: { duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] as any },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <motion.div {...fromLeft(0.05)} style={{ marginBottom: 30, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Chip>
          <svg viewBox="0 0 8 8" width={6} height={6}><circle cx="4" cy="4" r="3" fill={BRAND.espresso} /></svg>
          Daily Nutrition
        </Chip>
        <div style={{
          width: 52, height: 1,
          background: `linear-gradient(to right, ${BRAND.burgundy}99, transparent)`,
        }} />
      </motion.div>

      <motion.div {...fromLeft(0.12)} style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(8px,1.2vw,16px)', flexWrap: 'nowrap' }}>
          <h2 style={{
            fontFamily: FONTS.main,
            fontSize: F_SIZE.xl,
            fontWeight: 900, lineHeight: 0.88,
            letterSpacing: '-0.04em', margin: 0, color: COLORS.ink,
          }}>Plain</h2>
          <h2 style={{
            fontFamily: FONTS.main,
            fontSize: F_SIZE.xl,
            fontWeight: 300, lineHeight: 0.88,
            letterSpacing: '-0.04em', margin: 0, color: BRAND.espresso,
          }}>Fuel</h2>
        </div>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] as any }}
        style={{ originX: 0, marginBottom: 22 }}
      >
        <GoldLine />
      </motion.div>

      <motion.p {...fromLeft(0.28)} style={{
        fontFamily: FONTS.accent,
        fontSize: F_SIZE.lg,
        fontWeight: 700, color: BRAND.espresso,
        margin: '0 0 38px 0', letterSpacing: '0.01em',
      }}>
        A Simple Approach to Daily Nutrition
      </motion.p>

      <motion.div {...fromLeft(0.34)} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <div style={{ width: 20, height: 1, background: BRAND.burgundy }} />
        <span style={{
          fontFamily: FONTS.main,
          fontSize: F_SIZE.sm, letterSpacing: '0.28em',
          textTransform: 'uppercase', color: BRAND.accent, fontWeight: 900,
        }}>What is PlainFuel?</span>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 46 }}>
        {paragraphs.map((text, i) => (
          <motion.p key={i} {...fromLeft(0.42 + i * 0.1)}
            style={{
              fontFamily: FONTS.main,
              fontSize: F_SIZE.md,
              fontWeight: 500, color: '#3c4a3e',
              lineHeight: 1.9, margin: 0,
              paddingLeft: 18,
              borderLeft: `2px solid ${i === 0 ? BRAND.burgundy : i === 1 ? BRAND.burgundy : 'rgba(22,101,52,0.15)'}`,
            }}
          >{text}</motion.p>
        ))}
      </div>

      <motion.div {...fromLeft(0.72)} style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <a href="#order" style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          fontFamily: FONTS.main,
          fontSize: F_SIZE.sm, fontWeight: 900,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: COLORS.white, background: BRAND.espresso,
          padding: '15px 30px', borderRadius: 3,
          textDecoration: 'none',
          boxShadow: '0 8px 32px rgba(10,61,31,0.12)',
          transition: 'all 0.25s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = BRAND.espresso; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(10,61,31,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = BRAND.espresso; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(10,61,31,0.12)'; }}
        >
          Get PlainFuel
          <svg viewBox="0 0 16 16" width={11} height={11} fill="none">
            <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex' }}>
            {['#2d6a3f', '#235233', '#3a8055'].map((bg, i) => (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: '50%',
                border: `2px solid ${COLORS.white}`,
                background: bg, marginLeft: i > 0 ? -9 : 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }} />
            ))}
          </div>
          <div>
            <div style={{ display: 'flex', gap: 2, marginBottom: 3 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <svg key={s} viewBox="0 0 10 10" width={9} height={9}>
                  <polygon points="5,0.5 6.2,3.8 9.5,3.8 6.9,5.9 7.9,9.1 5,7.1 2.1,9.1 3.1,5.9 0.5,3.8 3.8,3.8" fill={BRAND.burgundy} />
                </svg>
              ))}
            </div>
            <span style={{
              fontFamily: FONTS.accent,
              fontSize: F_SIZE.sm, color: COLORS.silver, fontWeight: 700,
            }}>1,200+ daily users</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Root Component ───────────────────────────────────────────────────────────
export default function PlainFuelHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Caveat:wght@500;600;700&display=swap');
        
        .pfa-section {
          background: ${BRAND.cream};
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(48px, 6vw, 80px) clamp(24px, 5.5vw, 72px);
          position: relative;
          overflow: hidden;
        }

        .pfa-section::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 10% 55%, rgba(22,101,52,0.035) 0%, transparent 52%),
            radial-gradient(ellipse at 90% 15%, rgba(133,77,14,0.02) 0%, transparent 48%);
          pointer-events: none;
        }

        .pfa-section::after {
          content: '';
          position: absolute; top: 0; bottom: 0;
          left: calc(50% - 40px);
          width: 1px;
          background: linear-gradient(to bottom,
            transparent,
            rgba(0,0,0,0.04) 20%,
            rgba(0,0,0,0.04) 80%,
            transparent
          );
          pointer-events: none;
        }

        .pfa-inner {
          max-width: 1160px; width: 100%;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: clamp(48px, 6.5vw, 88px);
          align-items: center;
          position: relative; z-index: 1;
        }

        @media (max-width: 900px) {
          .pfa-inner { grid-template-columns: 1fr !important; gap: 48px !important; }
          .pfa-panel-col { order: -1; width: 100%; max-width: 480px; margin: 0 auto; }
          .pfa-section::after { display: none; }
        }
      `}</style>

      <section className="pfa-section">
        <div className="pfa-inner" ref={sectionRef}>
          <AboutLeft inView={inView} />
          <motion.div
            className="pfa-panel-col"
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
            transition={{ duration: 0.72, delay: 0.1, ease: [0.22, 1, 0.36, 1] as any }}
          >
            <ProductPanel />
          </motion.div>
        </div>
      </section>
    </>
  );
}
