'use client';

import { motion, useScroll } from 'framer-motion';
import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { ArrowRight, Beaker } from 'lucide-react';
import { F_SIZE, BRAND, FONTS, TYPOGRAPHY } from '@/lib/typography';

/* ══════════════════════════════════════════════════════════
   WATERMARK IMAGE POOL
   Replace paths with your actual public/images/ assets.
   Each image is rendered at low opacity as a decorative
   background element — position & rotation are varied per section.
══════════════════════════════════════════════════════════ */
const WATERMARK_IMAGES: {
  src: string;
  top: string;
  right: string;
  size: number;
  rotation: number;
}[] = [
  { src: '/images/wm/sachet-flat.png',      top: '8%',  right: '-3rem', size: 290, rotation: 10  },
  { src: '/images/wm/sachet-standing.png',  top: '20%', right: '-1rem', size: 260, rotation: -8  },
  { src: '/images/wm/powder-spill.png',     top: '6%',  right: '-4rem', size: 310, rotation: 5   },
  { src: '/images/wm/formula-badge.png',    top: '14%', right: '-2rem', size: 240, rotation: -14 },
  { src: '/images/wm/leaf-sprig.png',       top: '10%', right: '0rem',  size: 230, rotation: 18  },
  { src: '/images/wm/grain-close.png',      top: '12%', right: '-3rem', size: 280, rotation: -6  },
  { src: '/images/wm/sachet-open.png',      top: '18%', right: '-1rem', size: 270, rotation: 8   },
  { src: '/images/wm/protein-wave.png',     top: '5%',  right: '-2rem', size: 300, rotation: -11 },
];

/* ══════════════════════════════════════════════════════════
   SIDEBAR NAV CONFIG
══════════════════════════════════════════════════════════ */
const NAV: { id: string; num: string; label: string }[] = [
  { id: 'hero',       num: '—',  label: 'Intro'         },
  { id: 'visual-comp', num: '★', label: 'The Comparison'},
  { id: 'sec-01',     num: '01', label: 'The Problem'   },
  { id: 'sec-02',     num: '02', label: 'Foundation'    },
  { id: 'sec-03',     num: '03', label: 'The Gap'       },
  { id: 'sec-04',     num: '04', label: 'Reality'       },
  { id: 'sec-05',     num: '05', label: 'Trade-off'     },
  { id: 'sec-06',     num: '06', label: 'Missing Piece' },
  { id: 'sec-07',     num: '07', label: 'Engineering'   },
  { id: 'sec-08',     num: '08', label: 'The Answer'    },
  { id: 'closing',    num: '—',  label: 'Conclusion'    },
];

/* ══════════════════════════════════════════════════════════
   READING PROGRESS BAR
══════════════════════════════════════════════════════════ */
const ReadingProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 2,
        background: BRAND.primaryDark,
        transformOrigin: '0%',
        scaleX: scrollYProgress,
        zIndex: 300,
      }}
    />
  );
};

/* ══════════════════════════════════════════════════════════
   FIXED SIDEBAR NAVIGATOR — works as navbar to navigate sections
══════════════════════════════════════════════════════════ */
const Sidebar = ({ active }: { active: string }) => {
  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      aria-label="Page sections"
      style={{
        position: 'fixed',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 6,
      }}
    >
      {NAV.map((item) => {
        const on = active === item.id;
        return (
          <motion.button
            key={item.id}
            onClick={() => go(item.id)}
            title={item.label}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              outline: 'none',
              borderRadius: 8,
              transition: 'all 0.3s',
              backgroundColor: on ? `${BRAND.primary}15` : 'transparent',
            }}
          >
            {/* pill indicator */}
            <motion.div
              animate={{ width: on ? 28 : 8 }}
              style={{
                height: 6,
                borderRadius: 100,
                background: on ? BRAND.primaryDark : BRAND.tertiary,
                flexShrink: 0,
              }}
            />

            {/* label always visible — changes color based on active state */}
            <motion.span
              animate={{ color: on ? BRAND.primaryDark : BRAND.tertiary, fontWeight: on ? 800 : 600 }}
              transition={{ duration: 0.3 }}
              style={{
                ...TYPOGRAPHY.eyebrow,
                color: on ? BRAND.primaryDark : BRAND.tertiary,
                fontWeight: on ? 800 : 600,
                whiteSpace: 'nowrap' as const,
                fontSize: '0.65rem',
              }}
            >
              {item.label}
            </motion.span>
          </motion.button>
        );
      })}
    </nav>
  );
};

/* ══════════════════════════════════════════════════════════
   WATERMARK TEXT — giant ghost word centred behind content
══════════════════════════════════════════════════════════ */
const WmText = ({ word }: { word: string }) => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
    }}
  >
    <span style={{
      ...TYPOGRAPHY.displayXL,
      fontWeight: 800,
      color: BRAND.quaternary,
      opacity: 0.55,
      userSelect: 'none' as const,
      textTransform: 'uppercase' as const,
      whiteSpace: 'nowrap' as const,
      marginLeft: '-0.06em',
    }}>
      {word}
    </span>
  </div>
);

/* ══════════════════════════════════════════════════════════
   WATERMARK IMAGE — decorative, right-side
══════════════════════════════════════════════════════════ */
const WmImg = ({
  src, top, right, size, rotation,
}: { src: string; top: string; right: string; size: number; rotation: number }) => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      top,
      right,
      width: size,
      height: size,
      opacity: 0.065,
      transform: `rotate(${rotation}deg)`,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
    }}
  >
    <img
      src={src}
      alt=""
      style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'grayscale(100%) contrast(0.7)' }}
    />
  </div>
);

/* ══════════════════════════════════════════════════════════
   SECTION WRAPPER — handles reveal animation + watermarks
══════════════════════════════════════════════════════════ */
const Section = ({
  id, children, wmWord, wmImg,
}: {
  id: string;
  children: React.ReactNode;
  wmWord: string;
  wmImg: typeof WATERMARK_IMAGES[0];
}) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    style={{
      position: 'relative',
      padding: '3rem 0',
      borderBottom: `0.5px solid ${BRAND.quaternary}`,
      overflow: 'hidden',
    }}
  >
    <WmText word={wmWord} />
    <WmImg {...wmImg} />
    <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
  </motion.section>
);

/* ══════════════════════════════════════════════════════════
   TYPOGRAPHY COMPONENTS — all use TYPOGRAPHY / BRAND constants
══════════════════════════════════════════════════════════ */

/* Chapter eyebrow: num ─── label */
const Eyebrow = ({ num, label }: { num: string; label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '0.9rem' }}>
    <span style={{ ...TYPOGRAPHY.eyebrow, fontWeight: 800, color: BRAND.primaryDark }}>{num}</span>
    <div style={{ flex: 1, height: '0.5px', background: BRAND.tertiary }} />
    <span style={{ ...TYPOGRAPHY.eyebrow, fontWeight: 800, color: BRAND.primaryDark }}>{label}</span>
  </div>
);

/* Ghost chapter number behind heading */
const Ghost = ({ num }: { num: string }) => (
  <div style={{
    ...TYPOGRAPHY.displayXL,
    fontWeight: 800,
    color: BRAND.light,
    lineHeight: 0.85,
    marginBottom: '-1.25rem',
    marginLeft: '-0.04em',
  }}>
    {num}
  </div>
);

/* Section heading — uses headingLG size, bigger clamped value */
const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{
    ...TYPOGRAPHY.headingLG,
    fontWeight: 800,
    color: BRAND.primary,
    margin: '0 0 1rem',
    maxWidth: 520,
  }}>
    {children}
  </h2>
);

/* Body paragraph — TYPOGRAPHY.bodyMD */
const Body = ({ children }: { children: React.ReactNode }) => (
  <p style={{ ...TYPOGRAPHY.bodyMD, fontWeight: 800, color: BRAND.secondary, lineHeight: 1.8, margin: '0 0 0.7rem' }}>
    {children}
  </p>
);

/* Callout pull-quote — uses TYPOGRAPHY.accentLG (Caveat italic) */
const Callout = ({ children }: { children: React.ReactNode }) => (
  <div style={{ position: 'relative', margin: '1.2rem 0', paddingLeft: '1.5rem' }}>
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0,
      width: 3, background: BRAND.primaryDark, borderRadius: 2,
    }} />
    <p style={{
      ...TYPOGRAPHY.accentLG,
      fontWeight: 800,
      color: BRAND.primaryDark,
      lineHeight: 1.5,
      margin: 0,
    }}>
      {children}
    </p>
  </div>
);

/* Inline strong — BRAND.primary + 800 weight */
const S = ({ children }: { children: React.ReactNode }) => (
  <strong style={{ color: BRAND.primaryDark, fontWeight: 800 }}>{children}</strong>
);

/* Inline cursive accent — Caveat italic, BRAND.primaryDark */
const C = ({ children }: { children: React.ReactNode }) => (
  <em style={{
    ...TYPOGRAPHY.accentLG,
    fontWeight: 900,
    color: BRAND.primaryDark,
  }}>
    {children}
  </em>
);

/* Numbered row list — uses TYPOGRAPHY.bodySM + eyebrow for number */
const NumList = ({ items }: { items: string[] }) => (
  <div style={{ margin: '1.5rem 0' }}>
    {items.map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.07, duration: 0.5 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 18,
          padding: '0.7rem 0',
          borderBottom: i < items.length - 1 ? `0.5px solid ${BRAND.tertiary}` : 'none',
        }}
      >
        <span style={{ ...TYPOGRAPHY.eyebrow, fontWeight: 800, color: BRAND.secondary, minWidth: 22 }}>
          {String(i + 1).padStart(2, '0')}
        </span>
        <span style={{ ...TYPOGRAPHY.bodySM, fontWeight: 800, color: BRAND.secondary, lineHeight: 1.65 }}>
          {item}
        </span>
      </motion.div>
    ))}
  </div>
);

/* Enzyme card — headingMD name + bodySM desc */
const Enzyme = ({ name, desc }: { name: string; desc: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    style={{
      display: 'grid',
      gridTemplateColumns: '3px 1fr',
      gap: '0 1.5rem',
      padding: '1.25rem 0',
      borderBottom: `0.5px solid ${BRAND.tertiary}`,
    }}
  >
    <div style={{ background: BRAND.secondary, borderRadius: 2, opacity: 0.3 }} />
    <div>
      <p style={{ ...TYPOGRAPHY.headingMD, fontWeight: 800, color: BRAND.primary, margin: '0 0 3px' }}>{name}</p>
      <p style={{ ...TYPOGRAPHY.bodySM, fontWeight: 800, color: BRAND.secondary, margin: 0, lineHeight: 1.6 }}>{desc}</p>
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════
   FOOD COMPARISON TABLE — Enhanced Premium Layout
══════════════════════════════════════════════════════════ */
const foodItems = [
  { emoji: '🥚', name: 'Eggs', amount: '3 large (~150 g)', kcal: 210, barPct: 17, nutrients: 'Protein, B12, selenium, biotin' },
  { emoji: '🥛', name: 'Milk', amount: '500 ml whole milk', kcal: 300, barPct: 24, nutrients: 'Calcium, B2, B12, vitamin D' },
  { emoji: '🫘', name: 'Legumes', amount: '150 g cooked (~1 bowl)', kcal: 240, barPct: 19, nutrients: 'Fiber, B vitamins, zinc' },
  { emoji: '🥦', name: 'Vegetables', amount: '100 g cooked', kcal: 25, barPct: 2, nutrients: 'Folate, magnesium' },
  { emoji: '🍌', name: 'Banana', amount: '120 g', kcal: 105, barPct: 8, nutrients: 'B6, potassium' },
  { emoji: '🍊', name: 'Orange', amount: '130 g', kcal: 60, barPct: 5, nutrients: 'Vitamin C' },
];

const FoodComparisonTable = () => (
  <div style={{ fontFamily: FONTS.main, padding: '1.5rem 0' }}>

    {/* ── Header ── */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: BRAND.light, border: `1px solid ${BRAND.quaternary}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v5l3 2" stroke={BRAND.primaryDark} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="8" r="6" stroke={BRAND.primaryDark} strokeWidth="1.5" />
        </svg>
      </div>
      <div>
        <p style={{ ...TYPOGRAPHY.headingMD, fontWeight: 800, color: BRAND.primary, margin: 0, fontSize: 'clamp(1rem, 2.5vw, 1.2rem)' }}>
          Todays Meal Breakdown
        </p>
        <p style={{ fontFamily: FONTS.main, fontSize: '0.72rem', fontWeight: 500, color: BRAND.secondary, margin: 0 }}>
          Complete nutrition from ~1.3 kg of real food
        </p>
      </div>
    </div>

    {/* ── Total strip ── */}
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.6rem 1rem',
      background: BRAND.primary, borderRadius: 10, marginBottom: '1rem',
    }}>
      <span style={{ fontFamily: FONTS.main, fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: BRAND.secondary }}>
        Total daily calories
      </span>
      <span style={{ fontFamily: FONTS.main, fontSize: '0.9rem', fontWeight: 800, color: BRAND.light }}>
        1,244 <span style={{ fontSize: '0.65rem', fontWeight: 600, color: BRAND.secondary, marginLeft: 4 }}>kcal · 6 foods</span>
      </span>
    </div>

    {/* ── Card Grid ── */}
    <div className="fc-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem' }}>
      {foodItems.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          style={{
            borderRadius: 14, background: BRAND.white,
            border: '1px solid #E8E2DC', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >

          {/* Top */}
          <div style={{ padding: '0.85rem 0.9rem 0.75rem', borderBottom: `0.5px solid ${BRAND.light}70` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.55rem' }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: BRAND.light,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 19, flexShrink: 0,
              }}>
                {item.emoji}
              </div>
              <div style={{
                background: BRAND.primary, color: BRAND.light,
                fontFamily: FONTS.main, fontSize: '0.6rem', fontWeight: 800,
                padding: '3px 9px', borderRadius: 20, letterSpacing: '0.04em', whiteSpace: 'nowrap' as const,
              }}>
                {item.kcal} kcal
              </div>
            </div>
            <p style={{ fontFamily: FONTS.main, fontSize: '0.88rem', fontWeight: 800, color: BRAND.primary, margin: '0 0 1px' }}>
              {item.name}
            </p>
            <p style={{ fontFamily: FONTS.main, fontSize: '0.65rem', fontWeight: 600, color: BRAND.secondary, margin: 0 }}>
              {item.amount}
            </p>
          </div>

          {/* Energy bar */}
          <div style={{ padding: '0.6rem 0.9rem', borderBottom: `0.5px solid ${BRAND.light}70` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontFamily: FONTS.main, fontSize: '0.52rem', fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase' as const, color: BRAND.secondary }}>
                Energy
              </span>
              <span style={{ fontFamily: FONTS.main, fontSize: '0.95rem', fontWeight: 800, color: BRAND.primary, lineHeight: 1 }}>
                {item.kcal} <span style={{ fontSize: '0.58rem', fontWeight: 600, color: BRAND.secondary, marginLeft: 2 }}>kcal</span>
              </span>
            </div>
            <div style={{ height: 4, borderRadius: 99, background: BRAND.light, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${item.barPct}%`, borderRadius: 99, background: BRAND.primaryDark }} />
            </div>
          </div>

          {/* Nutrients */}
          <div style={{
            padding: '0.6rem 0.9rem', background: '#FAFAF8',
            display: 'flex', alignItems: 'center', gap: 7, flex: 1,
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              background: BRAND.light, border: `1px solid ${BRAND.quaternary}70`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1.5 4l2 2 3-3" stroke={BRAND.primaryDark} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontFamily: FONTS.main, fontSize: '0.65rem', fontWeight: 600, color: BRAND.primaryDark, lineHeight: 1.4 }}>
              {item.nutrients}
            </span>
          </div>

        </motion.div>
      ))}
    </div>

    <style>{`
      @media (max-width: 480px) {
        .fc-card-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  </div>
);
/* ══════════════════════════════════════════════════════════
   VISUAL COMPARISON SECTION
══════════════════════════════════════════════════════════ */
const VisualComparisonSection = () => (
  <motion.section
    id="visual-comp"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    style={{
      position: 'relative',
      borderBottom: `0.5px solid ${BRAND.quaternary}`,
      overflow: 'hidden',
    }}
  >
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ═══ ROW 1: COMPARISON BOXES WITH IMAGE ═══ */}
      <div style={{ paddingBottom: 'clamp(2rem, 4vw, 3rem)', borderBottom: `0.5px solid ${BRAND.quaternary}40` }}>
        <div
          className="visual-comp-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.15fr)',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            alignItems: 'start',
          }}
        >

          {/* ── LEFT: Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ minWidth: 0 }}
          >
            <div style={{ position: 'relative',top: 100, borderRadius: 20, overflow: 'hidden' }}>
              <img
                src="/images/sciencePage1.png"
                alt="Visual Comparison: Traditional plate vs PlainFuel sachet"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />

              {/* Corner science icon badge */}
              {/* <div style={{
                position: 'absolute',
                top: 14,
                right: 14,
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: BRAND.light,
                border: `1.5px solid ${BRAND.quaternary}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="5.5" stroke={BRAND.primaryDark} strokeWidth="1.5" />
                  <path d="M8 5.5V8.5L10 10" stroke={BRAND.primaryDark} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              Bottom shelf overlay
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1rem 1.25rem',
                background: `${BRAND.primary}cc`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{
                  fontFamily: FONTS.main,
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase' as const,
                  color: `${BRAND.light}cc`,
                }}>
                  Nutrition Science
                </span>
                <span style={{
                  fontFamily: FONTS.main,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: BRAND.light,
                  background: BRAND.primaryDark,
                  padding: '3px 9px',
                  borderRadius: 20,
                  letterSpacing: '0.06em',
                }}>
                  PlainFuel Research
                </span>
              </div> */}
            </div>
          </motion.div>

          {/* ── RIGHT: Content column ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >

            {/* Section tag pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 12px 5px 8px',
              border: `0.5px solid ${BRAND.quaternary}`,
              borderRadius: 20,
              width: 'fit-content',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND.primaryDark }} />
              <span style={{
                fontFamily: FONTS.main,
                fontSize: '0.62rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase' as const,
                color: BRAND.primaryDark,
              }}>
                Visual Comparison
              </span>
            </div>

            {/* Heading */}
            <div>
              <h3 style={{
                ...TYPOGRAPHY.headingLG,
                fontWeight: 800,
                color: BRAND.primary,
                fontSize: 'clamp(1.4rem, 3.8vw, 1.8rem)',
                lineHeight: 1.15,
                margin: '0 0 0.6rem',
              }}>
                Same nutrition.{' '}
                <span style={{ color: BRAND.primaryDark }}>Fraction</span>{' '}
                of the weight.
              </h3>
              <p style={{
                ...TYPOGRAPHY.bodyMD,
                fontWeight: 600,
                color: BRAND.secondary,
                lineHeight: 1.75,
                margin: 0,
                fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
              }}>
                <S>~1.3 kg of food</S> delivers the same nutrition as{' '}
                <S>one 40g PlainFuel scoop</S> — engineered for density, not bulk.
              </p>
            </div>

            {/* ── Duel Cards + Insight Strip ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

              {/* Duel row */}
              <div
                className="vc-duel"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) 36px minmax(0, 1fr)',
                  alignItems: 'stretch',
                }}
              >
                {/* Card A — Traditional */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  style={{
                    background: BRAND.white, borderRadius: 16,
                    border: `1px solid ${BRAND.quaternary}60`,
                    overflow: 'hidden', display: 'flex', flexDirection: 'column',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  {/* Top stripe */}
                  <div style={{ height: 3, background: BRAND.quaternary, flexShrink: 0 }} />

                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                    {/* Pill */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 20, background: BRAND.light, border: `0.5px solid ${BRAND.quaternary}`, width: 'fit-content' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: BRAND.secondary }} />
                      <span style={{ fontFamily: FONTS.main, fontSize: '0.56rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: BRAND.primaryDark }}>Traditional Meal</span>
                    </div>

                    <p style={{ fontFamily: FONTS.main, fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', fontWeight: 800, color: BRAND.primary, lineHeight: 1, margin: 0 }}>~1244 kcal</p>
                    <p style={{ fontFamily: FONTS.main, fontSize: '0.7rem', fontWeight: 600, color: BRAND.secondary, margin: 0 }}>~1.3 kg food</p>

                    <div style={{ borderTop: `0.5px solid ${BRAND.quaternary}30`, margin: '0.1rem 0' }} />

                    {/* Tags */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
                      {['Bulky', 'Perishable', 'Hard to carry'].map(t => (
                        <span key={t} style={{ fontFamily: FONTS.main, fontSize: '0.6rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: BRAND.light, color: BRAND.primaryDark }}>{t}</span>
                      ))}
                    </div>

                    <p style={{ fontFamily: FONTS.main, fontSize: '0.65rem', fontWeight: 600, color: BRAND.secondary, lineHeight: 1.4, margin: 0, marginTop: 'auto', paddingTop: '0.5rem', borderTop: `0.5px solid ${BRAND.quaternary}30` }}>
                      Needs preparation, storage & multiple containers. <strong style={{ fontWeight: 800, color: BRAND.primary }}>Not portable.</strong>
                    </p>
                  </div>
                </motion.div>

                {/* VS column */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <div style={{ flex: 1, width: 0.5, background: `${BRAND.quaternary}60`, minHeight: 12 }} />
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: BRAND.light, border: `1px solid ${BRAND.quaternary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.main, fontSize: '0.52rem', fontWeight: 800, color: BRAND.primaryDark, flexShrink: 0 }}>vs</div>
                  <div style={{ flex: 1, width: 0.5, background: `${BRAND.quaternary}60`, minHeight: 12 }} />
                </div>

                {/* Card B — PlainFuel */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{
                    background: BRAND.primary, borderRadius: 16,
                    border: `1px solid ${BRAND.primary}`,
                    overflow: 'hidden', display: 'flex', flexDirection: 'column',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  {/* Top stripe */}
                  <div style={{ height: 3, background: BRAND.primaryDark, flexShrink: 0 }} />

                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                    {/* Pill */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 20, background: `${BRAND.primaryDark}30`, border: `0.5px solid ${BRAND.primaryDark}60`, width: 'fit-content' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: BRAND.secondary }} />
                      <span style={{ fontFamily: FONTS.main, fontSize: '0.56rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: BRAND.secondary }}>PlainFuel Scoop</span>
                    </div>

                    <p style={{ fontFamily: FONTS.main, fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', fontWeight: 800, color: BRAND.light, lineHeight: 1, margin: 0 }}>129 kcal</p>
                    <p style={{ fontFamily: FONTS.main, fontSize: '0.7rem', fontWeight: 600, color: BRAND.secondary, margin: 0 }}>40g scoop</p>

                    <div style={{ borderTop: `0.5px solid ${BRAND.white}15`, margin: '0.1rem 0' }} />

                    {/* Tags */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
                      {['Portable', 'Shelf-stable', 'Precise'].map(t => (
                        <span key={t} style={{ fontFamily: FONTS.main, fontSize: '0.6rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: `${BRAND.primaryDark}30`, color: BRAND.secondary }}>{t}</span>
                      ))}
                    </div>

                    <p style={{ fontFamily: FONTS.main, fontSize: '0.65rem', fontWeight: 600, color: BRAND.secondary, lineHeight: 1.4, margin: 0, marginTop: 'auto', paddingTop: '0.5rem', borderTop: `0.5px solid ${BRAND.white}15` }}>
                      One scoop, anywhere. No prep, no waste. <strong style={{ fontWeight: 800, color: BRAND.light }}>Precision dosed.</strong>
                    </p>
                  </div>
                </motion.div>
              </div>

             
            </div>

          </motion.div>
        </div>
      </div>

      {/* ═══ ROW 2: TODAY'S MEAL BREAKDOWN ═══ */}
      <div style={{ paddingTop: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
        <FoodComparisonTable />
      </div>

    </div>

    <style>{`
      @media (max-width: 768px) {
        .visual-comp-grid { grid-template-columns: 1fr !important; }
      }
      @media (max-width: 400px) {
        .vc-duel {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  </motion.section>
);

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function SciencePage() {
  const [activeId, setActiveId] = useState('hero');

  /* Sync sidebar with visible section */
  useEffect(() => {
    const els = NAV.map(n => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setActiveId(e.target.id);
          }
        });
      },
      {
        threshold: [0, 0.25, 0.5, 0.75],
        rootMargin: '-50% 0px -50% 0px',
      }
    );
    els.forEach(el => obs.observe(el));
    return () => {
      els.forEach(el => obs.unobserve(el));
      obs.disconnect();
    };
  }, []);

  return (
    <MainLayout background={BRAND.white}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,700;0,900;1,400&family=Caveat:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        @media (max-width: 950px) {
          .pf-sidebar { display: none !important; }
          .pf-content { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
        }
      `}</style>

      <ReadingProgress />
      <div className="pf-sidebar"><Sidebar active={activeId} /></div>

      <div style={{ background: BRAND.white }}>
        <div
          className="pf-content"
          style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem 5rem 3.5rem', paddingTop: '80px' }}
        >

          {/* ═══════════ HERO ═══════════ */}
          <section
            id="hero"
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column' as const,
              justifyContent: 'center',
              padding: '3rem 0 3rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Rotated "FUEL" watermark text */}
            <div aria-hidden="true" style={{
              position: 'absolute',
              right: '-5rem',
              top: '50%',
              transform: 'translateY(-50%) rotate(-90deg)',
              fontFamily: FONTS.main,
              fontSize: 'clamp(7rem, 22vw, 15rem)',
              fontWeight: 900,
              color: BRAND.light,
              opacity: 0.55,
              lineHeight: 1,
              userSelect: 'none' as const,
              pointerEvents: 'none' as const,
              letterSpacing: '-0.05em',
              whiteSpace: 'nowrap' as const,
            }}>
              FUEL
            </div>

            {/* Hero image watermark */}
            <div aria-hidden="true" style={{
              position: 'absolute',
              right: '-1rem', bottom: '5rem',
              width: 300, opacity: 0.06,
              transform: 'rotate(7deg)',
              pointerEvents: 'none',
            }}>
              <img src={WATERMARK_IMAGES[1].src} alt=""
                style={{ width: '100%', filter: 'grayscale(100%) contrast(0.7)' }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '3.5rem' }}
              >
                <Beaker size={11} color={BRAND.primaryDark} />
                <span style={{ ...TYPOGRAPHY.eyebrow, fontSize: F_SIZE.md, color: BRAND.primaryDark }}>
                  The science behind
                </span>
                <span style={{
                  display: 'inline-block', width: 36, height: 1,
                  background: BRAND.primaryDark, opacity: 0.35,
                }} />
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1 style={{
                  fontFamily: FONTS.main,
                  fontSize: 'clamp(3.5rem, 10vw, 7rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.05em',
                  lineHeight: 0.9,
                  color: BRAND.primary,
                  margin: '0 0 0.1rem',
                }}>
                  Why
                </h1>
                <div style={{
                  fontFamily: FONTS.accent,
                  fontStyle: 'italic',
                  fontSize: 'clamp(3.8rem, 10.8vw, 7.8rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  lineHeight: 0.9,
                  color: BRAND.primaryDark,
                  marginBottom: '3rem',
                }}>
                  PlainFuel
                </div>
              </motion.div>

              {/* Sub-heading + hero body */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                style={{ maxWidth: 540 }}
              >
                <p style={{
                  ...TYPOGRAPHY.headingMD,
                  color: BRAND.primaryDark,
                  margin: '0 0 0.6rem',
                  lineHeight: 1.45,
                }}>
                  More than protein.{' '}
                  <span style={{ color: BRAND.primary }}>Real daily nutrition.</span>
                </p>
                <p style={{ ...TYPOGRAPHY.bodyMD, color: BRAND.secondary, lineHeight: 1.9, margin: 0 }}>
                  PlainFuel is <S>not a typical protein powder.</S>{' '}
                  It combines <C>high-quality whey protein,</C> essential micronutrients,
                  functional fibre, and digestive enzymes into one formulation designed for everyday nutrition.
                  <br /><br />
                  Just replace your normal protein sachet with PlainFuel and cover{' '}
                  <S>far more than protein alone.</S>
                </p>
              </motion.div>

              {/* Scroll cue */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.8 }}
                style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <div style={{
                  width: 26, height: 42,
                  border: `1.5px solid ${BRAND.quaternary}`,
                  borderRadius: 100,
                  display: 'flex', justifyContent: 'center', paddingTop: 7,
                }}>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                    style={{ width: 4, height: 4, borderRadius: '50%', background: BRAND.primaryDark }}
                  />
                </div>
                <span style={{ ...TYPOGRAPHY.eyebrow, fontSize: '0.54rem', color: BRAND.tertiary }}>
                  The Story
                </span>
              </motion.div>
            </div>
          </section>

          {/* ═══════════ VISUAL COMPARISON ═══════════ */}
          <VisualComparisonSection />

          {/* ═══════════ 01 ═══════════ */}
          <Section id="sec-01" wmWord="PROTEIN" wmImg={WATERMARK_IMAGES[0]}>
            <Eyebrow num="01" label="The Problem" />
            <Ghost num="01" />
            <Heading>Not Just Another Protein Powder</Heading>
            <Body>
              Most protein powders solve only <S>one problem</S> — protein intake.
              But the body needs far more than protein to function well.
            </Body>
            <Callout>
              PlainFuel breaks away from the traditional protein powder category by combining:
            </Callout>
            <NumList items={[
              'Whey protein',
              'Essential vitamins and minerals',
              'Functional fibre',
              'Digestive enzymes',
            ]} />
            <Body>
              Instead of stacking multiple supplements, PlainFuel delivers{' '}
              <S>complete daily nutrition support</S> in one sachet.
            </Body>
          </Section>

          {/* ═══════════ 02 ═══════════ */}
          <Section id="sec-02" wmWord="WHEY" wmImg={WATERMARK_IMAGES[1]}>
            <Eyebrow num="02" label="The Foundation" />
            <Ghost num="02" />
            <Heading>Built On High-Quality Whey Protein</Heading>
            <Body>
              Protein is the <S>foundation</S> of PlainFuel. Whey protein is one of the most
              bioavailable protein sources, containing <S>all essential amino acids</S> required
              for muscle repair and metabolic health.
            </Body>
            <Callout>But protein alone does not create a complete diet.</Callout>
            <Body>
              PlainFuel builds on whey by adding nutrients that support{' '}
              <S>overall health,</S> not just muscle recovery.
            </Body>
          </Section>

          {/* ═══════════ 03 ═══════════ */}
          <Section id="sec-03" wmWord="MICRO" wmImg={WATERMARK_IMAGES[2]}>
            <Eyebrow num="03" label="The Gap" />
            <Ghost num="03" />
            <Heading>Micronutrients Require Diversity</Heading>
            <Body>
              Your body needs <S>dozens of vitamins and minerals daily.</S>{' '}
              Getting all of them from food requires significant dietary diversity:
            </Body>
            <NumList items={[
              'Multiple vegetables',
              'Fruits',
              'Whole grains',
              'Seeds and nuts',
              'Different protein sources',
            ]} />
            <Body>
              Most people repeat the same meals every day, which makes{' '}
              <S>micronutrient gaps common.</S>{' '}
              PlainFuel makes daily nutrition <C>manageable and consistent</C> by providing
              a wide spectrum of micronutrients in one sachet.
            </Body>
          </Section>

          {/* ═══════════ 04 ═══════════ */}
          <Section id="sec-04" wmWord="DAILY" wmImg={WATERMARK_IMAGES[3]}>
            <Eyebrow num="04" label="The Reality" />
            <Ghost num="04" />
            <Heading>Nutrition Should Be Easy to Maintain</Heading>
            <Body>
              Eating perfectly balanced meals every day is <S>difficult.</S>{' '}
              Busy schedules often lead to:
            </Body>
            <NumList items={['Skipped meals', 'Repetitive diets', 'Nutrient gaps']} />
            <Callout>
              One sachet helps support a balanced intake of protein, vitamins, minerals, and fibre.
            </Callout>
            <Body><S>No complicated planning required.</S></Body>
          </Section>

          {/* ═══════════ 05 ═══════════ */}
          <Section id="sec-05" wmWord="BALANCE" wmImg={WATERMARK_IMAGES[4]}>
            <Eyebrow num="05" label="The Trade-off" />
            <Ghost num="05" />
            <Heading>Weight Loss Without Nutrient Compromise</Heading>
            <Body>
              Many calorie-restricted diets <S>reduce overall nutrient intake.</S>{' '}
              Low-calorie diets can unintentionally reduce:
            </Body>
            <NumList items={['Vitamins', 'Minerals', 'Fibre']} />
            <Callout>This can make long-term dieting harder to sustain.</Callout>
            <Body>
              PlainFuel allows you to maintain a calorie-controlled diet while{' '}
              <S>still supporting daily nutrient needs.</S>{' '}
              High protein and fibre also help promote <S>satiety,</S>{' '}
              which can make calorie management easier.
            </Body>
          </Section>

          {/* ═══════════ 06 ═══════════ */}
          <Section id="sec-06" wmWord="FIBRE" wmImg={WATERMARK_IMAGES[5]}>
            <Eyebrow num="06" label="The Missing Piece" />
            <Ghost num="06" />
            <Heading>Fibre That Modern Diets Often Lack</Heading>
            <Body>
              Dietary fibre intake is often <S>far below recommended levels.</S>{' '}
              Fibre plays an important role in:
            </Body>
            <NumList items={[
              'Digestive health',
              'Blood sugar regulation',
              'Satiety',
              'Gut microbiome support',
            ]} />
            <Body>
              PlainFuel includes functional fibres such as <C>inulin,</C> which help support{' '}
              <S>beneficial gut bacteria</S> and digestive balance.
            </Body>
          </Section>

          {/* ═══════════ 07 ═══════════ */}
          <Section id="sec-07" wmWord="DIGEST" wmImg={WATERMARK_IMAGES[6]}>
            <Eyebrow num="07" label="The Engineering" />
            <Ghost num="07" />
            <Heading>Designed for Better Digestion</Heading>
            <Body>
              Protein shakes can sometimes cause <S>digestive discomfort</S> such as bloating.
              PlainFuel includes digestive enzymes that help improve digestion:
            </Body>
            <div style={{ margin: '1.5rem 0' }}>
              <Enzyme name="Lactase" desc="helps break down lactose present in whey" />
              <Enzyme name="Protease / Prolase" desc="supports protein digestion" />
            </div>
            <Body>
              These enzymes help improve <S>digestibility and nutrient absorption,</S>{' '}
              making the sachet <C>easier on the stomach.</C>
            </Body>
          </Section>

          {/* ═══════════ 08 ═══════════ */}
          <Section id="sec-08" wmWord="SIMPLE" wmImg={WATERMARK_IMAGES[7]}>
            <Eyebrow num="08" label="The Answer" />
            <Ghost num="08" />
            <Heading>Simpler Nutrition, Every Day</Heading>
            <Body>
              PlainFuel is designed to <S>simplify nutrition.</S> Instead of managing multiple
              supplements and complicated diets, you can replace your normal protein sachet with a
              formulation designed to <S>support daily nutrition more completely.</S>
            </Body>
          </Section>

          {/* ═══════════ CLOSING ═══════════ */}
          <motion.section
            id="closing"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              padding: '9rem 0 4rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Closing image watermark */}
            <div aria-hidden="true" style={{
              position: 'absolute', right: '-3rem', top: '50%',
              transform: 'translateY(-50%) rotate(5deg)',
              width: 340, opacity: 0.055,
              pointerEvents: 'none',
            }}>
              <img src={WATERMARK_IMAGES[0].src} alt=""
                style={{ width: '100%', filter: 'grayscale(100%) contrast(0.7)' }} />
            </div>
            {/* Closing text watermark */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
            }}>
              <span style={{
                fontFamily: FONTS.main,
                fontSize: 'clamp(5rem, 18vw, 13rem)',
                fontWeight: 900,
                color: BRAND.quaternary,
                opacity: 0.14,
                letterSpacing: '-0.05em',
                userSelect: 'none' as const,
                textTransform: 'uppercase' as const,
                whiteSpace: 'nowrap' as const,
              }}>
                PLAINFUEL
              </span>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <Eyebrow num="—" label="The Conclusion" />

              <div style={{ marginBottom: '3.5rem' }}>
                <div style={{
                  fontFamily: FONTS.main,
                  fontSize: 'clamp(2.8rem, 9vw, 6rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.05em',
                  color: BRAND.primary,
                  lineHeight: 0.9,
                  margin: '0 0 0.1rem',
                }}>
                  One Sachet.
                </div>
                <div style={{
                  fontFamily: FONTS.accent,
                  fontStyle: 'italic',
                  fontSize: 'clamp(3rem, 9.5vw, 6.5rem)',
                  fontWeight: 700,
                  color: BRAND.primaryDark,
                  lineHeight: 0.9,
                  margin: '0 0 0.1rem',
                }}>
                  Better Nutrition.
                </div>
                <div style={{
                  fontFamily: FONTS.main,
                  fontSize: 'clamp(1.5rem, 4.5vw, 3.2rem)',
                  fontWeight: 500,
                  color: BRAND.secondary,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                }}>
                  Simpler Routine.
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.04, backgroundColor: BRAND.primaryDark }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '16px 46px',
                  background: BRAND.primary,
                  color: BRAND.white,
                  borderRadius: 100,
                  border: 'none',
                  fontFamily: FONTS.main,
                  fontSize: F_SIZE.sm,
                  fontWeight: 700,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.2em',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                Explore PlainFuel
                <ArrowRight size={13} />
              </motion.button>
            </div>
          </motion.section>

        </div>
      </div>
    </MainLayout>
  );
}