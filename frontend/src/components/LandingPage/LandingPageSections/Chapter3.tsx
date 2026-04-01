'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Sparkles, Shield, Target, ShieldCheck, Check, FlaskConical } from 'lucide-react';
import { F_SIZE, FONTS, BRAND } from '@/lib/typography';

/* ─────────────────────────────────────────────────────────────
   SHARED: CHAPTER STAMP
───────────────────────────────────────────────────────────── */
function ChapterStamp({ number }: { number: string }) {
  return (
    <section style={{ padding: '52px 24px 0', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ height: 1, width: 80, background: BRAND.primary, opacity: 0.18, transformOrigin: 'right' }} />
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 20px', borderRadius: 100, background: BRAND.light, border: `1px solid ${BRAND.tertiary}` }}>
          <Sparkles size={13} color={BRAND.accent} />
          <span style={{ fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.primary, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: FONTS.main }}>Chapter {number}</span>
        </motion.div>
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ height: 1, width: 80, background: BRAND.primary, opacity: 0.18, transformOrigin: 'left' }} />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 1 — DIAGONAL CONTRAST PANELS (The Challenge)
   Style: Sliced diagonal split, problem left / solution right,
          with animated counter badges and sliding list items
───────────────────────────────────────────────────────────── */
function ChallengeSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const problems = ['Multiple separate supplements', 'Confusing timings', 'Difficult to maintain consistency'];
  const solutions = ['NO EXTRA PLANNING', 'NO EXTRA TRACKING', 'JUST A SIMPLE DAILY HABIT'];

  return (
    <section ref={ref} style={{ padding: '72px 24px 0', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

      {/* Ghost watermark */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: FONTS.main, fontSize: 'clamp(100px, 14vw, 180px)',
        fontWeight: 900, color: `${BRAND.primary}03`,
        letterSpacing: '-0.06em', whiteSpace: 'nowrap',
        userSelect: 'none', pointerEvents: 'none',
      }}>CHALLENGE</div>

      {/* Eyebrow row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
        <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7 }}
          style={{ height: 2, width: 40, background: BRAND.accent, transformOrigin: 'left' }} />
        <motion.span initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.accent, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          The Challenge
        </motion.span>
      </div>

      {/* Big headline */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: FONTS.main, fontSize: 'clamp(2rem, 4vw, 3.2rem)',
          fontWeight: 900, color: BRAND.primary, margin: '0 0 56px',
          letterSpacing: '-0.035em', lineHeight: 1.08, maxWidth: 700,
        }}>
        What do we do today?
      </motion.h2>

      {/* Asymmetric split: problem (narrow) + solution (wide) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 2, borderRadius: 40, overflow: 'hidden', boxShadow: '0 40px 100px rgba(50,45,41,0.12)' }}>

        {/* LEFT — Problem column, dark warm */}
        <motion.div
          initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: BRAND.primary, padding: 'clamp(32px, 4vw, 52px)', position: 'relative', overflow: 'hidden' }}
        >
          {/* Decorative circle */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', border: `1px solid rgba(255,255,255,0.06)`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', border: `1px solid rgba(255,255,255,0.05)`, pointerEvents: 'none' }} />

          <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.white, margin: '0 0 32px', lineHeight: 1.25 }}>
            But this creates another problem:
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
            {problems.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', border: `1.5px solid rgba(255,255,255,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <span style={{ fontFamily: FONTS.main, fontSize: '0.7rem', fontWeight: 900, color: `${BRAND.white}80` }}>{i + 1}</span>
                </div>
                <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 600, color: `${BRAND.white}CC`, lineHeight: 1.5 }}>{item}</span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.7 }}
            style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: `${BRAND.white}60`, lineHeight: 1.7, margin: 0 }}>
            Maintaining a complex routine is a logistical challenge. Most people start with good intent but stop within days. The real issue isnt effort — its that the current system is too complex for a busy life.
          </motion.p>
        </motion.div>

        {/* RIGHT — Solution column, accent */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: BRAND.accent, padding: 'clamp(32px, 4vw, 52px)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
          {/* Rotating glow */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', bottom: -100, right: -100, width: 320, height: 320, borderRadius: '50%', border: `1px dashed rgba(255,255,255,0.1)`, pointerEvents: 'none' }} />

          <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.white, margin: '0 0 20px', lineHeight: 1.25 }}>
            What PlainFuel does?
          </h3>
          <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: `${BRAND.white}E0`, lineHeight: 1.75, margin: '0 0 36px', fontWeight: 400 }}>
            PlainFuel simplifies this entire process. Instead of managing multiple supplements, you take one sachet daily. It replaces your regular protein sachet while providing essential vitamins, minerals, and digestive support.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {solutions.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Check size={15} color={BRAND.white} strokeWidth={3} />
                <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.white, letterSpacing: '0.08em' }}>{item}</span>
              </motion.div>
            ))}
          </div>

          {/* Signature quote */}
          <div style={{ marginTop: 'auto', paddingTop: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontFamily: FONTS.accent, fontSize: '1.6rem', color: BRAND.white, fontWeight: 700, whiteSpace: 'nowrap' }}>One Sachet Daily.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 2 — SCROLLING MARQUEE + TABBED ACCORDION (The Logic)
   Style: Horizontal info ticker + expandable accordion rows
          instead of stacked cards
───────────────────────────────────────────────────────────── */
const FIVE_IN_ONE_DATA = [
  {
    icon: <Shield size={20} />,
    headline: 'What does PlainFuel contain?',
    contentBefore: 'Each serving of PlainFuel is designed to provide balanced daily support:',
    list: [
      { title: 'Protein', desc: '25g of whey protein with a complete amino acid profile' },
      { title: 'Fiber', desc: '6g to support digestion' },
      { title: 'Vitamins', desc: 'B-complex, Vitamin D3, and Vitamin C (covering a significant portion of daily needs)' },
      { title: 'Minerals', desc: 'Calcium, Magnesium, Zinc, and Selenium' },
      { title: 'Digestive Enzymes', desc: 'To improve absorption and reduce digestive issues' },
    ],
    contentAfter: 'The goal is not to overload the body, but to provide consistent and balanced nutrition.',
    note: 'Balanced & Consistent.',
  },
  {
    icon: <Target size={20} />,
    headline: 'How does this help?',
    contentBefore: 'PlainFuel supports multiple essential functions in the body:',
    list: [
      { title: 'Energy and focus', desc: 'B vitamins and magnesium help in how your body produces and uses energy' },
      { title: 'Recovery and sleep', desc: 'Protein supports muscle recovery, while magnesium helps with relaxation' },
      { title: 'Bone and structural health', desc: 'Calcium and Vitamin D3 support bone strength' },
      { title: 'Overall daily functioning', desc: 'Zinc and other micronutrients support normal body processes' },
    ],
    contentAfterPoints: ['It is not about instant results.', 'It is about supporting your body every day.'],
    note: 'Supporting Body Processes.',
  },
  {
    icon: <Sparkles size={20} />,
    headline: 'How does PlainFuel fit into daily life?',
    content: 'PlainFuel is designed to be easy to use.',
    list: [
      { title: 'Simple Habit', desc: 'Take one sachet daily' },
      { title: 'Replacement', desc: 'Replace your regular protein' },
      { title: 'Minimalist', desc: 'No need for multiple supplements' },
      { title: 'Versatile', desc: 'Works with any diet' },
    ],
    note: 'The focus is consistency.',
  },
];

function AccordionRow({ data, index, isOpen, onToggle }: {
  data: typeof FIVE_IN_ONE_DATA[number]; index: number; isOpen: boolean; onToggle: () => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ borderBottom: `1px solid ${BRAND.tertiary}`, overflow: 'hidden' }}
    >
      {/* Header row — always visible */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '28px 0', display: 'flex', alignItems: 'center', gap: 24,
          textAlign: 'left',
        }}
      >
        {/* Index number */}
        <span style={{ fontFamily: FONTS.main, fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: isOpen ? BRAND.accent : `${BRAND.primary}20`, lineHeight: 1, minWidth: 56, transition: 'color 0.4s', letterSpacing: '-0.04em' }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Icon chip */}
        <div style={{ width: 44, height: 44, borderRadius: 12, background: isOpen ? BRAND.accent : BRAND.light, color: isOpen ? BRAND.white : BRAND.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.4s' }}>
          {data.icon}
        </div>

        {/* Title */}
        <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.primary, flex: 1, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          {data.headline}
        </span>

        {/* Toggle indicator */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.35 }}
          style={{ width: 32, height: 32, borderRadius: '50%', border: `1.5px solid ${isOpen ? BRAND.accent : BRAND.tertiary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'border-color 0.3s' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke={isOpen ? BRAND.accent : BRAND.secondary} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
      </button>

      {/* Expandable content */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <div style={{ paddingBottom: 36, paddingLeft: 80 }}>
          {data.contentBefore && (
            <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.secondary, margin: '0 0 24px', lineHeight: 1.7, fontWeight: 400 }}>
              {data.contentBefore}
            </p>
          )}
          {data.content && (
            <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.secondary, margin: '0 0 24px', lineHeight: 1.7, fontWeight: 400 }}>
              {data.content}
            </p>
          )}

          {/* List in 2-col grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 32px', marginBottom: 24 }}>
            {data.list.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND.accent, flexShrink: 0, marginTop: 8 }} />
                <div>
                  <div style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{item.title}</div>
                  <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.secondary, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {data.contentAfter && (
            <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.primary, margin: '0 0 0', fontWeight: 600 }}>{data.contentAfter}</p>
          )}
          {data.contentAfterPoints && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data.contentAfterPoints.map((p, i) => (
                <p key={i} style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.primary, margin: 0, fontWeight: 600 }}>{p}</p>
              ))}
            </div>
          )}

          {/* Note */}
          <p style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.lg, color: BRAND.secondary, margin: '20px 0 0', fontStyle: 'italic' }}>{data.note}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LogicSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // Marquee strip above
  const marqueeItems = ['Precision Dosage', 'Zero Filler Ethics', 'Invisible Utility', 'Bio-Identical Forms', 'Clean Label DNA', 'One Sachet Daily'];

  return (
    <section ref={ref} style={{ padding: '80px 0 0', position: 'relative', zIndex: 1 }}>
      {/* Scrolling ticker */}
      <div style={{ overflow: 'hidden', borderTop: `1px solid ${BRAND.tertiary}`, borderBottom: `1px solid ${BRAND.tertiary}`, padding: '12px 0', marginBottom: 72, background: BRAND.light }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap', width: 'max-content' }}
        >
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.primary, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0 28px', opacity: 0.5 }}>
              {item} <span style={{ marginLeft: 28, opacity: 0.4 }}>·</span>
            </span>
          ))}
        </motion.div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Section header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px, 6vw, 80px)', alignItems: 'end', marginBottom: 64 }}>
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 36, height: 2, background: BRAND.accent }} />
              <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.accent, textTransform: 'uppercase', letterSpacing: '0.2em' }}>The Logic</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: FONTS.main, fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: BRAND.primary, margin: 0, letterSpacing: '-0.035em', lineHeight: 1.08 }}>
              PlainFuel —<br />A Simple Approach.
            </motion.h2>
          </div>
          <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.7, delay: 0.25 }}
            style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.secondary, lineHeight: 1.7, margin: 0, fontWeight: 400 }}>
            Three pillars that define how PlainFuel works — what it contains, how it helps you, and how it fits seamlessly into your daily life.
          </motion.p>
        </div>

        {/* Accordion rows */}
        <div style={{ borderTop: `1px solid ${BRAND.tertiary}` }}>
          {FIVE_IN_ONE_DATA.map((data, i) => (
            <AccordionRow key={i} data={data} index={i} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SECTION 3 — BENTO GRID (The Simple Process)
   Style: Magazine bento: large hero tile + small data tiles,
          feature pills, ingredient reveal rows, floating badges
───────────────────────────────────────────────────────────── */
const allCards = [
  { icon: <Target size={18} />, stat: '21', statSuffix: ' ingredients', statLabel: 'calibrated for Indian diet', title: 'Precision Dosage', content: 'Our formula targets specific dietary gaps in typical Indian meals — not generic Western bodies.', note: 'no guesswork!' },
  { icon: <Sparkles size={18} />, stat: '100%', statSuffix: '', statLabel: 'active ingredients', title: 'Zero Filler Ethics', content: 'Most supplements are 80% maltodextrin. We use 100% active ingredients. Every milligram is functional.', note: 'zero junk!' },
  { icon: <Shield size={18} />, stat: '0 mg', statSuffix: '', statLabel: 'taste or texture added', title: 'Invisible Utility', content: 'Tasteless and textureless. Mix into anything without changing the flavour of your favourite foods.', note: 'mix anywhere!' },
  { icon: <Shield size={18} />, stat: '≥65%', statSuffix: '', statLabel: 'RDA covered per serving', title: 'Bio-Identical Forms', content: 'Methylcobalamin B12, Calcium Citrate, Zinc Gluconate — forms your body recognises and absorbs fast.', note: 'absorbed fast!' },
  { icon: <Shield size={18} />, stat: '0%', statSuffix: '', statLabel: 'amino acids', title: 'Clean Label DNA', content: 'No amino spiking — nothing to inflate our protein numbers or skew your natural macros.', note: 'pure science!' },
];

const ingredients = [
  { name: 'Vitamin B12 (Methylcobalamin)', qty: '1.7 mcg', rda: '77% RDA', highlight: true },
  { name: 'Vitamin C (Ascorbic Acid)', qty: '50 mg', rda: '62% RDA', highlight: true },
  { name: 'Calcium (Citrate form)', qty: '300 mg', rda: '30% RDA', highlight: true },
  { name: 'Zinc (Gluconate form)', qty: '6.8 mg', rda: '40% RDA', highlight: true },
  { name: 'Magnesium (Citrate)', qty: '132 mg', rda: '30% RDA', highlight: false },
  { name: 'Digestive Enzymes blend', qty: '100 mg', rda: '—', highlight: false },
];

const supplements = [
  { label: 'Whey Protein', complexity: 'Essential' },
  { label: 'Omega-3', complexity: 'Additional' },
  { label: 'Magnesium', complexity: 'Additional' },
  { label: 'Creatine', complexity: 'Optional' },
];

function SimpleProcessSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} style={{ padding: '80px 24px 80px', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 18px', borderRadius: 100, background: BRAND.light, border: `1px solid ${BRAND.tertiary}`, marginBottom: 20 }}>
          <ShieldCheck size={13} color={BRAND.accent} />
          <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.primary, letterSpacing: '0.15em', textTransform: 'uppercase' }}>The Simple Process</span>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONTS.main, fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: BRAND.primary, margin: '0 0 16px', letterSpacing: '-0.035em', lineHeight: 1.08 }}>
          What do we do <span style={{ color: BRAND.accent }}>today?</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.2 }}
          style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.secondary, maxWidth: 580, margin: '0 auto', lineHeight: 1.65 }}>
          To fill nutritional gaps, most people turn to multiple supplements. But this creates a new problem: its hard to track and maintain in a busy life.
        </motion.p>
      </div>

      {/* ── BENTO GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'auto', gap: 16 }}>

        {/* Tile 1 — Hero dark tile: Complexity Barrier (spans 5 cols, 2 rows) */}
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ gridColumn: '1 / 6', gridRow: '1 / 2', background: BRAND.primary, borderRadius: 28, padding: '36px 32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: -40, right: -40, width: 180, height: 180, borderRadius: '50%', border: `1px solid rgba(255,255,255,0.06)`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -10, right: -10, width: 100, height: 100, borderRadius: '50%', border: `1px solid rgba(255,255,255,0.04)`, pointerEvents: 'none' }} />
          <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: `${BRAND.white}50`, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Market Analysis</span>
          <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.white, margin: '16px 0 20px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>The Complexity Barrier.</h3>
          <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: `${BRAND.white}70`, lineHeight: 1.65, margin: '0 0 28px' }}>
            The issue is not effort; the issue is that the system for meeting daily needs is too complex.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {supplements.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 700, color: `${BRAND.white}CC` }}>{s.label}</span>
                <span style={{ fontFamily: FONTS.main, fontSize: '0.75rem', fontWeight: 800, color: `${BRAND.white}50`, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.complexity}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tile 2 — Stat tile: "21 ingredients" (spans 3 cols) */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ gridColumn: '6 / 9', background: BRAND.accent, borderRadius: 28, padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
          <div>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: BRAND.white, marginBottom: 20 }}>
              <Target size={18} />
            </div>
            <span style={{ fontFamily: FONTS.main, fontSize: 'clamp(2.8rem, 5vw, 4rem)', fontWeight: 900, color: BRAND.white, lineHeight: 0.9, letterSpacing: '-0.04em', display: 'block' }}>21</span>
            <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: `${BRAND.white}80`, display: 'block', marginTop: 8 }}>ingredients</span>
          </div>
          <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: `${BRAND.white}CC`, margin: 0, lineHeight: 1.5 }}>Precision Dosage — calibrated for Indian diet</p>
        </motion.div>

        {/* Tile 3 — "100%" stat tile (spans 4 cols) */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{ gridColumn: '9 / 13', background: BRAND.light, borderRadius: 28, padding: '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: `1px solid ${BRAND.tertiary}` }}>
          <div>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${BRAND.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: BRAND.accent, marginBottom: 20 }}>
              <Sparkles size={18} />
            </div>
            <span style={{ fontFamily: FONTS.main, fontSize: 'clamp(2.8rem, 5vw, 4rem)', fontWeight: 900, color: BRAND.accent, lineHeight: 0.9, letterSpacing: '-0.04em', display: 'block' }}>100%</span>
            <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.secondary, display: 'block', marginTop: 8 }}>active ingredients</span>
          </div>
          <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.secondary, margin: 0, lineHeight: 1.5 }}>Zero Filler Ethics — every milligram is functional</p>
        </motion.div>

        {/* Tile 4 — Ingredients table (spans 7 cols, row 2) */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ gridColumn: '1 / 8', background: BRAND.white, borderRadius: 28, padding: '28px 28px', border: `1px solid ${BRAND.quaternary}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <FlaskConical size={18} color={BRAND.accent} />
            <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 900, color: BRAND.primary, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Ingredients</span>
          </div>
          {ingredients.map((ing, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.06 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                padding: '11px 14px', borderRadius: 12, marginBottom: 7,
                border: ing.highlight ? `1px solid ${BRAND.accent}25` : `1px solid ${BRAND.border}`,
                background: ing.highlight ? `${BRAND.accent}05` : BRAND.white,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {ing.highlight
                  ? <Check size={13} color={BRAND.accent} strokeWidth={3} />
                  : <div style={{ width: 5, height: 5, borderRadius: '50%', background: BRAND.secondary, opacity: 0.3 }} />}
                <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 600, color: BRAND.text }}>{ing.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.secondary }}>{ing.qty}</span>
                <span style={{ fontFamily: FONTS.main, fontSize: '0.78rem', fontWeight: 900, color: ing.highlight ? BRAND.accent : BRAND.secondary, background: ing.highlight ? `${BRAND.accent}11` : BRAND.quaternary, padding: '3px 10px', borderRadius: 100 }}>{ing.rda}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tile 5 — "0 mg" + "≥65%" stacked (spans 5 cols, row 2) */}
        <div style={{ gridColumn: '8 / 13', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            style={{ flex: 1, background: BRAND.primary, borderRadius: 28, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', border: `1px dashed rgba(255,255,255,0.08)`, pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: BRAND.white }}>
                <Shield size={16} />
              </div>
              <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: `${BRAND.white}60`, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Invisible Utility</span>
            </div>
            <div>
              <span style={{ fontFamily: FONTS.main, fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900, color: BRAND.white, letterSpacing: '-0.04em', display: 'block', lineHeight: 1 }}>0 mg</span>
              <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: `${BRAND.white}60` }}>taste or texture added</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.45 }}
            style={{ flex: 1, background: BRAND.light, borderRadius: 28, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: `1px solid ${BRAND.tertiary}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `${BRAND.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: BRAND.accent }}>
                <Shield size={16} />
              </div>
              <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.secondary, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Bio-Identical</span>
            </div>
            <div>
              <span style={{ fontFamily: FONTS.main, fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900, color: BRAND.accent, letterSpacing: '-0.04em', display: 'block', lineHeight: 1 }}>≥65%</span>
              <span style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, color: BRAND.secondary }}>RDA covered per serving</span>
            </div>
          </motion.div>
        </div>

        {/* Tile 6 — Full-width conclusion strip */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ gridColumn: '1 / 13', background: BRAND.accent, borderRadius: 28, padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
          {/* Animated rings */}
          {[1, 2].map(r => (
            <motion.div key={r} animate={{ scale: [1, 1.4], opacity: [0.15, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: r * 1.2, ease: 'easeOut' }}
              style={{ position: 'absolute', right: 80, top: '50%', transform: 'translateY(-50%)', width: 100, height: 100, borderRadius: '50%', border: `2px solid rgba(255,255,255,0.4)`, pointerEvents: 'none' }} />
          ))}
          <div>
            <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.white, margin: '0 0 10px', letterSpacing: '-0.02em' }}>PlainFuel simplifies the process.</h3>
            <p style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.lg, color: `${BRAND.white}CC`, margin: 0, fontStyle: 'italic' }}>One simple habit. Done daily. Making nutrition easier.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['Simple Habit', 'Replacement', 'Minimalist', 'Versatile'].map((tag, i) => (
              <span key={i} style={{ fontFamily: FONTS.main, fontSize: F_SIZE.sm, fontWeight: 800, color: BRAND.white, padding: '8px 16px', borderRadius: 100, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>{tag}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────── */
export default function Chapter3() {
  return (
    <div style={{ background: BRAND.white, overflow: 'hidden', position: 'relative' }}>
      {/* Ambient blobs */}
      <div style={{ position: 'absolute', top: '20%', right: '-8%', width: '45vw', height: '45vw', background: `radial-gradient(circle, ${BRAND.accent}05 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '35vw', height: '35vw', background: `radial-gradient(circle, ${BRAND.primary}05 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <ChapterStamp number="3" />
      <ChallengeSection />
      <LogicSection />
      <SimpleProcessSection />

      <style>{`
        @media (max-width: 900px) {
          /* bento collapses to single column */
          [style*="gridColumn: '1 / 6'"] { grid-column: 1 / -1 !important; }
          [style*="gridColumn: '6 / 9'"] { grid-column: 1 / 7 !important; }
          [style*="gridColumn: '9 / 13'"] { grid-column: 7 / 13 !important; }
          [style*="gridColumn: '1 / 8'"] { grid-column: 1 / -1 !important; }
          [style*="gridColumn: '8 / 13'"] { grid-column: 1 / -1 !important; }
          [style*="gridColumn: '1 / 13'"] { grid-column: 1 / -1 !important; }
        }
        @media (max-width: 640px) {
          [style*="gridTemplateColumns: '1fr 1.1fr'"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}