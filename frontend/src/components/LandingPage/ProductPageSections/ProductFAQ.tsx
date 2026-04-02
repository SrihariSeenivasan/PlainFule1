'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import { F_SIZE, BRAND } from '@/lib/typography';

/* ── Design Tokens ── */
const C = {
  forest: BRAND.primary,
  deep: BRAND.primary,
  mid: BRAND.primary,
  leaf: BRAND.primaryDark,
  ink: BRAND.primary,
  white: '#ffffff',
  offwhite: BRAND.light,
  silver: '#64748b',
  gold: BRAND.primaryDark,
  glass: 'rgba(255, 255, 255, 0.92)',
};

const FONTS = {
  main: "'Montserrat', sans-serif",
  accent: "'Caveat', cursive",
};

interface FAQ {
  id: number;
  question: string;
  answer: string;
  type: string;
}

/* ── Components ── */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: FONTS.main,
      fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
      color: BRAND.primary, fontWeight: 800,
      border: `1px solid ${BRAND.primary}30`,
      borderRadius: 2, padding: '4px 12px',
      backgroundColor: 'rgba(10, 61, 31, 0.04)',
    }}>{children}</span>
  );
}

const FaqItem = ({ q, a, index }: { q: string; a: string; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      style={{
        background: C.white,
        borderRadius: 8,
        border: `1px solid ${open ? BRAND.primary : 'rgba(0,0,0,0.06)'}`,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: open ? '0 10px 30px -10px rgba(0,0,0,0.05)' : 'none',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: open ? `${BRAND.primary}04` : 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 20
        }}
      >
        <span style={{ 
          fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 800, color: open ? BRAND.primary : C.ink, 
          letterSpacing: '-0.01em', lineHeight: 1.4 
        }}>
          {q}
        </span>
        <motion.div
           animate={{ rotate: open ? 180 : 0 }}
           style={{ color: open ? BRAND.primary : C.silver }}
        >
           <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 32px 32px', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
              <p style={{
                fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 500, color: '#3c4a3e', 
                lineHeight: 1.8, margin: '24px 0 0', position: 'relative', paddingLeft: 20
              }}>
                <span style={{ position: 'absolute', left: 0, top: 0, color: C.gold, fontWeight: 900 }}>—</span>
                {a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DEFAULT_FAQS: FAQ[] = [
  { id: 1, question: 'What is the recommended dosage for optimal performance?', answer: 'One sachet (approx. 12g) integrated into your morning hydration routine. Formulated for maximum cellular absorption when taken on an empty stomach.', type: 'PRODUCT' },
  { id: 2, question: 'Is the product compatible with other bio-supplements?', answer: 'Yes. PlainFuel is designed to be a foundational product. It has been tested for safety alongside common micronutrients. Consult your medical advisor if using prescription supplements.', type: 'PRODUCT' },
  { id: 3, question: 'What is the expected synchronization period?', answer: 'Most users report baseline metabolic stabilization within 48-72 hours. Peak efficacy is typically achieved after 14 days of consistent adherence.', type: 'PRODUCT' },
  { id: 4, question: 'Is the formula compatible with plant-based lifestyles?', answer: 'Strictly. All ingredients are synthesized from high-purity botanical sources. 100% Vegan, Non-GMO, and Lab-Verified.', type: 'PRODUCT' },
];

export default function ProductFAQ({ productId }: { productId?: number } = {}) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFaqs = useCallback(async () => {
      try {
        setLoading(true);
        const apiUrl = getApiUrl();
        const params = new URLSearchParams();
        params.append('type', 'PRODUCT');
        if (productId) params.append('productId', productId.toString());

        const response = await fetch(`${apiUrl}/faqs?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setFaqs(data.data?.length ? data.data : DEFAULT_FAQS);
        } else {
          setFaqs(DEFAULT_FAQS);
        }
      } catch (err) {
        console.error('Failed to fetch FAQs:', err);
        setFaqs(DEFAULT_FAQS);
      } finally {
        setLoading(false);
      }
  }, [productId]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  return (
    <div style={{ fontFamily: FONTS.main }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
      `}</style>

      <div style={{ position: 'relative' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
           <Chip>Knowledge Base — Product Q&A</Chip>
           <h3 style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: C.ink, margin: '20px 0 0', letterSpacing: '-0.02em' }}>Common Inquiries</h3>
           <div style={{ height: 1, width: 60, background: C.gold, marginTop: 16 }} />
        </div>

        {/* FAQ List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <p style={{ color: C.silver, fontWeight: 700, textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.15em' }}>Retrieving Knowledge Base...</p>
            </div>
          ) : (
            faqs.map((faq, i) => (
              <FaqItem key={faq.id} q={faq.question} a={faq.answer} index={i} />
            ))
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            marginTop: 48, padding: '32px 40px', background: BRAND.light, borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap'
          }}
        >
          <div>
            <h4 style={{ fontSize: F_SIZE.md, fontWeight: 900, margin: '0 0 4px', color: C.ink }}>Expert Support Available</h4>
            <p style={{ fontSize: F_SIZE.sm, color: C.silver, margin: 0, fontWeight: 600 }}>Our specialist team is available for deep-technical inquiries.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: BRAND.primary, color: C.white }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/contact'}
            style={{
              padding: '12px 28px', background: 'transparent', color: BRAND.primary,
              border: `2px solid ${BRAND.primary}`, borderRadius: 6, fontWeight: 900, 
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', transition: '0.2s'
            }}
          >
            Contact Specialist
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}



