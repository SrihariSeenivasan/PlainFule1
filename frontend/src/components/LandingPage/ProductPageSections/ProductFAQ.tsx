'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

// ── Theme Constants ──
const FD = "'Playfair Display', Georgia, serif";
const FS = "'DM Sans', 'Helvetica Neue', sans-serif";
const G = '#15803d';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  type: string;
}

// ── Doodle SVG Primitives ──
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

/* eslint-disable @typescript-eslint/no-unused-vars */

const StarBurst = ({ size = 28, rotate = 0, color = '#15803d', style = {} }: { size?: number; rotate?: number; color?: string; style?: React.CSSProperties }) => {
  // This SVG can be used in the future for decorations
  void rotate; // Avoid unused warning
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden
      style={{ transform: `rotate(${rotate}deg)`, ...style }}>
      <path
        d="M16,2 L17.8,12 L28,10 L20,17 L24,27 L16,21 L8,27 L12,17 L4,10 L14.2,12 Z"
        fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
};

const CircleScribble = ({ size = 60, style = {} }: { size?: number; style?: React.CSSProperties }) => {
  // This SVG can be used in the future for decorations
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden style={style}>
      <path
        d="M32,6 C48,5 58,18 58,32 C58,46 48,59 32,58 C16,59 6,46 6,32 C6,18 16,5 32,6 Z"
        fill="none" stroke="rgba(34,197,94,0.25)" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,3"
      />
    </svg>
  );
};
/* eslint-enable @typescript-eslint/no-unused-vars */

// ── FAQ Item ──
const FaqCard = ({ q, a, index }: { q: string; a: string; index: number }) => {
  const [open, setOpen] = useState(false);
  const rotations = [-1.2, 0.8, -0.6, 1.0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: rotations[index % 4] }}
      whileInView={{ opacity: 1, y: 0, rotate: open ? 0 : rotations[index % 4] }}
      viewport={{ once: true }}
      transition={{ delay: (index % 4) * 0.1, duration: 0.6 }}
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
        transform: `rotate(${open ? 0 : rotations[index % 4]}deg)`,
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

// ── Default FAQs (moved outside component to avoid dependency issues) ──
const DEFAULT_FAQS: FAQ[] = [
  { id: 1, question: 'Wha is the recommended dosage?', answer: 'One scoop (about 10g) mixed into your daily drink is all you need. Take it with breakfast for best results.', type: 'PRODUCT' },
  { id: 2, question: 'Can I take it with other supplements?', answer: 'Yes! PlainFuel works well alongside other supplements. No known interactions, but consult your doctor if on medication.', type: 'PRODUCT' },
  { id: 3, question: 'How long until I see results?', answer: 'Most customers notice improved energy and digestion within 3-5 days of consistent use.', type: 'PRODUCT' },
  { id: 4, question: 'Is it suitable for vegetarians/vegans?', answer: 'Absolutely! All PlainFuel products are 100% vegan and plant-based. No animal derivatives.', type: 'PRODUCT' },
  { id: 5, question: 'What\'s the shelf life?', answer: 'Our pouches stay fresh for 24 months when stored in a cool, dry place. Check the date on your pack.', type: 'PRODUCT' },
  { id: 6, question: 'Do you offer bulk discounts?', answer: 'Yes! Subscribe for monthly delivery and get 15% off. Contact our team for wholesale options.', type: 'PRODUCT' },
];

// ── Main Component ──
export default function ProductFAQ({ productId }: { productId?: number } = {}) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch FAQs from backend for specific product
  const fetchFaqs = useCallback(async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        
        // Build query params
        const params = new URLSearchParams();
        params.append('type', 'PRODUCT');
        if (productId) {
          params.append('productId', productId.toString());
        }

        const response = await fetch(`${apiUrl}/faqs?${params.toString()}`);

        if (response.ok) {
          const data = await response.json();
          setFaqs(data.data || DEFAULT_FAQS);
          setError('');
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700;900&family=Permanent+Marker&display=swap');
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* ─── Section Header ─── */}
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
              ❓ Product FAQs
            </span>
          </div>

          <div style={{ position: 'relative', display: 'inline-block' }}>
            <h3 style={{
              fontFamily: "'Permanent Marker',cursive",
              fontSize: 'clamp(2rem,4vw,3rem)',
              color: '#0a0a0a',
              margin: 0,
              lineHeight: 1.1,
            }}>Common Product Questions</h3>
            <ScribbleUnderline delay={0.4} />
          </div>
        </motion.div>

        {/* ─── FAQ Grid ─── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
          gap: 20,
        }}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontFamily: FS, color: '#999' }}>Loading FAQs...</p>
            </div>
          ) : error && faqs.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontFamily: FS, color: '#c33' }}>Failed to load FAQs</p>
            </div>
          ) : (
            faqs.map((faq, i) => (
              <FaqCard key={faq.id} q={faq.question} a={faq.answer} index={i} />
            ))
          )}
        </div>

        {/* ─── CTA Section ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            marginTop: 64, textAlign: 'center',
            background: '#fff', borderRadius: 16, padding: 'clamp(32px, 8vw, 48px)',
            border: '2px dashed rgba(21,128,61,0.2)',
          }}
        >
          <p style={{ fontFamily: FS, fontSize: 14, color: '#999', margin: 0, marginBottom: 12, textTransform: 'uppercase' }}>
            Still have questions?
          </p>
          <h4 style={{ fontFamily: FD, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#1a1a1a', margin: '0 0 16px' }}>
            Get in touch with our team
          </h4>
          <p style={{ fontFamily: FS, fontSize: 14, color: '#666', marginBottom: 20 }}>
            Reach out at <strong>support@plainfuel.com</strong> or use our contact form
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.location.href = 'mailto:support@plainfuel.com'}
            style={{
              padding: '10px 24px', background: G, color: '#fff',
              fontFamily: "'Caveat', cursive", fontWeight: 600, fontSize: 16,
              border: 'none', borderRadius: 12, cursor: 'pointer',
              boxShadow: '3px 4px 0 rgba(21,128,61,0.2)',
            }}
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
