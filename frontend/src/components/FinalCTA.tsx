'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Mail, Twitter, ChevronDown, Sparkles, Send, Globe, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BRAND, FONTS } from '@/lib/typography';

// ─── Doodle Elements ──────────────────────────────────────────────────
const StarDoodle = ({ size = 24, rotation = 0, style = {}, color = BRAND.taupe }: {
  size?: number; rotation?: number; style?: React.CSSProperties; color?: string
}) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden
    style={{ transform: `rotate(${rotation}deg)`, flexShrink: 0, ...style }}>
    <path d="M12,2 L13.2,9 L20,9 L14.6,13.4 L16.6,20 L12,15.8 L7.4,20 L9.4,13.4 L4,9 L10.8,9 Z"
      fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ScribbleUnderline = ({ color = BRAND.burgundy, delay = 0 }: { color?: string; delay?: number }) => (
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

// ─── FAQ Card ──────────────────────────────────────────────────────────
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
        padding: '32px',
        cursor: 'pointer',
        border: `1px solid ${open ? BRAND.burgundy + '30' : BRAND.stone + '80'}`,
        boxShadow: open
          ? `0 30px 60px rgba(114, 56, 61, 0.08), 0 0 0 1px ${BRAND.white}`
          : `0 4px 12px rgba(50, 45, 41, 0.04)`,
        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        overflow: 'hidden',
      }}
      whileHover={{
        y: -4,
        background: 'rgba(255, 255, 255, 0.85)',
        border: `1px solid ${BRAND.burgundy}20`,
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
            color: open ? BRAND.burgundy : BRAND.taupe,
            background: open ? BRAND.burgundy + '12' : `${BRAND.stone}40`,
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
            <div style={{ paddingTop: 20, borderTop: `1px solid ${BRAND.stone}40` }}>
              <p style={{ fontFamily: FONTS.main, fontSize: 15.5, fontWeight: 500, color: BRAND.taupe, lineHeight: 1.7, margin: 0 }}>{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Footer Components ────────────────────────────────────────────────
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <motion.a href={href} whileHover={{ x: 4, color: BRAND.stone }}
    style={{ fontFamily: FONTS.main, fontSize: 13.5, fontWeight: 600, color: BRAND.taupe, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.3s' }}
  >
    {children}
  </motion.a>
);

const FooterHeader = ({ children }: { children: React.ReactNode }) => (
  <h5 style={{ fontFamily: FONTS.main, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: BRAND.stone, marginBottom: 28 }}>{children}</h5>
);

// ─── Data ───────────────────────────────────────────────────────────
const faqs = [
  { q: 'Is this a complete meal replacement?', a: "Plainfuel is a daily nutritional enhancer. We provide the 20% of critical micronutrients and protein your high-quality meals usually miss." },
  { q: 'Why is it neutral in taste?', a: "Habit science. We designed it to disappear into your routine (oats, smoothies, shakes) so you don't have to change your palette to get your nutrients." },
  { q: 'Is it safe for long-term use?', a: "Standardized by pharmacists and FSSAI certified. No artificial fillers, megadoses, or synthetics — just balanced biological logic." },
  { q: 'How do I incorporate it?', a: "One scoop (25g) daily. It dissolves instantly with no texture, no aftertaste, and no compromise to your favorite recipes." },
];

export default function FinalCTA({ showFAQ = true }: { showFAQ?: boolean }) {
  const router = useRouter();
  return (
    <>
      <section id="buy" style={{ position: 'relative', overflow: 'hidden', background: BRAND.white }}>

        {/* FAQ BLOCK */}
        {showFAQ && (
          <div className="faq-section" style={{ background: BRAND.cream, padding: '120px 0', position: 'relative' }}>
            <div style={{ maxWidth: 1040, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 60 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: BRAND.espresso, padding: '8px 20px', borderRadius: 100, marginBottom: 20, boxShadow: `0 10px 20px rgba(50,45,41,0.12)` }}>
                  <Sparkles size={14} color={BRAND.stone} />
                  <span style={{ fontFamily: FONTS.main, fontSize: 10, fontWeight: 800, color: BRAND.white, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Biological Logic</span>
                </div>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <h3 className="faq-header" style={{ fontFamily: FONTS.main, fontSize: 'clamp(2.8rem, 6vw, 3.8rem)', fontWeight: 900, color: BRAND.espresso, margin: 0, letterSpacing: '-0.04em', lineHeight: 1 }}>Common Questions</h3>
                  <ScribbleUnderline delay={0.4} color={BRAND.burgundy} />
                </div>
                <p className="faq-subtext" style={{ fontFamily: FONTS.accent, fontSize: 24, color: BRAND.burgundy, marginTop: 16, opacity: 0.9 }}>Helping you make sense of the daily scoop ✨</p>
              </motion.div>

              <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
                {faqs.map((faq, i) => (
                  <FaqCard key={i} q={faq.q} a={faq.a} index={i} />
                ))}
              </div>

              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} style={{ textAlign: 'center', marginTop: 80 }}>
                <p style={{ fontFamily: FONTS.main, fontSize: 14, fontWeight: 700, color: BRAND.taupe, marginBottom: 24 }}>Still have something on your mind?</p>
                <motion.button
                  onClick={() => router.push('/contact')}
                  whileHover={{ scale: 1.05, background: BRAND.burgundy, boxShadow: `0 20px 40px rgba(114,56,61,0.2)` }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '18px 40px', background: BRAND.espresso, color: BRAND.white, borderRadius: 100, border: 'none', fontFamily: FONTS.main, fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', boxShadow: `0 20px 40px rgba(50,45,41,0.15)`, transition: 'all 0.3s' }}
                >
                  Contact our support team <Send size={16} />
                </motion.button>
              </motion.div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="footer-main" style={{ background: BRAND.espresso, padding: '120px 0 60px', color: BRAND.white, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `radial-gradient(${BRAND.stone} 1px, transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
            <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 60, marginBottom: 80 }}>
              <div className="footer-brand" style={{ gridColumn: 'span 2' }}>
                <Image src="/images/plainfuel.png" alt="PlainFuel" width={180} height={45} style={{ filter: 'brightness(0) invert(1)', marginBottom: 32 }} />
                <p style={{ fontFamily: FONTS.main, fontSize: 16, lineHeight: 1.8, color: BRAND.stone, maxWidth: 380, marginBottom: 40, fontWeight: 500 }}>Standardizing daily nutrition without the compromise. Built by pharmacists, designed for high-performance longevity.</p>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[Twitter, Instagram, Mail, Globe].map((Icon, i) => (
                    <motion.a key={i} href="#"
                      whileHover={{ scale: 1.1, backgroundColor: BRAND.burgundy, color: BRAND.white }}
                      style={{ width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${BRAND.taupe}30`, color: BRAND.stone, transition: 'all 0.3s' }}
                    ><Icon size={18} /></motion.a>
                  ))}
                </div>
              </div>

              <div>
                <FooterHeader>Discovery</FooterHeader>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <FooterLink href="/products">The Scoop</FooterLink>
                  <FooterLink href="/about">Origins</FooterLink>
                  <FooterLink href="/how-it-works">The Science</FooterLink>
                  <FooterLink href="/reviews">Community</FooterLink>
                </div>
              </div>

              <div>
                <FooterHeader>Governance</FooterHeader>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <FooterLink href="/shipping">Shipping Policy</FooterLink>
                  <FooterLink href="/cancellation">Cancellation Policy</FooterLink>
                  <FooterLink href="/return">Return Policy</FooterLink>
                  <FooterLink href="/payment">Payment Policy</FooterLink>
                  <FooterLink href="/privacy">Privacy Policy</FooterLink>
                  <FooterLink href="/terms">Terms & Conditions</FooterLink>
                  <FooterLink href="/contact">Support</FooterLink>
                </div>
              </div>
            </div>

            <div className="footer-bottom" style={{ borderTop: `1px solid ${BRAND.taupe}20`, paddingTop: 40, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <ShieldCheck size={22} color={BRAND.stone} />
                <span style={{ fontFamily: FONTS.main, fontSize: 13, fontWeight: 800, color: BRAND.taupe, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Pharmaceutical Grade Quality</span>
              </div>
              <div className="footer-copy" style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: FONTS.main, fontSize: 13, fontWeight: 700, color: BRAND.taupe, margin: 0 }}>© 2026 PLAINFUEL INC.</p>
                <p style={{ fontFamily: FONTS.accent, fontSize: 18, color: BRAND.white, opacity: 0.5, marginTop: 4 }}>Empowering your biological potential ✨</p>
              </div>
            </div>
          </div>
        </footer>

        <style>{`
          @media (max-width: 768px) {
            .faq-section { padding: 80px 0 !important; }
            .faq-header { font-size: 3rem !important; }
            .faq-subtext { font-size: 20px !important; }
            .faq-grid { grid-template-columns: 1fr !important; }
            
            .footer-main { padding: 80px 0 40px !important; }
            .footer-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
            .footer-brand { grid-column: span 1 !important; }
            .footer-bottom { flex-direction: column !important; text-align: center !important; }
            .footer-copy { textAlign: center !important; }
          }
        `}</style>
      </section>
    </>
  );
}