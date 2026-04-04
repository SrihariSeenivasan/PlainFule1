'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { getApiUrl, FAQ } from '@/lib/api';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';

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
        background: BRAND.white,
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
          width: '100%', padding: 'clamp(16px, 3vw, 24px) clamp(16px, 4vw, 32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: open ? `${BRAND.primary}04` : 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 20
        }}
      >
        <span style={{ 
          fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 800, color: open ? BRAND.primary : BRAND.primaryDark, 
          letterSpacing: '-0.01em', lineHeight: 1.4 
        }}>
          {q}
        </span>
        <motion.div
           animate={{ rotate: open ? 180 : 0 }}
           style={{ color: open ? BRAND.primary : BRAND.light }}
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
            <div style={{ padding: '0 clamp(16px, 4vw, 32px) clamp(16px, 3vw, 32px)', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
              <p style={{
                fontFamily: FONTS.main, fontSize: F_SIZE.md, fontWeight: 500, color: '#3c4a3e', 
                lineHeight: 1.8, margin: '24px 0 0', position: 'relative', paddingLeft: 20
              }}>
                <span style={{ position: 'absolute', left: 0, top: 0, color: BRAND.primaryDark, fontWeight: 900 }}>—</span>
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
  { id: 1, question: 'What is the recommended dosage for optimal performance?', answer: 'One sachet (approx. 12g) integrated into your morning hydration routine. Formulated for maximum cellular absorption when taken on an empty stomach.', category: 'PRODUCT', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, question: 'Is the product compatible with other bio-supplements?', answer: 'Yes. PlainFuel is designed to be a foundational product. It has been tested for safety alongside common micronutrients. Consult your medical advisor if using prescription supplements.', category: 'PRODUCT', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 3, question: 'What is the expected synchronization period?', answer: 'Most users report baseline metabolic stabilization within 48-72 hours. Peak efficacy is typically achieved after 14 days of consistent adherence.', category: 'PRODUCT', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 4, question: 'Is the formula compatible with plant-based lifestyles?', answer: 'Strictly. All ingredients are synthesized from high-purity botanical sources. 100% Vegan, Non-GMO, and Lab-Verified.', category: 'PRODUCT', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
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
        <div style={{ marginBottom: 'clamp(24px, 5vw, 48px)' }}>
           <Chip>Knowledge Base — Product Q&A</Chip>
           <h3 style={{ fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.primaryDark, margin: '20px 0 0', letterSpacing: '-0.02em' }}>Common Inquiries</h3>
           <div style={{ height: 1, width: 60, background: BRAND.primaryDark, marginTop: 16 }} />
        </div>

        {/* FAQ List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 16px)' }}>
          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <p style={{ color: BRAND.light, fontWeight: 700, textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.15em' }}>Retrieving Knowledge Base...</p>
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
            marginTop: 'clamp(24px, 5vw, 48px)', padding: 'clamp(20px, 4vw, 40px)', background: BRAND.light, borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'clamp(16px, 4vw, 32px)', flexWrap: 'wrap'
          }}
        >
          <div>
            <h4 style={{ fontSize: F_SIZE.md, fontWeight: 900, margin: '0 0 4px', color: BRAND.primaryDark }}>Expert Support Available</h4>
            <p style={{ fontSize: F_SIZE.sm, color: BRAND.light, margin: 0, fontWeight: 600 }}>Our specialist team is available for deep-technical inquiries.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: BRAND.primary, color: BRAND.white }}
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



