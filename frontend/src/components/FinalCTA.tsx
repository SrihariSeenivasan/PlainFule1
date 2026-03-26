'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Mail, Twitter, ChevronDown, Sparkles, Send, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Design Tokens (Standardized with Navbar) ───────────────────────
const COLORS = {
  forest: '#0a3d1f',
  deep: '#071a0d',
  mid: '#14532d',
  leaf: '#16a34a',
  ink: '#070d08',
  white: '#ffffff',
  offwhite: '#f7f8f5',
  silver: '#9eaaa0',
  mist: '#eef4ee',
  gold: '#b8953a',
  goldLight: '#d4af5a',
  champagne: '#f0e4c0',
  glass: 'rgba(255, 255, 255, 0.45)',
  glassDark: 'rgba(4, 14, 7, 0.65)',
};

// ─── Doodle Elements (Standardized) ──────────────────────────────────
const StarDoodle = ({ size = 24, rotation = 0, style = {}, color = COLORS.leaf }: {
  size?: number; rotation?: number; style?: React.CSSProperties; color?: string
}) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden
    style={{ transform: `rotate(${rotation}deg)`, flexShrink: 0, ...style }}>
    <path d="M12,2 L13.2,9 L20,9 L14.6,13.4 L16.6,20 L12,15.8 L7.4,20 L9.4,13.4 L4,9 L10.8,9 Z"
      fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ScribbleUnderline = ({ color = COLORS.leaf, delay = 0 }: { color?: string; delay?: number }) => (
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
        background: open ? 'rgb(255, 255, 255)' : 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(32px)',
        borderRadius: 24,
        padding: '32px',
        cursor: 'pointer',
        border: `1px solid ${open ? COLORS.leaf + '40' : 'rgba(255,255,255,0.7)'}`,
        boxShadow: open 
          ? '0 30px 60px rgba(10, 61, 31, 0.1), 0 0 0 1px rgba(255,255,255,1)' 
          : '0 4px 12px rgba(10, 61, 31, 0.02)',
        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        overflow: 'hidden',
      }}
      whileHover={{ y: -4, background: 'rgba(255, 255, 255, 0.8)', border: `1px solid ${COLORS.leaf}20` }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
        <h4 style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 17, fontWeight: 800, color: COLORS.forest, margin: 0, lineHeight: 1.4, flex: 1,
          letterSpacing: '-0.01em',
        }}>{q}</h4>
        <motion.div
          animate={{ rotate: open ? '180deg' : '0deg', scale: open ? 1.1 : 1 }}
          style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: open ? COLORS.leaf : COLORS.silver, background: open ? COLORS.leaf + '10' : 'rgba(0,0,0,0.04)', transition: 'all 0.4s' }}
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
            <div style={{ paddingTop: 20, borderTop: `1px solid ${COLORS.mid}10` }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15.5, fontWeight: 500, color: '#4a5a4e', lineHeight: 1.7, margin: 0 }}>{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Footer Components ────────────────────────────────────────────────
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <motion.a href={href} whileHover={{ x: 4, color: COLORS.leaf }}
    style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13.5, fontWeight: 600, color: COLORS.silver, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.3s' }}
  >
    {children}
  </motion.a>
);

const FooterHeader = ({ children }: { children: React.ReactNode }) => (
  <h5 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: COLORS.leaf, marginBottom: 28 }}>{children}</h5>
);

// ─── Data ───────────────────────────────────────────────────────────
const faqs = [
  { q: 'Is this a complete meal replacement?', a: "Plainfuel is a daily nutritional enhancer. We provide the 20% of critical micronutrients and protein your high-quality meals usually miss." },
  { q: 'Why is it neutral in taste?', a: "Habit science. We designed it to disappear into your routine (oats, smoothies, shakes) so you don't have to change your palette to get your nutrients." },
  { q: 'Is it safe for long-term use?', a: "Standardized by pharmacists and FSSAI certified. No artificial fillers, megadoses, or synthetics — just balanced biological logic." },
  { q: 'How do I incorporate it?', a: "One scoop (25g) daily. It dissolves instantly with no texture, no aftertaste, and no compromise to your favorite recipes." },
];

export default function FinalCTA() {
  const router = useRouter();
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Caveat:wght@400;600;700;900&display=swap');
        .premium-glow { position: relative; }
        .premium-glow::after { content: ''; position: absolute; inset: -1px; border-radius: inherit; padding: 1px; background: linear-gradient(135deg, rgba(255,255,255,0.4), transparent, rgba(255,255,255,0.2)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-mask( #fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
      `}</style>

      <section id="buy" style={{ position: 'relative', overflow: 'hidden', background: '#fff' }}>
        
        {/* FAQ BLOCK */}
        <div style={{ background: `linear-gradient(to bottom, #f9faf8, #f5f7f5)`, padding: '120px 0', position: 'relative' }}>
          <div style={{ maxWidth: 1040, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
            
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 80 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: COLORS.forest, padding: '8px 20px', borderRadius: 100, marginBottom: 24, boxShadow: '0 10px 20px rgba(10,61,31,0.1)' }}>
                <Sparkles size={14} color={COLORS.gold} />
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Biological Logic</span>
              </div>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(2.8rem, 6vw, 3.8rem)', fontWeight: 900, color: COLORS.forest, margin: 0, letterSpacing: '-0.04em', lineHeight: 1 }}>Common Questions</h3>
                <ScribbleUnderline delay={0.4} color={COLORS.gold} />
              </div>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: 24, color: COLORS.leaf, marginTop: 20, opacity: 0.9 }}>Helping you make sense of the daily scoop ✨</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 24 }}>
              {faqs.map((faq, i) => (
                <FaqCard key={i} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} style={{ textAlign: 'center', marginTop: 80 }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 700, color: COLORS.silver, marginBottom: 24 }}>Still have something on your mind?</p>
              <motion.button onClick={() => router.push('/contact')} whileHover={{ scale: 1.05, background: COLORS.leaf }} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '18px 40px', background: COLORS.forest, color: '#fff', borderRadius: 100, border: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', boxShadow: '0 20px 40px rgba(10,61,31,0.15)', transition: 'all 0.3s' }}>
                Chat with our team <Send size={16} />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ background: COLORS.deep, padding: '120px 0 60px', color: COLORS.white, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: `radial-gradient(${COLORS.white} 1px, transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />
          
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 80, marginBottom: 100 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <Image src="/images/plainfuel.png" alt="PlainFuel" width={180} height={45} style={{ filter: 'brightness(0) invert(1)', marginBottom: 32 }} />
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, lineHeight: 1.8, color: COLORS.silver, maxWidth: 380, marginBottom: 40, fontWeight: 500 }}>Standardizing daily nutrition without the compromise. Built by pharmacists, designed for high-performance longevity.</p>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[Twitter, Instagram, Mail, Globe].map((Icon, i) => (
                    <motion.a key={i} href="#" whileHover={{ scale: 1.1, backgroundColor: COLORS.leaf, color: COLORS.deep }} style={{ width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', transition: 'all 0.3s' }}><Icon size={18} /></motion.a>
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
                  <FooterLink href="/shipping">Shipping</FooterLink>
                  <FooterLink href="/privacy">Privacy</FooterLink>
                  <FooterLink href="/terms">Terms</FooterLink>
                  <FooterLink href="/contact">Support</FooterLink>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 40, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <ShieldCheck size={22} color={COLORS.leaf} />
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 800, color: COLORS.silver, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Pharmaceutical Grade Quality</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.silver, margin: 0 }}>© 2026 PLAINFUEL INC.</p>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: 18, color: COLORS.white, opacity: 0.6, marginTop: 4 }}>Empowering your biological potential ✨</p>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
}