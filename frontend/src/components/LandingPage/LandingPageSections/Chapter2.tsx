'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, AlertCircle, Sparkles, FlaskConical, ArrowRight } from 'lucide-react';
import Image from 'next/image';

import { F_SIZE, FONTS, BRAND } from '../../../lib/typography';

/* ─────────────────────────────────────────────────────────────
   EYEBROW PILL — uses tertiary bg, primaryDark text
───────────────────────────────────────────────────────────── */
function Pill({ label, variant = 'default' }: { label: string; variant?: 'default' | 'dark' | 'accent' }) {
  const styles = {
    default: {
      bg: BRAND.light,
      border: BRAND.tertiary,
      iconColor: BRAND.primaryDark,
      textColor: BRAND.primaryDark,
    },
    dark: {
      bg: BRAND.primary,
      border: BRAND.secondary,
      iconColor: BRAND.tertiary,
      textColor: BRAND.light,
    },
    accent: {
      bg: BRAND.primaryDark,
      border: BRAND.secondary,
      iconColor: BRAND.light,
      textColor: BRAND.white,
    },
  }[variant];

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 16px', borderRadius: 100,
      background: styles.bg,
      border: `1px solid ${styles.border}`,
    }}>
      <Sparkles size={11} color={styles.iconColor} />
      <span style={{
        fontSize: F_SIZE.sm,
        fontWeight: 800,
        color: styles.textColor,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
      }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CHAPTER STAMP — tertiary lines, light bg pill, primaryDark text
───────────────────────────────────────────────────────────── */
function ChapterStamp({ number }: { number: string }) {
  return (
    <section style={{ padding: '28px 24px 0', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }} style={{ height: 1, width: 80, background: BRAND.tertiary, transformOrigin: 'right' }} />
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '6px 20px', borderRadius: 100,
            background: BRAND.light,
            border: `1px solid ${BRAND.tertiary}`,
          }}>
          <Sparkles size={12} color={BRAND.primaryDark} />
          <span style={{
            fontSize: F_SIZE.lg,
            fontWeight: 800,
            color: BRAND.primary,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}>Chapter {number}</span>
        </motion.div>
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }} style={{ height: 1, width: 80, background: BRAND.tertiary, transformOrigin: 'left' }} />
      </div>

      {/* Hook line below Chapter label */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          textAlign: 'center',
          marginTop: 16,
        }}
      >
        <p style={{
          fontSize: F_SIZE.lg,
          fontWeight: 600,
          color: BRAND.primaryDark,
          margin: 0,
          lineHeight: 1.6,
        }}>
          We all want things to be <span style={{ color: BRAND.primary, fontWeight: 800 }}>natural</span>, but <span style={{ color: BRAND.primary, fontWeight: 800 }}>natural food</span> can&apos;t provide that all
        </p>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 1 — DIETARY ANALYSIS
   Colors used: primary (headings), secondary (body/subtitle), primaryDark (accents/secondary heading),
                tertiary (dividers/borders), light (backgrounds), quaternary (dot decorations)
───────────────────────────────────────────────────────────── */
function DietaryAnalysisSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const focused = ['Carbohydrates', 'Fats'];
  const lacking = ['Protein', 'Fiber', 'Essential micronutrients'];

  return (
    <section ref={ref} style={{ padding: '24px 0 0', position: 'relative', zIndex: 1 }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: BRAND.white, position: 'relative', overflow: 'hidden', padding: '48px 0 44px' }}
      >
        {/* Watermark */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(100px, 16vw, 200px)',
          fontWeight: 900,
          color: `${BRAND.quaternary}50`,
          letterSpacing: '-0.06em', whiteSpace: 'nowrap',
          userSelect: 'none', pointerEvents: 'none',
        }}>NUTRITION</div>

        {/* Glow blob */}
        <div style={{
          position: 'absolute', top: '-10%', right: '0%',
          width: '35vw', height: '35vw', borderRadius: '50%',
          background: `radial-gradient(circle, ${BRAND.light} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 5vw, 64px)', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: 40, maxWidth: 760, margin: '0 auto 40px', textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
              <Pill label="Dietary Analysis" variant="default" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
                fontWeight: 900,
                color: BRAND.primary,
                margin: '22px 0 12px',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}>
              Today, many of us have started paying attention to nutrition .
              <span style={{ color: BRAND.primaryDark }}> But nutrition is not just about protein.</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.25 }}
              style={{ fontSize: F_SIZE.md, color: BRAND.secondary, margin: 0, fontWeight: 800 }}>
              Our daily diet, especially in India
            </motion.p>
          </div>

          {/* Two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(16px, 3vw, 40px)', alignItems: 'start' }}>

            {/* Focused column — primaryDark accent */}
            <motion.div initial={{ opacity: 0, x: -24 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: BRAND.primaryDark,
                  border: `1px solid ${BRAND.primaryDark}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CheckCircle2 size={18} color={BRAND.white} />
                </div>
                <span style={{
                  fontSize: F_SIZE.sm,
                  fontWeight: 800, color: BRAND.primaryDark,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>Heavily focused on</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {focused.map((tag, i) => (
                  <motion.div key={tag}
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '20px 24px', borderRadius: 14,
                      background: BRAND.light,
                      border: `1.5px solid ${BRAND.primaryDark}30`,
                    }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: BRAND.primaryDark, flexShrink: 0,
                      boxShadow: `0 0 8px ${BRAND.primaryDark}60`,
                    }} />
                    <span style={{ fontSize: F_SIZE.md, fontWeight: 700, color: BRAND.primary }}>{tag}</span>
                    <div style={{ marginLeft: 'auto' }}>
                      <ArrowRight size={14} color={BRAND.primaryDark} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Lacking column — secondary accent */}
            <motion.div initial={{ opacity: 0, x: 24 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.35 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: BRAND.tertiary,
                  border: `1px solid ${BRAND.secondary}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AlertCircle size={18} color={BRAND.primary} />
                </div>
                <span style={{
                  fontSize: F_SIZE.sm,
                  fontWeight: 800, color: BRAND.primary,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>But often lacks</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {lacking.map((tag, i) => (
                  <motion.div key={tag}
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 16px', borderRadius: 12,
                      background: BRAND.white,
                      border: `1px solid ${BRAND.quaternary}`,
                    }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: BRAND.secondary, flexShrink: 0,
                    }} />
                    <span style={{ fontSize: F_SIZE.md, fontWeight: 600, color: BRAND.primaryDark }}>{tag}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.8 }}
            style={{ height: 1, background: `linear-gradient(90deg, transparent, ${BRAND.tertiary}, transparent)`, marginTop: 32, transformOrigin: 'left' }} />
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 2 — THEORETICAL VS PRACTICAL
   CounterBlock: light bg, primaryDark number, primary label
   TextBlock: white bg, primaryDark label dot, primary label, secondary body
   Conclusion block: primary bg (dark), tertiary/secondary text
───────────────────────────────────────────────────────────── */
function useCountUp(target: number, inView: boolean, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      const duration = 1400;
      const start = performance.now();
      function easeOutExpo(t: number) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
      function step(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        setValue(Math.round(easeOutExpo(progress) * target));
        if (progress < 1) requestAnimationFrame(step);
        else setValue(target);
      }
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [inView, target, delay]);
  return value;
}

function CounterBlock({ target, suffix, unit, inView, delay }: {
  target: number; suffix: string; unit: string; inView: boolean; delay: number;
}) {
  const value = useCountUp(target, inView, delay);
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(20px, 3vw, 28px) 16px',
      background: BRAND.light,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, ${BRAND.tertiary}60 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        fontSize: F_SIZE.xl,
        fontWeight: 900,
        color: BRAND.primaryDark,
        lineHeight: 0.85,
        letterSpacing: '-0.03em',
        position: 'relative', zIndex: 1,
      }}>
        {value}{suffix}
      </div>
      <div style={{
        fontSize: F_SIZE.sm,
        fontWeight: 700,
        color: BRAND.primary,
        marginTop: 8, textAlign: 'center', lineHeight: 1.3,
        letterSpacing: '0.05em', position: 'relative', zIndex: 1,
      }}>
        {unit}
      </div>
    </div>
  );
}

function TextBlock({ label, body }: { label: string; body: string }) {
  return (
    <div style={{
      padding: 'clamp(18px, 3vw, 28px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6,
      background: BRAND.white,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND.primaryDark, flexShrink: 0 }} />
        <span style={{
          fontSize: F_SIZE.md, fontWeight: 800,
          color: BRAND.primaryDark, textTransform: 'uppercase',
          letterSpacing: '0.07em', lineHeight: 1.2,
        }}>{label}</span>
      </div>
      <p style={{
        fontSize: F_SIZE.md,
        color: BRAND.secondary, fontWeight: 700,
        margin: 0, lineHeight: 1.55,
      }}>{body}</p>
    </div>
  );
}

const theoreticalItems = [
  { label: 'Spinach is considered rich in iron', body: 'But to meet daily iron needs, you would need around 600 grams of spinach every day.', target: 600, suffix: 'g', unit: 'Spinach / day', numLeft: false },
  { label: 'Ragi is rich in calcium', body: 'To meet daily calcium needs, you would need around 300 grams of ragi daily.', target: 300, suffix: 'g', unit: 'Ragi / day', numLeft: true },
  { label: 'Eggs provide Vitamin D3', body: 'To meet daily requirements, you would need 15 or more eggs every day.', target: 15, suffix: '+', unit: 'Eggs / day', numLeft: false },
];

function TheoreticalSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} style={{ padding: '40px 24px 0', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <div style={{ maxWidth: 1080, marginBottom: 40 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5 }}>
          <Pill label="Theoretical vs Practical" variant="default" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: 'clamp(2.6rem, 5vw, 2.5rem)',
            fontWeight: 900,
            color: BRAND.primary,
            margin: '18px 0 0',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}>
          Can we get everything from food?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{ fontSize: F_SIZE.lg, color: BRAND.primaryDark, margin: '14px 0 0', lineHeight: 1.65, fontWeight: 800 }}>
          In theory, yes. In reality, it is difficult to do consistently in our modern world. Let&apos;s look at the numbers:
        </motion.p>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {theoreticalItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ boxShadow: `0 6px 32px rgba(114,56,61,0.1)` }}
            style={{
              display: 'grid',
              gridTemplateColumns: item.numLeft
                ? 'clamp(110px, 18vw, 170px) 1px 1fr'
                : '1fr 1px clamp(110px, 18vw, 170px)',
              alignItems: 'stretch',
              borderRadius: 18,
              border: `1px solid ${BRAND.quaternary}`,
              overflow: 'hidden',
              background: BRAND.white,
            }}
          >
            {item.numLeft ? (
              <>
                <CounterBlock target={item.target} suffix={item.suffix} unit={item.unit} inView={inView} delay={300 + i * 120} />
                <div style={{ background: BRAND.quaternary }} />
                <TextBlock label={item.label} body={item.body} />
              </>
            ) : (
              <>
                <TextBlock label={item.label} body={item.body} />
                <div style={{ background: BRAND.quaternary }} />
                <CounterBlock target={item.target} suffix={item.suffix} unit={item.unit} inView={inView} delay={300 + i * 120} />
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Dark conclusion block — primary bg, tertiary/secondary/light text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.7 }}
        style={{
          marginTop: 12,
          background: BRAND.primary,
          borderRadius: 18,
          padding: 'clamp(20px, 3vw, 30px)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 18,
          border: `1px solid ${BRAND.primaryDark}`,
        }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          border: `1.5px solid ${BRAND.secondary}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: 2,
          fontSize: F_SIZE.md,
          fontWeight: 900,
          color: BRAND.tertiary,
        }}>!</div>
        <div>
          <div style={{
            fontSize: F_SIZE.sm, fontWeight: 800,
            color: BRAND.secondary, letterSpacing: '0.14em',
            textTransform: 'uppercase', marginBottom: 4,
          }}>
            Consistency &amp; Practicality
          </div>
          <h4 style={{
            fontSize: 'clamp(1.4rem, 3vw, 1.5rem)',
            fontWeight: 900,
            color: BRAND.white,
            margin: '0 0 6px',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            This is not practical for most people.
          </h4>
          <p style={{ fontSize: F_SIZE.sm, color: BRAND.tertiary, margin: 0, lineHeight: 1.6, fontWeight: 400 }}>
            So the problem is not lack of knowledge. The problem is{' '}
            <span style={{ fontWeight: 800, color: BRAND.light }}>consistency and practicality.</span>
          </p>
          <p style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.lg, color: BRAND.secondary, marginTop: 8, marginBottom: 0, fontStyle: 'italic' }}>
            — A Practical Choice.
          </p>
        </div>
      </motion.div>

    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 3 — LABORATORY INSIGHTS
   NutrientCard: light bg, quaternary progress track, primaryDark fill
   Header: primary heading, secondary body, primaryDark subheading
   Image panel: primaryDark overlay, white/light text
   CTA box: white bg, primaryDark border/icon, primary text, secondary body
───────────────────────────────────────────────────────────── */
function NutrientCard({ pct, label, sym, role, delay = 0, inView }: {
  pct: number; label: string; sym: string; role: string; delay?: number; inView: boolean;
}) {
  const deficiency = 100 - pct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderRadius: 14,
        background: BRAND.primary,
        border: `1px solid ${BRAND.quaternary}`,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* Header: Symbol and Label */}
      <div>
        <div style={{
          fontSize: F_SIZE.lg,
          fontWeight: 900, color: BRAND.secondary, marginBottom: 3,
        }}>{sym}</div>
        <div style={{
          fontSize: '0.875rem',
          fontWeight: 800, color: BRAND.tertiary, marginBottom: 8,
        }}>{label}</div>
      </div>

      {/* Clear Deficiency Statement */}
      <div style={{
        padding: '12px',
        background: `${BRAND.secondary}15`,
        borderRadius: 10,
        borderLeft: `3px solid ${BRAND.secondary}`,
      }}>
        <div style={{
          fontSize: F_SIZE.md,
          fontWeight: 900, color: BRAND.white, lineHeight: 1,
        }}>{deficiency}%</div>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 800, color: BRAND.white, marginTop: 2,
        }}>Deficient</div>
      </div>

      {/* Role description */}
      <div style={{ fontSize: F_SIZE.md, color: BRAND.light, lineHeight: 1.3, fontWeight: 800, fontFamily: FONTS.main }}>
        {role}
      </div>
    </motion.div>
  );
}

function LaboratorySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const NUTRIENTS = [
    { name: 'Vitamin B12', sym: 'B12', pct: 85, role: 'Nerve function & metabolic energy' },
    { name: 'Vitamin D3',  sym: 'D3',  pct: 78, role: 'Immune resilience & bone density' },
    { name: 'Magnesium',   sym: 'Mg',  pct: 92, role: 'Muscular recovery & deep sleep' },
    { name: 'Calcium',     sym: 'Ca',  pct: 64, role: 'Skeletal structural integrity' },
    { name: 'Iron',        sym: 'Fe',  pct: 72, role: 'Oxygen transport & cognitive focus' },
  ];

  return (
    <section ref={ref} style={{ padding: '28px 24px 28px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
            <Pill label="Laboratory Insights" variant="default" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontSize: F_SIZE.xl,
              fontWeight: 900,
              color: BRAND.primary,
              margin: '16px 0 8px',
              // letterSpacing: '-0.035em',
              // lineHeight: 1.1,
            }}>
            Beyond the Surface.
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              fontSize: F_SIZE.lg,
              fontWeight: 800, color: BRAND.primaryDark,
              margin: '0 0 8px', textTransform: 'uppercase',
            }}>
            Common Deficiencies in Indian Diet
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: F_SIZE.md,
              color: BRAND.secondary, margin: '0 auto', maxWidth: 1000,
              lineHeight: 1.65, fontWeight: 800,
            }}>
            When we look at blood reports, the most common deficiencies are not protein — these are micronutrients, and they play a critical role in how our body functions.
          </motion.p>
        </div>

        {/* Two-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr clamp(240px, 32%, 360px)', gap: 'clamp(16px, 3vw, 28px)', alignItems: 'start' }}>

          <div>
            {/* Gradient rule — primaryDark → tertiary */}
            <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.9 }}
              style={{ height: 2, background: `linear-gradient(90deg, ${BRAND.primaryDark}, ${BRAND.tertiary})`, borderRadius: 2, marginBottom: 20, transformOrigin: 'left' }} />

            {/* Nutrient cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {NUTRIENTS.map((n, i) => (
                <NutrientCard key={n.sym} pct={n.pct}
                  label={n.name} sym={n.sym} role={n.role}
                  delay={i * 0.06} inView={inView} />
              ))}
            </div>

            {/* CTA box — white bg, primaryDark border */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{
                marginTop: 20,
                padding: '18px',
                border: `2px solid ${BRAND.primaryDark}`,
                borderRadius: 14,
                background: BRAND.white,
                display: 'flex', flexDirection: 'column', gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FlaskConical size={16} color={BRAND.primaryDark} />
                <div style={{
                  fontSize: F_SIZE.md,
                  fontWeight: 900, color: BRAND.primaryDark,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  The Indian Nutrient Gap
                </div>
              </div>
              <p style={{
                fontSize: F_SIZE.md,
                color: BRAND.primary, margin: 0, lineHeight: 1.5, fontWeight: 800,
              }}>
                These deficiencies in Indian diets are systemic. PlainFuel bridges this gap with a scientifically-formulated solution.
              </p>
            </motion.div>
          </div>

          {/* Image panel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '3/4' }}
          >
            <Image src="/images/why/bg-blood.png" alt="Lab" fill style={{ objectFit: 'cover' }} priority />
            {/* Gradient overlay — uses primary + primaryDark */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(to top, ${BRAND.primary}CC 0%, ${BRAND.primaryDark}60 45%, transparent 75%)`,
              zIndex: 1,
            }} />

            {/* Badge top-left */}
            <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 3 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 20,
                  background: BRAND.primaryDark,
                  border: `1px solid ${BRAND.secondary}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span style={{
                  fontSize: F_SIZE.sm, fontWeight: 800,
                  color: BRAND.white, letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  What&rsquo;s Missing
                </span>
              </motion.div>
            </div>

            {/* Play button */}
            <div style={{ position: 'absolute', top: '44%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3 }}>
              <motion.div
                whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: BRAND.primaryDark,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: `0 8px 32px rgba(0,0,0,0.2)`,
                }}>
                {[1, 2].map(r => (
                  <motion.div key={r} animate={{ scale: [1, 1.7], opacity: [0.3, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: r * 0.9, ease: 'easeOut' }}
                    style={{ position: 'absolute', width: 52, height: 52, borderRadius: '50%', border: `1.5px solid ${BRAND.tertiary}` }} />
                ))}
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none" style={{ marginLeft: 3 }}>
                  <path d="M10 6L26 16L10 26V6Z" fill="white" />
                </svg>
              </motion.div>
            </div>

            {/* Caption bottom */}
            <div style={{ position: 'absolute', bottom: 20, left: 16, right: 16, zIndex: 3 }}>
              <p style={{
                fontFamily: FONTS.accent, fontSize: F_SIZE.md,
                color: BRAND.light, margin: 0, lineHeight: 1.4,
                fontStyle: 'italic', textAlign: 'center',
              }}>
                Most Indian diets are deficient in critical micronutrients needed for optimal health and vitality.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────── */
export default function Chapter2() {
  return (
    <div style={{ background: BRAND.white, overflow: 'hidden', position: 'relative' }}>
      

      {/* Ambient background blobs */}
      <div style={{
        position: 'absolute', top: '28%', right: '-6%',
        width: '40vw', height: '40vw',
        background: `radial-gradient(circle, ${BRAND.light} 0%, transparent 70%)`,
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: '12%', left: '-5%',
        width: '32vw', height: '32vw',
        background: `radial-gradient(circle, ${BRAND.tertiary}40 0%, transparent 70%)`,
        pointerEvents: 'none', zIndex: 0,
      }} />

      <ChapterStamp number="2" />
      <DietaryAnalysisSection />
      <TheoreticalSection />
      <LaboratorySection />
    </div>
  );
}