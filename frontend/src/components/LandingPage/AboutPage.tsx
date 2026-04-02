'use client';

import { motion } from 'framer-motion';
import MainLayout from '@/components/MainLayout';
import Image from 'next/image';
import { ShieldCheck, ArrowRight, Zap, Target, BookOpen, Microscope, FlaskConical, Award, Users } from 'lucide-react';
import { F_SIZE, BRAND, FONTS } from '@/lib/typography';
import PeopleSection from '@/components/LandingPage/LandingPageSections/Peoplesection';

/* ─── Premium Glass Blob ─────────────────────────────────────── */
const GlassBlob = ({ color, top, left, size, delay = 0 }: { color: string; top: string; left: string; size: string; delay?: number }) => (
  <motion.div
    animate={{
      x: [0, 50, 0],
      y: [0, 30, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 15,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{
      position: 'absolute',
      top,
      left,
      width: size,
      height: size,
      background: color,
      filter: 'blur(100px)',
      opacity: 0.1,
      borderRadius: '50%',
      zIndex: -1,
      pointerEvents: 'none'
    }}
  />
);

/* ─── Premium Doodle (Very Selective) ────────────────────────── */
const StarDoodle = ({ size = 20, rotation = 0, color = BRAND.primaryDark }: { size?: number; rotation?: number; color?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ transform: `rotate(${rotation}deg)`, opacity: 0.4 }}>
    <path d="M12,2 L13.2,9 L20,9 L14.6,13.4 L16.6,20 L12,15.8 L7.4,20 L9.4,13.4 L4,9 L10.8,9 Z"
      fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── Professional Card ───────────────────────────────────────── */
function TrustCard({ children, index, delay = 0, direction = 'up' }: { children: React.ReactNode; index?: number; delay?: number; direction?: 'left' | 'right' | 'up' }) {
  const initial = direction === 'left' ? { x: -60, opacity: 0 } : direction === 'right' ? { x: 60, opacity: 0 } : { y: 30, opacity: 0 };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: (index ?? 0) * 0.1 + delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: BRAND.white,
        backdropFilter: 'blur(40px)',
        borderRadius: 32,
        padding: '48px 40px',
        border: `1px solid ${BRAND.primary}08`,
        boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{ y: -8, boxShadow: `0 40px 80px rgba(114,56,61,0.08)`, borderColor: `${BRAND.primaryDark}30` }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${BRAND.primaryDark}40, transparent)`, opacity: 0 }} />
      {children}
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <MainLayout background={BRAND.white}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        
        .hero-gradient {
            background: radial-gradient(circle at 10% 10%, ${BRAND.primary}05 0%, transparent 50%),
                        radial-gradient(circle at 90% 90%, ${BRAND.primaryDark}03 0%, transparent 50%);
        }
        .text-glow {
            text-shadow: 0 0 30px ${BRAND.primary}20;
        }
        .glass-panel {
            background: rgba(255, 255, 255, 0.4);
            backdropFilter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.5);
        }
      `}</style>

      <div className="hero-gradient" style={{ position: 'relative', zIndex: 1, paddingTop: 120, paddingBottom: 40, overflow: 'hidden', marginTop: 0 }}>
        
        {/* Animated Background Blobs */}
        <GlassBlob color={BRAND.primary} top="10%" left="5%" size="600px" />
        <GlassBlob color={BRAND.primaryDark} top="50%" left="70%" size="500px" delay={2} />
        <GlassBlob color={BRAND.secondary} top="-10%" left="40%" size="400px" delay={5} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>

          {/* HEADER / HERO */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 60, alignItems: 'center', marginBottom: 60 }}>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}
              >
                <div style={{ padding: '6px 16px', background: BRAND.white, borderRadius: 100, border: `1px solid ${BRAND.primary}15`, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <Zap size={14} color={BRAND.primaryDark} />
                  <span style={{ fontFamily: FONTS.main, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', color: BRAND.primary, letterSpacing: '0.2em' }}>Scientific standard</span>
                </div>
              </motion.div>

              <h1 style={{
                fontFamily: FONTS.main,
                fontSize: "4.5rem",
                fontWeight: 900, color: BRAND.primary,
                margin: 0, letterSpacing: '-0.05em', lineHeight: 0.95
              }}>
                Integrity <span style={{ color: BRAND.secondary }}>Over</span><br />Complexity.
              </h1>

              <p style={{
                fontFamily: FONTS.main,
                fontSize: F_SIZE.md, color: BRAND.secondary,
                marginTop: 32, lineHeight: 1.7, fontWeight: 500, maxWidth: 540, opacity: 0.9
              }}>
                PlainFuel is a nutritional science brand built to eliminate the noise. Founded by pharmacists, we standardize daily maintenance into one uncompromising baseline.
              </p>

              <div style={{ display: 'flex', gap: 40, marginTop: 56 }}>
                {[
                  { val: '100%', label: 'Traceability' },
                  { val: 'FSSAI', label: 'Certified' },
                  { val: 'USP', label: 'Standards' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div style={{ fontFamily: FONTS.main, fontSize: "2.5rem", fontWeight: 900, color: BRAND.primary, lineHeight: 1 }}>{stat.val}</div>
                    <div style={{ fontFamily: FONTS.main, fontSize: 11, fontWeight: 800, color: BRAND.secondary, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 8 }}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'relative' }}
            >
              <div style={{
                borderRadius: 48, overflow: 'hidden',
                boxShadow: `0 60px 120px rgba(114,56,61,0.15)`,
                border: `8px solid ${BRAND.white}`,
                position: 'relative'
              }}>
                <Image
                  src="/images/lab_hero.png"
                  alt="Pharmaceutical Laboratory"
                  width={600}
                  height={700}
                  style={{ objectFit: 'cover' }}
                  priority
                />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${BRAND.primary}20, transparent)` }} />
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: 'absolute', top: 40, right: -20, background: BRAND.white, padding: '24px', borderRadius: 24, boxShadow: '0 30px 60px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 16, zIndex: 10, border: `1px solid ${BRAND.primary}10` }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 16, background: BRAND.primaryDark, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 12px 24px ${BRAND.primaryDark}30` }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div style={{ fontFamily: FONTS.main, fontSize: 13, fontWeight: 900, color: BRAND.primary }}>GMP Certified</div>
                  <div style={{ fontFamily: FONTS.main, fontSize: 11, color: BRAND.secondary, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grade-A Quality</div>
                </div>
              </motion.div>

              <div style={{ position: 'absolute', bottom: -40, left: -40, zIndex: -1 }}>
                <StarDoodle size={120} rotation={15} color={BRAND.primaryDark} />
              </div>
            </motion.div>
          </section>

          {/* PILLARS OF TRUST */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '4px 12px', background: `${BRAND.primaryDark}10`, borderRadius: 100, marginBottom: 16 }}>
              <Target size={14} color={BRAND.primaryDark} />
              <span style={{ fontSize: 12, fontWeight: 900, color: BRAND.primary, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: FONTS.main }}>Our Foundations</span>
            </div>
            <h2 style={{ fontFamily: FONTS.main, fontSize: "2.8rem", fontWeight: 900, color: BRAND.primaryDark, marginBottom: 12, letterSpacing: '-0.03em' }}>The Trust Layer</h2>
            <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, color: BRAND.secondary, fontWeight: 700, maxWidth: 600, margin: '0 auto' }}>Scientific precision meets biological empathy. We standardize maintenance into one baseline.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 32, marginBottom: 80 }}>

            <TrustCard index={0} direction="left">
              <div style={{ width: 64, height: 64, borderRadius: 20, background: `${BRAND.primaryDark}08`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                <FlaskConical size={32} color={BRAND.primaryDark} />
              </div>
              <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.primary, marginBottom: 20 }}>Biological Balance</h3>
              <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, lineHeight: 1.7, color: BRAND.secondary, fontWeight: 700, marginBottom: 32 }}>
                We avoid &quot;super-dosing&quot;. Our formula is engineered around human body&apos;s daily metabolic baselines. No fillers, no spikes—just what your body can actually absorb.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: BRAND.primary }}>
                <div style={{ padding: '8px 16px', borderRadius: 100, background: BRAND.white, border: `1px solid ${BRAND.primary}15`, fontSize: 12, fontWeight: 800 }}>
                  <BookOpen size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', fontFamily: FONTS.accent }} /> Data-Driven
                </div>
              </div>
            </TrustCard>

            <TrustCard index={1} direction="right">
              <div style={{ width: 64, height: 64, borderRadius: 20, background: `${BRAND.secondary}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                <Microscope size={32} color={BRAND.secondary} />
              </div>
              <h3 style={{ fontFamily: FONTS.main, fontSize: F_SIZE.lg, fontWeight: 900, color: BRAND.primary, marginBottom: 20 }}>Clinical Standards</h3>
              <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, lineHeight: 1.7, color: BRAND.secondary, fontWeight: 500, marginBottom: 32 }}>
                Every batch of PlainFuel undergoes three-stage quality control. We standardize against the Pharmaceutical grade to ensure 100% potency until the day of expiry.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: BRAND.primary }}>
                <div style={{ padding: '8px 16px', borderRadius: 100, background: BRAND.white, border: `1px solid ${BRAND.primary}15`, fontSize: 12, fontWeight: 800 }}>
                  <Award size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} /> Lab Certified
                </div>
              </div>
            </TrustCard>
          </div>

          {/* TEAM / PROFESSIONAL CREDIBILITY */}
          <div style={{
            background: BRAND.primary,
            borderRadius: 56,
            padding: '60px 80px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 60,
            boxShadow: `0 80px 150px rgba(50,45,41,0.25)`
          }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '60%', height: '140%', background: `radial-gradient(circle, ${BRAND.primaryDark} 0%, transparent 70%)`, opacity: 0.2 }} />

            <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 60, alignItems: 'center' }}>
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: 100, border: '1px solid rgba(255,255,255,0.2)', marginBottom: 40 }}>
                  <Users size={16} />
                  <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Founding Collective</span>
                </div>
                <h2 style={{ fontFamily: FONTS.main, fontSize: "4rem", fontWeight: 900, marginBottom: 32, letterSpacing: '-0.03em', lineHeight: 1 }}>Built by <span style={{ opacity: 0.5 }}>Science.</span></h2>
                <p style={{ fontFamily: FONTS.main, fontSize: "1.25rem", lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', fontWeight: 400, maxWidth: 500 }}>
                  PlainFuel was established by a collective of pharmacists and nutritional clinicians. We don&apos;t sell instant results—we provide long-term standard.
                </p>

                <div style={{ marginTop: 64, display: 'flex', gap: 48 }}>
                  <div>
                    <div style={{ fontSize: "3rem", fontWeight: 900, color: BRAND.tertiary }}>12<span style={{ fontSize: '1.5rem', opacity: 0.5 }}>+</span></div>
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', marginTop: 4 }}>Specialists</div>
                  </div>
                  <div style={{ width: 1, height: 60, background: 'rgba(255,255,255,0.1)' }} />
                  <div>
                    <div style={{ fontSize: "3rem", fontWeight: 900, color: BRAND.tertiary }}>240<span style={{ fontSize: '1.5rem', opacity: 0.5 }}>+</span></div>
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', marginTop: 4 }}>Formulations</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                style={{ textAlign: 'center', position: 'relative' }}
              >
                <div style={{ position: 'relative', width: 320, height: 320, margin: '0 auto 48px' }}>
                  <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: `linear-gradient(135deg, ${BRAND.primaryDark}40, transparent)`, filter: 'blur(40px)', zIndex: -1 }} />
                  <div style={{
                    width: '100%', height: '100%', borderRadius: '50%', background: BRAND.white,
                    border: '12px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
                    position: 'relative', overflow: 'hidden'
                  }}>
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${BRAND.white} 0%, #fff 100%)` }} />
                    <div style={{ zIndex: 1, position: 'relative' }}>
                      <div style={{ width: 140, height: 140, borderRadius: '50%', background: `${BRAND.primary}08`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Microscope size={80} color={BRAND.primary} strokeWidth={1} />
                      </div>
                    </div>
                  </div>
                </div>

                <h3 style={{ fontFamily: FONTS.main, fontSize: "2.2rem", fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: BRAND.white }}>Dr. S Seenivasan</h3>
                <p style={{ fontFamily: FONTS.main, fontSize: 13, color: BRAND.tertiary, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: 12 }}>Founder &amp; Chief Formulator</p>
                <div style={{ marginTop: 24, padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', maxWidth: 400, margin: '24px auto 0' }}>
                  <p style={{ fontFamily: FONTS.accent, fontSize: "1.5rem", color: BRAND.white, margin: 0, opacity: 0.9, fontStyle: 'italic' }}>&quot;Standardizing nutrition for every biological potential.&quot; ✨</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* PEOPLE SECTION */}
          <PeopleSection />

          {/* CTA */}
          <div style={{ textAlign: 'center', paddingTop: 40, paddingBottom: 40, position: 'relative' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              style={{ maxWidth: 800, margin: '0 auto' }}
            >
              <h2 style={{ fontFamily: FONTS.main, fontSize: "3rem", fontWeight: 900, color: BRAND.primary, marginBottom: 16, letterSpacing: '-0.04em' }}>Ready to Standardize?</h2>
              <p style={{ fontFamily: FONTS.main, fontSize: F_SIZE.md, color: BRAND.secondary, marginBottom: 32, fontWeight: 500, maxWidth: 500, margin: '0 auto 32px' }}>Join 10,000+ people building their biological baseline daily.</p>

              <motion.button
                whileHover={{ scale: 1.05, background: BRAND.primaryDark, boxShadow: `0 20px 40px ${BRAND.primaryDark}30` }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '24px 60px', background: BRAND.primary, color: BRAND.white,
                  borderRadius: 100, border: 'none', fontFamily: FONTS.main,
                  fontSize: 13, fontWeight: 900, textTransform: 'uppercase',
                  letterSpacing: '0.3em', cursor: 'pointer', transition: 'all 0.4s',
                  boxShadow: '0 20px 40px rgba(114,56,61,0.15)'
                }}
              >
                Explore Products <ArrowRight size={20} style={{ display: 'inline', marginLeft: 16, verticalAlign: 'middle' }} />
              </motion.button>
            </motion.div>
          </div>

        </div>

        {/* Global Overlays */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${BRAND.primary}10, transparent)` }} />
      </div>
    </MainLayout>
  );
}