'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Send } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BRAND, F_SIZE, FONTS } from '@/lib/typography';

const ScribbleUnderline = ({ color = BRAND.primaryDark, delay = 0 }: { color?: string; delay?: number }) => (
  <motion.svg
    viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden
    style={{ position: 'absolute', bottom: -4, left: 0, width: '100%', height: 10, pointerEvents: 'none' }}
  >
    <motion.path
      d="M4,10 Q50,2 100,8 Q150,14 196,4"
      fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
    />
  </motion.svg>
);

const FaqCard = ({ q, a, index }: { q: string; a: string; index: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => setOpen(v => !v)}
      style={{
        position: 'relative',
        background: open ? BRAND.white : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(32px)',
        borderRadius: 24,
        padding: 'clamp(20px, 5vw, 32px)',
        cursor: 'pointer',
        border: `1px solid ${open ? BRAND.primaryDark + '30' : BRAND.light + '80'}`,
        boxShadow: open
          ? `0 30px 60px rgba(114, 56, 61, 0.08), 0 0 0 1px ${BRAND.white}`
          : `0 4px 12px rgba(50, 45, 41, 0.04)`,
        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        overflow: 'hidden',
      }}
      whileHover={{
        y: -4,
        background: 'rgba(255, 255, 255, 0.85)',
        border: `1px solid ${BRAND.primaryDark}20`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
        <h4 style={{
          fontFamily: FONTS.main,
          fontSize: 17, fontWeight: 800, color: BRAND.secondary, margin: 0, lineHeight: 1.4, flex: 1,
          letterSpacing: '-0.01em',
        }}>{q}</h4>
        <motion.div
          animate={{ rotate: open ? '180deg' : '0deg', scale: open ? 1.1 : 1 }}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: open ? BRAND.primaryDark : BRAND.secondary,
            background: open ? BRAND.primaryDark + '12' : `${BRAND.light}40`,
            transition: 'all 0.4s'
          }}
        >
          <ChevronDown size={20} strokeWidth={2.5} />
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 20 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ paddingTop: 20, borderTop: `1px solid ${BRAND.light}40` }}>
              <p style={{ fontFamily: FONTS.main, fontSize: 15.5, fontWeight: 500, color: BRAND.secondary, lineHeight: 1.7, margin: 0 }}>{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface FAQSectionProps {
  title: string;
  subtitle: string;
  faqs: Array<{ q: string; a: string }>;
}

export default function FAQSection({ title, subtitle, faqs }: FAQSectionProps) {
  const router = useRouter();

  return (
    <section style={{ background: BRAND.white, padding: 'clamp(60px, 12vw, 120px) 0', position: 'relative' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 'clamp(30px, 6vw, 60px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: BRAND.primary, padding: '8px 20px', borderRadius: 100, marginBottom: 20, boxShadow: `0 10px 20px rgba(50,45,41,0.12)` }}>
            <Sparkles size={14} color={BRAND.light} />
            <span style={{ fontFamily: FONTS.main, fontSize: 10, fontWeight: 800, color: BRAND.white, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Frequently Asked</span>
          </div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <h3 className="faq-header" style={{ fontFamily: FONTS.main, fontSize: 'clamp(2.8rem, 6vw, 3.8rem)', fontWeight: 900, color: BRAND.primary, margin: 0, letterSpacing: '-0.04em', lineHeight: 1 }}>{title}</h3>
            <ScribbleUnderline delay={0.4} color={BRAND.primaryDark} />
          </div>
          <p className="faq-subtext" style={{ fontFamily: FONTS.accent, fontSize: F_SIZE.xl, color: BRAND.primaryDark, marginTop: 16, opacity: 0.9 }}>{subtitle}</p>
        </motion.div>

        <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 85vw, 400px), 1fr))', gap: 'clamp(12px, 3vw, 20px)' }}>
          {faqs.map((faq, i) => (
            <FaqCard key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} style={{ textAlign: 'center', marginTop: 'clamp(40px, 8vw, 80px)' }}>
          <p style={{ fontFamily: FONTS.main, fontSize: 14, fontWeight: 700, color: BRAND.secondary, marginBottom: 24 }}>Still have something on your mind?</p>
          <motion.button
            onClick={() => router.push('/contact')}
            whileHover={{ scale: 1.05, background: BRAND.primaryDark, boxShadow: `0 20px 40px rgba(114,56,61,0.2)` }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '18px 40px', background: BRAND.primary, color: BRAND.white, borderRadius: 100, border: 'none', fontFamily: FONTS.main, fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', boxShadow: `0 20px 40px rgba(50,45,41,0.15)`, transition: 'all 0.3s' }}
          >
            Contact our support team <Send size={16} />
          </motion.button>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .faq-section { padding: 80px 0 !important; }
          .faq-header { font-size: 3rem !important; }
          .faq-subtext { font-size: 20px !important; }
          .faq-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
