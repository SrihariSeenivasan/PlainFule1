'use client';

import Image from 'next/image';
import { motion, } from 'framer-motion';
import { Instagram, Mail, Twitter, Globe, ShieldCheck } from 'lucide-react';
import { BRAND, FONTS } from '@/lib/typography';







// ─── Footer Components ────────────────────────────────────────────────
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <motion.a href={href} whileHover={{ x: 4, color: BRAND.light }}
    style={{ fontFamily: FONTS.main, fontSize: 13.5, fontWeight: 600, color: BRAND.secondary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.3s' }}
  >
    {children}
  </motion.a>
);

const FooterHeader = ({ children }: { children: React.ReactNode }) => (
  <h5 style={{ fontFamily: FONTS.main, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: BRAND.light, marginBottom: 28 }}>{children}</h5>
);


export default function FinalCTA() {

  return (
    <>
      <section id="buy" style={{ position: 'relative', overflow: 'hidden', background: BRAND.white }}>

       

        {/* FOOTER */}
        <footer className="footer-main" style={{ background: BRAND.primary, padding: '120px 0 60px', color: BRAND.white, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `radial-gradient(${BRAND.light} 1px, transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
            <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 60, marginBottom: 80 }}>
              <div className="footer-brand" style={{ gridColumn: 'span 1' }}>
                <Image src="/images/plainfuel.png" alt="PlainFuel" width={180} height={45} style={{ filter: 'brightness(0) invert(1)', marginBottom: 32 }} />
                <p style={{ fontFamily: FONTS.main, fontSize: 16, lineHeight: 1.8, color: BRAND.light, maxWidth: 380, marginBottom: 40, fontWeight: 500 }}>Standardizing daily nutrition without the compromise. Built by pharmacists, designed for high-performance longevity.</p>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[Twitter, Instagram, Mail, Globe].map((Icon, i) => (
                    <motion.a key={i} href="#"
                      whileHover={{ scale: 1.1, backgroundColor: BRAND.primaryDark, color: BRAND.white }}
                      style={{ width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${BRAND.secondary}30`, color: BRAND.light, transition: 'all 0.3s' }}
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

            <div className="footer-bottom" style={{ borderTop: `1px solid ${BRAND.secondary}20`, paddingTop: 40, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <ShieldCheck size={22} color={BRAND.light} />
                <span style={{ fontFamily: FONTS.main, fontSize: 13, fontWeight: 800, color: BRAND.secondary, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Pharmaceutical Grade Quality</span>
              </div>
              <div className="footer-copy" style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: FONTS.main, fontSize: 13, fontWeight: 700, color: BRAND.secondary, margin: 0 }}>© 2026 PLAINFUEL INC.</p>
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